import fs from 'fs'
import os from 'os'
import { promisify } from 'util'
import consola from 'consola'
import disk from 'diskusage'
import getSize from 'get-folder-size'

const readFile = promisify(fs.readFile)

let CACHE = {}
let CHAINDATA = 0

export default {
  clear() {
    CACHE = {}
  },
  get() {
    return CACHE
  },
  async set() {
    try {
      const info = await disk.check(os.homedir())
      info.chaindata = CHAINDATA

      let arch = await os.arch()
      const platform = await os.platform()
      if (arch === 'x64') {
        arch = 'amd64'
      }
      CACHE = {
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        meminfo: await meminfo(),
        loadavg: os.loadavg(),
        cpus: await cpuinfo(),
        platform: platform + '-' + arch,
        diskusage: info
      }
    } catch (err) {
      consola.error(new Error(err))
    }
  },
  async setChaindata() {
    try {
      getSize(os.homedir() + '/.ubiq/gubiq/chaindata', (err, size) => {
        if (err) {
          consola.error(new Error(err))
        }
        CHAINDATA = size
      })
    } catch (e) {
      consola.error(new Error(e))
    }
  }
}

async function cpuinfo() {
  try {
    const cpus = os.cpus()
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

async function meminfo() {
  const json = {}
  try {
    const raw = await readFile('/proc/meminfo', 'utf8')
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
