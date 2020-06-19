<template>
  <form @submit.prevent="saveSettings">
    <v-col :cols="12" class="px-0 py-2">
      <v-row no-gutters>
        <v-col :cols="6" class="pa-0 pr-1">
          <v-card class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Instance Name
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Unique identifier for this instance.
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="instanceName"
                      class="ma-0 pa-0"
                      name="instanceName"
                      outlined
                      dense
                      :rules="[rules.required, rules.minlen]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
          <v-card v-if="showAdvanced" class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Data Directory
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Data directory for the databases and keystore
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.datadir"
                      class="ma-0 pa-0"
                      name="datadir"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
          <v-card class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Full sync
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Perform full validation on blockchain data
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.fullsync"></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
          <v-card class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Archive
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Set blockchain garbage collection mode to 'archive'
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.archive"></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
          <v-card class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Port</v-list-item-title>
                    <v-list-item-subtitle>
                      Network listening port
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field
                      v-model="config.port"
                      name="port"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
          <v-card class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Max. Peers</v-list-item-title>
                    <v-list-item-subtitle>
                      Maximum number of network peers (network disabled if set
                      to 0)
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-text-field
                      v-model="config.maxpeers"
                      name="maxpeers"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
          <v-card v-if="showAdvanced" class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      NAT
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      NAT port mapping mechanism
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-combobox
                      v-model="config.nat"
                      :items="natOptions"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-combobox>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
          <v-card v-if="showAdvanced" class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Nodiscover
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Disables the peer discovery mechanism (manual peer
                      addition)
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.nodiscover"></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
        </v-col>
        <v-col :cols="6" class="pa-0 pl-1">
          <v-card class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Ethstats</v-list-item-title>
                    <v-list-item-subtitle>
                      Relay node statistics
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.ethstats.enable"></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="config.ethstats.enable" dense>
                  <v-text-field
                    v-model="config.ethstats.nodename"
                    class="input-group--focused"
                    label="Node name"
                    name="ethstats"
                    outlined
                    dense
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
          <v-card class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>HTTP-RPC</v-list-item-title>
                    <v-list-item-subtitle>
                      Enable the HTTP RPC server
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.http.enable"></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="config.http.enable">
                  <v-list-item-content>
                    <v-list-item-title>ADDRESS</v-list-item-title>
                    <v-list-item-subtitle>
                      HTTP-RPC server listening interface
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.http.addr"
                      name="rpcaddr"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="config.http.enable">
                  <v-list-item-content>
                    <v-list-item-title>
                      PORT
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      HTTP-RPC server listening port
                    </v-list-item-subtitle>
                    <v-spacer />
                    <v-text-field
                      v-model="config.http.port"
                      name="rpcport"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.http.enable">
                  <v-list-item-content>
                    <v-list-item-title>CORS DOMAIN</v-list-item-title>
                    <v-list-item-subtitle>
                      Comma separated list of domains from which to accept cross
                      origin requests (browser enforced)
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.http.corsdomain"
                      name="rpccorsdomain"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.http.enable">
                  <v-list-item-content>
                    <v-list-item-title>VHOSTS</v-list-item-title>
                    <v-list-item-subtitle>
                      Comma separated list of virtual hostnames from which to
                      accept requests (server enforced).
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.http.vhosts"
                      name="rpcvhosts"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="config.http.enable">
                  <v-list-item-content>
                    <v-list-item-title>API's</v-list-item-title>
                    <v-list-item-subtitle>
                      API's offered over the HTTP-RPC interface
                    </v-list-item-subtitle>
                    <v-checkbox
                      v-for="mod in rpcModules"
                      :key="mod"
                      v-model="config.http.api"
                      :label="mod === 'ENGINE' ? engine : mod"
                      :value="mod"
                      class="mr-4 my-0 pb-0"
                      hide-details
                    ></v-checkbox>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
          <v-card class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>WS-RPC</v-list-item-title>
                    <v-list-item-subtitle>
                      Enable the WS-RPC server
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.ws.enable"></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="config.ws.enable">
                  <v-list-item-content>
                    <v-list-item-title>ADDRESS</v-list-item-title>
                    <v-list-item-subtitle>
                      WS-RPC server listening interface
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.ws.addr"
                      name="wsaddr"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="config.ws.enable">
                  <v-list-item-content>
                    <v-list-item-title>
                      PORT
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      WS-RPC server listening port
                    </v-list-item-subtitle>
                    <v-spacer />
                    <v-text-field
                      v-model="config.ws.port"
                      name="wsport"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.ws.enable">
                  <v-list-item-content>
                    <v-list-item-title>ORIGINS</v-list-item-title>
                    <v-list-item-subtitle>
                      Origins from which to accept websockets requests
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.ws.origins"
                      name="wsorigins"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="config.ws.enable">
                  <v-list-item-content>
                    <v-list-item-title>API's</v-list-item-title>
                    <v-list-item-subtitle>
                      API's offered over the WS-RPC interface
                    </v-list-item-subtitle>
                    <v-checkbox
                      v-for="mod in rpcModules"
                      :key="mod"
                      v-model="config.ws.api"
                      :label="mod === 'ENGINE' ? engine : mod"
                      :value="mod"
                      class="mr-4 my-0 pb-0"
                      hide-details
                    ></v-checkbox>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
          <v-card class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>GraphQL</v-list-item-title>
                    <v-list-item-subtitle>
                      Enable the GraphQL server
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.graphql.enable"></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="config.graphql.enable">
                  <v-list-item-content>
                    <v-list-item-title>ADDRESS</v-list-item-title>
                    <v-list-item-subtitle>
                      GraphQL server listening interface
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.graphql.addr"
                      name="graphqladdr"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="config.graphql.enable">
                  <v-list-item-content>
                    <v-list-item-title>
                      PORT
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      GraphQL server listening port
                    </v-list-item-subtitle>
                    <v-spacer />
                    <v-text-field
                      v-model="config.graphql.port"
                      name="graphqlport"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.graphql.enable">
                  <v-list-item-content>
                    <v-list-item-title>CORS DOMAIN</v-list-item-title>
                    <v-list-item-subtitle>
                      Comma separated list of domains from which to accept cross
                      origin requests (browser enforced)
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.graphql.corsdomain"
                      name="graphqlcorsdomain"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.graphql.enable">
                  <v-list-item-content>
                    <v-list-item-title>VHOSTS</v-list-item-title>
                    <v-list-item-subtitle>
                      Comma separated list of virtual hostnames from which to
                      accept requests (server enforced).
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.graphql.vhosts"
                      name="graphqlvhosts"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-fab-transition>
          <v-btn type="submit" color="primary" class="saveSettingsButton" fab>
            <v-icon v-if="spin === true">mdi-cog mdi-spin</v-icon>
            <v-icon v-else>mdi-content-save-settings</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-row>
    </v-col>
  </form>
