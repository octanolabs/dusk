import LRU from 'lru-cache'
import axios from 'axios'
import {Admin} from 'web3-eth-admin'
import net from 'net'

const ONE_DAY = 86400

// https://www.npmjs.com/package/lru-cache
let CACHE = new LRU({ maxAge: ONE_DAY })
let LOCAL = false
let web3Admin = null

export default {
  async init(ipcPath) {
    web3Admin = await new Admin(ipcPath, net)
  },
  clear() {
    CACHE.reset()
    LOCAL = false
  },
  get() {
    return CACHE.values().reverse()
  },
  poll() {
    web3Admin.getPeers(function(err, peers) {
      if (err) {
        consola.error(new Error(err))
      } else {
        n(peers)
      }
    })
  },
  localhost() {
    if (LOCAL) {
      return LOCAL
    } else {
      web3Admin.getNodeInfo(function(err, info) {
        if(!err) {
          parseNode(info, 0, true)
          return LOCAL
        } else {
          return false
        }
      })
    }
  }
}

const parseNode = function(node, id, local) {
  // "Gubiq/v3.0.1-andromeda-834c1f86/linux-amd64/go1.13.5"
  // "Gubiq/UbiqMainnet/v3.0.1-andromeda-834c1f86/linux-amd64/go1.13.5"
  const peer = {}
  const name = node.name
  let split = name.split('/')
  peer.client = split[0]
  const version = split[1].substr(0, 1) === 'v' ? split[1] : split[2]
  const vsplit = version.split('-')
  peer.version = vsplit[0]
  peer.tag = vsplit[1]
  peer.build = vsplit[2]
  const platform = split[1].substr(0, 1) === 'v' ? split[2] : split[3]
  split = platform.split('-')
  peer.os = split[0]
  peer.arch = split[1]
  peer.id = id

  const ip = local ? node.ip : node.network.remoteAddress.split(':')[0]
  let cachedPeer = CACHE.get(ip)
  if (!CACHE.get(ip)) {
    axios.get('https://ip2c.org/' + ip)
      .then( function(response) {
        const parsed = parseCountryCode(response.data)
        peer.countryName = parsed.name
        peer.countryCode = parsed.code
        CACHE.set(ip, peer)
      })
      .catch( function(err) {
        consola.error(new Error(err))
      })
  }
}

const parseCountryCode = function(code) {
  const split = code.split(';')
  return {
    name: split[3],
    code: split[1]
  }
}

const n = function(peers) {
  for (const i in peers) {
    parseNode(peers[i], parseInt(i) + 1, false)
  }
}
