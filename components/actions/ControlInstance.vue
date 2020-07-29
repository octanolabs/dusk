<template>
  <span v-if="!list">
    <v-btn v-if="state === 20" icon @click="stopInstance(instance.id)">
      <v-icon>mdi-stop-circle</v-icon>
    </v-btn>
    <v-btn v-else-if="state === 10 || state === 40" icon>
      <v-icon>mdi-cog mdi-spin</v-icon>
    </v-btn>
    <v-btn v-else icon @click="startInstance(instance.id)">
      <v-icon>mdi-play-circle</v-icon>
    </v-btn>
  </span>
  <span v-else>
    <v-list-item
      v-if="instance.supervisor.state === 20"
      link
      @click="stopInstance(instance.id)"
    >
      <v-list-item-title>
        <v-icon>mdi-stop-circle</v-icon>
        Stop
      </v-list-item-title>
    </v-list-item>
    <v-list-item v-else link @click="startInstance(instance.id)">
      <v-list-item-title>
        <v-icon>mdi-play-circle</v-icon>
        Start
      </v-list-item-title>
    </v-list-item>
  </span>
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
  computed: {
    state() {
      return this.instance?.supervisor.state || 0
    }
  },
  methods: {
    startInstance(instanceId) {
      this.$store.dispatch('startInstance', { id: instanceId })
    },
    stopInstance(instanceId) {
      this.$store.dispatch('stopInstance', { id: instanceId })
    }
  }
}
</script>
