import fs from 'fs'
import os from 'os'
import { promisify } from 'util'
import consola from 'consola'
import disk from 'diskusage'
import Platform from './platform'

const readFile = promisify(fs.readFile)

let CACHE = {}

export default {
  get() {
    return CACHE
  },
  async set() {
    try {
      const raw = await readFile('/proc/meminfo', 'utf8')
      const cpus = await os.cpus()
      const arch = await os.arch()
      const platform = await os.platform()

      CACHE = {
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        meminfo: await parseMeminfo(raw),
        loadavg: os.loadavg(),
        cpus: await parseCpus(cpus),
        diskusage: await disk.check(os.homedir()),
        hostname: os.hostname(),
        release: os.release(),
        platform: await Platform.parse(arch, platform),
        userInfo: os.userInfo(),
        networkInterfaces: os.networkInterfaces()
      }
    } catch (err) {
      consola.error(new Error(err))
    }
  },
  helpers: {
    async cpuInfo(cpus) {
      try {
        return await parseCpus(cpus)
      } catch (e) {
        consola.error(new Error(e))
        return null
      }
    },
    async memInfo(meminfo) {
      try {
        return await parseMeminfo(meminfo)
      } catch (e) {
        consola.error(new Error(e))
        return null
      }
    }
  }
}

async function parseCpus(cpus) {
  try {
    const usage = []
    for (const i in cpus) {
      const cpu = cpus[i]
      let total = 0
      let idle = 0
      for (const type in cpu.times) {
        total += cpu.times[type]
        if (type === 'idle') {
          idle = Math.round((100 * cpu.times[type]) / total)
        }
      }
      usage.push(idle)
    }
    return usage
  } catch (e) {
    consola.error(new Error(e))
    return null
  }
}

async function parseMeminfo(raw) {
  const json = {}
  try {
    const lines = raw.split('\n')
    for (const i in lines) {
      const parts = lines[i].split(':')
      if (parts.length === 2) {
        json[parts[0]] = parts[1].trim().split(' ', 1)[0]
      }
    }
    return json
  } catch (e) {
    consola.error(new Error(e))
    return null
  }
}
