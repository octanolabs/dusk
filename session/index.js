import consola from 'consola'
import express from 'express'
import storage from 'node-persist'
import bcrypt from 'bcrypt'
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

const SALT_ROUNDS = 16
const ONE_HOUR = 3600

const start = async function() {
  try {
    await storage.init({
      dir: 'persist'
    })
    const user = await storage.getItem('user')
    if (!user) {
      bcrypt.hash('octano', SALT_ROUNDS, async function(err, hash) {
        if (err) consola.error(new Error(err))
        await storage.setItem('user', {
          username: 'dusk',
          hash: hash,
          locale: 'en',
          maxAttempts: 5,
          locktime: ONE_HOUR,
          attempts: 0,
          locked: 0
        })
      })
    }
  } catch (e) {
    consola.error(new Error(e))
  }
}

start()


// Add POST - /session/login
router.post('/login', async (req, res) => {
  try {
    const user = await storage.getItem('user')
    if (!user || user.username !== req.body.username.toLowerCase()) {
      // user store does not exist?? or username is invalid.
      res.status(401).json({ message: 'Bad credentials' })
    } else {
      bcrypt.compare(req.body.password, user.hash, function(err, result) {
        if (!err && result === true) {
          req.session.user = {
            username: user.username,
            maxAttempts: user.maxAttempts,
            locktime: user.locktime
          }
          return res.json({ username: user.username })
        } else {
          // invalid password
          res.status(401).json({ message: 'Bad credentials' })
        }
      })
    }
  } catch (e) {
    res.status(401).json({ message: 'Bad credentials' })
  }
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

router.post('/update-settings', async (req, res) => {
  try {
    const user = await storage.getItem('user')
    if (!user || !req.session.user || user.username !== req.session.user.username || req.body.username.length < 4) {
      // user store does not exist?? or username is invalid.
      res.json({ success: false })
    } else {
      // verify password
      bcrypt.compare(req.body.password, user.hash, async function(err, result) {
        if (!err && result === true) {
          //password is correct
          await storage.setItem('user', {
            username: req.body.username,
            hash: user.hash,
            locale: req.body.locale,
            maxAttempts: req.body.maxAttempts,
            locktime: req.body.locktime,
            attempts: user.attempts,
            locked: user.locked
          })
          req.session.user = {
            username: req.body.username,
            maxAttempts: req.body.maxAttempts,
            locktime: req.body.locktime
          }
          res.json({ success: true })
        } else {
          res.json({ success: false })
        }
      })
    }
  } catch (e) {
    res.json({ success: false, message: e })
  }
})

// Export the server middleware
export default {
  path: '/session',
  handler: router
}
