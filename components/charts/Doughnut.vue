<template>
  <v-card
    class="mr-1"
    height="150"
    width="300"
    style="background-color:rgba(0,0,0,0);"
    flat
  >
    <client-only placeholder="Loading...">
      <doughnut-chart
        :chart-data="data"
        :options="options"
        :height="120"
        :styles="{ height: '120px' }"
      />
    </client-only>
  </v-card>
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
        legend: {
          display: true,
          position: !this.right ? 'left' : 'right',
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
