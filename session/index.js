import express from 'express'
import storage from 'node-persist'
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

const start = async function() {
  try {
    await storage.init({
      dir: 'persist'
    })
    const user = await storage.getItem('user')
    if (!user) {
      await storage.setItem('user', {
        username: 'dusk',
        hash: 'octano',
        attempts: 0,
        locale: 'en'
      })
    }
  } catch (e) {
    console.log(e)
  }
}

start()


// Add POST - /session/login
router.post('/login', (req, res) => {
  // TODO: lol.
  if (req.body.username === 'dusk' && req.body.password === 'octano') {
    req.session.user = { username: req.body.username }
    return res.json({ username: req.body.username })
  }
  res.status(401).json({ message: 'Bad credentials' })
})

// Add POST - /session/logout
router.post('/logout', (req, res) => {
  delete req.session.user
  res.json({ ok: true })
})

// Add GET - /session/user
router.get('/user', (req, res) => {
  res.json({ user: req.session.user })
})

// Export the server middleware
export default {
  path: '/session',
  handler: router
}
