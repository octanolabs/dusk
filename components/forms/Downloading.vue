<template>
  <v-bottom-sheet :value="show" hide-overlay persistent inset flat>
    <v-sheet class="text-center" height="100px" flat>
      <v-flex style="position:relative">
        <v-btn
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
    }
  },
  watch: {
    status(val) {
      if (val === true) {
        this.sync = true
        this.show = true
        this.poll()
      } else {
        this.sync = false
        const t = this
        setTimeout(function() {
          t.show = false
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
      }, 1000)
    }
  }
}
</script>
