import lib from './lib.js'

const MAXLEN = 88

let CACHE = []

export default {
  clear() {
    CACHE = []
  },
  get() {
    return CACHE
  },
  set(blocks, cb) {
    CACHE = [] // reset cache
    lib.syncLoop(blocks.length, function(loop) {
      const i = loop.iteration()
      const block = blocks[i]
      calcBlockValues(block, function (calc) {
        CACHE.push({
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
    }, function() {
      checklen()
      return cb()
    })
  },
  push(block) {
    calcBlockValues(block, function (calc) {
      CACHE.push({
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
      checklen()
    })
  },
  maxlen() {
    return MAXLEN
  }
}

const checklen = function () {
  if (CACHE.length > MAXLEN) {
    CACHE = CACHE.splice(CACHE.length - MAXLEN, MAXLEN)
  }
}

const calcBlockValues = function(block, cb) {
  const len = CACHE.length
  const blocktime = len > 0
    ? block.timestamp - CACHE[len - 1].timestamp
    : 0
  const avgblocktime10 = len >= 10
    ? (block.timestamp - CACHE[len - 10].timestamp) / 10
    : 0
  const avgblocktime25 = len >= 25
    ? (block.timestamp - CACHE[len - 25].timestamp) / 25
    : 0
  const avgblocktime88 = len >= 88
    ? (block.timestamp - CACHE[len - 88].timestamp) / 88
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
