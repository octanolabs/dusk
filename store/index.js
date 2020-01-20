import axios from 'axios'

export const state = () => ({
  authenticated: false,
  peers: [],
  nodeInfo: {},
  systemInfo: {}
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
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authenticated) {
      commit('SET_USER', req.session.authenticated)
    }
  },
  async login({ commit }, { password }) {
    try {
      const { data } = await axios.post('/api/login', { password })
      commit('SET_USER', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async logout({ commit }) {
    await axios.post('/api/logout')
    commit('SET_USER', false)
  },

  async peers({ commit }) {
    try {
      const { data } = await axios.post('/api/peers')
      commit('SET_PEERS', data.list)
    } catch (error) {
      // TODO
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async nodeInfo({ commit }) {
    try {
      const { data } = await axios.post('/api/nodeinfo')
      commit('SET_NODEINFO', data.info)
    } catch (error) {
      // TODO
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async systemInfo({ commit }) {
    try {
      const { data } = await axios.post('/api/system')
      console.log(data)
      commit('SET_SYSTEMINFO', data.info)
    } catch (error) {
      // TODO
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  }
}
