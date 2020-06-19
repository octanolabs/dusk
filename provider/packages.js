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
import cmpver from 'compare-versions'

import Platform from './lib/platform'
import Downloader from './sub/downloader'
import Hasher from './sub/hasher'

// promisify fs functions so we can async/await them later.
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const mkdir = promisify(fs.mkdir)
const readJson = promisify(jf.readFile)
const access = promisify(fs.access)
const chmod = promisify(fs.chmod)

// caches
let PACKAGES = []
let CUSTOM = []
let CLIENTS = []
let NETWORKS = {
  testnet: {},
  mainnet: {}
}

/* downloadCompleted
 * loop through CLIENTS to find matching clientName
 * loop through releases to find matching version
 * update status:
 * -1: error
 *  0: available for downloaded
 *  1: downloaded & verified (available for use)
 */
const downloadCompleted = async function(clientName, version, success, error) {
  try {
    for (let n in CLIENTS) {
      if (CLIENTS[n].name === clientName) {
        for (let x in CLIENTS[n].releases) {
          const release = CLIENTS[n].releases[x]
          if (cmpver(release.version, version) === 0) {
            if (CLIENTS[n].releases[x].status !== 1) {
              CLIENTS[n].releases[x].status = success ? 1 : -1
              CLIENTS[n].releases[x].error = success ? null : error
            }
          }
        }
      }
    }
    let downloading = Downloader.get()
    downloading.status = false
    Downloader.set(downloading)
    return
  } catch (e) {
    consola.error(new Error(e))
    return
  }
}

/* loadPackages
 * loop through a packages directory
 * load packages data
 * load accompaning package data (e.g client.json)
 */
const loadPackages = async function(pkgs) {
  try {
    const ls = await readdir(pkgs)
    for (let x of ls) {
      const packagePath = path.join(pkgs, x)
      const duskpkg = await stat(packagePath)
      if (duskpkg.isDirectory()) {
        let pkg = await readJson(path.join(packagePath, 'dusk.json'))
        pkg.path = packagePath.substr(8) + '/' // default/packageid
        PACKAGES.push(pkg)
        if (pkg.client) {
          // fetch client data
          const clientData = await getPackageData (
            path.join(packagePath, pkg.client.local),
            'https://github.com/' + pkg.client.remote
          )
          // parse client data
          const client = await parseClient(clientData)
          client.duskpkg = {
            path: packagePath.substr(8) + '/',
            id: client.name
          }

          // push client to CLIENTS cache
          CLIENTS.push(client)

          // check if client releases already exist locally
          // validate hashes
          // update release status in CLIENTS cache
          if (client.releases.length > 0) {
            for (let release of client.releases) {
              // check if bin already exists
              const basename = path.basename(release.download.url)
              const releaseDir =
                path.join('persist/binaries', client.name, release.version)
              const binPath = path.join(releaseDir, basename)

              // use standard (non-promisified) fs.stat, we want to simply
              // ignore if err, not get caught in try/catch.
              fs.stat(binPath, async function(err, binStat) {
                if (binStat && !err && binStat.isFile()) {
                  const binPathAccessErr = await access(binPath, fs.constants.X_OK)
                  if (!binPathAccessErr) {
                    Hasher.helpers.sha256sum(binPath, {
                      name: client.name,
                      version: release.version,
                      sha256: release.download.sha256,
                      extract: false // we should never need to extract here.
                    })
                  }
                }
              })
            }
          }

          // add client networks to NETWORKS cache
          if (client.networks && client.networks.length > 0) {
            for (let n of client.networks) {
              let type = 'mainnet'
              if (n.testnet) {
                type = 'testnet'
              }
              if (NETWORKS[type][n.id]) {
                NETWORKS[type][n.id].clients.push(client.name)
              } else {
                n.clients = [ client.name ]
                n.duskpkg = {
                  path: packagePath.substr(8) + '/',
                  id: client.name
                }
                NETWORKS[type][n.id] = n
              }
            }
          }
        }
      } else {
        consola.error('path not found: ' + packagePath)
      }
    }
  } catch (e) {
    consola.error(new Error(e))
  }
}

/* parseClient
 * parse packages client.json
 * set platform
 * filter releases by platform
 * set status
 */
const parseClient = async function(json) {
  try {
    let client = json
    let arch = await os.arch()
    const platform = await os.platform()
    const build = await Platform.parse(arch, platform)
    client.platform = build
    let releases = []
    for(let y in client.releases) {
      let release = client.releases[y]
      if (release[build]){
        // update releases
        const r = {
          version: release.version,
          status: 0,
          tag: release.tag,
          note: release.note,
          info: release.info,
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

/* Event Listeners
 * Downloader events (complete, error)
 * Hasher events (complete, error)
 */

// download comppleted
Downloader.emitter.on('download-complete', async function(downloader) {
  try {
    const basename = path.basename(downloader.url)
    const filepath = path.join(downloader.path, basename)
    await chmod(filepath, 0o755)
    Hasher.helpers.sha256sum(
      filepath,
      downloader.info
    )
  } catch (e) {
    consola.error(new Error(e))
  }
})

// download error
Downloader.emitter.on('download-error', function(downloader) {
  downloadCompleted(
    downloader.info.name,
    downloader.info.version,
    false,
    downloader.error
  )
})

// hasher completed
Hasher.emitter.on('sha256-complete', async function(hasher) {
  try {
    const pass = hasher.hash === hasher.info.sha256
    if (pass && hasher.info.extract === true) {
      const bindir = path.dirname(hasher.path) + '/'
      const files = Downloader.helpers.extract(hasher.path, bindir)
    }

    downloadCompleted(
      hasher.info.name,
      hasher.info.version,
      pass
    )
  } catch (e) {
    consola.error(new Error(e))
  }
})

// hasher error
Hasher.emitter.on('sha256-error', function(hasher) {
  downloadCompleted(
    hasher.info.name,
    hasher.info.version,
    false,
    hasher.error
  )
})

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
      default: PACKAGES,
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
        const defaultPath = path.join(rootPath, 'default')
        const customPath = path.join(rootPath, 'custom')
        // check packages/default directory exists
        const defaultStat = await stat(defaultPath)
        if (defaultStat.isDirectory()) {
          // load packages
          await loadPackages(defaultPath)
        } else {
          consola.error('default packages path not found: ' + defaultPath)
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
  async download(clientName, version) {
    try {
      const state = Downloader.get()
      // is a download already in progress?
      if (state.status !== true) {
        // nope? ok continue
        // loop through clients for a matching clientName
        for (let i in CLIENTS) {
          const client = CLIENTS[i]
          if (client.name === clientName) {
            // clientName found
            // loop through releases for a matching version
            for (let x in client.releases) {
              const release = client.releases[x]
              if (release.version === version) {
                // release found, set download path
                const downloadPath =
                  path.join('persist/binaries', client.name, release.version)
                // does download path already exist?
                try {
                  const downloadPathAccessErr = await access(downloadPath, fs.constants.W_OK)
                  if (downloadPathAccessErr) {
                    consola.error(new Error(downloadPathAccessErr))
                    return
                  }
                } catch (e) {
                  // nope, create download path
                  await mkdir(downloadPath, { recursive: true })
                }

                // init download
                await Downloader.helpers.download(
                  release.download.url,
                  downloadPath,
                  {
                    name: client.name,
                    version: release.version,
                    sha256: release.download.sha256,
                    extract: release.download.extract || false,
                    bin: release.download.bin || null
                  }
                )
              }
            }
          }
        }
      }
    } catch (e) {
      consola.error(new Error(e))
      return
    }
  }
}
