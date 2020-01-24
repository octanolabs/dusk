// os. module only returns totalmem and freemem, we want more info.
import consola from 'consola'
import fs from 'fs'
import os from 'os'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)

export default {
  async cpuinfo() {
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
  },
  async meminfo() {
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
  },
  async syncLoop(iterations, process, exit){
    var index = 0,
      done = false,
      shouldExit = false
    var loop = {
      next:function(){
        if(done){
          if(shouldExit && exit){
            exit() // Exit if we're done
          } else {
            return // Stop the loop if we're done
          }
        } else {
          // If we're not finished
          if(index < iterations){
            index++ // Increment our index
            process(loop)
          } else {
            done = true; // Make sure we say we're done
            if(exit) exit() // Call the callback on exit
          }
        }
      },
      iteration:function(){
        return index - 1 // Return the loop number we're on
      },
      break:function(end){
        done = true // End the loop
        shouldExit = end // Passing end as true means we still call the exit callback
      },
      redo:function(){
        process(loop)
      }
    };
    loop.next()
    return loop
  }
}
