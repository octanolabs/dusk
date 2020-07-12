import BlockCache from '../../provider/geth/sub/blocks'
import blocks from '../data/blocks'
import newBlock from '../data/block'

/*beforeEach((done) => {
  // reset cache before each test
  Cache.set(blocks.data(), function() {
    done()
  })
})*/

test('constructor executes', (done) => {
  try {
    let cache = BlockCache.new(100)
    expect(cache.maxlen).toBe(100)
    done()
  } catch (err) {
    done(err)
  }
})

test('SET', (done) => {
  try {
    let cache = BlockCache.new(100)
    cache.setBlocks(blocks.data(), function() {
      const items = cache.getBlocks()
      expect(items.length).toBe(19) // TODO - iquidus
      done()
    })
  } catch (err) {
    done(err)
  }
})
