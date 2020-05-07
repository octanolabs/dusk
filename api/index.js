import consola from 'consola'
import os from 'os'
import express from 'express'
import provider from '../provider/index.js'

// Create express router
const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

let providers = {}

// start polling
const start = async function() {
  try {
    providers = await provider.init()
    for (let key of Object.keys(providers)) {
      await provider.startProvider(key)
    }
  } catch (e) {
    consola.error(new Error(e))
  }
}

start()

router.get('/system', (req, res) => {
  return res.json({ info: providers.system.get() })
})

router.get('/networks', (req, res) => {
  return res.json({ info: providers.networks.get() })
})

router.get('/packages', (req, res) => {
  return res.json({ info: providers.packages.get() })
})

// Export the server middleware
export default {
  path: '/api',
  handler: router
}
