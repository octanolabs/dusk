import xmlrpc from 'xmlrpc'
import consola from 'consola'

let CACHE = {}
let SV = {}

export default {
  get() {
    return CACHE
  },
  async set() {
    try {
      SV = xmlrpc.createClient({
        socketPath: '/var/run/supervisor.sock',
        path: '/RPC2',
      })
      SV.methodCall('supervisor.getAllProcessInfo', [], function(err, value) {
        if (!err) {
          CACHE = value
          consola.log(value)
        } else {
          consola.error(new Error(err))
        }
      })
    } catch (e) {
      consola.error(new Error(e))
    }
  },
  helpers: {}
}
