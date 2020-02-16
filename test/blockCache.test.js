import Cache from '../api/blockCache'
import blocks from './data/blocks'
import newBlock from './data/block'

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

test('MAXLEN: does return', done => {
  try {
    const maxlen = Cache.maxlen()
    expect(maxlen).toBe(88)
    done()
  } catch (err) {
    done(err)
  }
})

test('MAXLEN: does set', done => {
  try {
    Cache.maxlen(20)
    const maxlen = Cache.maxlen()
    expect(maxlen).toBe(20)
    done()
  } catch (err) {
    done(err)
  }
})

test('PUSH: does add', done => {
  try {
    Cache.push(newBlock.data())
    const cache = Cache.get()
    const block = cache[cache.length - 1]
    expect(block.number).toBe(1100001)
    done()
  } catch (err) {
    done(err)
  }
})

test('PUSH: does prune', done => {
  try {
    Cache.maxlen(20)
    const b = newBlock.data()
    Cache.push(b)
    const cache = Cache.get()
    const block = cache[cache.length - 1]
    expect(block.number).toBe(b.number)
    expect(block.timestamp).toBe(b.timestamp)
    expect(block.blocktime).toBe(b.timestamp - cache[cache.length - 2].timestamp)
    expect(cache.length).toBe(20)
    done()
  } catch (err) {
    done(err)
  }
})
