<template>
  <bar-chart
    :chart-data="data"
    :options="options"
    :height="150"
    :styles="{ height: '150px' }"
  />
</template>

<script>
import BarChart from './MixedBarLine.js'

export default {
  components: {
    BarChart
  },
  props: {
    title: {
      type: String,
      default() {
        return ''
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    left: {
      type: Boolean,
      default() {
        return true
      }
    },
    right: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  computed: {
    options() {
      const self = this
      return {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          position: 'top',
          text: this.title
        },
        scales: {
          xAxes: [
            {
              display: false,
              ticks: {
                beginAtZero: true
              }
            }
          ],
          yAxes: [
            {
              display: false,
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          mode: 'index',
          callbacks: {
            label(tooltipItem, data) {
              let label = tooltipItem.value || 0
              if (label) {
                if (tooltipItem.datasetIndex === 0) {
                  label =
                    self.$t('geth.dashboard.blocktime') +
                    ': ' +
                    parseFloat(label).toFixed(2) +
                    's'
                }
                if (tooltipItem.datasetIndex === 1) {
                  label =
                    self.$tc('geth.dashboard.averageBlocks', 10) +
                    parseFloat(label).toFixed(2) +
                    's'
                }
                if (tooltipItem.datasetIndex === 2) {
                  label =
                    self.$tc('geth.dashboard.averageBlocks', 25) +
                    parseFloat(label).toFixed(2) +
                    's'
                }
                if (tooltipItem.datasetIndex === 3) {
                  label =
                    self.$tc('geth.dashboard.averageBlocks', 50) +
                    parseFloat(label).toFixed(2) +
                    's'
                }
              }
              return label
            }
          }
        }
      }
    }
  }
}
</script>
