import axios from 'axios'
import consola from 'consola'

export const state = () => ({
  authenticated: false,
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
  version: '0.0.1',
  blocks: [],
  peers: [],
  pending: [],
  nodeInfo: {}
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
  // legacy api re-added temporarily for demo
  SET_PEERS(state, peers) {
    state.peers = peers
  },
  SET_PENDING(state, data) {
    state.pending = data
  },
  SET_BLOCKS(state, data) {
    console.log(data)
    state.blocks = data
  },
  SET_NODEINFO(state, data) {
    state.nodeInfo = data
  }
  // end legacy api
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
  },
  // legacy api re-added temporarily for demo
  async blocks({ commit }) {
    try {
      const { data } = await axios.get('/legacy/gubiq/api/blocks')
      commit('SET_BLOCKS', data.data.blocks)
      commit('SET_PENDING', data.data.pending)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        consola.error(new Error(error))
      }
      consola.error(new Error(error))
    }
  },

  async peers({ commit }) {
    try {
      const { data } = await axios.get('/legacy/gubiq/api/peers')
      commit('SET_PEERS', data.data.peers)
      commit('SET_NODEINFO', data.data.localhost)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        consola.error(new Error('Bad credentials'))
      }
      consola.error(new Error(error))
    }
  }
  // end legacy api
}
