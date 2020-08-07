export default {
  async parse(arch, platform) {
    try {
      if (arch === 'x64' || arch === 'x86_64') {
        arch = 'amd64'
      }
      return platform + '-' + arch
    } catch (e) {
      consola.error(new Error(e))
      return null
    }
  }
}
