import consola from 'consola'
import NanoTimer from 'nanotimer'

import system from './system.js'
import packages from './packages.js'

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
