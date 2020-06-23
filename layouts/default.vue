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
  data() {
    return {
      title: 'Octano Dusk'
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
    this.$store.dispatch('instances')
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
    }
  }
}
</script>
