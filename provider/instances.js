import os from 'os'
import path from 'path'
import consola from 'consola'
import storage from 'node-persist'

const DUSKDIR = path.join(os.homedir(), '.dusk')
const STORE = path.join(path.join(DUSKDIR, 'persist'), 'store')

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
