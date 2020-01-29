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
  methods: {
    convertHashes(hashes, showUnit) {
      const sizes = ['Hash', 'KH', 'MH', 'GH', 'TH']
      if (hashes === 0) {
        return 'n/a'
      }
      const i = parseInt(Math.floor(Math.log(hashes) / Math.log(1000)))
      if (i === 0) {
        return hashes + ' ' + sizes[i]
      }
      let unit = ''
      if (showUnit) {
        unit = ' ' + sizes[i]
      }
      return (hashes / 1000 ** i).toFixed(2) + unit
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
              id: 'diff',
              display: false
            },
            {
              id: 'hash',
              display: false,
              ticks: {
                beginAtZero: true
              }
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
        },
        tooltips: {
          mode: 'index',
          callbacks: {
            label(tooltipItem, data) {
              console.log(tooltipItem)
              const hashes = tooltipItem.value
              const sizes = ['Hash', 'KH', 'MH', 'GH', 'TH']
              if (hashes === 0) {
                return 'n/a'
              }
              const i = parseInt(Math.floor(Math.log(hashes) / Math.log(1000)))
              const unit = ' ' + sizes[i]

              let label = (hashes / 1000 ** i).toFixed(2) + unit
              if (tooltipItem.datasetIndex === 1) {
                label = 'Hashrate: ' + label + '/s'
              } else {
                label = 'Difficulty: ' + label
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
