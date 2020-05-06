<template>
  <v-container>
    <v-tabs>
      <v-tab :key="0">Clients</v-tab>
      <v-tab-item :key="0">
        <v-card>
          <v-card-text>
            List clients here
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>
