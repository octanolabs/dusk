import Platform from '../provider/lib/platform'

test('platform', async (done) => {
  try {
    const platform = await Platform.parse('x64', 'linux')
    await expect(platform).toBe('linux-amd64')
    done()
  } catch (e) {
    done(e)
  }
})
