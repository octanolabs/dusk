<template>
  <bar-chart
    :chart-data="data"
    :options="options"
    :height="150"
    :styles="{ height: '150px' }"
  />
</template>

<script>
import BarChart from './Line.js'

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
              display: false
            }
          ],
          yAxes: [
            {
              id: 'gas',
              display: false,
              type: 'logarithmic',
              ticks: {
                beginAtZero: true
              }
            },
            {
              id: 'txns',
              display: false,
              ticks: {
                beginAtZero: true
              }
            },
            {
              id: 'size',
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
                  label = self.$tc('geth.dashboard.txnCount', label)
                }
                if (tooltipItem.datasetIndex === 1) {
                  label = self.$tc('geth.dashboard.gasUsed', label)
                }
                if (tooltipItem.datasetIndex === 2) {
                  label = self.$tc('geth.dashboard.gasLimit', label)
                }
                if (tooltipItem.datasetIndex === 3) {
                  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
                  const bytes = label
                  const i = parseInt(
                    Math.floor(Math.log(bytes) / Math.log(1024))
                  )
                  const unit = ' ' + sizes[i]
                  label = self.$tc(
                    'geth.dashboard.size',
                    (bytes / 1024 ** i).toFixed(1) + unit
                  )
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
