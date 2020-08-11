<template>
  <v-container>
    <v-tabs>
      <v-tab :key="0">{{ $t('server.instances') }}</v-tab>
      <v-tab-item :key="0">
        <v-btn absolute dark fab top right color="primary" to="/create">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-card>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="instances"
              :items-per-page="-1"
              :no-data-text="$t('server.noResults')"
              hide-default-footer
              flat
            >
              <template v-slot:item.network="{ item }">
                <v-avatar size="28px">
                  <img
                    v-if="item.network.icon"
                    :src="
                      require('~/packages' +
                        item.network.duskpkg.path +
                        item.network.icon)
                    "
                  />
                </v-avatar>
                {{ item.network.name }}
              </template>
              <template v-slot:item.uptime="{ item }">
                {{
                  item.supervisor.state === 20
                    ? formatUptime(item.supervisor.description)
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
                  {{ $t('server.stopped') }}
                </v-flex>
                <v-flex
                  v-else-if="item.supervisor.state === 10"
                  color="primary"
                >
                  <v-icon color="primary">mdi-cog mdi-spin</v-icon>
                  {{ $t('server.starting') }}
                </v-flex>
                <v-flex
                  v-else-if="item.supervisor.state === 20"
                  color="primary"
                >
                  <v-icon color="primary">mdi-rocket-launch</v-icon>
                  {{ $t('server.running') }}
                </v-flex>
                <v-flex
                  v-else-if="item.supervisor.state === 40"
                  color="secondary"
                >
                  <v-icon color="secondary">mdi-cog mdi-spin</v-icon>
                  {{ $t('server.stopping') }}
                </v-flex>
                <v-flex
                  v-else-if="item.supervisor.state === 9000"
                  color="primary"
                >
                  <v-icon color="primary">mdi-atom-variant mdi-spin</v-icon>
                  {{ $t('server.creating') }}
                </v-flex>
                <v-flex v-else color="secondary">
                  <v-icon color="secondary">mdi-fire</v-icon>
                  {{ $t('server.error') }}
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
                        {{ $t('server.details') }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <dashboard list :instance="item" />
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
  computed: {
    instances() {
      return this.$store.state.instances
    },
    headers() {
      return [
        { text: this.$t('server.name'), value: 'name' },
        { text: this.$t('server.network'), value: 'network' },
        { text: this.$t('server.client'), value: 'client.name' },
        { text: this.$t('server.version'), value: 'version' },
        { text: this.$t('server.status'), value: 'supervisor' },
        { text: this.$t('server.uptime'), value: 'uptime' },
        { text: this.$t('server.stoppedAt'), value: 'stopped' },
        { text: '', align: 'end', value: 'menu' }
      ]
    }
  },
  methods: {
    formatUptime(str) {
      const split = str.split(' ')
      if (split.length > 4) {
        const slice = split.slice(-3)
        slice[1] = this.$tc('server.day', slice[0])
        return slice[0] + ' ' + slice[1] + ' - ' + slice[2]
      } else {
        return split[3]
      }
    }
  }
}
</script>
