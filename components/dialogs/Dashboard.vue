<template>
  <v-dialog
    v-model="show"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" :disabled="state !== 20" v-on="on">
        <v-icon>mdi-desktop-mac-dashboard</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  middleware: 'auth',
  props: {
    instanceId: {
      type: String,
      default() {
        return ''
      }
    },
    state: {
      type: Number,
      default() {
        return 0
      }
    },
    provider: {
      type: String,
      default() {
        return 'geth'
      }
    },
    ipcPath: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {}
}
</script>
