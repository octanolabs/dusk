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
            :raise="selectedNetwork == network.networkId"
            class="mx-1"
            @click.stop="selectedNetwork = network.networkId"
          >
            <v-avatar tile color="#111" size="180">
              <img
                :src="
                  require('~/packages' + network.duskpkg.path + network.icon)
                "
                height="140"
                style="max-height:140px"
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
                  :raise="selectedNetwork == network.networkId"
                  class="mx-1"
                  @click.stop="selectedNetwork = network.networkId"
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
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      showTestnets: false,
      selectedNetwork: false,
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
    }
  }
}
</script>
