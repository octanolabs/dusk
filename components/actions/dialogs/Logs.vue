<template>
  <v-dialog v-model="show" fullscreen transition="dialog-bottom-transition">
    <template v-if="!list" v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        @click="getInstanceLogs(instance.id)"
        v-on="on"
      >
        <v-icon>mdi-console</v-icon>
      </v-btn>
    </template>
    <template v-else v-slot:activator="{ on, attrs }">
      <v-list-item
        link
        v-bind="attrs"
        @click="getInstanceLogs(instance.id)"
        v-on="on"
      >
        <v-list-item-title>
          <v-icon>mdi-console</v-icon>
          Logs
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card v-if="instance">
      <v-toolbar flat>
        <v-btn color="secondary" fab small class="mr-4" @click="closeLogs()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ instance.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-list dense class="pa-0" style="max-width:235px;background:none;">
          <v-list-item class="pr-0">
            <v-list-item-avatar>
              <img src="~/static/octano.svg" />
            </v-list-item-avatar>
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
        <v-toolbar-items></v-toolbar-items>
      </v-toolbar>
      <v-card-text style="height: calc(100vh - 112px);" class="pa-0">
        <v-tabs v-model="tabs" background-color="transparent" grow>
          <v-tab key="0">
            stdout
          </v-tab>
          <v-tab key="1">
            stderr
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabs" style="height:100%;">
          <v-tab-item key="0" style="height:100%;">
            <template v-if="!returned">
              <v-skeleton-loader
                v-for="n in 6"
                :key="n"
                class="mx-auto mt-6"
                type="paragraph, sentences, paragraph, text, paragraph, sentences"
                max-height="600"
              />
            </template>
            <pre
              v-else
              style="width:100%;height:100%;display:flex;flex-direction:column-reverse;"
            >
              {{ instanceLogs[instance.id].stderr[0] || '' }}
            </pre>
          </v-tab-item>
          <v-tab-item key="1" style="height:100%;">
            <template v-if="!returned">
              <v-skeleton-loader
                v-for="n in 6"
                :key="n"
                class="mx-auto mt-6"
                type="paragraph, sentences, paragraph, text, paragraph, sentences"
                max-height="600"
              />
            </template>
            <pre v-else style="width:100%;height:100%;">
              {{ instanceLogs[instance.id].stdout[0] || '' }}
            </pre>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  middleware: 'auth',
  props: {
    instance: {
      type: Object,
      default() {
        return null
      }
    },
    list: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      show: false,
      tabs: null,
      returned: false
    }
  },
  computed: {
    instanceLogs() {
      return this.$store.state.logs || null
    },
    version() {
      return this.$store.state.version
    }
  },
  methods: {
    getInstanceLogs(instanceId) {
      const self = this
      const updateLogs = function(id) {
        self.$store.dispatch('getInstanceLogs', { id })
        if (self.instanceLogs[id]) {
          self.returned = true
        }
        if (
          self.instance?.supervisor?.state === 20 ||
          self.returned === false
        ) {
          setTimeout(function() {
            if (self.show) {
              updateLogs(id)
            }
          }, 1000)
        }
      }
      updateLogs(instanceId)
    },
    closeLogs() {
      this.$store.dispatch('getInstanceLogs', null) // reset
      this.returned = false
      this.show = false
    }
  }
}
</script>
