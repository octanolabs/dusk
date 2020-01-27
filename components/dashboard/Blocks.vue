<template>
  <div>
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
  </div>
</template>

<script>
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
  computed: {
    blocks() {
      return this.$store.state.blocks
    },
    chartData() {
      const data = {
        labels: [],
        blocktime: [],
        avgblocktime: [],
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
          data.avgblocktime.push(this.blocks[i].avgblocktime)
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
                backgroundColor: 'rgba(111, 206, 183, 1)',
                data: this.chartData.blocktime,
                borderWidth: [0, 0, 0],
                order: 1
              },
              {
                borderColor: 'rgba(231, 103, 84, 0.9)', // orange
                backgroundColor: '#e76754',
                pointRadius: 0,
                data: this.chartData.avgblocktime,
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
                  return value > prev ? '#6fceb7' : '#e76754'
                },
                data: this.chartData.difficulty,
                borderWidth: [0, 0, 0]
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
    }
  }
}
</script>
