<template>
  <v-dialog v-model="show" fullscreen transition="dialog-bottom-transition">
    <template v-if="!list" v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" :disabled="state !== 20" v-on="on">
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
    <v-card v-if="instance">
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
      show: false
    }
  },
  computed: {
    state() {
      return this.instance?.supervisor.state
    },
    version() {
      return this.$store.state.version
    }
  },
  methods: {}
}
</script>
