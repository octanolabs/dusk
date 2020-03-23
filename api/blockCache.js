import lib from './lib.js'
import LRU from 'lru-cache'

let MAXLEN = 100

// https://www.npmjs.com/package/lru-cache
let CACHE = new LRU(MAXLEN)
let PENDING = {}

export default {
  clear() {
    CACHE.reset()
    PENDING = {}
  },
  get() {
    return CACHE.values().reverse()
  },
  set(blocks, cb) {
    CACHE.reset() // reset cache
    lib.syncLoop(blocks.length, function(loop) {
      const i = loop.iteration()
      const block = blocks[i]
      const next = i <= blocks.length ? blocks[i + 1] : false
      if (next) {
        calcBlockValues(block, next, function (calc) {
          CACHE.set(block.number, {
            number: block.number,
            blocktime: calc.blocktime,
            avgblocktime10: calc.avgblocktime10,
            avgblocktime25: calc.avgblocktime25,
            avgblocktime88: calc.avgblocktime88,
            hashrate: calc.hashrate,
            timestamp: block.timestamp,
            txns: block.transactions.length,
            gasLimit: block.gasLimit,
            gasUsed: block.gasUsed,
            size: block.size,
            miner: block.miner,
            difficulty: block.difficulty,
            hash: block.hash,
            parent: block.parentHash
          })
          loop.next()
        })
      } else {
        loop.next()
      }
    }, function() {
      return cb()
    })
  },
  push(block) {
    calcBlockValues(block, PENDING, function (calc) {
      CACHE.set(block.number, {
        number: block.number,
        blocktime: calc.blocktime,
        avgblocktime10: calc.avgblocktime10,
        avgblocktime25: calc.avgblocktime25,
        avgblocktime88: calc.avgblocktime88,
        hashrate: calc.hashrate,
        timestamp: block.timestamp,
        txns: block.transactions.length,
        gasLimit: block.gasLimit,
        gasUsed: block.gasUsed,
        size: block.size,
        miner: block.miner,
        difficulty: block.difficulty,
        hash: block.hash,
        parent: block.parentHash
      })
    })
  },
  maxlen(len) {
    if (len) {
      MAXLEN = len
      CACHE = new LRU(len)
    } else {
      return MAXLEN
    }
  },
  pending(block) {
    if (block) {
      PENDING = block
    } else {
      return PENDING
    }
  }
}

const calcBlockValues = async function(block, next, cb) {
  const len = CACHE.length
  const blocktime = len > 0
    ? next.timestamp - block.timestamp
    : 0
  const avgblocktime10 = len >= 10
    ? (next.timestamp - CACHE.peek(block.number - 10).timestamp) / 10
    : 0
  const avgblocktime25 = len >= 25
    ? (next.timestamp - CACHE.peek(block.number - 25).timestamp) / 25
    : 0
  const avgblocktime88 = len >= 88
    ? (next.timestamp - CACHE.peek(block.number - 88).timestamp) / 88
    : 0
  const hashrate = block.difficulty / avgblocktime10
  return cb({
    blocktime,
    avgblocktime10,
    avgblocktime25,
    avgblocktime88,
    hashrate
  })
}
