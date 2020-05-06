<template>
  <v-container>
    <v-tabs>
      <v-tab :key="0">Instances</v-tab>
      <v-tab :key="0">Networks</v-tab>
      <v-tab-item :key="0">
        <v-btn absolute dark fab top right color="primary">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-card>
          <v-card-text>
            List instances here
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item :key="1">
        <v-card>
          <v-card-text>
            <networks-table />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import NetworksTable from '~/components/tables/Networks'

export default {
  middleware: 'auth',
  components: {
    NetworksTable
  }
}
</script>
