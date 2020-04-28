import Cache from '../api/clientCache'

beforeEach(async (done) => {
  // reset cache before each test
  await Cache.set('./test/data/clientBinaries.json', 'https://raw.githubusercontent.com/octanolabs/dusk/develop/test/data/clientBinaries.json')
  done()
})

test('Source equals "remote"', async (done) => {
  try {
    await Cache.set('./test/data/clientBinaries.json', 'https://raw.githubusercontent.com/octanolabs/dusk/develop/clientBinaries.json')
    const cache = await Cache.get()
    await expect(cache.source).toBe('remote')
    done()
  } catch (err) {
    done(err)
  }
})

test('Source equals "local"', async (done) => {
  try {
    await Cache.set('./test/data/clientBinaries.json', 'https://raw.githubusercontent.com/octanolabs/dusk2/develop/test/data/clientBinaries.json')
    const cache = await Cache.get()
    await expect(cache.source).toBe('local')
    done()
  } catch (err) {
    done(err)
  }
})
