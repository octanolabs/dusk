/*
 * Dusk package provider
 */
import axios from 'axios'
import jf from 'jsonfile'
import fs from 'fs'
import os from 'os'
import { promisify } from 'util'
import consola from 'consola'
import path from 'path'
import Platform from './platform'
import Downloader from './downloader'
// promisify fs functions so we can async/await them later.
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const mkdir = promisify(fs.mkdir)
const readJson = promisify(jf.readFile)
const access = promisify(fs.access)

// caches
let PACKAGES = []
let CUSTOM = []
let CLIENTS = []
let NETWORKS = {
  testnet: {},
  mainnet: {}
}

const downloadCompleted = async function(clientId, version) {
  try {
    for (let n in CLIENTS) {
      if (CLIENTS[n].id === clientId) {
        CLIENTS[n].downloaded = CLIENTS[n].downloaded + 1
        for (let x in CLIENTS[n].releases) {
          const release = CLIENTS[n].releases[x]
          if (release.version === version) {
            CLIENTS[n].releases[x].status = 1
          }
        }
      }
    }
    return
  } catch (e) {
    consola.error(new Error(e))
    return
  }
}

const loadPackages = async function(pkgs) {
  try {
    const ls = await readdir(pkgs)
    for (let x of ls) {
      const packagePath = path.join(pkgs, x)
      const duskpkg = await stat(packagePath)
      if (duskpkg.isDirectory()) {
        let pkg = await readJson(path.join(packagePath, 'dusk.json'))
        pkg.path = packagePath.substr(8) + '/' // octano/packageid
        PACKAGES.push(pkg)
        if (pkg.client) {
          const clientData = await getPackageData (
            path.join(packagePath, pkg.client.local),
            'https://github.com/' + pkg.client.remote
          )
          const client = await parseClient(clientData)
          client.duskpkg = {
            path: packagePath.substr(8) + '/',
            id: client.id
          }
          CLIENTS.push(client)
          if (client.networks && client.networks.length > 0) {
            for (let n of client.networks) {
              let type = 'mainnet'
              if (n.testnet) {
                type = 'testnet'
              }
              if (NETWORKS[type][n.networkId]) {
                NETWORKS[type][n.networkId].clients.push(client.id)
              } else {
                n.clients = [ client.id ]
                n.duskpkg = {
                  path: packagePath.substr(8) + '/',
                  id: client.id
                }
                NETWORKS[type][n.networkId] = n
              }
            }
          }
        }
        return
      } else {
        consola.error('path not found: ' + packagePath)
      }
    }
  } catch (e) {
    consola.error(new Error(e))
  }
}

const parseClient = async function(json) {
  try {
    let client = json
    let arch = await os.arch()
    const platform = await os.platform()
    const build = await Platform.parse(arch, platform)
    client.platform = build
    client.downloaded = 0
    let releases = []
    for(let y in client.releases) {
      let release = client.releases[y]
      if (release[build]){
        const r = {
          version: release.version,
          status: 0,
          maxHeight: release.maxHeight,
          tag: release.tag,
          note: release.note,
          download: release[build]
        }
        releases.push(r)
      }
    }
    client.releases = releases
    return client
  } catch (e) {
    consola.error(new Error(e))
    return
  }
}

/* getPackageData
 * fetch data from remote json or use local copy as a fallback
 * injects source (remote/local) and returns json data as object
 */
const getPackageData = async function(localPath, remotePath) {
  try {
    let remote = await axios.get(remotePath)
    if (remote && remote.data) { remote.data.source = 'remote' }
    return remote.data || {}
  } catch (e) {
    try {
      const localJson = await stat(localPath)
      if (localJson.isFile()) {
        let local = await readJson(localPath)
        if (local) { local.source = 'local' }
        return local || {}
      } else {
        consola.error('localPath is not a file (expected json): ' + localPath)
      }
    } catch (e) {
      consola.error(new Error(e))
      return
    }
  }
}

export default {
  // clear all caches
  clear() {
    PACKAGES = [],
    CUSTOM = [],
    CLIENTS = [],
    NETWORKS = []
  },
  // return caches
  get() {
    return {
      octano: PACKAGES,
      custom: CUSTOM,
      clients: CLIENTS,
      networks: NETWORKS
    }
  },
  // set caches
  async set(rootPath) { // './packages'
    try {
      // check packages (rootPath) directory exists
      const pkgs = await stat(rootPath)
      if (pkgs.isDirectory()) {
        // set paths
        const octanoPath = path.join(rootPath, 'octano')
        const customPath = path.join(rootPath, 'custom')
        // check packages/octano directory exists
        const octano = await stat(octanoPath)
        if (octano.isDirectory()) {
          // load packages
          await loadPackages(octanoPath)
        } else {
          consola.error('octano packages path not found: ' + octanoPath)
        }
        // check packages/custom directory exists
        const custom = await stat(customPath)
        if (custom.isDirectory()) {
          // load packages
          await loadPackages(customPath)
        } else {
          consola.error('custom packages path not found: ' + customPath)
        }
      } else {
        consola.error('packages path not found: ' + rootPath)
      }
    } catch (e) {
      consola.error(new Error(e))
    }
  },
  downloading() {
    return Downloader.get()
  },
  async download(clientId, version) {
    try {
      const { status } = Downloader.get()
      if (status !== true) {
        for (let i in CLIENTS) {
          const client = CLIENTS[i]
          if (client.id === clientId) {
            for (let x in client.releases) {
              const release = client.releases[x]
              if (release.version === version) {
                const downloadPath = path.join('persist/binaries', client.name, release.version)
                try {
                  // persist/binaries/go-ubiq/3.0.1/gubiq
                  const downloadPathAccessErr = await access(downloadPath, fs.constants.W_OK)
                  if (downloadPathAccessErr) {
                    consola.error(new Error(downloadPathAccessErr))
                    return
                  }
                } catch (e) {
                  await mkdir(downloadPath, { recursive: true })
                }
                await Downloader.helpers.download(
                  release.download.url,
                  downloadPath,
                  {
                    name: client.name,
                    version: release.version
                  }
                )
                Downloader.emitter.on('download-complete', function() {
                  downloadCompleted(client.id, release.version)
                })
                return
              }
            }
          }
        }
      }
    } catch (e) {
      consola.error(new Error(e))
      return
    }
  },
  initDownloading(data) {
    Downloader.set(data)
  }
}
