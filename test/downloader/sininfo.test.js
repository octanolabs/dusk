import Downloader from '../../provider/sub/downloader'

const testUrl =
  'https://raw.githubusercontent.com/octanolabs/dusk/develop/test/data/system.js'

test('download-complete (sin info)', async (done) => {
  try {
    const url = testUrl
    const path = 'test/data/persist/sin'
    Downloader.emitter.on('download-complete', function(downloader) {
      expect(downloader.url).toBe(url)
      expect(downloader.path).toBe(path)
      done()
    })
    await Downloader.helpers.download(url, path)
  } catch (e) {
    done(e)
  }
})
