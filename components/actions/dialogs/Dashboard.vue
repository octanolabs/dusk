<template>
  <v-dialog
    v-if="!!instance"
    v-model="show"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <template v-if="!list" v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        :disabled="state !== 20"
        v-on="on"
        @click="fetch()"
      >
        <v-icon>mdi-desktop-mac-dashboard</v-icon>
      </v-btn>
    </template>
    <template v-else v-slot:activator="{ on, attrs }">
      <v-list-item link :disabled="state !== 20" v-bind="attrs" v-on="on">
        <v-list-item-title>
          <v-icon>mdi-desktop-mac-dashboard</v-icon>
          Dashboard
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card v-if="!!instance" style="background-color:#111">
      <v-toolbar flat>
        <v-btn color="secondary" fab small class="mr-4" @click="show = false">
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
      <v-col :cols="12" class="pa-2">
        <v-row v-if="!!provider" no-gutters>
          <v-col :cols="6"></v-col>
          <v-col :cols="6" class="pl-2">
            <dashboard-blocks :provider="provider" />
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
import DashboardBlocks from '~/components/dashboard/Blocks.vue'

export default {
  middleware: 'auth',
  components: {
    DashboardBlocks
  },
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
      returned: false
    }
  },
  computed: {
    state() {
      return this.instance?.supervisor?.state || 0
    },
    version() {
      return this.$store.state.version
    },
    provider() {
      return this.$store.state.providers[this.instance.id] || null
    }
  },
  methods: {
    fetch() {
      const self = this
      const updateProvider = function() {
        self.$store.dispatch('getProvider', self.instance)
        if (self.provider) {
          self.returned = true
        }
        if (
          self.instance?.supervisor?.state === 20 ||
          self.returned === false
        ) {
          setTimeout(function() {
            if (self.show) {
              updateProvider()
            }
          }, 2000)
        }
      }
      updateProvider()
    }
  }
}
</script>
