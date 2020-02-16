<template>
  <v-layout>
    <v-col :cols="12" class="pa-2">
      <v-row no-gutters>
        <v-col :cols="6">
          <dashboard-peers />
        </v-col>
        <v-col :cols="6" class="pl-2">
          <dashboard-blocks />
        </v-col>
      </v-row>
    </v-col>
  </v-layout>
</template>

<script>
import DashboardBlocks from '~/components/dashboard/Blocks.vue'
import DashboardPeers from '~/components/dashboard/Peers.vue'

export default {
  // middleware: 'auth',
  components: {
    DashboardBlocks,
    DashboardPeers
  }
}
</script>
