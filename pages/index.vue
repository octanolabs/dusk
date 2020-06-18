<template>
  <v-container>
    <v-row>
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    </v-row>
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
                  <v-icon color="primary">mdi-play-circle</v-icon>
                  <v-subtitle>running</v-subtitle>
                </v-flex>
              </template>
              <template v-slot:item.menu>
                <v-menu bottom left>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item link to="/dashboard">
                      <v-list-item-title>
                        <v-icon>mdi-desktop-mac-dashboard</v-icon>
                        Dashboard
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item link to="/dashboard">
                      <v-list-item-title>
                        <v-icon>mdi-cogs</v-icon>
                        Configure
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item link>
                      <v-list-item-title>
                        <v-icon>mdi-stop-circle</v-icon>
                        Stop
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <v-list-item link disabled>
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
        { text: 'client', value: 'clientId' },
        { text: 'version', value: 'version' },
        { text: 'network', value: 'network' },
        { text: 'status', value: 'status' },
        { text: '', align: 'end', value: 'menu' }
      ],
      instances: [
        {
          name: 'ubiq1',
          clientId: 'gubiq',
          network: {
            id: 'ubq',
            type: 'mainnet'
          },
          version: '3.0.1',
          status: 1
        }
      ],
      breadcrumbs: [
        {
          text: 'Instances',
          disabled: true,
          to: '/'
        }
      ]
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
