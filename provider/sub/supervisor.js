import xmlrpc from 'xmlrpc'
import consola from 'consola'

// supervisord XML-RPC API
// http://supervisord.org/api.html

let CACHE = []
let SV = null

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
      reloadConfig()
      SV.methodCall('supervisor.getAllProcessInfo', [], function(err, value) {
        if (!err) {
          CACHE = value
        } else {
          consola.error(new Error(err))
        }
      })
    } catch (e) {
      consola.error(new Error(e))
    }
  },
  helpers: {
    reload() {
      return reloadConfig()
    },
    add(instanceId) {
      return addProcessGroup(instanceId)
    },
    remove(instanceId) {
      return removeProcessGroup(instanceId)
    },
    start(instanceId) {
      return startProcessGroup(instanceId)
    },
    stop(intanceId) {
      return stopProcessGroup(instanceId)
    },
    stdout(instanceId) {
      return tailProcessStdoutLog(instanceId, 0, 512)
    },
    stderr(instanceId) {
      return tailProcessStderrLog(instanceId, 0, 512)
    }
  }
}

const reloadConfig = function () {
  SV.methodCall('supervisor.reloadConfig', [], function(err, changes) {
    if (err) consola.error(new Error(err))
    return changes
  })
}

const addProcessGroup = function (instanceId) {
  SV.methodCall('supervisor.addProcessGroup', [ instanceId ], function(err, success) {
    if (err) consola.error(new Error(err))
    return success
  })
}

const removeProcessGroup = function (instanceId) {
  SV.methodCall('supervisor.removeProcessGroup', [ instanceId ], function(err, success) {
    if (err) consola.error(new Error(err))
    return success
  })
}

const startProcessGroup = function (instanceId) {
  SV.methodCall('supervisor.startProcessGroup', [ instanceId ], function(err, status) {
    if (err) consola.error(new Error(err))
    return status
  })
}

const stopProcessGroup = function (instanceId) {
  SV.methodCall('supervisor.stopProcessGroup', [ instanceId ], function(err, status) {
    if (err) consola.error(new Error(err))
    return status
  })
}

const tailProcessStdoutLog = function (instanceId, offset, length) {
  SV.methodCall('supervisor.tailProcessStdoutLog', [ instanceId, offset, length ], function(err, log) {
    if (err) consola.error(new Error(err))
    return log
  })
}

const tailProcessStderrLog = function (instanceId, offset, length) {
  SV.methodCall('supervisor.tailProcessStderrLog', [ instanceId, offset, length ], function(err, log) {
    if (err) consola.error(new Error(err))
    return log
  })
}
