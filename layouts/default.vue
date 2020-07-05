<template>
  <v-app dark>
    <left-drawer v-if="authed" />
    <right-drawer v-if="authed" />
    <v-main>
      <nuxt />
    </v-main>
    <downloading />
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
  watch: {
    $route(to, from) {
      // react to route changes...
      if (from.path === '/') {
        this.stopSyncInstances()
      }
      if (to.path === '/') {
        this.$store.dispatch('instances')
        this.startSyncInstances()
      }
    }
  },
  data() {
    return {
      title: 'Octano Dusk',
      instancesTimer: null
    }
  },
  computed: {
    authed() {
      return this.$auth.loggedIn
    }
  },
  created() {
    this.$store.dispatch('system')
    this.$store.dispatch('packages')
    const t = this
    setInterval(function() {
      t.$store.dispatch('system')
      t.$store.dispatch('packages')
    }, 10000)
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout()
      } catch (e) {
        this.formError = e.message
      }
    },
    startSyncInstances() {
      const self = this
      clearInterval(this.instancesTimer)
      this.instancesTimer = setInterval(function() {
        self.$store.dispatch('instances')
      }, 2000)
    },
    stopSyncInstances() {
      clearInterval(this.instancesTimer)
      this.instancesTimer = null
    }
  }
}
</script>
