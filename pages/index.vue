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
                <v-flex v-else color="secondary">
                  <v-icon color="primary">mdi-fire</v-icon>
                  error
                </v-flex>
              </template>
              <template v-slot:item.menu="{ item }">
                <v-menu bottom left>
                  <template v-slot:activator="{ on }">
                    <v-flex style="text-align:right">
                      <v-btn icon v-on="on" style="margin:auto 0 auto auto">
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </v-flex>
                  </template>
                  <v-list>
                    <v-list-item
                      :disabled="item.supervisor.state !== 20"
                      to="/dashboard"
                      link
                    >
                      <v-list-item-title>
                        <v-icon>mdi-desktop-mac-dashboard</v-icon>
                        Dashboard
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      :disabled="item.supervisor.state === 20"
                      to="/dashboard"
                      link
                    >
                      <v-list-item-title>
                        <v-icon>mdi-cogs</v-icon>
                        Configure
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="item.supervisor.state === 20"
                      link
                      @click="stopInstance(item.id)"
                    >
                      <v-list-item-title>
                        <v-icon>mdi-stop-circle</v-icon>
                        Stop
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-else link @click="startInstance(item.id)">
                      <v-list-item-title>
                        <v-icon>mdi-play-circle</v-icon>
                        Start
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <v-list-item
                      link
                      :disabled="item.supervisor.state === 20"
                      @click.stop="
                        selectedInstance = item
                        destroyInstanceDialog = true
                      "
                    >
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
        <v-dialog v-model="destroyInstanceDialog" width="500" persistent>
          <v-card>
            <v-card-title primary-title>Destroy Instance</v-card-title>
            <v-card-text>
              <p>
                Are you sure you want to destroy
                <strong>{{ selectedInstance.name }}?</strong>
                <br />
                Enter <code class="elevation-0">{{ selectedInstance.id }}</code>
                to confirm.
              </p>
              <v-text-field
                v-model="confirmDestroy"
                class="input-group--focused"
                label="confirm"
                name="confirm"
                outlined
                dense
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click.stop="
                  selectedInstance = {}
                  destroyInstanceDialog = false
                "
              >
                No
              </v-btn>
              <v-btn
                color="secondary"
                text
                :disabled="confirmDestroy !== selectedInstance.id"
                @click.stop="
                  destroyInstance(selectedInstance.id)
                  selectedInstance = {}
                  destroyInstanceDialog = false
                "
              >
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      destroyInstanceDialog: false,
      confirmDestroy: '',
      selectedInstance: {},
      headers: [
        { text: 'name', value: 'name' },
        { text: 'network', value: 'network' },
        { text: 'client', value: 'client' },
        { text: 'version', value: 'version' },
        { text: 'status', value: 'supervisor' },
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
    },
    destroyInstance(instanceId) {
      this.$store.dispatch('removeInstance', { id: instanceId })
    },
    startInstance(instanceId) {
      this.$store.dispatch('startInstance', { id: instanceId })
    },
    stopInstance(instanceId) {
      this.$store.dispatch('stopInstance', { id: instanceId })
    }
  }
}
</script>
