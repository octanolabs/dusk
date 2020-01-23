// os. module only returns totalmem and freemem, we want more info.
import os from 'os'
import consola from 'consola'

export default {
  async async() {
    try {
      const cpus = os.cpus()
      let usage = []
      for (const i in cpus) {
        console.log('cpu - ' + i)
        const cpu = cpus[i]
        let total = 0;
        let idle = 0;
        for (const type in cpu.times) {
          total += cpu.times[type]
          if (type === 'idle') {
            idle = Math.round(100 * cpu.times[type] / total)
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
}
