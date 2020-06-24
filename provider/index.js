import consola from 'consola'
import NanoTimer from 'nanotimer'

import system from './system.js'
import packages from './packages.js'
import instances from './instances.js'

const providers = {
  system: {
    timer: new NanoTimer(),
    interval: '25s',
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
    set() {
      instances.set()
    },
    get() {
      return instances.get()
    },
    add(instance) {
      return instances.helpers.add(instance)
    },
    remove(instanceId) {
      return instances.helpers.remove(instanceId)
    },
    start(instanceId) {
      return instances.helpers.start(instanceId)
    },
    stop(instanceId) {
      return instances.helpers.stop(instanceId)
    }
  }
}

export default {
  async init() {
    try {
      // TODO: load provider functions from packages
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
  }
}
