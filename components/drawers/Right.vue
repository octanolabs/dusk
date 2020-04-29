<template>
  <resizable-drawer :show="true" side="right" app>
    <v-toolbar>
      <v-btn icon to="/" class="ma-1">
        <v-icon>mdi-view-dashboard</v-icon>
      </v-btn>
      <v-btn icon to="/clients" class="ma-1">
        <v-icon>mdi-download-network</v-icon>
      </v-btn>
      <v-btn icon to="/settings" class="ma-1">
        <v-icon>mdi-router-wireless-settings</v-icon>
      </v-btn>
      <v-btn icon class="ma-1">
        <v-icon>mdi-console</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list class="pa-0">
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
    <span style="position:absolute;bottom:0;width:100%;padding-right:15px;">
      <v-list-item-title class="pl-4">
        CPU
      </v-list-item-title>
      <v-sheet class="px-4 bg-transparent">
        <v-sparkline
          :value="cpuinfo"
          :gradient="['#e76754', '#6fceb7', '#6fceb7']"
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
        <v-list-item v-if="availableSwap.percent" two-line>
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
        <v-list-item v-if="diskusage" two-line>
          <v-list-item-content>
            <v-list-item-title>
              Storage
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-progress-linear
                :value="availableStorage.percent"
                background-color="secondary"
                color="primary"
                height="25"
                reactive
              >
                <strong>
                  {{ convertBytes(availableStorage.kBytes, true) }} /
                  {{ convertBytes(availableStorage.total, true) }}
                </strong>
              </v-progress-linear>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
import ResizableDrawer from '~/components/drawers/Resizable'

export default {
  components: {
    ResizableDrawer
  },
  computed: {
    system() {
      return this.$store.state.systemInfo
    },
    meminfo() {
      return this.$store.state.systemInfo.meminfo
    },
    diskusage() {
      return this.$store.state.systemInfo.diskusage
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
    availableStorage() {
      return this.diskusage
        ? {
            percent: (this.diskusage.available / this.diskusage.total) * 100,
            kBytes: this.diskusage.available,
            total: this.diskusage.total
          }
        : { percent: 0, kBytes: 0, total: 0 }
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
    },
    convertBytes(bytes, showUnit) {
      const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB']
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
