<template>
  <div>
    <v-row no-gutters>
      <v-col :cols="12">
        <v-data-table
          :headers="headers"
          :items="pending"
          :items-per-page="5"
          item-key="id"
          flat
          dense
        >
          <template v-slot:item.hash="{ item }">
            {{ format(item.hash) }}
          </template>
          <template v-slot:item.from="{ item }">
            {{ format(item.from) }}
          </template>
          <template v-slot:item.to="{ item }">
            {{ format(item.to) }}
          </template>
          <template v-slot:item.value="{ item }">
            {{ fromWei(item.value) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BN from 'bignumber.js'

export default {
  data() {
    return {
      headers: [
        { text: 'Hash', value: 'hash' },
        { text: 'From', value: 'from' },
        { text: 'To', value: 'to' },
        { text: 'Value', value: 'value' }
      ]
    }
  },
  computed: {
    pending() {
      return this.$store.state.pending.transactions || []
    }
  },
  methods: {
    format(hash) {
      return hash.substring(0, 12) + '...'
    },
    fromWei(wei) {
      return new BN(wei).div(1000000000000000000).toString()
    }
  }
}
</script>
