import axios from 'axios'
import consola from 'consola'
import LRU from 'lru-cache'
import Loop from '../../lib/loop.js'

class PeerCache {
  constructor(maxage) {
    this.cache = new LRU({ maxAge: maxage })
    this.geodata = new LRU({ maxAge: maxage })
    this.maxage = maxage
    this._localhost = {}
    this.getGeo = function(ip, cb) {
      const self = this
      if (!this.geodata.get(ip)) {
        axios
          .get('https://ip2c.org/' + ip)
          .then(function(response) {
            const parsed = parseCountryCode(response.data)
            self.geodata.set(ip, parsed)
            return cb(parsed)
          })
          .catch(function(err) {
            consola.error(new Error(err))
          })
      } else {
        return cb(this.geodata.get(ip))
      }
    }
  }
  clear() {
    this.cache.reset()
    this.geodata.reset()
    this._localhost = {}
  }
  getPeers() {
    return this.cache.values()
  }
  setPeers(peers, cb) {
    this.cache.reset()
    const self = this
    Loop.sync(peers.length, function(loop) {
      const i = loop.iteration()
      const peer = peers[i]
      const ip = peer.network.remoteAddress.split(':')[0]
      let parsed = parseNode(peer, parseInt(i) + 1)
      self.getGeo(ip, function(geodata) {
        parsed.countryName = geodata.name
        parsed.countryCode = geodata.code
        self.cache.set(ip, parsed)
        loop.next()
      })
    }, function() {
      return cb()
    })
  }

  get localhost() {
    return this._localhost
  }
  set localhost(lo) {
    let parsed = parseNode(lo, 0)
    let self = this
    this.getGeo(lo.ip, function(geodata) {
      parsed.countryName = geodata.name
      parsed.countryCode = geodata.code
      self.cache.set(lo.ip, parsed)
      self._localhost = parsed
    })
  }
}

export default {
  new(maxage) {
    return new PeerCache(maxage)
  }
}

const parseNode = function(node, id) {
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

    return peer
}

const parseCountryCode = function(code) {
  const split = code.split(';')
  return {
    name: split[3],
    code: split[1]
  }
}
