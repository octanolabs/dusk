import Downloader from '../../provider/sub/downloader'

const testUrl =
  'https://raw.githubusercontent.com/octanolabs/dusk/develop/test/data/system.js'

const testInfo = {
  name: 'test',
  version: '0.0.1'
}

test('download-complete (con info)', async (done) => {
  try {
    const url = testUrl
    const path = 'test/data/persist/con'
    Downloader.emitter.on('download-complete', function(downloader) {
      expect(downloader.url).toBe(url)
      expect(downloader.path).toBe(path)
      expect(downloader.info)
      expect(downloader.info.name).toBe(testInfo.name)
      done()
    })
    await Downloader.helpers.download(url, path, testInfo)
  } catch (e) {
    done(e)
  }
})
