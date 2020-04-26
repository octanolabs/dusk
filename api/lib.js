import os from 'os'

export default {
  async syncLoop(iterations, process, exit) {
    let index = 0
    let done = false
    let shouldExit = false
    const loop = {
      next() {
        if (done) {
          if (shouldExit && exit) {
            exit() // Exit if we're done
          } else {
            // Stop the loop if we're done
          }
          // If we're not finished
        } else if (index < iterations) {
          index++ // Increment our index
          process(loop)
        } else {
          done = true // Make sure we say we're done
          if (exit) exit() // Call the callback on exit
        }
      },
      iteration() {
        return index - 1 // Return the loop number we're on
      },
      break(end) {
        done = true // End the loop
        shouldExit = end // Passing end as true means we still call the exit callback
      },
      redo() {
        process(loop)
      }
    }
    loop.next()
    return loop
  }
}
