// import consola from 'consola'
import os from 'os'
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
provider.init(os.homedir() + '/.ubiq/gubiq.ipc', async function() {
  await provider.startPolling('peers')
  await provider.startPolling('chaindata')
  await provider.startPolling('systemInfo')
  await provider.startPolling('blocks')
  await provider.startPolling('clientBinaries')
})

router.get('/country', (req, res) => {
  const ip = req.body.ip
  return res.json({ code: provider.getCountryCode(ip) })
})

router.get('/nodeinfo', (req, res) => {
  return res.json({ info: provider.getNodeInfo() })
})

router.get('/peers', (req, res) => {
  return res.json({ list: provider.getPeers() })
})

router.get('/system', (req, res) => {
  return res.json({ info: provider.getSystemInfo() })
})

router.get('/pending', (req, res) => {
  return res.json({ info: provider.getPendingTxns() })
})

router.get('/blocks', (req, res) => {
  return res.json({ list: provider.getBlocks() })
})

router.get('/clients', (req, res) => {
  return res.json({ info: provider.getClientBinaries() })
})

router.post('/download', (req, res) => {})

// Export the server middleware
export default {
  path: '/api',
  handler: router
}
