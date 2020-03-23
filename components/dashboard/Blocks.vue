<template>
  <div>
    <v-col :cols="12" class="pa-0">
      <v-row no-gutters class="pb-2">
        <v-col :cols="4" class="pr-1">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Difficulty</div>
                <v-list-item-title class="headline mb-1">
                  {{ convertHashes(latestBlock.difficulty, true) }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Est. {{ convertHashes(latestBlock.hashrate, true) }}/s
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-avatar tile size="80">
                <v-icon x-large>mdi-fire</v-icon>
              </v-list-item-avatar>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col :cols="4" class="px-1">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Last Block</div>
                <v-list-item-title class="headline mb-1">
                  {{ seconds }}s ago
                </v-list-item-title>
                <v-list-item-subtitle>
                  Prev. {{ latestBlock.blocktime }}s
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-avatar tile size="80">
                <v-icon x-large>mdi-clock-outline</v-icon>
              </v-list-item-avatar>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col :cols="4" class="pl-1">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Best Block</div>
                <v-list-item-title class="headline mb-1">
                  {{ latestBlock.number }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ latestBlock.hash.substring(0, 12) }}..
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-avatar tile size="80">
                <v-icon x-large>mdi-cube-outline</v-icon>
              </v-list-item-avatar>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-row no-gutters class="pb-2">
      <v-col :cols="12">
        <v-card class="bg-transparent" outlined>
          <blocktime v-if="blocks" :data="chartBlocktime" title="Blocktime" />
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters class="pb-2">
      <v-col :cols="12">
        <v-card class="bg-transparent" outlined>
          <difficulty
            v-if="blocks"
            :data="chartDifficulty"
            title="Difficulty"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters class="pb-2">
      <v-col :cols="12">
        <v-card class="bg-transparent" outlined>
          <usage v-if="blocks" :data="chartUsage" title="Activity" />
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters class="pb-2">
      <v-col :cols="12">
        <v-data-table
          :headers="headers"
          :items="pendingTxns"
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
import Blocktime from '~/components/charts/Blocktime.vue'
import Difficulty from '~/components/charts/Difficulty.vue'
import Usage from '~/components/charts/Usage.vue'

