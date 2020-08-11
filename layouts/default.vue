<template>
  <v-app dark>
    <left-drawer v-if="authed" />
    <right-drawer v-if="authed" />
    <v-main>
      <nuxt />
    </v-main>
    <downloading v-if="authed" />
  </v-app>
</template>

<script>
import RightDrawer from '@/components/drawers/Right'
import LeftDrawer from '@/components/drawers/Left'
import Downloading from '@/components/forms/Downloading'

export default {
  components: {
    RightDrawer,
    LeftDrawer,
    Downloading
  },
  data() {
    return {
      title: 'Octano Dusk',
      timer: {
        instances: null,
        system: null
      },
      interval: {
        instances: 2000,
        system: 10000
      }
    }
  },
  computed: {
    authed() {
      return this.$auth.loggedIn
    },
    syncSystemInfo() {
      return this.$store.state.sync.system
    }
  },
  watch: {
    authed() {
      if (this.$auth.loggedIn === false) {
        this.$router.push({ path: '/login' })
      } else {
        this.$store.dispatch('packages')
      }
    },
    $route(to, from) {
      // react to route changes...
      // start/stop instances sync (index: /)
      if (from.path === '/') {
        this.stopSync('instances')
      }
      if (to.path === '/') {
        this.$store.dispatch('instances')
        this.startSync('instances')
      }
      // start/stop instances sync (instance details: /instance/:id)
      if (from.path.length > 1) {
        if (from.path.substr(0, from.path.lastIndexOf('/')) === '/instance') {
          this.stopSync('instances')
        }
      }
      if (to.path.length > 1) {
        if (to.path.substr(0, to.path.lastIndexOf('/')) === '/instance') {
          this.$store.dispatch('instances')
          this.startSync('instances')
        }
      }
    },
    syncSystemInfo(nval, oval) {
      if (nval === true) {
        this.$store.dispatch('system')
        this.startSync('system')
      } else {
        this.stopSync('system')
      }
    }
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout()
      } catch (e) {
        this.formError = e.message
      }
    },
    startSync(store) {
      const self = this
      clearInterval(this.timer[store])
      this.timer[store] = null
      this.timer[store] = setInterval(function() {
        self.$store.dispatch(store)
      }, this.interval[store])
    },
    stopSync(store) {
      clearInterval(this.timer[store])
      this.timer[store] = null
    }
  }
}
</script>
