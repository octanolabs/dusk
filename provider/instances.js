import os from 'os'
import fs from 'fs'
import path from 'path'
import consola from 'consola'
import { promisify } from 'util'
import storage from 'node-persist'
import xmlrpc from 'xmlrpc'
import Loop from './lib/loop'

const DUSKDIR = path.join(os.homedir(), '.dusk')
const STORE = path.join(path.join(DUSKDIR, 'persist'), 'store')
const SVDIR = path.join(DUSKDIR, 'supervisor')
const LOGDIR = path.join(SVDIR, 'logs')

// promisify fs functions so we can async/await them later.
const stat = promisify(fs.stat)
const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)

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
        addInstance(instance, function(info) {
          return info
        })
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
    },
    logs (instanceId, cb) {
      SV.methodCall('supervisor.tailProcessStdoutLog', [ instanceId, 0, 10240 ], function(err, stdout) {
        if (err) consola.error(new Error(err))
        if (stdout && stdout[0]) { // clean up logs
          // remove first (probably incomplete) line
          stdout[0] = stdout[0].substr(stdout[0].indexOf('\n'))
        }
        SV.methodCall('supervisor.tailProcessStderrLog', [ instanceId, 0, 10240 ], function(err, stderr) {
          if (err) consola.error(new Error(err))
          if (stderr && stderr[0]) { // clean up logs
            // remove first (probably incomplete) line
            stderr[0] = stderr[0].substr(stderr[0].indexOf('\n'))
          }
          return cb({ stdout, stderr })
        })
      })
    }
  }
}

function addInstance(instance, cb) {
  if (instance) {
    createSupervisorConfig(instance, function (config) {
      // make sure LOGDIR has been created
      fs.stat(LOGDIR, async function(logerr, logstat) {
        try {
          if (logerr) {
            await mkdir(LOGDIR, { recursive: true })
          }
          const confPath = path.join(SVDIR, instance.id + '.conf')
          // write to disk
          const err = await writeFile(confPath, config)
          if (err) {
            consola.error(new Error(err))
            return cb({ success: false })
          } else {
            CACHE.push(instance)
            SV.methodCall('supervisor.reloadConfig', [], function(rl_err, changes) {
              if (rl_err) consola.error(new Error(rl_err))
              SV.methodCall('supervisor.addProcessGroup', [ instance.id ], function(apg_err, success) {
                if (apg_err) consola.error(new Error(apg_err))
                updateCacheStates(CACHE, async function(newCache) {
                  CACHE = newCache
                  await storage.setItem('instances', CACHE)
                  return cb({ success: true, info: CACHE })
                })
              })
            })
          }
        } catch (e) {
          consola.error(new Error(e))
          return cb({ success: false })
        }
      })
    })
  } else {
    return cb({ success: false })
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

const createSupervisorConfig = function (instance, cb) {
  let err = '.err.log'
  let out = '.out.log'
  consola.log('createSupervisorConfig')
  consola.log(instance)
  const binpath = '/usr/bin/gubiq'
  const user = os.userInfo()
  let config =
    '[program:' + instance.id + ']' + '\n' +
    'command=' + binpath + ' ' + instance.flags + '\n' +
    'user=' + user.username + '\n' +
    'autostart=true' + '\n' +
    'autorestart=true' + '\n' +
    'stderr_logfile=' + path.join(LOGDIR, instance.id + err) + '\n' +
    'stdout_logfile=' + path.join(LOGDIR, instance.id + out)
  return cb(config)
}

// http://supervisord.org/api.html

// supervisor process states
// http://supervisord.org/subprocess.html#process-states
const supervisor = {
  reloadConfig() {
    SV.methodCall('supervisor.reloadConfig', [], function(err, changes) {
      if (err) consola.error(new Estatrror(err))
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
  }
}
