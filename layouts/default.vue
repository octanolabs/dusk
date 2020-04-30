<template>
  <v-app dark>
    <left-drawer v-if="authed" />
    <right-drawer v-if="authed" />
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import RightDrawer from '@/components/drawers/Right'
import LeftDrawer from '@/components/drawers/Left'

export default {
  components: {
    RightDrawer,
    LeftDrawer
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
    const t = this
    setInterval(function() {
      t.$store.dispatch('system')
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
