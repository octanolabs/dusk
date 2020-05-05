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

const DEFAULT_SALT_ROUNDS = 12
const ONE_HOUR = 3600

const start = async function() {
  try {
    await storage.init({
      dir: 'persist'
    })
    const user = await storage.getItem('user')
    if (!user) {
      bcrypt.hash('octano', DEFAULT_SALT_ROUNDS, async function(err, hash) {
        if (err) consola.error(new Error(err))
        await storage.setItem('user', {
          username: 'dusk',
          hash: hash,
          maxAttempts: 5,
          locktime: ONE_HOUR,
          attempts: 0,
          locked: 0,
          bcrypt: DEFAULT_SALT_ROUNDS
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
    /* compare passphrase first if possible to ensure bcrypts compute cost
     * also applies if username is invalid otherwise response times can be used
     * to validate a usernames existence.
     *
     * Return exactly the same on all fail conditions, do not leak which value
     * is invalid (username or passphrase).
     */
    if (!user || !req.body.password || !req.body.username) {
      // missing credentials
      res.status(401).json({ message: 'Bad credentials' })
    } else {
      bcrypt.compare(req.body.password, user.hash, function(err, result) {
        if (!err && result === true && user.username === req.body.username.toLowerCase()) {
          // both password and username are correct, success!
          req.session.user = {
            username: user.username,
            maxAttempts: user.maxAttempts,
            locktime: user.locktime,
            bcrypt: user.bcrypt
          }
          return res.json({ username: user.username })
        } else {
          // invalid credentials
          res.status(401).json({ message: 'Bad credentials' })
        }
      })
    }
  } catch (e) {
    // some other issue
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
            bcrypt: user.bcrypt,
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

router.post('/change-passphrase', async (req, res) => {
  try {
    const user = await storage.getItem('user')
    if (!user || !req.session.user || user.username !== req.session.user.username) {
      // user store does not exist?? or username is invalid.
      res.json({ success: false })
    } else {
      // verify password
      bcrypt.compare(req.body.password, user.hash, async function(err, result) {
        if (!err && result === true) {
          //passphrase is correct
          //hash new passphrase
          bcrypt.hash(req.body.new, req.body.bcrypt, async function(err, hash) {
            await storage.setItem('user', {
              username: user.username,
              hash: hash,
              locale: user.locale,
              maxAttempts: user.maxAttempts,
              locktime: user.locktime,
              attempts: user.attempts,
              bcrypt: req.body.bcrypt,
              locked: user.locked
            })
            req.session.user = {
              username: user.username,
              maxAttempts: user.maxAttempts,
              locktime: user.locktime,
              bcrypt: req.body.bcrypt
            }
            res.json({ success: true })
          })
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
