import os from 'os'
import axios from 'axios'
import consola from 'consola'
import download from 'download'
import jf from 'jsonfile'

let CLIENTS = {}

const platform = async function() {
  try {
    let arch = await os.arch()
    const platform = await os.platform()
    if (arch === 'x64') {
      arch = 'amd64'
    }
    return platform + '-' + arch
  } catch (e) {
    consola.error(new Error(e))
  }
}

const parse = async function(json) {
  try {
    let clients = json.clients
    const build = await platform()
    json.platform = build
    for(let x in clients) {
      clients[x].downloaded = 0
      let releases = []
      for(let y in clients[x].releases) {
        let release = clients[x].releases[y]
        if (release[build]){
          releases.push({
            version: release.version,
            status: 0,
            maxHeight: release.maxHeight,
            tag: release.tag,
            note: release.note,
            download: release[build]
          })
        }
      }
      clients[x].releases = releases
    }
    json.clients = clients
    return json
  } catch (e) {
    consola.error(new Error(e))
    return { error: e }
  }
}

export default {
  clear() {
    CLIENTS = {}
  },
  get() {
    return CLIENTS
  },
  async set() {
    // try fetching remote.
    try {
      const remote = await axios.get('https://raw.githubusercontent.com/octanolabs/dusk2/develop/clientBinaries.json')
      CLIENTS = await parse(JSON.parse(remote.data))
      CLIENTS.source = 'remote'
    } catch (err) {
      try {
        jf.readFile('./clientBinaries.json', async function (err, local) {
          CLIENTS = await parse(local)
          CLIENTS.source = 'raw'
        })
      } catch (e) {
        consola.error(new Error(e))
      }
    }
  },
  async downloadClient(client, release) {
    try {
      const response = await download(
        release.url,
        'bin/' + client.tag + '/' + version
      ).on('downloadProgress', (progress) => {})
    } catch (e) {
      consola.error(new Error(e))
    }
  }
}
