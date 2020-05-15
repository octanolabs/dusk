import consola from 'consola'
import crypto from 'crypto'
import fs from 'fs'
import EventEmitter from 'events'

class Hasher extends EventEmitter { }
let hasher = new Hasher()

const sha256sum = async function(filepath) {
  try {
    const hash = crypto.createHash('sha256')
    const input = fs.createReadStream(filepath)
    input.on('readable', () => {
      const data = input.read()
      if (data)
        hash.update(data)
      else {
        hasher.emit('sha256-complete', {
          path: filepath,
          hash: hash.digest('hex')
        })
      }
    })
  } catch (e) {
    consola.error(new Error(e))
  }
}

export default {
  helpers: {
    sha256sum(filepath) {
      sha256sum(filepath)
    }
  },
  emitter: hasher
}
