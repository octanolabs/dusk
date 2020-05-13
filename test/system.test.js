import fs from 'fs'
import { promisify } from 'util'

import provider from '../provider/system'
import system from './data/system'

const readFile = promisify(fs.readFile)
let testData = system.data()

test('cpuInfo/parseCpus', async (done) => {
  try {
    const cpus = await provider.helpers.cpuInfo(testData.cpus)
    await expect(cpus.length).toBe(8)
    await expect(cpus[0]).toBe(89)
    await expect(cpus[7]).toBe(92)
    done()
  } catch (e) {
    done(e)
  }
})

test('memInfo/parseMeminfo', async (done) => {
  try {
    const raw = await readFile('/proc/meminfo', 'utf8')
    const meminfo = await provider.helpers.memInfo(raw)
    await expect(meminfo.MemTotal)
    await expect(meminfo.MemFree)
    await expect(meminfo.MemAvailable)
    await expect(meminfo.SwapTotal)
    await expect(meminfo.SwapFree)
    done()
  } catch (e) {
    done(e)
  }
})

test('set/get', async (done) => {
  try {
    await provider.set()
    const cache = await provider.get()
    await expect(cache.totalmem)
    await expect(cache.freemem)
    await expect(cache.meminfo)
    await expect(cache.loadavg)
    await expect(cache.cpus)
    await expect(cache.diskusage)
    await expect(cache.hostname)
    await expect(cache.release)
    await expect(cache.platform)
    await expect(cache.userInfo)
    await expect(cache.networkInterfaces)
    done()
  } catch (e) {
    done(e)
  }
})
