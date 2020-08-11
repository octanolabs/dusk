import os from 'os'
import path from 'path'
import consola from 'consola'
import express from 'express'
import storage from 'node-persist'
import bcrypt from 'bcrypt'
import utf8 from 'utf8'
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

const DUSKDIR = path.join(os.homedir(), '.dusk')
const STORE = path.join(DUSKDIR, 'store')
const DEFAULT_SALT_ROUNDS = 12
const ONE_HOUR = 3600
let AUTH_TOKEN = null
let providers = {}

const start = async function() {
  try {
    // get user persistent store
    await storage.init({
      dir: STORE
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
    // start default providers
    providers = await provider.init()
    for (let key of Object.keys(providers)) {
      await provider.startProvider(key)
    }
  } catch (e) {
    consola.error(new Error(e))
  }
}

const utf8ToHex = function(str) {
  str = utf8.encode(str);
  var hex = "";

  // remove \u0000 padding from either side
  str = str.replace(/^(?:\u0000)*/,'');
  str = str.split("").reverse().join("");
  str = str.replace(/^(?:\u0000)*/,'');
  str = str.split("").reverse().join("");

  for(var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    var n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }
  return "0x" + hex
}

const createToken = function(hash, rounds, cb) {
  const now = Date.now()
  const seed = hash + now.toString()
  bcrypt.hash(seed, rounds, function(err, _token) {
    if (err) consola.log(new Error(err))
    const hexed = utf8ToHex(_token)
    const token = hexed.substr(hexed.length - 30)
    return cb(token)
  })
}

const isAuthed = function(req, res, next) {
  if (
    req.session.user &&
    AUTH_TOKEN !== null &&
    req.session.user.token === AUTH_TOKEN
  ) {
    next()
  } else {
    res.status(401).json({ message: 'Bad credentials' })
  }
}

start()

// authentication endpoints
// Add POST - /session/login
router.post('/session/login', async (req, res) => {
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
      const usernamePass = user.username === req.body.username.toLowerCase()
      bcrypt.compare(req.body.password, user.hash, async function(err, result) {
        if (!err && result === true && usernamePass) {
          // both password and username are correct
          // make sure account is not locked
          if ((user.locked + (user.locktime*1000)) > Date.now()) {
            // account is locked
            res.status(401).json({ message: 'Bad credentials' })
          } else {
            createToken(user.hash, user.bcrypt, async function(authToken) {
              if (user.attempts > 0 || user.locked > 0) {
                // reset counters
                await storage.setItem('user', {
                  username: user.username,
                  hash: user.hash,
                  locale: user.locale,
                  maxAttempts: user.maxAttempts,
                  locktime: user.locktime,
                  attempts: 0,
                  bcrypt: user.bcrypt,
                  locked: 0,
                  token: authToken
                })
              }
              req.session.user = {
                username: user.username,
                maxAttempts: user.maxAttempts,
                locktime: user.locktime,
                bcrypt: user.bcrypt,
                token: authToken
              }
              AUTH_TOKEN = authToken
              return res.json({ username: user.username, token: authToken })
            })
          }
        } else if (!err && usernamePass) {
          // password failed but username is correct.
          // increment failed login attempts
          const failedAttempts = user.attempts + 1
          // set locked if failed attempts >= max attempts
          const locked = failedAttempts < user.maxAttempts ? 0 : Date.now()
          await storage.setItem('user', {
            username: user.username,
            hash: user.hash,
            locale: user.locale,
            maxAttempts: user.maxAttempts,
            locktime: user.locktime,
            attempts: failedAttempts,
            bcrypt: user.bcrypt,
            locked: locked
          })
          return res.status(401).json({ message: 'Bad credentials' })
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
router.post('/session/logout', (req, res) => {
  delete req.session.user
  res.json({ ok: true })
})

// Add GET - /session/user
router.get('/session/user', (req, res) => {
  res.json({ user: req.session.user })
})

router.post('/session/update-settings', async (req, res) => {
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
            locked: user.locked,
            token: user.token
          })
          req.session.user = {
            username: req.body.username,
            maxAttempts: req.body.maxAttempts,
            locktime: req.body.locktime,
            token: user.token
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

router.post('/session/change-passphrase', async (req, res) => {
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
              locked: user.locked,
              token: user.token
            })
            req.session.user = {
              username: user.username,
              maxAttempts: user.maxAttempts,
              locktime: user.locktime,
              bcrypt: req.body.bcrypt,
              token: user.token
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

// app endpoints
router.get('/system', isAuthed, (req, res) => {
  return res.json({ info: providers.system.get() })
})

router.get('/packages', isAuthed, (req, res) => {
  return res.json({ info: providers.packages.get() })
})

router.get('/downloading', isAuthed, (req, res) => {
  return res.json({ info: providers.packages.downloading() })
})

router.post('/download', isAuthed, async (req, res) => {
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

router.get('/instances/get', isAuthed, (req, res) => {
  return res.json({ info: providers.instances.get() })
})

router.post('/instance/add', isAuthed, async (req, res) => {
  if (!req.body.id || !req.body.name) {
    res.status(401).json({ message: 'Bad params' })
  } else {
    const success = await providers.instances.add(req.body)
    res.json({success: success})
  }
})

router.post('/instance/update', isAuthed, (req, res) => {
  if (!req.body.id) {
    res.status(401).json({ message: 'Bad params' })
  } else {
    providers.instances.update(req.body, function(updated) {
      return res.json({ success: updated.success, info: updated.info })
    })
  }
})

router.post('/instance/remove', isAuthed, (req, res) => {
  if (!req.body.id) {
    res.status(401).json({ message: 'Bad params' })
  } else {
    providers.instances.remove(req.body.id, req.body.rmDatadir, function(removed) {
      return res.json({ success: removed.success, info: removed.info })
    })
  }
})

router.post('/instance/start', isAuthed, (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
    providers.instances.start(req.body.id, function (success, instances) {
      return res.json({ success, instances })
    })
  }
})

router.post('/instance/stop', isAuthed, (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
    providers.instances.stop(req.body.id, function (success, instances) {
      return res.json({ success, instances })
    })
  }
})

router.post('/instance/logs', isAuthed, (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
    providers.instances.logs(req.body.id, function (logs) {
      return res.json({ logs: logs })
    })
  }
})

router.post('/provider/create', isAuthed, (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
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

router.post('/provider/get', isAuthed, (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
    const provider = providers[req.body.id].get()
    return res.json({ success: true, provider })
  }
})

router.post('/provider/stop', isAuthed, (req, res) => {
  if (!req.body.id) {
    return res.status(401).json({ message: 'Bad params' })
  } else {
    provider.destroyProvider(req.body.id, function(_providers) {
      if (_providers) {
        providers = _providers
        return res.json({ success: true })
      } else {
        return res.json({ success: false })
      }
    })
  }
})

router.post('/provider/start', isAuthed, (req, res) => {
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
