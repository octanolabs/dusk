<template>
  <v-container>
    <v-row>
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    </v-row>
    <v-card style="background-color:#363636">
      <v-tabs v-model="tab" vertical>
        <v-tab v-for="client in clients" :key="client.tag">
          {{ client.name }}
        </v-tab>
        <v-tab-item v-for="client in clients" :key="client.tag">
          <v-card flat tile class="mb-1">
            <v-list>
              <v-list-item>
                <v-list-item-avatar tile>
                  <img
                    v-if="client.icon"
                    :src="
                      require('~/packages' + client.duskpkg.path + client.icon)
                    "
                  />
                  <v-icon v-else color="#222" v-text="O.o"></v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ client.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ client.desc }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-chip
                small
                outlined
                label
                class="mr-1"
                :color="client.releases.length > 0 ? 'primary' : 'secondary'"
              >
                {{ client.platform }}
              </v-chip>
              <v-chip
                small
                label
                outlined
                :color="client.releases.length > 0 ? 'primary' : 'secondary'"
              >
                {{ client.releases.length }}
                {{ $tc('clients.available', client.releases.length) }}
              </v-chip>
            </v-card-actions>
          </v-card>
          <v-card flat tile class="mt-0">
            <versions :client="client" />
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
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
      tab: null,
      breadcrumbs: [
        {
          text: this.$t('clients.title'),
          disabled: true,
          to: '/'
        },
        {
          text: this.$t('clients.releases'),
          disabled: true
        }
      ]
    }
  },
  computed: {
    clients() {
      return this.$store.state.packages.clients || []
    },
    releases() {
      return this.client.releases || []
    }
  }
}
</script>
