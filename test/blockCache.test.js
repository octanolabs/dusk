import Cache from '../api/blockCache'
import blocks from './data/blocks'

beforeEach(done => {
  // reset cache before each test
  Cache.set(blocks.data(), function() {
    done()
  })
})

test('GET: length', done => {
  try {
    const cache = Cache.get()
    expect(cache.length).toBe(20)
    done()
  } catch (err) {
    done(err)
  }
})

test('GET: order', done => {
  try {
    const cache = Cache.get()
    expect(cache[0].number).toBe(1099981)
    expect(cache[0].timestamp).toBe(1581285685)
    expect(cache[19].number).toBe(1100000)
    expect(cache[19].timestamp).toBe(1581287150)
    done()
  } catch (err) {
    done(err)
  }
})

test('GET: blocktime', done => {
  try {
    const cache = Cache.get()
    expect(cache[19].blocktime).toBe(cache[19].timestamp - cache[18].timestamp)
    done()
  } catch (err) {
    done(err)
  }
})

test('CLEAR: does clear', done => {
  try {
    Cache.clear()
    const cache = Cache.get()
    expect(cache.length).toBe(0)
    done()
  } catch (err) {
    done(err)
  }
})
