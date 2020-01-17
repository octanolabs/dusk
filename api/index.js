import express from 'express'
import {Admin} from 'web3-eth-admin'
import Web3IpcProvider from 'web3-providers-ipc'
import net from 'net'
import axios from 'axios'
import NodeCache from 'node-cache'

const web3 = new Admin('/home/xocel/.ubiq/gubiq.ipc', net)
const peerCache = new NodeCache()
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

// Add POST - /api/login
router.post('/peers', (req, res) => {
  web3.getPeers(function(err, peers) {
    if (err) {
      res.status(401).json({ message: err })
    } else {
      res.json({ list: peers })
    }
  })
})

// Add POST - /api/login
router.post('/login', (req, res) => {
  if (req.body.password === 'octano') { // TODO: lol.
    req.session.authUser = { username: 'dusk' }
    return res.json({ username: 'dusk' })
  }
  res.status(401).json({ message: 'Bad credentials' })
})

// Add POST - /api/logout
router.post('/logout', (req, res) => {
  delete req.session.authUser
  res.json({ ok: true })
})

// Export the server middleware
export default {
  path: '/api',
  handler: router
}
