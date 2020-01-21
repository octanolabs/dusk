import axios from 'axios'
import consola from 'consola'

export const state = () => ({
  peers: [],
  nodeInfo: {},
  systemInfo: {},
  txpool: {},
  drawers: {
    right: true
  }
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
  SET_TXPOOL(state, data) {
    state.txpool = data
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

  async txpool({ commit }) {
    try {
      const { data } = await axios.get('/api/txpool')
      commit('SET_TXPOOL', data.info)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        consola.error(new Error('Bad credentials'))
      }
      consola.error(new Error(error))
    }
  }
}
