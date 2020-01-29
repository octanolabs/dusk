<template>
  <client-only placeholder="Loading...">
    <doughnut-chart
      :chart-data="data"
      :options="options"
      :height="120"
      :styles="{ width: '100%', height: '112px' }"
    />
  </client-only>
</template>

<script>
import DoughnutChart from './Doughnut.js'

export default {
  components: {
    DoughnutChart
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
    },
    legend: {
      type: String,
      default() {
        return 'top'
      }
    }
  },
  computed: {
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label(tooltipItem, data) {
              const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
              const bytes = data.datasets[0].data[tooltipItem.index] || 0
              const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
              const unit = ' ' + sizes[i]
              return (
                data.labels[tooltipItem.index] +
                ': ' +
                (bytes / 1024 ** i).toFixed(1) +
                unit
              )
            }
          }
        }
      }
    }
  }
}
</script>
