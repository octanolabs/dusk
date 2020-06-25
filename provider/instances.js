import os from 'os'
import path from 'path'
import consola from 'consola'
import storage from 'node-persist'
import xmlrpc from 'xmlrpc'
import Loop from './lib/loop'

const DUSKDIR = path.join(os.homedir(), '.dusk')
const STORE = path.join(path.join(DUSKDIR, 'persist'), 'store')

const SV = xmlrpc.createClient({
  socketPath: '/var/run/supervisor.sock',
  path: '/RPC2',
})

let CACHE = []

function updateCacheStates(oldCache, cb) {
  const newCache = oldCache
  Loop.sync(newCache.length, function(loop) {
    const i = loop.iteration()
    SV.methodCall('supervisor.getProcessInfo', [ newCache[i].id ], function(err, info) {
      if (!err) {
        newCache[i].supervisor = info
        loop.next()
      } else {
        loop.next()
      }
    })
  }, function() {
    return cb(newCache)
  })
}

export default {
  get() {
    return CACHE
  },
  async set() {
    try {
      if (CACHE.length > 0) {
        updateCacheStates(CACHE, function(newCache) {
          CACHE = newCache
        })
      } else {
        await storage.init({
          dir: STORE
        })
        // read from disk
        const instances = await storage.getItem('instances')
        for (let i in instances) {
          SV.methodCall('supervisor.getProcessInfo', [ instances[i].id ], function(err, info) {
            if (!err) {
              instances[i].supervisor = info
              CACHE.push(instances[i])
            } else {
              consola.error(new Error(err))
            }
          })
        }
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
    start (instanceId, cb) {
      SV.methodCall('supervisor.startProcessGroup', [ instanceId ], function(err, status) {
        if (!err) {
          updateCacheStates(CACHE, function(newCache) {
            CACHE = newCache
            return cb(true, newCache)
          })
        } else {
          consola.error(new Error(err))
          return cb(false, null)
        }
      })
    },
    stop (instanceId, cb) {
      SV.methodCall('supervisor.stopProcessGroup', [ instanceId ], function(err, status) {
        if (!err) {
          updateCacheStates(CACHE, function(newCache) {
            CACHE = newCache
            return cb(true, newCache)
          })
        } else {
          consola.error(new Error(err))
          return cb(false, null)
        }
      })
    }
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

const getProcessInfo = async function(instanceId) {
  try {
    SV.methodCall('supervisor.getProcessInfo', [ instanceId ], function(err, info) {
      if (err) consola.error(new Error(err))
      return info
    })
  } catch (e) {
    consola.error(new Error(e))
  }
}

/*
[program:[instanceId]]
command=[binpath] [params]
user=[user]
autostart=true
autorestart=true
stderr_logfile=[logdir]/[intanceId].err.log
stdout_logfile=[logdir]/[intanceId].out.log
*/
const createSupervisorConfig = async function (instance) {
  try {

  } catch (e) {

  }
}

// http://supervisord.org/api.html

// supervisor process states
// http://supervisord.org/subprocess.html#process-states
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
