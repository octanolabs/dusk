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
              <template v-slot:item.uptime="{ item }">
                {{
                  item.supervisor.state === 20
                    ? item.supervisor.description.split(' ')[3]
                    : '-'
                }}
              </template>
              <template v-slot:item.stopped="{ item }">
                {{
                  item.supervisor.state === 0
                    ? item.supervisor.description
                    : '-'
                }}
              </template>
              <template v-slot:item.supervisor="{ item }">
                <v-flex v-if="item.supervisor.state === 0" color="primary">
                  <v-icon color="secondary">mdi-rocket</v-icon>
                  stopped
                </v-flex>
                <v-flex
                  v-else-if="item.supervisor.state === 10"
                  color="primary"
                >
                  <v-icon color="primary">mdi-cog mdi-spin</v-icon>
                  starting
                </v-flex>
                <v-flex
                  v-else-if="item.supervisor.state === 20"
                  color="primary"
                >
                  <v-icon color="primary">mdi-rocket-launch</v-icon>
                  running
                </v-flex>
                <v-flex
                  v-else-if="item.supervisor.state === 40"
                  color="secondary"
                >
                  <v-icon color="secondary">mdi-cog mdi-spin</v-icon>
                  stopping
                </v-flex>
                <v-flex
                  v-else-if="item.supervisor.state === 9000"
                  color="primary"
                >
                  <v-icon color="primary">mdi-atom-variant mdi-spin</v-icon>
                  creating
                </v-flex>
                <v-flex v-else color="secondary">
                  <v-icon color="secondary">mdi-fire</v-icon>
                  error
                </v-flex>
              </template>
              <template v-slot:item.menu="{ item }">
                <v-menu bottom left>
                  <template v-slot:activator="{ on }">
                    <v-flex style="text-align:right">
                      <v-btn icon style="margin:auto 0 auto auto" v-on="on">
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </v-flex>
                  </template>
                  <v-list>
                    <v-list-item :to="'/instance/' + item.id" link>
                      <v-list-item-title>
                        <v-icon>mdi-information-outline</v-icon>
                        Details
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <dashboard
                      list
                      :instance-id="item.id"
                      :provider="item.client.provider"
                      ipc-path=""
                      :state="item.supervisor.state"
                    />
                    <instance-logs :instance="item" list />
                    <v-divider />
                    <control-instance :instance="item" list />
                    <v-divider />
                    <destroy-instance
                      :instance="item"
                      :state="item.supervisor.state"
                      list
                    />
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
import ControlInstance from '@/components/actions/ControlInstance'
import Dashboard from '@/components/actions/dialogs/Dashboard'
import DestroyInstance from '@/components/actions/dialogs/DestroyInstance'
import InstanceLogs from '@/components/actions/dialogs/Logs'

export default {
  middleware: 'auth',
  components: {
    ControlInstance,
    Dashboard,
    DestroyInstance,
    InstanceLogs
  },
  data() {
    return {
      headers: [
        { text: 'name', value: 'name' },
        { text: 'network', value: 'network' },
        { text: 'client', value: 'client.name' },
        { text: 'version', value: 'version' },
        { text: 'status', value: 'supervisor' },
        { text: 'uptime', value: 'uptime' },
        { text: 'stopped at', value: 'stopped' },
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
