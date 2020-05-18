import Downloader from '../../provider/sub/downloader'
import Hasher from '../../provider/sub/hasher'

// this file does not exist
const testUrl =
  'https://raw.githubusercontent.com/octanolabs/dusk/develop/test/data/system.js'
const testHash =
  'f3127fade30df49b898823ca5f99947148f103290da4ee84e327c899b440c73e'
const testInfo = {
  name: 'test',
  version: '0.0.1'
}

test('checksum after download', async (done) => {
  try {
    const url = testUrl
    const path = 'test/data/persist/checksum'
    Downloader.emitter.on('download-complete', async function(downloader) {
      await expect(downloader.url).toBe(url)
      await expect(downloader.path).toBe(path)
      Hasher.emitter.on('sha256-complete', async function(hasher) {
        await expect(hasher.hash).toBe(testHash)
        done()
      })
      await Hasher.helpers.sha256sum('test/data/persist/checksum/system.js')
    })
    await Downloader.helpers.download(url, path, testInfo)
  } catch (e) {
    done(e)
  }
})
