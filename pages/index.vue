<template>
  <v-layout>
    <v-col :cols="12" class="pa-0">
      <v-col :cols="6">
        <v-card class="mb-1 bg-transparent" outlined>
          <v-card-title>
            <v-avatar :size="28" class="mr-2">
              <img src="~/static/networks/ubiq.svg" />
            </v-avatar>
            Ubiq - mainnet
            <v-spacer />
            <v-icon class="mr-2">mdi-account-group</v-icon>
            {{ peers.length - 1 }}
          </v-card-title>
          <v-row no-gutters>
            <v-col :cols="6" class="pa-3">
              <v-card class="bg-transparent" flat>
                <client-only placeholder="Loading...">
                  <world-map
                    v-if="map"
                    :countryData="map"
                    low-color="#6fceb7"
                    high-color="#6fceb7"
                    default-country-fill-color="#333"
                    country-stroke-color="#6fceb7"
                  />
                </client-only>
              </v-card>
            </v-col>
            <v-col :cols="6" class="pr-3 pl-3">
              <bar-chart v-if="chartCountry" :data="chartCountry" />
            </v-col>
          </v-row>
          <v-row no-gutters class="mb-2">
            <v-col :cols="3">
              <doughnut-chart
                v-if="chartOperatingSystem"
                :data="chartOperatingSystem"
                title="OS"
                legend="top"
                right
              />
            </v-col>
            <v-col :cols="3">
              <doughnut-chart
                v-if="chartArch"
                :data="chartArch"
                title="Arch"
                right
              />
            </v-col>
            <v-col :cols="3">
              <doughnut-chart
                v-if="chartClient"
                :data="chartClient"
                title="Clients"
                legend="top"
                right
              />
            </v-col>
            <v-col :cols="3">
              <doughnut-chart
                v-if="chartVersion"
                :data="chartVersion"
                title="Versions (Gubiq)"
                legend="top"
                right
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card flat>
          <v-row no-gutters>
            <v-col :cols="12">
              <client-only>
                <v-data-table
                  :headers="headers"
                  :items="peers"
                  :items-per-page="5"
                  :expanded.sync="expandedPeers"
                  item-key="id"
                  flat
                  dense
                >
                  <template v-slot:body="{ items }">
                    <tbody>
                      <tr
                        :class="item.id === 0 ? 'custom-highlight-row' : ''"
                        v-for="item in items"
                        :key="item.id"
                      >
                        <td class="text-left">{{ item.countryName }}</td>
                        <td class="text-left">{{ item.client }}</td>
                        <td class="text-left">{{ item.version }}</td>
                        <td class="text-left">{{ item.tag }}</td>
                        <td class="text-left">{{ item.build }}</td>
                        <td class="text-left">{{ item.os }}</td>
                        <td class="text-left">{{ item.arch }}</td>
                      </tr>
                    </tbody>
                  </template>
                  <template v-slot:item.id="{ item }">
                    <v-icon v-if="item.id === 0" small>
                      mdi-star
                    </v-icon>
                  </template>
                  <template v-slot:item.os="{ item }">
                    <v-icon v-if="item.os === 'linux'" small>mdi-linux</v-icon>
                    <v-icon v-else-if="item.os === 'darwin'" small>
                      mdi-apple
                    </v-icon>
                    <v-icon v-else small>mdi-windows</v-icon>
                  </template>
                </v-data-table>
              </client-only>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-col>
  </v-layout>
</template>

<script>
import stringifyObject from 'stringify-object'
import WorldMap from 'vue-world-map'
import BarChart from '~/components/charts/Bar.vue'
import DoughnutChart from '~/components/charts/Doughnut.vue'

export default {
  // middleware: 'auth',
  components: {
    BarChart,
    DoughnutChart,
    WorldMap
  },
  data() {
    return {
      expandedPeers: [],
      headers: [
        { text: 'Country', value: 'countryName' },
        { text: 'Client', value: 'client' },
        { text: 'Version', value: 'version' },
        { text: 'Tag', value: 'tag' },
        { text: 'Build', value: 'build' },
        { text: 'OS', value: 'os' },
        { text: 'Arch', value: 'arch' }
      ],
      countries: {},
      chartData: {
        version: {},
        arch: {},
        os: {},
        client: {},
        country: false
      }
    }
  },
  computed: {
    peers() {
      return this.$store.state.peers
    },
    system() {
      return this.$store.state.systemInfo
    },
    chartArch() {
      return this.$store.state.peers.length > 0
        ? this.toChartData(this.peers, 'arch', 0)
        : false
    },
    chartCountry() {
      return this.$store.state.peers.length > 0
        ? this.toChartData(this.peers, 'countryCode', 1)
        : false
    },
    chartClient() {
      return this.$store.state.peers.length > 0
        ? this.toChartData(this.peers, 'client', 0)
        : false
    },
    chartOperatingSystem() {
      return this.$store.state.peers.length > 0
        ? this.toChartData(this.peers, 'os', 0)
        : false
    },
    chartVersion() {
      return this.$store.state.peers.length > 0
        ? this.toChartData(this.peers, 'version', 0)
        : false
    },
    map() {
      return this.$store.state.peers.length > 0
        ? this.toMapData(this.peers)
        : false
    }
  },
  methods: {
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

      return {
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
      const newArr = this.strip(arr, 'countryCode')
      const counts = {}
      for (const i in newArr) {
        counts[newArr[i]] = counts[newArr[i]] ? counts[newArr[i]] + 1 : 1
      }
      return counts
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
