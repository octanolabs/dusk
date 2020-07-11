import net from 'net'
import { Admin } from 'web3-eth-admin'
import Web3 from 'web3'
import consola from 'consola'
import NanoTimer from 'nanotimer'

import BlockCache from './sub/blocks.js'
// import PeerCache from './sub/nodes.js'
import Loop from '../lib/loop.js'

const providers = {}

const GethProvider = function(id, ipcPath, interval) {
  this.ipcPath = ipcPath
  this.id = id
  this.web3 = null
  this.web3Admin = null
  this.timer = new NanoTimer()
  this.interval = interval || '1s'
  this.blockCache = BlockCache.new(100) // 100 blocks
  // this.peerCache = PeerCache.new(86400) // 1 day
}

export default {
  getProvider(id) {
    return providers[id] || null
  },
  setProvider(id, ipcPath, interval, cb) {
    if (providers.id) {
      // provider exists, update
    } else {
      // new provider, init
      const geth = new GethProvider(id, ipcPath, interval)
      geth.web3 = await new Web3(ipcPath, net)
      geth.web3Admin = await new Admin(ipcPath, net)
      geth.web3.eth.getBlock('pending', false, function(err, head) {
        if (err || !head) {
          consola.fatal(new Error(err))
          return cb()
        } else {
          const cache = []
          const blockNumber = head.number - geth.blockCache.maxlen * 2
          Loop.sync(
            geth.blockCache.maxlen * 2 + 1,
            function(loop) {
              const i = loop.iteration()
              geth.web3.eth.getBlock(blockNumber + i, false, function(err, block) {
                if (!err && block) {
                  cache.push(block)
                  loop.next()
                } else {
                  loop.break(true)
                  loop.next()
                }
              })
            },
            function() {
              geth.blockCache.set(cache, function() {
                return cb(providers)
              })
            }
          )
        }
      }
    }
  }
}
