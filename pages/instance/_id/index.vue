<template>
  <v-container>
    <v-row v-if="!!instance">
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    </v-row>
    <v-row v-if="!!instance">
      <v-list two-line>
        <v-list-item>
          <v-list-item-avatar>
            <img
              :src="require('~/packages' + network.duskpkg.path + network.icon)"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ instance.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{
                network.name +
                  ' - ' +
                  instance.client.name +
                  ' v' +
                  instance.version
              }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-row>
    <v-tabs v-model="tab">
      <v-tab :key="0">
        Overview
      </v-tab>
      <v-tab :key="1">
        Settings
      </v-tab>
      <v-tab-item :key="0">
        <v-card v-if="!!instance">{{ instance.name }}</v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
  name: 'Instance',
  data() {
    return {
      instance: null,
      network: null,
      tab: null,
      breadcrumbs: [
        {
          text: 'Instances',
          disabled: false,
          to: '/'
        }
      ]
    }
  },
  created() {
    const instanceId = this.$route.params.id
    if (instanceId) {
      this.instance = this.$store.state.instances.find(function(
        value,
        index,
        arr
      ) {
        return value.id === instanceId
      })
      this.network = this.$store.state.packages.networks[
        this.instance.network.type
      ][this.instance.network.id]
      this.breadcrumbs.push({
        text: this.instance.name || instanceId,
        disabled: true,
        to: '/'
      })
    }
  }
}
</script>
