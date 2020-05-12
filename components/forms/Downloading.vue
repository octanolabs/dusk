<template>
  <v-bottom-sheet :value="show" hide-overlay persistent inset flat>
    <v-sheet class="text-center" height="100px" flat>
      <v-flex style="position:relative">
        <v-btn
          v-if="show && !sync"
          color="primary"
          fab
          absolute
          top
          right
          small
          @click.stop="show = false"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-subtitle></v-subtitle>
      </v-flex>
      <v-list two-line>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title v-if="show && !sync">
              Downloading complete
            </v-list-item-title>
            <v-list-item-title v-else>
              Downloading...
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ downloading.client }} v{{ downloading.version }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-progress-linear
        color="primary"
        height="10"
        :value="percent * 100"
        striped
      ></v-progress-linear>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  data() {
    return {
      sync: false,
      show: false
    }
  },
  computed: {
    status() {
      return this.$store.state.downloading.status
    },
    downloading() {
      return this.$store.state.downloading
    },
    percent() {
      return this.$store.state.downloading.download
        ? this.$store.state.downloading.download.percent
        : 0
    }
  },
  watch: {
    status(val) {
      console.log('download status changed: ' + val)
      if (val === true) {
        this.sync = true
        this.show = true
        this.poll()
      } else {
        this.sync = false
        this.$store.dispatch('packages')
        const t = this
        setTimeout(function() {
          t.show = false
          t.$store.dispatch('downloadComplete')
        }, 5000)
      }
    }
  },
  methods: {
    poll() {
      const t = this
      setTimeout(function() {
        t.$store.dispatch('downloading')
        if (t.sync === true) {
          t.poll()
        }
      }, 500)
    }
  }
}
</script>
