import LRU from 'lru-cache'
import Loop from '../../lib/loop.js'

class BlockCache {
  constructor(maxlen) {
    this.cache = new LRU(maxlen)
    this._pending = {}
    this.maxlen = maxlen
  }

  getBlocks() {
    return this.cache.values().reverse()
  }
  set pending(value) {
    this._pending = value
  }
  get pending() {
    return this._pending
  }

  setBlocks(blocks, cb) {
    this.cache.reset()
    const self = this
    Loop.sync(
      blocks.length,
      function(loop) {
        const i = loop.iteration()
        const block = blocks[i]
        const next = i <= blocks.length ? blocks[i + 1] : false
        if (next) {
          calcBlockValues(self.cache, block, next, function(calc) {
            self.cache.set(block.number, {
              number: block.number,
              blocktime: calc.blocktime,
              avgblocktime10: calc.avgblocktime10,
              avgblocktime25: calc.avgblocktime25,
              avgblocktime50: calc.avgblocktime50,
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
      },
      function() {
        return cb()
      }
    )
  }

  push(block) {
    calcBlockValues(this.cache, block, this.pending, function(calc) {
      this.cache.set(block.number, {
        number: block.number,
        blocktime: calc.blocktime,
        avgblocktime10: calc.avgblocktime10,
        avgblocktime25: calc.avgblocktime25,
        avgblocktime50: calc.avgblocktime50,
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
  }
}

export default {
  new(size) {
    return new BlockCache(size)
  }
}

const calcBlockValues = function(cache, block, next, cb) {
  const len = cache.length
  const blocktime = len > 0 ? next.timestamp - block.timestamp : 0
  const avgblocktime10 =
    len >= 10
      ? (next.timestamp - cache.peek(block.number - 10).timestamp) / 10
      : 0
  const avgblocktime25 =
    len >= 25
      ? (next.timestamp - cache.peek(block.number - 25).timestamp) / 25
      : 0
  const avgblocktime50 =
    len >= 50
      ? (next.timestamp - cache.peek(block.number - 50).timestamp) / 50
      : 0
  const hashrate = block.difficulty / avgblocktime10
  return cb({
    blocktime,
    avgblocktime10,
    avgblocktime25,
    avgblocktime50,
    hashrate
  })
}
