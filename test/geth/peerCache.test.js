import PeerCache from '../../provider/geth/sub/peers'
import peers from '../data/peers'

/*beforeEach((done) => {
  // reset cache before each test
  Cache.set(blocks.data(), function() {
    done()
  })
})*/

const ONE_DAY = 86400

test('constructor executes', (done) => {
  try {
    let cache = PeerCache.new(ONE_DAY)
    expect(cache.maxage).toBe(ONE_DAY)
    done()
  } catch (err) {
    done(err)
  }
})

test('SET', (done) => {
  try {
    let cache = PeerCache.new(ONE_DAY)
    cache.setPeers(peers.data(), function() {
      const items = cache.getPeers()
      expect(items.length).toBe(7) // TODO - iquidus
      done()
    })
  } catch (err) {
    done(err)
  }
})
