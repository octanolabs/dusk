<template>
  <v-container>
    <v-row>
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    </v-row>
    <v-card class="px-1 py-2">
      <v-card-title class="py-1">
        <v-icon class="mx-1">mdi-lan</v-icon>
        Select a network
        <v-spacer />
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>
                show testnets
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="showTestnets"></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-card
            v-for="network in mainnets"
            :key="network.name"
            outlined
            style="display:inline-block;"
            hover
            ripple
            :raised="selectedNetwork === network.networkId"
            class="ma-1"
            @click.stop="
              selectedNetwork = network.networkId
              selectedNetworkType = 'mainnet'
              selectedClient = false
              selectedClientVersion = false
              filterClientsByNetwork()
            "
          >
            <v-avatar tile color="#111" size="180">
              <img
                :src="
                  require('~/packages' + network.duskpkg.path + network.icon)
                "
                height="140"
                style="max-height:140px"
                :class="{
                  grayscale:
                    selectedNetwork && selectedNetwork !== network.networkId
                }"
              />
            </v-avatar>
            <v-chip
              v-if="showTestnets"
              color="primary"
              label
              style="position:absolute;top:5px;left:5px;"
              small
            >
              MAINNET
            </v-chip>
            <v-chip
              v-if="showTestnets"
              color="default"
              label
              style="position:absolute;top:5px;right:5px;"
              small
            >
              {{ network.engine }}
            </v-chip>
            <v-card-text class="text-center">
              {{ network.name }}
            </v-card-text>
          </v-card>
          <v-flex shrink>
            <v-expand-x-transition>
              <div v-show="showTestnets" style="white-space: nowrap">
                <v-card
                  v-for="network in testnets"
                  :key="network.name"
                  outlined
                  style="min-width:182px;display:inline-block;"
                  hover
                  ripple
                  :raised="selectedNetwork === network.networkId"
                  class="ma-1"
                  @click.stop="
                    selectedNetwork = network.networkId
                    selectedNetworkType = 'testnet'
                    selectedClient = false
                    selectedClientVersion = false
                    filterClientsByNetwork()
                  "
                >
                  <v-avatar tile color="#111" size="180">
                    <img
                      :src="
                        require('~/packages' +
                          network.duskpkg.path +
                          network.icon)
                      "
                      height="140"
                      style="max-height:140px"
                      :class="{
                        grayscale:
                          selectedNetwork &&
                          selectedNetwork !== network.networkId
                      }"
                    />
                  </v-avatar>
                  <v-chip
                    color="secondary"
                    label
                    style="position:absolute;top:5px;left:5px;"
                    small
                  >
                    TESTNET
                  </v-chip>
                  <v-chip
                    color="default"
                    label
                    style="position:absolute;top:5px;right:5px;"
                    small
                  >
                    {{ network.engine }}
                  </v-chip>
                  <v-card-text class="text-center">
                    {{ network.name }}
                  </v-card-text>
                </v-card>
              </div>
            </v-expand-x-transition>
          </v-flex>
        </v-row>
      </v-card-text>
    </v-card>
    <v-flex shrink>
      <v-slide-y-transition>
        <v-card v-show="!!selectedNetwork" class="px-1 py-2 mt-2">
          <v-card-title class="py-1">
            <v-icon class="mx-1">mdi-cloud</v-icon>
            Select a client
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-card
                v-for="client in availableClients"
                :key="client.name"
                outlined
                style="display:inline-block;"
                hover
                :raised="selectedClient === client.name"
                class="ma-1"
              >
                <v-menu
                  bottom
                  origin="center center"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-list two-line>
                      <v-list-item v-on="on">
                        <v-list-item-avatar tile color="#111">
                          <img
                            :src="
                              require('~/packages' +
                                client.duskpkg.path +
                                client.icon)
                            "
                          />
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ client.name }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ selectedClientVersion }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon color="grey lighten-1">mdi-menu-down</v-icon>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </template>
                  <v-list>
                    <template v-for="(item, i) in client.releases">
                      <v-list-item
                        v-if="item.status > 0"
                        :key="i"
                        @click="
                          selectedClient = client.name
                          selectedClientVersion = item.version
                        "
                      >
                        <v-list-item-title>
                          {{ item.version }}
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-list>
                </v-menu>
              </v-card>
            </v-row>
          </v-card-text>
        </v-card>
      </v-slide-y-transition>
    </v-flex>
    <v-flex shrink>
      <v-slide-y-transition>
        <v-card
          v-show="!!selectedClient && !!selectedClientVersion"
          class="px-1 py-2 mt-2"
        >
          <v-card-title class="py-1">
            <v-icon class="mx-1">mdi-cogs</v-icon>
            Configure your client
          </v-card-title>
          <v-card-text></v-card-text>
        </v-card>
      </v-slide-y-transition>
    </v-flex>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      showTestnets: false,
      selectedNetwork: false,
      selectedNetworkType: 'mainnet',
      selectedClient: false,
      selectedClientVersion: false,
      availableClients: [],
      availableReleases: [],
      breadcrumbs: [
        {
          text: 'Instances',
          disabled: false,
          to: '/'
        },
        {
          text: 'Create',
          disabled: true,
          to: '/create'
        }
      ]
    }
  },
  computed: {
    mainnets() {
      return this.$store.state.packages.networks.mainnet || []
    },
    testnets() {
      return this.$store.state.packages.networks.testnet || []
    },
    clients() {
      return this.$store.state.packages.clients || []
    }
  },
  methods: {
    filterClientsByNetwork() {
      const network = this.$store.state.packages.networks[
        this.selectedNetworkType
      ][this.selectedNetwork]
      const supportedClients = network.clients
      this.availableClients = []
      for (const n in supportedClients) {
        for (const c in this.clients) {
          if (supportedClients[n] === this.clients[c].name) {
            this.availableClients.push(this.clients[c])
          }
        }
      }
    }
  }
}
</script>
