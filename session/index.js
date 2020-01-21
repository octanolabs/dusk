import express from 'express'

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

// Add POST - /api/auth/login
router.post('/login', (req, res) => {
  // TODO: lol.
  if (req.body.username === 'dusk' && req.body.password === 'octano') {
    req.session.user = { username: req.body.username }
    return res.json({ username: req.body.username })
  }
  res.status(401).json({ message: 'Bad credentials' })
})

// Add POST - /api/auth/logout
router.post('/logout', (req, res) => {
  delete req.session.user
  res.json({ ok: true })
})

// Add GET - /api/auth/logout
router.get('/user', (req, res) => {
  res.json({ user: req.session.user })
})

// Export the server middleware
export default {
  path: '/session',
  handler: router
}
