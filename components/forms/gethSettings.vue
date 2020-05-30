<template>
  <form @submit.prevent="saveSettings">
    <v-flex class="pa-4">
      <v-divider />
      <v-row class="px-4">
        <v-text-field
          v-model="instanceName"
          class="input-group--focused"
          :label="$t('account.username.label')"
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
// import axios from 'axios'

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
    }
  },
  data() {
    return {
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
