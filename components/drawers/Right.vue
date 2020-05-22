<template>
  <resizable-drawer :show="true" side="right" app>
    <v-toolbar>
      <v-list dense class="pa-0">
        <v-list-item>
          <v-list-item-action>
            <img src="~/static/octano.svg" height="36px" style="height:36px;" />
          </v-list-item-action>
          <v-list-item-content class="text-right">
            <h1 style="color:#6fceb7">
              octano<span style="color:#e76754">dusk</span>
            </h1>
            <v-list-item-subtitle style="color:#e76754">
              v{{ version }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-toolbar>
    <v-list dense class="pa-0">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            {{ system.hostname }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="system.userInfo">
            {{ system.userInfo.username }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            {{ system.platform }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ system.release }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <template v-for="key of Object.keys(networkInterfaces)">
        <v-list-item
          v-if="
            system.networkInterfaces[key][0] &&
              system.networkInterfaces[key][0].address !== '127.0.0.1'
          "
          :key="key"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ system.networkInterfaces[key][0].address }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ system.networkInterfaces[key][1].address }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <span style="position:absolute;bottom:0;width:100%;">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t('system.cpu') }}
            </v-list-item-title>
            <v-list-item-subtitle class="bg-transparent">
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
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <template v-for="key of Object.keys(available)">
          <v-tooltip v-if="available[key].total" :key="key" left>
            <template v-slot:activator="{ on }">
              <v-list-item two-line v-on="on">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $t('system')[key] }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-progress-linear
                      :value="available[key].percent"
                      background-color="secondary"
                      color="primary"
                      height="25"
                      reactive
                    >
                      <strong>
                        {{
                          convertUnits(
                            available[key].available,
                            true,
                            available[key].units
                          )
                        }}
                        /
                        {{
                          convertUnits(
                            available[key].total,
                            true,
                            available[key].units
                          )
                        }}
                      </strong>
                    </v-progress-linear>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-subheader>{{ $t('system')[key] }}</v-subheader>
            <v-simple-table dense transparent>
              <template v-slot:default>
                <tbody>
                  <tr style="color:#6fceb7">
                    <th>{{ $t('system.available') }}</th>
                    <td>
                      {{
                        convertUnits(
                          available[key].available,
                          true,
                          available[key].units
                        )
                      }}
                    </td>
                  </tr>
                  <tr style="color:#e76754">
                    <th>{{ $t('system.used') }}</th>
                    <td>
                      {{
                        convertUnits(
                          available[key].used,
                          true,
                          available[key].units
                        )
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>{{ $t('system.total') }}</th>
                    <td>
                      {{
                        convertUnits(
                          available[key].total,
                          true,
                          available[key].units
                        )
                      }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tooltip>
        </template>
      </v-list>
      <v-list-item-title class="pl-4">
        {{ $t('system.loadavg') }}
      </v-list-item-title>
      <v-simple-table style="border-radius:0;">
        <thead>
          <tr>
            <th class="text-center">{{ $t('system.1minute') }}</th>
            <th class="text-center">{{ $t('system.5minutes') }}</th>
            <th class="text-center">{{ $t('system.15minutes') }}</th>
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
    version() {
      return this.$store.state.version
    },
    system() {
      return this.$store.state.system
    },
    meminfo() {
      return this.$store.state.system.meminfo
    },
    diskusage() {
      return this.$store.state.system.diskusage
    },
    cpuinfo() {
      return this.$store.state.system.cpus
    },
    networkInterfaces() {
      return this.system.networkInterfaces || {}
    },
    available() {
      return {
        memory: this.meminfo
          ? {
              percent:
                (this.meminfo.MemAvailable / this.meminfo.MemTotal) * 100,
              available: this.meminfo.MemAvailable,
              total: this.meminfo.MemTotal,
              used: this.meminfo.MemTotal - this.meminfo.MemAvailable,
              units: 'kBytes'
            }
          : { percent: 0, kBytes: 0, total: 0, used: 0 },
        swap: this.meminfo
          ? {
              percent: (this.meminfo.SwapFree / this.meminfo.SwapTotal) * 100,
              available: this.meminfo.SwapFree,
              total: this.meminfo.SwapTotal,
              used: this.meminfo.SwapTotal - this.meminfo.SwapFree,
              units: 'kBytes'
            }
          : { percent: 0, kBytes: 0, total: 0 },
        storage: this.diskusage
          ? {
              percent: (this.diskusage.available / this.diskusage.total) * 100,
              available: this.diskusage.available,
              total: this.diskusage.total,
              used: this.diskusage.total - this.diskusage.available,
              units: 'bytes'
            }
          : { percent: 0, kBytes: 0, total: 0, used: 0 }
      }
    }
  },
  methods: {
    convertUnits(bytes, showUnit, units) {
      const sizes =
        units === 'bytes'
          ? ['bytes', 'KB', 'MB', 'GB', 'TB']
          : ['KB', 'MB', 'GB', 'TB']
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
