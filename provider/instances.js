import consola from 'consola'
import storage from 'node-persist'

let CACHE = []

export default {
  get() {
    return CACHE
  },
  async set() {
    try {
      await storage.init({
        dir: 'persist'
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
