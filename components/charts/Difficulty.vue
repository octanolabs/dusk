<template>
  <bar-chart
    :chart-data="data"
    :options="options"
    :height="150"
    :styles="{ height: '150px' }"
  />
</template>

<script>
import BarChart from './Bar.js'

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
              display: false
            }
          ]
        },
        legend: {
          display: false,
          position: 'top',
          align: 'start',
          labels: {
            fontFamily: "'Avenir', 'Helvetica', 'Arial', 'sans-serif'"
          }
        }
      }
    }
  }
}
</script>
