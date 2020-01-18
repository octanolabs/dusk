<template>
  <div>
    <v-col :cols="12">
      <v-row no-gutters>
        <v-col :cols="2">
          <v-row no-gutters>
            <doughnut-chart :data="chartData.os" title="OS" left />
          </v-row>
          <v-row no-gutters>
            <doughnut-chart :data="chartData.arch" title="Arch" left />
          </v-row>
        </v-col>
        <v-col :cols="4">
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
        <v-col :cols="2">
          <v-row no-gutters>
            <doughnut-chart :data="chartData.client" title="Clients" right />
          </v-row>
          <v-row no-gutters>
            <doughnut-chart
              :data="chartData.version"
              title="Versions (Gubiq)"
              right
            />
          </v-row>
        </v-col>
        <v-col :cols="4"></v-col>
      </v-row>
      <v-row no-gutters class="mt-2">
        <v-col :cols="8">
          <v-data-table
            :headers="headers"
            :items="peers"
            :items-per-page="5"
            :expanded.sync="expandedPeers"
            item-key="raw.enode"
            flat
            single-expand
            show-expand
          >
            <template v-slot:item.country="{ item }">
              {{
                countryCache[
                  item.raw.network.remoteAddress.split(':')[0]
                ].split(';')[3]
              }}
            </template>
            <template v-slot:item.os="{ item }">
              <v-icon v-if="item.os === 'linux'">mdi-linux</v-icon>
              <v-icon v-else-if="item.os === 'darwin'">mdi-apple</v-icon>
              <v-icon v-else>mdi-windows</v-icon>
            </template>
            <template v-slot:expanded-item="{ item }">
              <td :colspan="12" class="pa-0">
                <pre v-highlightjs="prettyJson(item.raw)">
<code class="javascript w-100 elevation-0"></code>
                </pre>
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import stringifyObject from 'stringify-object'
import WorldMap from 'vue-world-map'
import DoughnutChart from '~/components/charts/Doughnut.vue'

export default {
  middleware: 'auth',
  components: {
    WorldMap,
    DoughnutChart
  },
  data() {
    return {
      expandedPeers: [],
      headers: [
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
        client: {}
      }
    }
  },
  computed: {
    peers() {
      const peers = this.$store.state.peers.list
      const info = []
      for (const i in peers) {
        // "Gubiq/v3.0.1-andromeda-834c1f86/linux-amd64/go1.13.5"
        // "Gubiq/UbiqMainnet/v3.0.1-andromeda-834c1f86/linux-amd64/go1.13.5" // which one of you assholes is this? <3
        const peer = {}
        const name = peers[i].name
        let split = name.split('/')
        peer.client = split[0]
        const version = split[1].substr(0, 1) === 'v' ? split[1] : split[2]
        const vsplit = version.split('-')
        peer.version = vsplit[0]
        peer.tag = vsplit[1]
        peer.build = vsplit[2]
        const platform = split[1].substr(0, 1) === 'v' ? split[2] : split[3]
        split = platform.split('-')
        peer.os = split[0]
        peer.arch = split[1]
        peer.raw = peers[i]
        info.push(peer)
      }
      return info
    },
    countryCache() {
      return this.$store.state.cache
    }
  },
  created() {
    this.getPeers()
  },
  methods: {
    async getPeers() {
      try {
        await this.$store.dispatch('peers')
        await this.toChartData(this.peers, 'client')
        await this.toChartData(this.peers, 'version')
        await this.toChartData(this.peers, 'os')
        await this.toChartData(this.peers, 'arch')
        await this.setCountryCodes(this.peers)
      } catch (e) {
        // console.log(e)
      }
    },
    async setCountryCodes(peers) {
      try {
        for (const i in peers) {
          const ip = peers[i].raw.network.remoteAddress.split(':')[0]
          await this.$store.dispatch('country', { ip })
        }
      } catch (e) {
        // console.log(e)
      }
    },
    toChartData(arr, key) {
      const newArr = this.strip(arr, key)
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
            backgroundColor: ['#6fceb7', '#e76754'],
            data: cdata.counts,
            borderWidth: [0, 0]
          }
        ]
      }
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
    }
  }
}
</script>
