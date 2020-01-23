<template>
  <resizable-drawer :show="true" side="right" app>
    <v-list>
      <v-list-item>
        <v-list-item-action>
          <img src="~/static/octano.svg" height="36px" style="height:36px;" />
        </v-list-item-action>
        <v-list-item-content class="text-right">
          <h1 style="color:#6fceb7">
            octano<span style="color:#e76754">dusk</span>
          </h1>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list-item-title class="pl-4">
      CPU
    </v-list-item-title>
    <v-sheet class="px-4 bg-transparent">
      <v-sparkline
        :value="cpuinfo"
        :gradient="['#e76754', '#6fceb7']"
        gradient-direction="bottom"
        color="#e76754"
        padding="1"
        smooth="2"
        type="bar"
        height="100px"
        auto-line-width
        fill
      ></v-sparkline>
    </v-sheet>
    <v-list>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>
            Memory
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-progress-linear
              :value="availableMemory.percent"
              background-color="secondary"
              color="primary"
              height="25"
              reactive
            >
              <strong>
                {{ convertKBytes(availableMemory.kBytes, true) }} /
                {{ convertKBytes(availableMemory.total, true) }}
              </strong>
            </v-progress-linear>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>
            Swap
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-progress-linear
              :value="availableSwap.percent"
              background-color="secondary"
              color="primary"
              height="25"
              reactive
            >
              <strong>
                {{ convertKBytes(availableSwap.kBytes, true) }} /
                {{ convertKBytes(availableSwap.total, true) }}
              </strong>
            </v-progress-linear>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list-item-title class="pl-4">
      Storage
    </v-list-item-title>
    <v-row no-gutters>
      <v-col :cols="6" class="pl-4">
        <v-chip
          color="primary"
          class="text-center mb-2"
          style="display:block;width:100px;"
          label
        >
          Available
        </v-chip>
        <v-chip
          color="secondary"
          class="text-center mb-2"
          style="display:block;width:100px;"
          label
        >
          Chaindata
        </v-chip>
        <v-chip
          color="#444"
          class="text-center"
          style="display:block;width:100px;"
          label
        >
          System
        </v-chip>
      </v-col>
      <v-col :cols="6">
        <doughnut-chart
          v-if="chartStorage"
          :data="chartStorage"
          title="Storage"
          legend="left"
          left
        />
      </v-col>
    </v-row>
    <span style="position:absolute;bottom:0;width:100%;">
      <v-list-item-title class="pl-4">
        Load Average
      </v-list-item-title>
      <v-simple-table style="border-radius:0;">
        <thead>
          <tr>
            <th class="text-center">1m</th>
            <th class="text-center">5m</th>
            <th class="text-center">15m</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="system.loadavg">
            <td class="text-center">
              {{ system.loadavg[0].toFixed(2) }}
            </td>
            <td class="text-center">
              {{ system.loadavg[1].toFixed(2) }}
            </td>
            <td class="text-center">
              {{ system.loadavg[2].toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </span>
  </resizable-drawer>
</template>

<script>
import DoughnutChart from '~/components/charts/Storage.vue'
import ResizableDrawer from '~/components/drawers/Resizable'

export default {
  components: {
    ResizableDrawer,
    DoughnutChart
  },
  computed: {
    system() {
      return this.$store.state.systemInfo
    },
    meminfo() {
      return this.$store.state.systemInfo.meminfo
    },
    cpuinfo() {
      return this.$store.state.systemInfo.cpus
    },
    availableMemory() {
      return this.meminfo
        ? {
            percent: (this.meminfo.MemAvailable / this.meminfo.MemTotal) * 100,
            kBytes: this.meminfo.MemAvailable,
            total: this.meminfo.MemTotal
          }
        : { percent: 0, kBytes: 0, total: 0 }
    },
    availableSwap() {
      return this.meminfo
        ? {
            percent: (this.meminfo.SwapFree / this.meminfo.SwapTotal) * 100,
            kBytes: this.meminfo.SwapFree,
            total: this.meminfo.SwapTotal
          }
        : { percent: 0, kBytes: 0, total: 0 }
    },
    chartStorage() {
      return this.system.diskusage
        ? {
            labels: ['Available', 'System', 'Chaindata'],
            datasets: [
              {
                backgroundColor: ['#6fceb7', '#444', '#e76754'],
                data: [
                  this.system.diskusage.available,
                  this.system.diskusage.total - this.system.diskusage.available,
                  this.system.diskusage.chaindata
                ],
                borderWidth: [0, 0, 0]
              }
            ]
          }
        : false
    }
  },
  methods: {
    convertKBytes(kBytes, showUnit) {
      const sizes = ['KB', 'MB', 'GB', 'TB']
      if (kBytes === 0) {
        return 'n/a'
      }
      const i = parseInt(Math.floor(Math.log(kBytes) / Math.log(1024)))
      if (i === 0) {
        return kBytes + ' ' + sizes[i]
      }
      let unit = ''
      if (showUnit) {
        unit = ' ' + sizes[i]
      }
      return (kBytes / 1024 ** i).toFixed(1) + unit
    }
  }
}
</script>
