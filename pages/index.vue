<template>
  <v-container>
    <v-tabs>
      <v-tab :key="0">Instances</v-tab>
      <v-tab-item :key="0">
        <v-btn absolute dark fab top right color="primary" to="/create">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="instances"
              :items-per-page="20"
              flat
            >
              <template v-slot:item.network="{ item }">
                <v-avatar size="28px">
                  <img
                    v-if="getNetworkIcon(item.network.id, item.network.type)"
                    :src="
                      require('~/packages' +
                        getNetworkPackagePath(
                          item.network.id,
                          item.network.type
                        ) +
                        getNetworkIcon(item.network.id, item.network.type))
                    "
                  />
                </v-avatar>
                {{ getNetworkName(item.network.id, item.network.type) }}
              </template>
              <template v-slot:item.status="{ item }">
                <v-flex v-if="item.status === 1" color="primary">
                  <v-icon color="primary">mdi-rocket-launch</v-icon>
                  <v-subtitle>running</v-subtitle>
                </v-flex>
                <v-flex v-else-if="item.status === 0" color="primary">
                  <v-icon color="primary">mdi-rocket</v-icon>
                  <v-subtitle>ready</v-subtitle>
                </v-flex>
                <v-flex v-else color="secondary">
                  <v-icon color="primary">mdi-fire</v-icon>
                  <v-subtitle>error</v-subtitle>
                </v-flex>
              </template>
              <template v-slot:item.menu="{ item }">
                <v-menu bottom left>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      :disabled="item.status !== 1"
                      to="/dashboard"
                      link
                    >
                      <v-list-item-title>
                        <v-icon>mdi-desktop-mac-dashboard</v-icon>
                        Dashboard
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      :disabled="item.status === 1"
                      to="/dashboard"
                      link
                    >
                      <v-list-item-title>
                        <v-icon>mdi-cogs</v-icon>
                        Configure
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="item.status === 1" link>
                      <v-list-item-title>
                        <v-icon>mdi-stop-circle</v-icon>
                        Stop
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-else link>
                      <v-list-item-title>
                        <v-icon>mdi-play-circle</v-icon>
                        Start
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <v-list-item link :disabled="item.status === 1">
                      <v-list-item-title color="secondary">
                        <v-icon color="secondary">mdi-delete</v-icon>
                        Destroy Instance
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      headers: [
        { text: 'name', value: 'name' },
        { text: 'client', value: 'client' },
        { text: 'version', value: 'version' },
        { text: 'network', value: 'network' },
        { text: 'status', value: 'status' },
        { text: '', align: 'end', value: 'menu' }
      ]
    }
  },
  computed: {
    instances() {
      return this.$store.state.instances
    }
  },
  methods: {
    getNetworkPackagePath(id, type) {
      return this.$store.state.packages.networks[type][id].duskpkg.path || ''
    },
    getNetworkIcon(id, type) {
      return this.$store.state.packages.networks[type][id].icon || ''
    },
    getNetworkName(id, type) {
      return this.$store.state.packages.networks[type][id].name || ''
    }
  }
}
</script>
