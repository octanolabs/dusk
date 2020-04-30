<template>
  <v-layout>
    <v-col :cols="12" class="pa-2">
      <v-tabs v-model="tab">
        <v-tab v-for="client in clients" :key="client.tag">
          {{ client.name }}
        </v-tab>
        <v-tab-item v-for="client in clients" :key="client.tag">
          <v-card>
            <versions :client="client" />
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-layout>
</template>

<script>
import Versions from '~/components/lists/Versions'

export default {
  name: 'Clients',
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
      return this.$store.state.clientInfo.clients
        ? this.$store.state.clientInfo.clients
        : []
    }
  }
}
</script>
