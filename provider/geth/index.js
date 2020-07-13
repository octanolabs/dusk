import net from 'net'
import { Admin } from 'web3-eth-admin'
import Web3 from 'web3'
import consola from 'consola'
import NanoTimer from 'nanotimer'

import BlockCache from './sub/blocks.js'
import PeerCache from './sub/peers.js'
import Loop from '../lib/loop.js'

const providers = {}

class Provider {
  constructor(id, interval) {
    this.id = id
    this.interval = interval
    this.timer = new NanoTimer()
  }
}

class GethProvider extends Provider {
  constructor(ipcPath, id, interval) {
    super(id, interval)
    this.ipcPath = ipcPath
    this.web3 = null
    this.web3Admin = null
    this.blockCache = BlockCache.new(100) // 100 blocks
    this.peerCache = PeerCache.new(86400) // 1day
  }
  async connect() {
    try {
      this.web3 = await new Web3(this.ipcPath, net)
      this.web3Admin = await new Admin(this.ipcPath, net)
    } catch(err) {
      consola.error(new Error(err))
    }
  }
  setBlocks(cb) {
    const self = this
    this.web3.eth.getBlock('pending', false, function(err, head) {
      if (err || !head) {
        consola.fatal(new Error(err))
        return cb()
      } else {
        const cache = []
        const blockNumber = head.number - geth.blockCache.maxlen * 2
        Loop.sync(self.blockCache.maxlen * 2 + 1, function(loop) {
          const i = loop.iteration()
          self.web3.eth.getBlock(blockNumber + i, false, function(err, block) {
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
          self.blockCache.set(cache, function() {
            return cb()
          })
        })
      }
    })
  }

}

export default {
  new(ipcPath, instanceId, pollingInterval) {
    return new GethProvider(ipcPath, instanceId, pollingInterval)
  }
}
