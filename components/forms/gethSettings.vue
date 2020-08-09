<template>
  <form @submit.prevent="saveInstance(config)">
    <v-col :cols="12" class="px-0 py-2">
      <v-row no-gutters>
        <v-col :cols="6" class="pa-0 pr-1">
          <v-card class="mb-1">
            <v-row no-gutters>
              <v-list two-line class="w-100">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('geth.settings.name.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.name.info') }}
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="instance.name"
                      class="ma-0 pa-0"
                      name="instanceName"
                      outlined
                      dense
                      :rules="[rules.required, rules.minlen]"
                      hide-details="auto"
                      autocomplete="off"
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
                      {{ $t('geth.settings.datadir.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.datadir.info') }}
                    </v-list-item-subtitle>
                    <v-text-field
                      v-model="config.datadir"
                      class="ma-0 pa-0"
                      name="datadir"
                      outlined
                      dense
                      :rules="[rules.required]"
                      hide-details="auto"
                      autocomplete="off"
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
                      {{ $t('geth.settings.fullSync.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.fullSync.info') }}
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
                      {{ $t('geth.settings.archive.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.archive.info') }}
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
                    <v-list-item-title>
                      {{ $t('geth.settings.port.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.port.info') }}
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
                    <v-list-item-title>
                      {{ $t('geth.settings.maxPeers.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.maxPeers.info') }}
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
                      {{ $t('geth.settings.nat.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.nat.info') }}
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
                      {{ $t('geth.settings.noDiscover.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.noDiscover.info') }}
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
                    <v-list-item-title>
                      {{ $t('geth.settings.ethstats.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.ethstats.info') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.ethstats.enable"></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="config.ethstats.enable" dense>
                  <v-text-field
                    v-model="config.ethstats.value"
                    class="input-group--focused"
                    :label="$t('geth.settings.ethstats.label')"
                    name="ethstats"
                    outlined
                    dense
                    :rules="[rules.required]"
                    autocomplete="off"
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
                    <v-list-item-title>
                      {{ $t('geth.settings.http.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.http.info') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.http.enable"></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="config.http.enable">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('geth.settings.http.address.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.http.address.info') }}
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
                      {{ $t('geth.settings.http.port.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.http.port.info') }}
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
                    <v-list-item-title>
                      {{ $t('geth.settings.http.corsdomain.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.http.corsdomain.info') }}
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
                    <v-list-item-title>
                      {{ $t('geth.settings.http.vhosts.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.http.vhosts.info') }}
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
                    <v-list-item-title>
                      {{ $t('geth.settings.http.apis.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.http.apis.info') }}
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
                    <v-list-item-title>
                      {{ $t('geth.settings.ws.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.ws.info') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="config.ws.enable"></v-switch>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item v-if="config.ws.enable">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $t('geth.settings.ws.address.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.ws.address.info') }}
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
                      {{ $t('geth.settings.ws.port.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.ws.port.info') }}
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
                    <v-list-item-title>
                      {{ $t('geth.settings.ws.origins.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.ws.origins.info') }}
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
                    <v-list-item-title>
                      {{ $t('geth.settings.ws.apis.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.ws.apis.info') }}
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
          <v-card v-if="legacyRPC !== true" class="mb-1">
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
                    <v-list-item-title>
                      {{ $t('geth.settings.graphql.address.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.graphql.address.info') }}
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
                      {{ $t('geth.settings.graphql.port.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.graphql.port.info') }}
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
                    <v-list-item-title>
                      {{ $t('geth.settings.graphql.corsdomain.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.graphql.corsdomain.info') }}
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
                    <v-list-item-title>
                      {{ $t('geth.settings.graphql.vhosts.title') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $t('geth.settings.graphql.vhosts.info') }}
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
      type: Object,
      default() {
        return {}
      }
    },
    release: {
      type: Object,
      default() {
        return {}
      }
    },
    network: {
      type: Object,
      default() {
        return null
      }
    },
    engine: {
      type: String,
      default() {
        return 'ubqhash'
      }
    },
    defaultOptions: {
      type: Object,
      default() {
        return null
      }
    },
    value: {
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
      instance: {},
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
      testInstanceName: new RegExp(/^([a-z0-9._-]{4,32})$/),
      spin: false,
      formError: null,
      snackbar: false,
      rules: {
        required: (value) => !!value || this.$t('common.required'),
        minlen: (value) =>
          this.testInstanceName.test(value) ||
          this.$t('account.username.minlen')
      }
    }
  },
  computed: {
    rightDrawer() {
      return this.$store.state.drawers?.right || false
    },
    homedir() {
      return this.$store.state.system?.userInfo?.homedir || ''
    },
    legacyRPC() {
      return this.release?.legacyRPC || false
    }
  },
  watch: {
    defaultOptions(opts) {
      this.setDefaults(opts)
    }
  },
  created() {
    this.setDefaults(this.defaultOptions)
  },
  methods: {
    setDefaults(opts) {
      if (this.value) {
        this.instance = { ...this.value }
        this.instance.version = this.release.version
        this.instance.binpath = this.release.binpath
        this.instance.client = this.client
      } else {
        this.instance = {
          name:
            this.network.id +
            '_' +
            this.client.name +
            '_' +
            this.release.version,
          client: this.client,
          version: this.release.version,
          binpath: this.release.binpath,
          network: this.network
        }
      }
      this.config = {
        datadir:
          opts?.datadir ||
          this.homedir +
            '/.dusk/data/' +
            this.client.name +
            '/' +
            this.network.id, // TODO - OSX
        fullsync: opts?.fullsync || false,
        archive: opts?.archive || false,
        port: opts?.port || 30388,
        maxpeers: opts?.maxpeers || 50,
        nat: opts?.nat || 'any',
        nodiscover: opts?.nodiscover || false,
        ethstats: {
          enable: opts?.ethstats?.enable || false,
          value: opts?.ethstats?.value || ''
        },
        http: {
          enable: opts?.http?.enable || false,
          port: opts?.http?.port || 8588,
          addr: opts?.http?.addr || 'localhost',
          api: opts?.http?.api || ['eth', 'net', 'web3'],
          vhosts: opts?.http?.vhosts || 'localhost',
          corsdomain: opts?.http?.corsdomain || ''
        },
        ws: {
          enable: opts?.ws?.enable || false,
          port: opts?.ws?.port || 8589,
          addr: opts?.ws?.addr || 'localhost',
          api: opts?.ws?.api || ['eth', 'net', 'web3'],
          origins: opts?.ws?.origins || ''
        },
        graphql: {
          enable: opts?.graphql?.enable || false,
          port: opts?.graphql?.port || 8590,
          addr: opts?.graphql?.addr || 'localhost',
          vhosts: opts?.graphql?.vhosts || 'localhost',
          corsdomain: opts?.graphql?.corsdomain || ''
        }
      }
    },
    async saveInstance(config, update) {
      try {
        this.spin = true
        const i = this.instance
        i.config = config
        let flags =
          '--datadir="' +
          config.datadir +
          '" --syncmode=' +
          (config.fullsync ? '"full"' : '"fast"') +
          ' --gcmode=' +
          (config.archive ? '"archive"' : '"full"') +
          ' --port ' +
          config.port +
          ' --maxpeers ' +
          config.maxpeers +
          ' --nat="' +
          config.nat +
          '"'

        // add network flag
        if (this.network.flag) {
          flags = this.network.flag + ' ' + flags // prefix with network flag
        }

        // check optional args
        if (config.nodiscover) {
          flags = flags + ' --nodiscover'
        }
        // ethstats
        if (config.ethstats?.enable) {
          flags = flags + ' --ethstats="' + config.ethstats?.value + '"'
        }
        // suport legacy rpc flags for older client versions, otherwise use new
        // http.* ws.* graphql.* formatting.
        if (this.release.legacyRPC && this.release.legacyRPC === true) {
          // legacy http-rpc
          if (config.http?.enable) {
            flags =
              flags +
              ' --rpc --rpcapi="' +
              config.http.api +
              '" --rpcaddr="' +
              config.http.addr +
              '" --rpcport ' +
              config.http.port +
              ' --rpcvhosts="' +
              config.http.vhosts +
              '"'
            if (config.http.corsdomain) {
              flags =
                flags + ' --rpccorsdomain="' + config.http.corsdomain + '"'
            }
          }
          // legacy ws-rpc
          if (config.ws?.enable) {
            flags =
              flags +
              ' --ws --wsapi="' +
              config.ws.api +
              '" --wsaddr="' +
              config.ws.addr +
              '" --wsport ' +
              config.ws.port
            if (config.ws.origins) {
              flags = flags + ' --wsorigins="' + config.ws.origins + '"'
            }
          }
        } else {
          // http-rpc
          if (config.http?.enable) {
            flags =
              flags +
              ' --http --http.api="' +
              config.http.api +
              '" --http.addr="' +
              config.http.addr +
              '" --http.port ' +
              config.http.port +
              ' --http.vhosts="' +
              config.http.vhosts +
              '"'
            if (config.http.corsdomain) {
              flags =
                flags + ' --http.corsdomain="' + config.http.corsdomain + '"'
            }
          }
          // ws-rpc
          if (config.ws?.enable) {
            flags =
              flags +
              ' --ws --ws.api="' +
              config.ws.api +
              '" --ws.addr="' +
              config.ws.addr +
              '" --ws.port ' +
              config.ws.port
            if (config.ws.origins) {
              flags = flags + ' --ws.origins="' + config.ws.origins + '"'
            }
          }
          if (config.graphql?.enable) {
            flags =
              flags +
              ' --graphql' +
              ' --graphql.addr="' +
              config.graphql.addr +
              '" --graphql.port ' +
              config.graphql.port +
              ' --graphql.vhosts="' +
              config.graphql.vhosts +
              '"'
            if (config.graphql.corsdomain) {
              flags =
                flags +
                ' --graphql.corsdomain="' +
                config.graphql.corsdomain +
                '"'
            }
          }
        }
        i.flags = flags
        i.version = this.release.version
        i.binpath = this.release.binpath
        i.client = this.client
        await this.$store.dispatch('addInstance', i)
        this.spin = false
        this.$router.push({ path: '/' })
      } catch (e) {
        this.formError = e
        this.snackbar = true
        this.formPassword = ''
        this.spin = false
      }
    }
  }
}
</script>
