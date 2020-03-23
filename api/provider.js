import {Admin} from 'web3-eth-admin'
import Web3 from 'web3'
import net from 'net'
import os from 'os'
import fs from 'fs'
import getSize from 'get-folder-size'
import disk from 'diskusage'
import axios from 'axios'
import consola from 'consola'
import NanoTimer from 'nanotimer'
import lib from './lib.js'
import bCache from './blockCache.js'
import nCache from './nodeCache.js'

const TWO_HOURS = 7200

let web3 = null
let web3Admin = null

const polling = {
  peers: {
    timer: new NanoTimer(),
    interval: '5s',
    method: function() {
      web3Admin.getPeers(function(err, peers) {
        if (err) {
          consola.error(new Error(err))
        } else {
          web3Admin.getNodeInfo(function(err, localhost) {
            nCache.set(peers, function() {
              nCache.localhost(localhost)
            })
          })
        }
      })
    }
  },
  systemInfo: {
    cache: {},
    timer: new NanoTimer(),
    interval: '25s',
    method: async function() {
      try {
        const info = await disk.check(os.homedir())
        info.chaindata = polling.chaindata.cache
        polling.systemInfo.cache = {
          totalmem: os.totalmem(),
          freemem: os.freemem(),
          meminfo: await lib.meminfo(),
          loadavg: os.loadavg(),
          cpus: await lib.cpuinfo(),
          diskusage: info
        }
      } catch (err) {
        consola.error(new Error(err))
      }
    }
  },
  chaindata: {
    cache: 0,
    timer: new NanoTimer(),
    interval: '3600s',
    method: function () {
      getSize(os.homedir() + '/.ubiq/gubiq/chaindata', (err, size) => {
        if (err) { throw err }
        polling.chaindata.cache = size
      })
    }
  },
  blocks: {
    timer: new NanoTimer(),
    interval: '5s',
    method: function () {
      const cache = bCache.get()
      if (cache.length > 0) {
        const i = cache.length-1
        web3.eth.getBlock(cache[i].number + 1, false, function(err, b) {
          if (!err && b) {
            web3.eth.getBlock('pending', true, function(err, pending) {
              if (!err && pending) {
                bCache.pending(pending)
                bCache.push(b)
              }
            })
          }
        })
      }
    }
  }
}

export default {
  async init(ipcPath, cb) {
    try {
      web3 = await new Web3(ipcPath, net)
      web3Admin = await new Admin(ipcPath, net)
      web3.eth.getBlock('pending', false, function(err, head) {
        if (err || !head ) {
          consola.fatal(new Error(err))
          return cb()
        } else {
          const cache = []
          let blockNumber = head.number - (bCache.maxlen() * 2)
          lib.syncLoop((bCache.maxlen() * 2) + 1, function (loop) {
            const i = loop.iteration()
            web3.eth.getBlock(blockNumber + i, false, function(err, block) {
              if (!err && block) {
                cache.push(block)
                loop.next()
              } else {
                loop.break(true)
                loop.next()
              }
            })
          }, function () {
            bCache.set(cache, function() {
              return cb()
            })
          })
        }
      })
    } catch (err) {
      consola.error(new Error(err))
    }
  },
  startPolling(name) {
    polling[name].timer.setTimeout(polling[name].method, '', '5s')
    polling[name].timer.setInterval(polling[name].method, '', polling[name].interval) // repeat
    return
  },
  getPeers() {
    return nCache.get()
  },
  getNodeInfo() {
    return nCache.localhost()
  },
  getSystemInfo() {
    return polling.systemInfo.cache
  },
  getPendingTxns() {
    return bCache.pending()
  },
  getBlocks() {
    return bCache.get()
  }
}
