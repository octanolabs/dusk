import consola from 'consola'
import NanoTimer from 'nanotimer'

// core providers
import system from './system.js'
import packages from './packages.js'
import instances from './instances.js'

// reusable providers
import Geth from './geth/provider.js'

const providers = {
  system: {
    timer: new NanoTimer(),
    interval: '10s',
    set() {
      system.set()
    },
    get() {
      return system.get()
    }
  },
  packages: {
    timer: new NanoTimer(),
    set() {
      packages.set('./packages')
    },
    get() {
      return packages.get()
    },
    download(clientId, version) {
      packages.download(clientId, version)
    },
    downloading() {
      return packages.downloading()
    },
    initDownloading(data) {
      packages.initDownloading(data)
    }
  },
  instances: {
    timer: new NanoTimer(),
    interval: '1s',
    set() {
      instances.set()
    },
    get() {
      return instances.get()
    },
    add(instance) {
      return instances.helpers.add(instance)
    },
    remove(instanceId, rmDatadir, cb) {
      instances.helpers.remove(instanceId, rmDatadir, function(success, instances) {
        return cb(success, instances)
      })
    },
    update(instance, cb) {
      instances.helpers.update(instance, function(success, instances) {
        return cb(success, instances)
      })
    },
    start(instanceId, cb) {
      instances.helpers.start(instanceId, function(success, instances){
        return cb(success, instances)
      })
    },
    stop(instanceId, cb) {
      instances.helpers.stop(instanceId, function(success, instances){
        return cb(success, instances)
      })
    },
    logs(instanceId, cb) {
      instances.helpers.logs(instanceId, function(logs) {
        return cb(logs)
      })
    }
  }
}

export default {
  async init() {
    try {
      return providers
    } catch (e) {
      consola.error(new Error(e))
      return {}
    }
  },
  startProvider(name) {
    providers[name].timer.setTimeout(providers[name].set, '', '2s')
    if (providers[name].interval) {
      providers[name].timer.setInterval(
        providers[name].set,
        '',
        providers[name].interval
      ) // repeat
    }
  },
  createProvider(type, id, ipcPath, cb) {
    if (type === 'geth') {
      providers[id] = Geth.new(ipcPath, id, '5s')
      return cb(providers)
    } else {
      return cb(null)
    }
  },
  destroyProvider(id) {
    providers[id] = null
  }
}
