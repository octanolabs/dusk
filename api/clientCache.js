import axios from 'axios'
import fs from 'fs'

let CLIENTS = false

export default {
  clear() {
    CLIENTS = false
  },
  get() {
    return CLIENTS
  },
  async set() {//
    try {
      fs.readFile('./clientBinaries.json', 'utf8', (err, jsonString) => {
        if (!err) {
          CLIENTS = jsonString
        } else {
          consola.error(new Error(err))
        }
      })
    } catch (e) {
      consola.error(new Error(e))
    }
  }
}
