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
  if (!req.body.clientId || !req.body.version) {
    res.status(401).json({ message: 'Bad params' })
  } else {
    const dl = await providers.packages.download(req.body.clientId, req.body.version)
    if (dl) {
      res.json({downloading: true})
    } else {
      res.json({downloading: false})
    }
  }
})

router.post('/resetdownload', async (req, res) => {
  const dl = await providers.packages.initDownloading(req.body.downloading)
  if (dl) {
    res.json({reset: true})
  } else {
    res.json({reset: false})
  }
})

// Export the server middleware
export default {
  path: '/api',
  handler: router
}
