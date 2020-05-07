import jf from 'jsonfile'
import fs from 'fs'
import { promisify } from 'util'
import consola from 'consola'
import path from 'path'

const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)

let PACKAGES = []
let CUSTOM = []

export default {
  clear() {
    PACKAGES = [],
    CUSTOM = []
  },
  get() {
    return { octano: PACKAGES, custom: CUSTOM }
  },
  async set(rootPath) { // './packages'
    try {
      // check path exists and is dir
      const pathExists = await stat(rootPath)
      if (pathExists.isDirectory()) {
        const octanoDir = path.join(rootPath, 'octano')
        const customDir = path.join(rootPath, 'custom')
        const octanoExists = await stat(octanoDir)
        const customExists = await stat(customDir)
        if (octanoExists.isDirectory()) {
          // ls contents
          const ls = await readdir(octanoDir)
          for (let x of ls) {
            const packagePath = path.join(octanoDir, x)
            const duskpkg = await stat(packagePath)
            if (duskpkg.isDirectory()) {
              jf.readFile(path.join(packagePath, 'dusk.json'), function (err, local) {
                if (err) {
                  consola.error(new Error(err))
                } else {
                  PACKAGES.push(local)
                }
              })
            }
          }
        } else {
          consola.error('octano packages path not found: ' + rootPath)
        }
      } else {
        consola.error('packages path not found: ' + rootPath)
      }
    } catch (e) {
      consola.error(new Error(e))
    }
  }
}
