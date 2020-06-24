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

router.get('/packages', (req, res) => {
  return res.json({ info: providers.packages.get() })
})

router.get('/downloading', (req, res) => {
  return res.json({ info: providers.packages.downloading() })
})

router.post('/download', async (req, res) => {
  if (!req.body.client || !req.body.version) {
    res.status(401).json({ message: 'Bad params' })
  } else {
    const dl = await providers.packages.download(req.body.client, req.body.version)
    if (dl) {
      res.json({downloading: true})
    } else {
      res.json({downloading: false})
    }
  }
})

router.get('/instances/get', (req, res) => {
  return res.json({ info: providers.instances.get() })
})

router.post('/instance/add', async (req, res) => {
  if (!req.body.id || !req.body.name) {
    res.status(401).json({ message: 'Bad params' })
  } else {
    const success = await providers.instances.add(req.body)
    res.json({success: success})
  }
})

router.post('/instance/remove', async (req, res) => {
  if (!req.body.id) {
    res.status(401).json({ message: 'Bad params' })
  } else {
    const rm = await providers.instances.remove(req.body.id)
    res.json({ success: rm.success, info: rm.info })
  }
})

router.post('/instance/start', async (req, res) => {
  if (!req.body.id) {
    res.status(401).json({ message: 'Bad params' })
  } else {
    const i = await providers.instances.start(req.body.id)
    res.json({ success: i.success, info: i.info })
  }
})

router.post('/instance/stop', async (req, res) => {
  if (!req.body.id) {
    res.status(401).json({ message: 'Bad params' })
  } else {
    const i = await providers.instances.stop(req.body.id)
    res.json({ success: i.success, info: i.info })
  }
})

// Export the server middleware
export default {
  path: '/api',
  handler: router
}
