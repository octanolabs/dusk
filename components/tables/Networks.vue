<template>
  <v-data-table :headers="headers" :items="networks" :items-per-page="5" flat>
    <template v-slot:item.name="{ item }">
      <v-avatar size="36px">
        <img
          v-if="item.icon"
          :src="require('~/static/networks/' + item.icon)"
        />
        <v-icon v-else color="#222" v-text="O.o"></v-icon>
      </v-avatar>
      {{ item.name }}
    </template>
    <template v-slot:item.testnet="{ item }">
      <v-chip v-if="item.testnet === true" color="secondary" label>
        Testnet
      </v-chip>
      <v-chip v-else color="primary" label>Mainnet</v-chip>
    </template>
    <template v-slot:item.explorer="{ item }">
      <a :href="item.explorer" target="_blank">{{ item.explorer }}</a>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'start',
          value: 'name'
        },
        {
          text: 'Type',
          align: 'end',
          value: 'testnet'
        },
        { text: 'Consensus Engine', value: 'engine' },
        { text: 'Network ID', value: 'networkId' },
        { text: 'Chain ID', value: 'chainId' },
        { text: 'Explorer', value: 'explorer' }
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
