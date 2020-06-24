import os from 'os'
import path from 'path'
import consola from 'consola'
import storage from 'node-persist'
import xmlrpc from 'xmlrpc'

const DUSKDIR = path.join(os.homedir(), '.dusk')
const STORE = path.join(path.join(DUSKDIR, 'persist'), 'store')

let SV = null
let CACHE = []

export default {
  get() {
    return CACHE
  },
  async set() {
    try {
      await storage.init({
        dir: STORE
      })
      // read from disk
      const instances = await storage.getItem('instances')
      if (instances) {
        CACHE = instances
        SV = xmlrpc.createClient({
          socketPath: '/var/run/supervisor.sock',
          path: '/RPC2',
        })
        consola.log(supervisor.getAllProcessInfo())
      }
    } catch (e) {
      consola.error(new Error(e))
    }
  },
  helpers: {
    async add(instance) {
      try {
        return await addInstance(instance)
      } catch (e) {
        consola.error(new Error(e))
        return null
      }
    },
    async remove(id) {
      try {
        return await removeInstance(id)
      } catch (e) {
        consola.error(new Error(e))
        return null
      }
    },

  }
}

async function addInstance(instance) {
  try {
    if (instance) {
      CACHE.push(instance)
      await storage.setItem('instances', CACHE)
      return true
    }
    return false
  } catch (e) {
    consola.error(new Error(e))
    return null
  }
}

async function removeInstance(id) {
  try {
    if (id) {
      const filtered = CACHE.filter(function(value, index, arr) {
        return value.id !== id
      })
      await storage.setItem('instances', filtered)
      CACHE = filtered
      return { success: true, info: CACHE }
    }
    return { success: false }
  } catch (e) {
    consola.error(new Error(e))
    return null
  }
}

const supervisor = {
  reloadConfig() {
    SV.methodCall('supervisor.reloadConfig', [], function(err, changes) {
      if (err) consola.error(new Error(err))
      return changes
    })
  },
  getAllProcessInfo() {
    SV.methodCall('supervisor.getAllProcessInfo', [], function(err, info) {
      if (err) consola.error(new Error(err))
      return info
    })
  },
  addProcessGroup (instanceId) {
    SV.methodCall('supervisor.addProcessGroup', [ instanceId ], function(err, success) {
      if (err) consola.error(new Error(err))
      return success
    })
  },
  removeProcessGroup (instanceId) {
    SV.methodCall('supervisor.removeProcessGroup', [ instanceId ], function(err, success) {
      if (err) consola.error(new Error(err))
      return success
    })
  },
  startProcessGroup (instanceId) {
    SV.methodCall('supervisor.startProcessGroup', [ instanceId ], function(err, status) {
      if (err) consola.error(new Error(err))
      return status
    })
  },
  stopProcessGroup (instanceId) {
    SV.methodCall('supervisor.stopProcessGroup', [ instanceId ], function(err, status) {
      if (err) consola.error(new Error(err))
      return status
    })
  },
  tailProcessStdoutLog (instanceId, offset, length) {
    SV.methodCall('supervisor.tailProcessStdoutLog', [ instanceId, offset, length ], function(err, log) {
      if (err) consola.error(new Error(err))
      return log
    })
  },
  tailProcessStderrLog (instanceId, offset, length) {
    SV.methodCall('supervisor.tailProcessStderrLog', [ instanceId, offset, length ], function(err, log) {
      if (err) consola.error(new Error(err))
      return log
    })
  }
}
