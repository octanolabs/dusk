<template>
  <div>
    <v-row no-gutters class="pb-2">
      <v-col :cols="12">
        <v-card class="bg-transparent" outlined>
          <blocktimes v-if="blocks" :data="chartBlocktimes" title="Blocktime" />
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
          <gas-chart v-if="blocks" :data="chartGas" title="Usage" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Blocktimes from '~/components/charts/Blocktimes.vue'
import Difficulty from '~/components/charts/Difficulty.vue'
import GasChart from '~/components/charts/Gas.vue'

export default {
  // middleware: 'auth',
  components: {
    Blocktimes,
    Difficulty,
    GasChart
  },
  computed: {
    blocks() {
      return this.$store.state.blocks
    },
    chartBlocktimes() {
      const number = this.strip(this.blocks, 'number')
      const blocktime = this.strip(this.blocks, 'blocktime')
      const avgblocktime = this.strip(this.blocks, 'avgblocktime')
      return this.$store.state.blocks.length > 0
        ? {
            labels: number,
            datasets: [
              {
                backgroundColor: 'rgba(111, 206, 183, 1)',
                data: blocktime,
                borderWidth: [0, 0, 0],
                order: 1
              },
              {
                borderColor: 'rgba(231, 103, 84, 0.9)', // orange
                backgroundColor: '#e76754',
                pointRadius: 0,
                data: avgblocktime,
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
      const number = this.strip(this.blocks, 'number')
      const stripped = this.strip(this.blocks, 'difficulty')
      return this.$store.state.blocks.length > 0
        ? {
            labels: number,
            datasets: [
              {
                backgroundColor(context) {
                  const index = context.dataIndex
                  const value = context.dataset.data[index]
                  const prev = context.dataset.data[index - 1] || 0
                  return value > prev ? '#6fceb7' : '#e76754'
                },
                data: stripped,
                borderWidth: [0, 0, 0]
              }
            ]
          }
        : {}
    },
    chartGas() {
      const usage = this.stripUsage(this.blocks)

      return this.$store.state.blocks.length > 0
        ? {
            labels: usage.labels,
            datasets: [
              {
                yAxisID: 'txns',
                backgroundColor: '#6fceb7',
                borderColor: '#6fceb7',
                data: usage.txns,
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
                data: usage.used,
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
                data: usage.limit,
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
                data: usage.size,
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
  methods: {
    strip(arr, key) {
      const newArr = []
      for (const i in arr) {
        if (arr[i][key]) {
          newArr.push(arr[i][key])
        }
      }
      return newArr
    },
    stripUsage(arr) {
      const usage = {
        limit: [],
        used: [],
        size: [],
        txns: [],
        labels: []
      }

      for (const i in arr) {
        if (arr[i]) {
          usage.limit.push(arr[i].gasLimit)
          usage.used.push(arr[i].gasUsed)
          usage.size.push(arr[i].size)
          usage.txns.push(arr[i].txns)
          usage.labels.push(arr[i].number)
        }
      }
      return usage
    },
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
    }
  }
}
</script>
