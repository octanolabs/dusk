import consola from 'consola'
import decompress from 'decompress'
import dl from 'download'
import EventEmitter from 'events'
import fs from 'fs'

// event emitter
class Downloader extends EventEmitter { }
let downloader = new Downloader()

// downloader 'cache'
let CACHE = {}

// return new downloader cache
const newCache = function() {
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

const download = async function(url, path, info) {
  try {
    if (CACHE.status !== true) {
      let staging = newCache()

      if (info) {
        staging.client = info.name
        staging.version = info.version
      }

      staging.status = true
      CACHE = staging

      const stream = await dl(url, path, {
        isStream: true
      }).on('downloadProgress', progress => {
        if (progress) {
          if (progress.percent === 1) {
            // delay a little then emit complete event
            setTimeout(function() {
              downloader.emit('download-complete', {
                url,
                path,
                info
              })
            }, 1000)
          }
          CACHE.download = progress
        }
      })
    }
  } catch (error) {
    CACHE.status = false
    CACHE.error = error
    downloader.emit('download-error', {
      url,
      path,
      info,
      error
    })
  }
}

export default {
  get() {
    return CACHE
  },
  set(data) {
    CACHE = data || newCache()
  },
  helpers: {
    download(url, path, info) {
      download(url, path, info)
    },
    async extract(file, path) {
      return await decompress(file, path)
    }
  },
  emitter: downloader
}
