import Hasher from '../provider/sub/hasher'

// sha256sum test/data/system.js
const hash =
  'f3127fade30df49b898823ca5f99947148f103290da4ee84e327c899b440c73e'

test('sha256-complete', async (done) => {
  try {
    const path = 'test/data/system.js'
    await Hasher.helpers.sha256sum(path)
    Hasher.emitter.on('sha256-complete', async function(hasher) {
      await expect(hasher.hash).toBe(hash)
      await expect(hasher.path).toBe(path)
      done()
    })
  } catch (e) {
    done(e)
  }
})

test('sha256-error', async (done) => {
  try {
    const path = 'test/data/noexist'
    await Hasher.helpers.sha256sum(path)
    Hasher.emitter.on('sha256-error', async function(hasher) {
      await expect(hasher.error)
      await expect(hasher.path).toBe(path)
      done()
    })
  } catch (e) {
    done(e)
  }
})
