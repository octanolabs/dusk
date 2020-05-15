import consola from 'consola'
import download from 'download'
import EventEmitter from 'events'
import fs from 'fs'

class Downloader extends EventEmitter { }
let downloader = new Downloader()

let CACHE = {}

const emptyCache = function() {
  return {
    client: null,
    version: null,
    status: false,
    error: false,
    download: {
      percent: 0,
      transferred: 0,
      total: 0
    }
  }
}

const downloadRelease = async function(url, path, info) {
  try {
    if (CACHE.status !== true) {
      let staging = emptyCache()

      staging.client = info.name
      staging.version = info.version
      staging.status = true
      CACHE = staging

      const stream = await download(url, path, {
        isStream: true
      }).on('downloadProgress', progress => {
        if (progress) {
          if (progress.percent === 1) {
            downloader.emit('download-complete', {
              url,
              path,
              info
            })
          }
          CACHE.download = progress
        }
      }).on('error', error => {
        CACHE.status = false
        CACHE.error = error
        downloader.emit('download-error', {
          url,
          path,
          info,
          error: error
        })
      })
    }
    return
  } catch (e) {
    consola.error(new Error(e))
  }
}

export default {
  get() {
    return CACHE
  },
  set(data) {
    CACHE = data || emptyCache()
  },
  helpers: {
    download(url, path, info) {
      downloadRelease(url, path, info)
    }
  },
  emitter: downloader
}
