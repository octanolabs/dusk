<template>
  <v-navigation-drawer left app fixed mini-variant>
    <v-list nav dense>
      <v-list-item link to="/">
        <v-list-item-icon>
          <v-icon>mdi-server</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('menu.server') }}</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/clients">
        <v-list-item-icon>
          <v-icon>mdi-cloud-download</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('menu.clients') }}</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/networks">
        <v-list-item-icon>
          <v-icon>mdi-lan</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('menu.networks') }}</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/packages">
        <v-list-item-icon>
          <v-icon>mdi-package</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('menu.packages') }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list nav dense>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-list-item
              link
              v-on="on"
              @click.stop="showAccountSettings = true"
            >
              <v-list-item-icon>
                <v-icon>mdi-account-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ $t('menu.settings') }}</v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t('menu.settings') }}</span>
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-list-item link v-on="on" @click.stop="logout()">
              <v-list-item-icon>
                <v-icon>mdi-account-lock</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ $t('menu.logout') }}</v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t('menu.logout') }}</span>
        </v-tooltip>
      </v-list>
    </template>
    <account-settings v-model="showAccountSettings" />
  </v-navigation-drawer>
</template>

<script>
import AccountSettings from '../forms/AccountSettings.vue'

export default {
  components: {
    AccountSettings
  },
  data() {
    return {
      showAccountSettings: false
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
