<template>
  <div>
    <v-col :cols="12" class="pa-0">
      <v-col :cols="6">
        <v-card class="mb-1 bg-transparent" flat>
          <v-row no-gutters>
            <v-chip class="mr-1" outlined label large text-color="white">
              <v-avatar class="mr-2">
                <img src="~/static/networks/ubiq.svg" />
              </v-avatar>
              Ubiq
            </v-chip>
            <v-chip class="mr-1" outlined label large text-color="white">
              <v-icon class="mr-2">mdi-account-group</v-icon>
              {{ peers.length - 1 }}
            </v-chip>
            <v-spacer />
            <v-chip class="mr-1" outlined label large text-color="white">
              <v-icon class="mr-2">mdi-cpu-64-bit</v-icon>
              {{ system.cpus.length }}
            </v-chip>
            <v-chip class="mr-1" outlined label large text-color="white">
              <v-icon class="mr-2">mdi-link-box-variant-outline</v-icon>
              {{ convertBytes(system.diskusage.chaindata, true) }}
            </v-chip>
            <v-chip class="mr-1" outlined label large text-color="white">
              <v-icon class="mr-2">mdi-harddisk</v-icon>
              {{ convertBytes(system.diskusage.available, true) }}
            </v-chip>
            <v-chip class="mr-1" outlined label large text-color="white">
              <v-icon class="mr-2">mdi-memory</v-icon>
              {{ convertBytes(system.freemem, true) }}
            </v-chip>
            <v-chip
              v-if="system.loadavg"
              text-color="white"
              outlined
              label
              large
            >
              <v-icon class="mr-2" small>mdi-worker</v-icon>
              {{ system.loadavg[0].toFixed(2) }},
              {{ system.loadavg[1].toFixed(2) }},
              {{ system.loadavg[2].toFixed(2) }}
            </v-chip>
          </v-row>
        </v-card>
        <v-card class="mb-1 bg-transparent" outlined>
          <v-row no-gutters>
            <v-col :cols="6" class="pa-3">
              <v-card style="background-color:rgba(0,0,0,0)" flat>
                <client-only placeholder="Loading...">
                  <world-map
                    :countryData="countries"
                    low-color="#6fceb7"
                    high-color="#6fceb7"
                    default-country-fill-color="#333"
                    country-stroke-color="#6fceb7"
                  />
                </client-only>
              </v-card>
            </v-col>
            <v-col :cols="6" class="pr-3 pl-3">
              <bar-chart :data="chartData.country" title="" />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col :cols="3">
              <doughnut-chart :data="chartData.os" title="OS" right />
            </v-col>
            <v-col :cols="3">
              <doughnut-chart :data="chartData.arch" title="Arch" right />
            </v-col>
            <v-col :cols="3">
              <doughnut-chart :data="chartData.client" title="Clients" right />
            </v-col>
            <v-col :cols="3">
              <doughnut-chart
                :data="chartData.version"
                title="Versions (Gubiq)"
                right
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card flat>
          <v-row no-gutters>
            <v-col :cols="12">
              <v-data-table
                :headers="headers"
                :items="peers"
                :items-per-page="5"
                :expanded.sync="expandedPeers"
                item-key="raw.enode"
                flat
                single-expand
                show-expand
                dense
              >
                <template v-slot:item.localhost="{ item }">
                  <v-icon v-if="item.localhost === true" small>mdi-star</v-icon>
                </template>
                <template v-slot:item.os="{ item }">
                  <v-icon v-if="item.os === 'linux'" small>mdi-linux</v-icon>
                  <v-icon v-else-if="item.os === 'darwin'" small>
                    mdi-apple
                  </v-icon>
                  <v-icon v-else small>mdi-windows</v-icon>
                </template>
                <template v-slot:expanded-item="{ item }">
                  <td
                    :colspan="9"
                    class="pa-0"
                    style="width:100%;overflow-x:auto;"
                  >
                    <pre v-highlightjs="prettyJson(item.raw)">
<code class="javascript w-100 elevation-0"></code>
                    </pre>
                  </td>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-col>
  </div>
</template>

<script>
import stringifyObject from 'stringify-object'
import WorldMap from 'vue-world-map'
import BarChart from '~/components/charts/Bar.vue'
import DoughnutChart from '~/components/charts/Doughnut.vue'

export default {
  middleware: 'auth',
  components: {
    WorldMap,
    BarChart,
    DoughnutChart
  },
  data() {
    return {
      expandedPeers: [],
      peerTabs: null,
      headers: [
        { text: '', value: 'localhost' },
        { text: 'Country', value: 'country' },
        { text: 'Client', value: 'client' },
        { text: 'Version', value: 'version' },
        { text: 'Tag', value: 'tag' },
        { text: 'Build', value: 'build' },
        { text: 'OS', value: 'os' },
        { text: 'Arch', value: 'arch' },
        { text: '', value: 'data-table-expand' }
      ],
      countries: {},
      chartData: {
        version: {},
        arch: {},
        os: {},
        client: {},
        country: {}
      }
    }
  },
  computed: {
    peers() {
      return this.$store.state.peers
    },
    system() {
      return this.$store.state.systemInfo
    }
  },
  created() {
    this.getPeers()
  },
  methods: {
    async getPeers() {
      try {
        await this.$store.dispatch('peers')
        await this.toChartData(this.peers, 'client', 0)
        await this.toChartData(this.peers, 'version', 0)
        await this.toChartData(this.peers, 'os', 0)
        await this.toChartData(this.peers, 'arch', 0)
        await this.toChartData(this.peers, 'country', 1)
        await this.toMapData(this.peers)
      } catch (e) {
        // console.log(e)
      }
    },
    // type 0 = doughnut, 1 = bar, 2 = hybrid
    toChartData(peers, key, type) {
      const newArr = this.strip(peers, key)
      const counts = {}
      for (const i in newArr) {
        counts[newArr[i]] = counts[newArr[i]] ? counts[newArr[i]] + 1 : 1
      }
      const cdata = {
        labels: [],
        counts: []
      }
      for (const key in counts) {
        if (counts.hasOwnProperty(key)) {
          cdata.labels.push(key)
          cdata.counts.push(counts[key])
        }
      }

      this.chartData[key] = {
        labels: cdata.labels,
        datasets: [
          {
            backgroundColor:
              type === 0 ? ['#6fceb7', '#e76754', '#ff00ff'] : '#6fceb7',
            data: cdata.counts,
            borderWidth: [0, 0, 0]
          }
        ]
      }
    },
    toMapData(arr) {
      const newArr = this.strip(arr, 'country')
      const counts = {}
      for (const i in newArr) {
        counts[newArr[i]] = counts[newArr[i]] ? counts[newArr[i]] + 1 : 1
      }
      this.countries = counts
    },
    strip(arr, key) {
      const newArr = []
      for (const i in arr) {
        if (arr[i][key]) {
          newArr.push(arr[i][key])
        }
      }
      return newArr
    },
    prettyJson(obj) {
      return stringifyObject(obj, {
        indent: '  ',
        singleQuotes: false,
        inlineCharacterLimit: 12
      })
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
