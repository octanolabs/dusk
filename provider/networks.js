import jf from 'jsonfile'
import consola from 'consola'

let NETWORKS = []

export default {
  clear() {
    NETWORKS = []
  },
  get() {
    return NETWORKS
  },
  async set(path) {
    try {
      jf.readFile(path, async function (err, local) {
        NETWORKS = local
        return
      })
    } catch (e) {
      consola.error(new Error(e))
    }
  }
}
