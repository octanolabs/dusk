<template>
  <form @submit.prevent="saveSettings">
    <v-flex class="pa-4">
      <v-divider />
      <v-row v-if="showAdvanced" class="px-4">
        <v-text-field
          v-model="config.datadir"
          class="input-group--focused"
          label="datadir"
          name="datadir"
          :rules="[rules.required]"
        ></v-text-field>
      </v-row>
      <v-row class="px-0">
        <v-list two-line>
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
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Ethstats</v-list-item-title>
              <v-list-item-subtitle>Relay node statistics</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="config.ethstats"></v-switch>
            </v-list-item-action>
          </v-list-item>
          <v-list-item v-if="config.ethstats">
            <v-text-field
              v-model="config.ethstatsname"
              class="input-group--focused"
              label="Node name"
              name="ethstats"
              :rules="[rules.required]"
            ></v-text-field>
          </v-list-item>
        </v-list>
      </v-row>
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
    </v-flex>
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
        ws: false
      },
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
