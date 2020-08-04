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

router.post('/instance/update', (req, res) => {
  if (!req.body.id) {
    res.status(401).json({ message: 'Bad params' })
  } else {
    providers.instances.update(req.body, function(updated) {
      return res.json({ success: updated.success, info: updated.info })
    })
  }
})

router.post('/instance/remove', (req, res) => {
  if (!req.body.id) {
    res.status(401).json({ message: 'Bad params' })
  } else {
    providers.instances.remove(req.body.id, req.body.rmDatadir, function(removed) {
      return res.json({ success: removed.success, info: removed.info })
    })
  }
})

router.post('/instance/start', (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
    providers.instances.start(req.body.id, function (success, instances) {
      return res.json({ success, instances })
    })
  }
})

router.post('/instance/stop', (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
    providers.instances.stop(req.body.id, function (success, instances) {
      return res.json({ success, instances })
    })
  }
})

router.post('/instance/logs', (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
    providers.instances.logs(req.body.id, function (logs) {
      return res.json({ logs: logs })
    })
  }
})

router.post('/provider/create', (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
    consola.log('/provider/create')
    consola.log(req.body.ipc)
    provider.createProvider(req.body.type, req.body.id, req.body.ipc, function(_providers) {
      if (_providers) {
        providers = _providers
        provider.startProvider(req.body.id)
        return res.json({ success: true, provider: providers[req.body.id].get() })
      } else {
        return res.json({ success: false })
      }
    })
  }
})

router.post('/provider/get', (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
    const provider = providers[req.body.id].get()
    return res.json({ success: true, provider })
  }
})

router.post('/provider/start', (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
    provider.startProvider(req.body.id)
    return res.json({ success: true })
  }
})

// Export the server middleware
export default {
  path: '/api',
  handler: router
}