</template>

<script>
export default {
  props: {
    client: {
      type: String,
      default() {
        return 'go-ubiq'
      }
    },
    version: {
      type: String,
      default() {
        return '3.0.1'
      }
    },
    engine: {
      type: String,
      default() {
        return 'ethash'
      }
    },
    defaultOptions: {
      type: Object,
      default() {
        return null
      }
    },
    showAdvanced: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      config: {},
      natOptions: ['any', 'none', 'upnp', 'pmp', 'extip'],
      rpcModules: [
        'admin',
        'debug',
        'eth',
        'miner',
        'net',
        'personal',
        'txpool',
        'ENGINE', // placeholder for ethash, ubqhash, clique
        'web3'
      ],
      instanceName: '',
      testInstanceName: new RegExp(/^([a-z]{4,32})$/),
      spin: false,
      rules: {
        required: (value) => !!value || this.$t('login.required'),
        minlen: (value) =>
          this.testInstanceName.test(value) ||
          this.$t('account.username.minlen')
      }
    }
  },
  computed: {
    rightDrawer() {
      return this.$store.state.drawers?.right || false
    }
  },
  watch: {
    defaultOptions(opts) {
      this.setDefaults(opts)
    }
  },
  created() {
    this.setDefaults(null)
  },
  methods: {
    setDefaults(opts) {
      this.config = {
        fullsync: opts?.fullsync || false,
        archive: opts?.archive || false,
        port: opts?.port || 30388,
        maxpeers: opts?.maxpeers || 50,
        nat: opts?.nat || 'any',
        nodiscover: opts?.nodiscover || false,
        ethstats: {
          enable: false,
          nodename: ''
        },
        http: {
          enable: false,
          port: opts?.http?.port || 8588,
          addr: opts?.http?.addr || 'localhost',
          api: opts?.http?.api || ['eth', 'net', 'web3'],
          vhosts: opts?.http?.vhosts || 'localhost',
          corsdomain: opts?.http?.corsdomain || ''
        },
        ws: {
          enable: false,
          port: opts?.ws?.port || 8589,
          addr: opts?.ws?.addr || 'localhost',
          api: opts?.ws?.api || ['eth', 'net', 'web3'],
          origins: opts?.ws?.origins || ''
        },
        graphql: {
          enable: false,
          port: opts?.graphql?.port || 8590,
          addr: opts?.graphql?.addr || 'localhost',
          vhosts: opts?.graphql?.vhosts || 'localhost',
          corsdomain: opts?.graphql?.corsdomain || ''
        }
      }
    }
  }
}
</script>
