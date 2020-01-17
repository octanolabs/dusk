<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="authed"
      :mini-variant="miniVariant"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
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
          <v-list-item @click="miniVariant = !miniVariant">
            <v-list-item-action>
              <v-icon>
                mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ miniVariant ? 'Expand' : 'Hide' }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-action>
              <v-icon>mdi-account-lock</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Lock</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer fixed app>
      <span>&copy; 2020</span>
    </v-footer>
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
          to: '/dashboard'
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
      miniVariant: true,
      title: 'Octano Dusk'
    }
  },
  computed: {
    authed: {
      get() {
        return !!this.$store.state.authUser
      },
      set() {}
    }
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout')
        this.$router.push({ path: '/' })
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>
