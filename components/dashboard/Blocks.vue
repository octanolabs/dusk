<template>
  <div>
    <v-col v-if="blocks && blocks.length > 0" :cols="12" class="pa-0">
      <v-row no-gutters class="pb-2">
        <v-col :cols="4" class="pr-1">
          <v-card>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">
                  {{ $t('geth.dashboard.difficulty') }}
                </div>
                <v-list-item-title class="headline mb-1">
                  {{ convertHashes(latestBlock.difficulty, true) }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('geth.dashboard.esthashrate') }}
                  {{ convertHashes(latestBlock.hashrate, true) }}/s
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
                <div class="overline mb-4">
                  {{ $t('geth.dashboard.lastBlock') }}
                </div>
                <v-list-item-title class="headline mb-1">
                  {{ $tc('geth.dashboard.ago', seconds) }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $tc('geth.dashboard.previous', latestBlock.blocktime) }}
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
                <div class="overline mb-4">
                  {{ $t('geth.dashboard.bestBlock') }}
                </div>
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
    <v-col v-else :cols="12" class="pa-0">
      <v-row no-gutters class="pb-2">
        <v-col :cols="4" class="pr-1">
          <v-skeleton-loader
            class="mx-auto"
            type="image"
            style="height:120px"
          />
        </v-col>
        <v-col :cols="4" class="px-1">
          <v-skeleton-loader
            class="mx-auto"
            type="image"
            style="height:120px"
          />
        </v-col>
        <v-col :cols="4" class="pl-1">
          <v-skeleton-loader
            class="mx-auto"
            type="image"
            style="height:120px"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-row v-if="blocks && blocks.length > 0" no-gutters class="pb-2">
      <v-col :cols="12">
        <v-card class="bg-transparent" outlined>
          <blocktime
            :data="chartBlocktime"
            :title="$t('geth.dashboard.blocktime')"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else no-gutters class="pb-2">
      <v-col :cols="12">
        <v-skeleton-loader type="image" style="height:151px;" />
      </v-col>
    </v-row>
    <v-row v-if="blocks && blocks.length > 0" no-gutters class="pb-2">
      <v-col :cols="12">
        <v-card class="bg-transparent" outlined>
          <difficulty
            :data="chartDifficulty"
            :title="$t('geth.dashboard.difficulty')"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else no-gutters class="pb-2">
      <v-col :cols="12">
        <v-skeleton-loader type="image" style="height:151px;" />
      </v-col>
    </v-row>
    <v-row v-if="blocks && blocks.length > 0" no-gutters class="pb-2">
      <v-col :cols="12">
        <v-card class="bg-transparent" outlined>
          <usage :data="chartUsage" :title="$t('geth.dashboard.activity')" />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else no-gutters class="pb-2">
      <v-col :cols="12">
        <v-skeleton-loader type="image" style="height:150px;" />
      </v-col>
    </v-row>
    <v-row
      v-if="pendingTxns && blocks && blocks.length > 0"
      no-gutters
      class="pb-2"
    >
      <v-col :cols="12">
        <v-data-table
          :headers="headers"
          :items="pendingTxns"
          :items-per-page="10"
          item-key="id"
          :footer-props="footerProps"
          :no-data-text="$t('geth.dashboard.noPending')"
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
          <template v-slot:item.gas="{ item }">
            {{ item.gas }}
          </template>
          <template v-slot:item.gasPrice="{ item }">
            {{ item.gasPrice }}
          </template>
          <template v-slot:item.r="{ item }">
            {{ maxfee(item.gas, item.gasPrice) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-else no-gutters class="pb-2">
      <v-col :cols="12">
        <v-skeleton-loader
          type="table-thead, table-row-divider, table-row-divider, table-row-divider, table-tfoot"
        />
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
  props: {
    provider: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      seconds: 0,
      headers: [
        { text: this.$t('geth.dashboard.hash'), value: 'hash' },
        { text: this.$t('geth.dashboard.from'), value: 'from' },
        { text: this.$t('geth.dashboard.to'), value: 'to' },
        { text: this.$t('geth.dashboard.value'), value: 'value' },
        { text: this.$t('geth.dashboard.gas'), value: 'gas' },
        { text: this.$t('geth.dashboard.gasPrice'), value: 'gasPrice' },
        { text: this.$t('geth.dashboard.maxFee'), value: 'r' }
      ],
      footerProps: {
        itemsPerPageAllText: this.$t('common.table.all'),
        itemsPerPageText: this.$t('geth.dashboard.txnsPerPage'),
        itemsPerPageOptions: [5, 10, 25, -1]
      }
    }
  },
  computed: {
    blocks() {
      return this.provider.blocks
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
      return this.provider.pending || {}
    },
    pendingTxns() {
      return this.pending?.transactions || []
    },
    blockNumber() {
      return this.latestBlock.number || 0
    },
    syncing() {
      return this.provider.syncing
    },
    chartData() {
      const data = {
        labels: [],
        blocktime: [],
        avgblocktime10: [],
        avgblocktime25: [],
        avgblocktime50: [],
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
          data.avgblocktime50.push(this.blocks[i].avgblocktime50)
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
      return this.provider.blocks.length > 0
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
                data: this.chartData.avgblocktime50,
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
      return this.provider.blocks.length > 0
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
      return this.provider.blocks.length > 0
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
      if (hash) {
        return hash.substring(0, 12) + '..'
      } else {
        return '-'
      }
    },
    fromWei(wei) {
      return new BN(wei).div(1000000000000000000).toString()
    },
    maxfee(gas, price) {
      const mf = new BN(gas).times(price)
      return mf.div(1000000000000000000).toString()
    }
  }
}
</script>
