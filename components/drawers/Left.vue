<template>
  <v-navigation-drawer left app fixed mini-variant>
    <v-list nav dense>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-server</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('menu.server') }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list nav dense>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-account-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menu.settings') }}</v-list-item-title>
        </v-list-item>
        <v-list-item link @click.stop="logout()">
          <v-list-item-icon>
            <v-icon>mdi-account-lock</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('menu.logout') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$auth.logout()
    }
  }
}
</script>
