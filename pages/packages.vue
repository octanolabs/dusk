<template>
  <v-container>
    <v-tabs>
      <v-tab :key="0">Packages</v-tab>
      <v-tab :key="1">Custom</v-tab>
      <v-tab-item :key="0">
        <v-card>
          <v-card-text>
            <packages-table :packages="packages" />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :key="1">
        <v-card>
          <v-card-text>
            <packages-table :packages="custom" />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import PackagesTable from '~/components/tables/Packages.vue'

export default {
  middleware: 'auth',
  components: {
    PackagesTable
  },
  computed: {
    packages() {
      return this.$store.state.packages.octano || []
    },
    custom() {
      return this.$store.state.packages.custom || []
    }
  }
}
</script>
