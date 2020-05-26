<template>
  <v-container>
    <v-row>
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    </v-row>
    <v-alert type="info">
      Packages enable support for new networks, clients and interfaces. By
      default Dusk includes a number of packages, however you can easily add
      your own custom packages for additional support.
    </v-alert>
    <v-tabs>
      <v-tab :key="0">Default</v-tab>
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
  data() {
    return {
      breadcrumbs: [
        {
          text: 'Dusk',
          disabled: false,
          to: '/'
        },
        {
          text: 'Packages',
          disabled: true,
          to: '/packages'
        }
      ]
    }
  },
  computed: {
    packages() {
      return this.$store.state.packages.default || []
    },
    custom() {
      return this.$store.state.packages.custom || []
    }
  }
}
</script>
