<template>
  <v-data-table :headers="headers" :items="networks" :items-per-page="5" flat>
    <template v-slot:item.name="{ item }">
      <v-avatar size="36px">
        <img
          v-if="item.icon"
          :src="require('~/packages/octano/' + item.icon)"
        />
        <v-icon v-else color="#222" v-text="O.o"></v-icon>
      </v-avatar>
      {{ item.name }}
    </template>
    <template v-slot:item.testnet="{ item }">
      <v-chip v-if="item.testnet === true" color="secondary" label>
        {{ $t('networks.testnet') }}
      </v-chip>
      <v-chip v-else color="primary" label>{{ $t('networks.mainnet') }}</v-chip>
    </template>
    <template v-slot:item.explorer="{ item }">
      <a :href="item.explorer" target="_blank">{{ item.explorer }}</a>
    </template>
    <template v-slot:item.ethstats="{ item }">
      <a :href="item.ethstats" target="_blank">{{ item.ethstats }}</a>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: this.$t('networks.name'),
          align: 'start',
          value: 'name'
        },
        { text: this.$t('networks.type'), value: 'testnet' },
        { text: this.$t('networks.engine'), value: 'engine' },
        { text: this.$t('networks.networkId'), value: 'networkId' },
        { text: this.$t('networks.chainId'), value: 'chainId' },
        { text: this.$t('networks.explorer'), value: 'explorer' },
        { text: this.$t('networks.stats'), value: 'ethstats' }
      ]
    }
  },
  computed: {
    networks() {
      return this.$store.state.networks || []
    }
  }
}
</script>
