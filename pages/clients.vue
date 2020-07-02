<template>
  <v-container>
    <v-tabs v-model="tab" grow>
      <v-tab v-for="client in clients" :key="client.tag">
        {{ client.name }}
      </v-tab>
      <v-tab-item v-for="client in clients" :key="client.tag">
        <v-card>
          <versions :client="client" />
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import Versions from '~/components/lists/Versions'

export default {
  middleware: 'auth',
  components: {
    Versions
  },
  data() {
    return {
      tab: null
    }
  },
  computed: {
    clients() {
      return this.$store.state.packages.clients || []
    }
  }
}
</script>
