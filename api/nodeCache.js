import axios from 'axios'
import consola from 'consola'
import LRU from 'lru-cache'

const ONE_DAY = 86400

// https://www.npmjs.com/package/lru-cache
const CACHE = new LRU({ maxAge: ONE_DAY })
const GEODATA = new LRU({ maxAge: ONE_DAY })

export default {
  clear() {
    CACHE.reset()
    GEODATA.reset()
  },
  get() {
    return CACHE.values()
  },
  set(peers, cb) {
    CACHE.reset()
    for (const i in peers) {
      parseNode(peers[i], parseInt(i) + 1, false)
    }
    return cb()
  },
  localhost(info) {
    parseNode(info, 0, true)
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
  if (!GEODATA.get(ip)) {
    axios
      .get('https://ip2c.org/' + ip)
      .then(function(response) {
        const parsed = parseCountryCode(response.data)
        GEODATA.set(ip, parsed)
        peer.countryName = parsed.name
        peer.countryCode = parsed.code
        CACHE.set(ip, peer)
      })
      .catch(function(err) {
        consola.error(new Error(err))
      })
  } else {
    const geodata = GEODATA.get(ip)
    peer.countryName = geodata.name
    peer.countryCode = geodata.code
    CACHE.set(ip, peer)
  }
}

const parseCountryCode = function(code) {
  const split = code.split(';')
  return {
    name: split[3],
    code: split[1]
  }
}