export default {
  // middleware: 'auth',
  components: {
    Blocktime,
    Difficulty,
    Usage
  },
  data() {
    return {
      seconds: 0,
      headers: [
        { text: 'Hash', value: 'hash' },
        { text: 'From', value: 'from' },
        { text: 'To', value: 'to' },
        { text: 'Value', value: 'value' }
      ]
    }
  },
  computed: {
    blocks() {
      return this.$store.state.blocks
    },
    latestBlock() {
      return this.blocks && this.blocks.length > 0
        ? this.blocks[this.blocks.length - 1]
        : {
            number: 0,
            hash: '0x1234567890',
            avgblocktime10: 0,
            avgblocktime25: 0,
            avgblocktime88: 0,
            blocktime: 0,
            difficulty: 0,
            timestamp: 0
          }
    },
    pending() {
      return this.$store.state.pending
    },
    pendingTxns() {
      return this.$store.state.pending.transactions || []
    },
    blockNumber() {
      return this.latestBlock.number
    },
    chartData() {
      const data = {
        labels: [],
        blocktime: [],
        avgblocktime10: [],
        avgblocktime25: [],
        avgblocktime88: [],
        hashrate: [],
        difficulty: [],
        limit: [],
        used: [],
        size: [],
        txns: []
      }

      for (const i in this.blocks) {
        if (this.blocks[i]) {
          data.labels.push(this.blocks[i].number)
          data.blocktime.push(this.blocks[i].blocktime)
          data.avgblocktime10.push(this.blocks[i].avgblocktime10)
          data.avgblocktime25.push(this.blocks[i].avgblocktime25)
          data.avgblocktime88.push(this.blocks[i].avgblocktime88)
          data.hashrate.push(this.blocks[i].hashrate)
          data.difficulty.push(this.blocks[i].difficulty)
          data.limit.push(this.blocks[i].gasLimit)
          data.used.push(this.blocks[i].gasUsed)
          data.size.push(this.blocks[i].size)
          data.txns.push(this.blocks[i].txns)
        }
      }

      return data
    },
    chartBlocktime() {
      return this.$store.state.blocks.length > 0
        ? {
            labels: this.chartData.labels,
            datasets: [
              {
                backgroundColor: '#444',
                data: this.chartData.blocktime,
                borderWidth: [0, 0, 0],
                order: 1
              },
              {
                backgroundColor: 'rgba(255, 0, 255, 1)', // magenta
                borderColor: 'rgba(255, 0, 255, 0.5)',
                pointRadius: 0,
                data: this.chartData.avgblocktime10,
                borderWidth: 2,
                type: 'line',
                fill: false,
                order: 0,
                showLine: true
              },
              {
                borderColor: 'rgba(231, 103, 84, 0.9)', // orange
                backgroundColor: '#e76754',
                pointRadius: 0,
                data: this.chartData.avgblocktime25,
                borderWidth: 2,
                type: 'line',
                fill: false,
                order: 0,
                showLine: true
              },
              {
                backgroundColor: '#6fceb7',
                borderColor: '#6fceb7',
                pointRadius: 0,
                data: this.chartData.avgblocktime88,
                borderWidth: 2,
                type: 'line',
                fill: false,
                order: 0,
                showLine: true
              }
            ]
          }
        : {}
    },
    chartDifficulty() {
      return this.$store.state.blocks.length > 0
        ? {
            labels: this.chartData.labels,
            datasets: [
              {
                backgroundColor(context) {
                  const index = context.dataIndex
                  const value = context.dataset.data[index]
                  const prev = context.dataset.data[index - 1] || 0
                  if (prev === 0) {
                    // fix for first bar, use trend based on next.
                    const next = context.dataset.data[index + 1]
                    return next > value ? '#6fceb7' : '#e76754'
                  }
                  return value > prev ? '#6fceb7' : '#e76754'
                },
                yAxisID: 'diff',
                data: this.chartData.difficulty,
                borderWidth: [0, 0, 0],
                order: 1
              },
              {
                yAxisID: 'hash',
                backgroundColor: 'rgba(255, 0, 255, 1)', // maglatestBlockenta
                borderColor: 'rgba(255, 0, 255, 0.5)',
                pointRadius: 0,
                data: this.chartData.hashrate,
                borderWidth: 2,
                type: 'line',
                fill: false,
                order: 0,
                showLine: true
              }
            ]
          }
        : {}
    },
    chartUsage() {
      return this.$store.state.blocks.length > 0
        ? {
            labels: this.chartData.labels,
            datasets: [
              {
                yAxisID: 'txns',
                backgroundColor: '#6fceb7',
                borderColor: '#6fceb7',
                data: this.chartData.txns,
                borderWidth: 2,
                type: 'line',
                fill: false,
                order: 0,
                showLine: true,
                pointRadius: 1
              },
              {
                yAxisID: 'gas',
                backgroundColor: '#e76754',
                borderColor: '#e76754',
                data: this.chartData.used,
                borderWidth: 2,
                type: 'line',
                fill: false,
                order: 2,
                showLine: true,
                pointRadius: 0
              },
              {
                yAxisID: 'gas',
                backgroundColor: '#222',
                borderColor: '#444',
                data: this.chartData.limit,
                borderWidth: 2,
                type: 'line',
                fill: false,
                order: 3,
                showLine: true,
                pointRadius: 1
              },
              {
                yAxisID: 'size',
                backgroundColor: 'rgba(255, 0, 255, 1)',
                borderColor: 'rgba(255, 0, 255, 0.5)',
                data: this.chartData.size,
                borderWidth: 2,
                type: 'line',
                fill: false,
                order: 1,
                showLine: true,
                pointRadius: 0
              }
            ]
          }
        : {}
    }
  },
  created() {
    const t = this
    setInterval(function() {
      const now = Math.round(new Date().getTime() / 1000)
      t.seconds = now - t.pending.timestamp
    }, 1000)
  },
  methods: {
    convertBytes(bytes, showUnit) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) {
        return 'n/a'
      }
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      if (i === 0) {
        return bytes + ' ' + sizes[i]
      }
      let unit = ''
      if (showUnit) {
        unit = ' ' + sizes[i]
      }
      return (bytes / 1024 ** i).toFixed(1) + unit
    },
    convertHashes(bytes, showUnit) {
      const sizes = ['Hash', 'KH', 'MH', 'GH', 'TH']
      if (bytes === 0) {
        return 'n/a'
      }
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)))
      if (i === 0) {
        return bytes + ' ' + sizes[i]
      }
      let unit = ''
      if (showUnit) {
        unit = ' ' + sizes[i]
      }
      return (bytes / 1000 ** i).toFixed(2) + unit
    },
    format(hash) {
      return hash.substring(0, 12) + '..'
    },
    fromWei(wei) {
      return new BN(wei).div(1000000000000000000).toString()
    }
  }
}
</script>
