<template>
  <v-card class="mr-1" style="background-color:rgba(0,0,0,0);" flat>
    <client-only placeholder="Loading...">
      <bar-chart
        :chart-data="data"
        :options="options"
        :height="300"
        :styles="{ height: '300px' }"
      />
    </client-only>
  </v-card>
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
          display: false,
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
              display: true
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
