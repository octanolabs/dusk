import axios from 'axios'

export const state = () => ({
  authUser: null,
  peers: {
    list: []
  },
  cache: {}
})

export const mutations = {
  SET_USER(state, user) {
    state.authUser = user
  },
  SET_PEERS(state, peers) {
    state.peers = peers
  },
  SET_COUNTRY(state, data) {
    state.cache[data.ip] = data.code
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_USER', req.session.authUser)
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
    commit('SET_USER', null)
  },

  async peers({ commit }) {
    try {
      const { data } = await axios.post('/api/peers')
      commit('SET_PEERS', data)
    } catch (error) {
      // TODO
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },
  async country({ commit }, { ip }) {
    try {
      const { data } = await axios.post('/api/country', { ip })
      console.log(data)
      commit('SET_COUNTRY', { ip, code: data.code })
    } catch (error) {
      // TODO
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  }
}
