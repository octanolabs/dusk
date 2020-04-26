import axios from 'axios'
import consola from 'consola'

export const state = () => ({
  blocks: [],
  peers: [],
  nodeInfo: {},
  systemInfo: {},
  clientInfo: {},
  pending: {},
  drawers: {
    right: true
  },
  settings: {}
})

export const mutations = {
  SET_USER(state, authed) {
    state.authenticated = authed
  },
  SET_PEERS(state, peers) {
    state.peers = peers
  },
  SET_NODEINFO(state, data) {
    state.nodeInfo = data
  },
  SET_SYSTEMINFO(state, data) {
    state.systemInfo = data
  },
  SET_PENDING(state, data) {
    state.pending = data
  },
  SET_BLOCKS(state, data) {
    state.blocks = data
  },
  SET_CLIENTINFO(state, data) {
    state.clientInfo = data
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  /* nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.user) {
      commit('SET_USER', req.session.authenticated)
    }
  }, */
  async peers({ commit }) {
    try {
      const { data } = await axios.get('/api/peers')
      commit('SET_PEERS', data.list)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        consola.error(new Error('Bad credentials'))
      }
      consola.error(new Error(error))
    }
  },

  async nodeInfo({ commit }) {
    try {
      const { data } = await axios.get('/api/nodeinfo')
      commit('SET_NODEINFO', data.info)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        consola.error(new Error('Bad credentials'))
      }
      consola.error(new Error(error))
    }
  },

  async systemInfo({ commit }) {
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

  async pending({ commit }) {
    try {
      const { data } = await axios.get('/api/pending')
      commit('SET_PENDING', data.info)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        consola.error(new Error('Bad credentials'))
      }
      consola.error(new Error(error))
    }
  },

  async blocks({ commit }) {
    try {
      const { data } = await axios.get('/api/blocks')
      commit('SET_BLOCKS', data.list)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        consola.error(new Error('Bad credentials'))
      }
      consola.error(new Error(error))
    }
  },

  async clientInfo({ commit }) {
    try {
      const { data } = await axios.get('/api/clients')
      commit('SET_CLIENTINFO', data.info)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        consola.error(new Error('Bad credentials'))
      }
      consola.error(new Error(error))
    }
  }
}
