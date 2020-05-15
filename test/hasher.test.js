import Hasher from '../provider/sub/hasher'

// sha256sum test/data/system.js
const testHash =
  'f3127fade30df49b898823ca5f99947148f103290da4ee84e327c899b440c73e'

test('sha256sum', async (done) => {
  try {
    const filepath = 'test/data/system.js'
    await Hasher.helpers.sha256sum(filepath)
    Hasher.emitter.on('sha256-complete', async function(digest) {
      await expect(digest).toBe(testHash)
      done()
    })
  } catch (e) {
    done(e)
  }
})
