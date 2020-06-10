<template>
  <form @submit.prevent="saveSettings">
    <v-col :cols="12" class="px-0 py-2">
      <v-row no-gutters>
        <v-col :cols="6" class="pa-0 pr-1">
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
                  </v-list-item-content>
                  <v-list-item-actions style="width:300px;">
                    <v-text-field
                      v-model="config.datadir"
                      class="ma-0 pa-0"
                      label="datadir"
                      name="datadir"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-list-item-actions>
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
                    <v-list-item-title>Ethstats</v-list-item-title>
                    <v-list-item-subtitle>
                      Relay node statistics
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.ethstats"></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item dense v-if="config.ethstats">
                  <v-text-field
                    v-model="config.ethstatsname"
                    class="input-group--focused"
                    label="Node name"
                    name="ethstats"
                    outlined
                    :rules="[rules.required]"
                  ></v-text-field>
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
                    <v-list-item-title>HTTP-RPC</v-list-item-title>
                    <v-list-item-subtitle>
                      Enable the HTTP RPC server
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.rpc"></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.rpc">
                  <v-list-item-content>
                    <v-list-item-title>ADDRESS</v-list-item-title>
                    <v-list-item-subtitle>
                      HTTP-RPC server listening interface
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.rpcaddr"
                      name="rpcaddr"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.rpc">
                  <v-list-item-content>
                    <v-list-item-title>
                      PORT
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      HTTP-RPC server listening port
                    </v-list-item-subtitle>
                    <v-spacer />
                    <v-text-field
                      v-model="config.rpcport"
                      name="rpcport"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.rpc">
                  <v-list-item-content>
                    <v-list-item-title>CORS DOMAIN</v-list-item-title>
                    <v-list-item-subtitle>
                      Comma separated list of domains from which to accept cross
                      origin requests (browser enforced)
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.rpccorsdomain"
                      name="rpccorsdomain"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.rpc">
                  <v-list-item-content>
                    <v-list-item-title>VHOSTS</v-list-item-title>
                    <v-list-item-subtitle>
                      Comma separated list of virtual hostnames from which to
                      accept requests (server enforced).
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.rpcvhosts"
                      name="rpcvhosts"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="config.rpc">
                  <v-list-item-content>
                    <v-list-item-title>API's</v-list-item-title>
                    <v-list-item-subtitle>
                      API's offered over the HTTP-RPC interface
                    </v-list-item-subtitle>
                    <v-checkbox
                      v-for="mod in rpcModules"
                      :key="mod"
                      v-model="config.rpcapi"
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
                    <v-switch v-model="config.ws"></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.ws">
                  <v-list-item-content>
                    <v-list-item-title>ADDRESS</v-list-item-title>
                    <v-list-item-subtitle>
                      WS-RPC server listening interface
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.wsaddr"
                      name="wsaddr"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.ws">
                  <v-list-item-content>
                    <v-list-item-title>
                      PORT
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      WS-RPC server listening port
                    </v-list-item-subtitle>
                    <v-spacer />
                    <v-text-field
                      v-model="config.wsport"
                      name="wsport"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="showAdvanced && config.ws">
                  <v-list-item-content>
                    <v-list-item-title>ORIGINS</v-list-item-title>
                    <v-list-item-subtitle>
                      Origins from which to accept websockets requests
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.wsorigins"
                      name="wsorigins"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="config.ws">
                  <v-list-item-content>
                    <v-list-item-title>API's</v-list-item-title>
                    <v-list-item-subtitle>
                      API's offered over the WS-RPC interface
                    </v-list-item-subtitle>
                    <v-checkbox
                      v-for="mod in rpcModules"
                      :key="mod"
                      v-model="config.wsapi"
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
        </v-col>
      </v-row>
    </v-col>
    <v-row class="px-4">
      <v-text-field
        v-model="instanceName"
        label="instance name"
        name="instanceName"
        :rules="[rules.required, rules.minlen]"
      ></v-text-field>
    </v-row>
    <v-row class="px-4">
      <v-spacer />
      <v-btn color="primary" type="submit" :disabled="spin">
        <v-icon v-if="spin === true">mdi-cog mdi-spin</v-icon>
        <span v-else>
          <v-icon>mdi-content-save-settings</v-icon>
          {{ $t('account.save') }}
        </span>
      </v-btn>
    </v-row>
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
    showAdvanced: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      config: {
        datadir: '',
        fullsync: false,
        archive: false,
        ethstats: false,
        rpc: false,
        rpcport: 8588,
        rpcaddr: 'localhost',
        rpcapi: ['eth', 'net', 'rpc', 'web3'],
        rpcvhosts: 'localhost',
        rpccorsdomain: '',
        ws: false,
        wsport: 8589,
        wsaddr: 'localhost',
        wsapi: ['eth', 'net', 'rpc', 'web3'],
        wsorigins: ''
      },
      rpcModules: [
        'admin',
        'debug',
        'eth',
        'miner',
        'net',
        'personal',
        'rpc',
        'txpool',
        'ENGINE',
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
  methods: {
    saveInstance() {}
  }
}
</script>
