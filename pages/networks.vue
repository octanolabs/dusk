<template>
  <v-container>
    <v-tabs>
      <v-tab :key="0">{{ $t('networks.mainnet') }}</v-tab>
      <v-tab :key="1">{{ $t('networks.testnet') }}</v-tab>
      <v-tab-item :key="0">
        <v-card>
          <v-card-text class="pa-0">
            <networks-table :networks="mainnet" />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :key="1">
        <v-card>
          <v-card-text class="pa-0">
            <networks-table :networks="testnet" />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import NetworksTable from '~/components/tables/Networks.vue'

export default {
  middleware: 'auth',
  components: {
    NetworksTable
  },
  computed: {
    mainnet() {
      const networks = []
      for (const networkId of Object.keys(
        this.$store.state.packages.networks.mainnet
      )) {
        networks.push(this.$store.state.packages.networks.mainnet[networkId])
      }
      return networks
    },
    testnet() {
      const networks = []
      for (const networkId of Object.keys(
        this.$store.state.packages.networks.testnet
      )) {
        networks.push(this.$store.state.packages.networks.testnet[networkId])
      }
      return networks
    }
  }
}
</script>
