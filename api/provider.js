import {Admin} from 'web3-eth-admin'
import net from 'net'
import axios from 'axios'
import consola from 'consola'
import NanoTimer from 'nanotimer'
import NodeCache from 'node-cache'

const ONE_DAY = 86400

let web3Admin = null

const geo = new NodeCache({stdTTL: ONE_DAY})

const polling = {
  peers: {
    cache: [],
    timer: new NanoTimer(),
    method: function() {
      if (web3Admin) {
        consola.info('checking peers')
        web3Admin.getPeers(function(err, peers) {
          if (err) {
            consola.error(new Error(err))
          } else {
            polling.peers.cache = peers
            for (const i in peers) {
              const peer = peers[i]
              const ip = peer.network.remoteAddress.split(':')[0]
              const countryCode = geo.get(ip)
              if (countryCode == undefined) {
                axios.get('https://ip2c.org/' + ip)
                  .then( function(response) {
                    const set = geo.set(ip, response.data)
                    consola.info('updated cache: ' + ip + ' - ' + response.data)
                  })
                  .catch( function(err) {
                    consola.error(new Error(err))
                  })
              }
            }
          }
        })
      }
    }
  }
}

export default {
  async init(ipcPath) {
    web3Admin = await new Admin(ipcPath, net)
    return
  },
  startPolling(name) {
    polling[name].method() // call now
    polling[name].timer.setInterval(polling[name].method, '', '30s') // repeat
    return
  },
  getPeers() {
    return polling.peers.cache
  },
  getCountryCode(ip) {
    return geo.get(ip)
  }
}
