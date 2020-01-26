<template>
  <client-only placeholder="Loading...">
    <doughnut-chart
      :chart-data="data"
      :options="options"
      :height="130"
      :styles="{ height: '130px' }"
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
          display: false,
          position: 'top',
          text: this.title
        },
        legend: {
          display: true,
          position: this.legend,
          align: this.legend === 'top' ? 'center' : this.legend,
          labels: {
            fontFamily: "'Avenir', 'Helvetica', 'Arial', 'sans-serif'"
          }
        }
      }
    }
  }
}
</script>
