import axios from 'axios'
import consola from 'consola'

export const state = () => ({
  drawers: {
    right: true
  },
  downloading: {
    clientId: null,
    version: null,
    status: false,
    download: {
      percent: 0,
      transferred: 0,
      total: 0
    }
  },
  system: {},
  packages: {},
  version: '0.0.1'
})

export const mutations = {
  SET_USER(state, authed) {
    state.authenticated = authed
  },
  SET_SYSTEMINFO(state, data) {
    state.system = data
  },
  SET_PACKAGES(state, data) {
    state.packages = data
  },
  SET_DOWNLOADING(state, data) {
    state.downloading = data
  }
}

export const actions = {
  async system({ commit }) {
    try {
      const { data } = await axios.get('/api/system')
      commit('SET_SYSTEMINFO', data.info)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        consola.error(new Error('Bad credentials'))
      }
      consola.error(new Error(error))
    }
  },
  async packages({ commit }) {
    try {
      const { data } = await axios.get('/api/packages')
      commit('SET_PACKAGES', data.info)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        consola.error(new Error('Bad credentials'))
      }
      consola.error(new Error(error))
    }
  },
  async downloading({ commit }) {
    try {
      const { data } = await axios.get('/api/downloading')
      commit('SET_DOWNLOADING', data.info)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        consola.error(new Error('Bad credentials'))
      }
      consola.error(new Error(error))
    }
  }
}
