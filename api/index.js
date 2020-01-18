import express from 'express'
import {Admin} from 'web3-eth-admin'
import Web3IpcProvider from 'web3-providers-ipc'
import net from 'net'
import axios from 'axios'

const web3 = new Admin('/home/xocel/.ubiq/gubiq.ipc', net)
const countryCache = {}
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
router.post('/country', (req, res) => {
  const ip = req.body.ip
  console.log(req.body.ip)
  if (!countryCache[ip]) {
    axios.get('https://ip2c.org/' + ip)
      .then( function(response) {
        countryCache[ip] = response.data
        res.json({ code: response.data })
      })
      .catch( function(err) {
        res.status(401).json({ message: err })
      })
  } else {
    res.json({code: countryCache[ip]})
  }
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
