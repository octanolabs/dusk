import consola from 'consola'
import express from 'express'
import provider from './provider.js'

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

// start polling
provider.init('/home/xocel/.ubiq/gubiq.ipc', async function() {
  provider.startPolling('peers')
})

router.post('/country', (req, res) => {
  const ip = req.body.ip
  return res.json({ code: provider.getCountryCode(ip) })
})

router.post('/nodeinfo', (req, res) => {
  return res.json({ info: provider.getNodeInfo() })
})

router.post('/peers', (req, res) => {
  return res.json({ list: provider.getPeers() })
})

router.post('/system', (req, res) => {
  return res.json({ info: provider.getSystemInfo() })
})

// Add POST - /api/login
router.post('/login', (req, res) => {
  if (req.body.password === 'octano') { // TODO: lol.
    req.session.authenticated = true
    return res.json({ authenticated: true })
  }
  res.status(401).json({ message: 'Bad credentials' })
})

// Add POST - /api/logout
router.post('/logout', (req, res) => {
  delete req.session.authenticated
  res.json({ ok: true })
})

// Export the server middleware
export default {
  path: '/api',
  handler: router
}
