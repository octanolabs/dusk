// import consola from 'consola'
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

router.get('/pending', (req, res) => {
  return res.json({ info: provider.getPendingTxns() })
})

router.get('/blocks', (req, res) => {
  return res.json({ list: provider.getBlocks() })
})

// Export the server middleware
export default {
  path: '/api/gubiq',
  handler: router
}
