<template>
  <v-app dark>
    <v-navigation-drawer mini-variant fixed app>
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <img
              src="~/static/octano.svg"
              height="48px"
              style="height:48px;"
              class="mr-2"
            />
          </v-list-item-action>
          <v-list-item-content>
            <h1 style="color:#6fceb7">
              octano<span style="color:#e76754">dusk</span>
            </h1>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in menu"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list>
          <v-list-item v-if="$auth.loggedIn" @click="logout">
            <v-list-item-action>
              <v-icon>mdi-lock-open</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Lock</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else to="/login" router exact>
            <v-list-item-action>
              <v-icon>mdi-lock</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Lock</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          icon: 'mdi-desktop-mac-dashboard',
          title: 'Dashboard',
          to: '/'
        },
        {
          icon: 'mdi-settings',
          title: 'Settings',
          to: '/settings'
        },
        {
          icon: 'mdi-cloud-download',
          title: 'Clients',
          to: '/clients'
        }
      ],
      title: 'Octano Dusk'
    }
  },
  computed: {
    menu() {
      return this.$auth.loggedIn ? this.items : []
    }
  },
  created() {
    this.$store.dispatch('peers')
    this.$store.dispatch('systemInfo')
    this.$store.dispatch('txpool')
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
