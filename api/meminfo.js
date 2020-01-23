// os. module only returns totalmem and freemem, we want more info.
import fs from 'fs'
import { promisify } from 'util'
import consola from 'consola'

const readFile = promisify(fs.readFile)

export default {
  async async() {
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
    } catch(e) {
      consola.error(new Error(e))
      return null
    }
  }
}
