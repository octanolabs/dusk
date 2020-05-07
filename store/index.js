import axios from 'axios'
import consola from 'consola'

export const state = () => ({
  authenticated: false,
  drawers: {
    right: true
  },
  system: {},
  networks: [],
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
  SET_NETWORKS(state, data) {
    state.networks = data
  },
  SET_PACKAGES(state, data) {
    state.packages = data
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
  async networks({ commit }) {
    try {
      const { data } = await axios.get('/api/networks')
      commit('SET_NETWORKS', data.info.networks)
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
  }
}
