<template>
  <v-app dark>
    <right-drawer />
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import RightDrawer from '@/components/drawers/Right'

export default {
  components: {
    RightDrawer
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
    this.$store.dispatch('peers')
    this.$store.dispatch('systemInfo')
    this.$store.dispatch('txpool')
    this.$store.dispatch('blocks')
    const t = this
    setInterval(function() {
      t.$store.dispatch('systemInfo')
      t.$store.dispatch('txpool')
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
