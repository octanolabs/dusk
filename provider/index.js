import consola from 'consola'
import NanoTimer from 'nanotimer'

import system from './system.js'
import networks from './networks.js'
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
  networks: {
    timer: new NanoTimer(),
    set() {
      networks.set('./networks.json')
    },
    get() {
      return networks.get()
    }
  },
  packages: {
    timer: new NanoTimer(),
    set() {
      packages.set('./packages')
    },
    get() {
      return packages.get()
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
