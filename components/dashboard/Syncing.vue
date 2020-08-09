<template>
  <div>
    <v-col :cols="12" class="pa-0 h-100">
      <v-flex
        class="d-flex flex-column align-center align-self-center"
        style="padding-top:128px;"
      >
        <v-row no-gutters>
          <v-subheader>
            {{ $tc('geth.dashboard.syncingFrom', startingBlock) }}
          </v-subheader>
        </v-row>
        <v-row no-gutters class="pb-2">
          <v-progress-circular
            :value="percent"
            :size="200"
            :width="21"
            color="primary"
            rotate="-90"
          >
            {{ percent.toFixed(2) }}%
          </v-progress-circular>
        </v-row>
        <v-row no-gutters>
          <v-subheader>
            {{
              $tc('geth.dashboard.syncingCurrent', 0, {
                current: currentBlock,
                highest: highestBlock
              })
            }}
          </v-subheader>
        </v-row>
        <v-row no-gutters>
          {{ $t('geth.dashboard.syncingMessage') }}
        </v-row>
      </v-flex>
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    provider: {
      type: Object,
      default() {
        return null
      }
    }
  },
  computed: {
    currentBlock() {
      return this.provider?.syncing?.currentBlock || null
    },
    highestBlock() {
      return this.provider?.syncing?.highestBlock || null
    },
    startingBlock() {
      return this.provider?.syncing?.startingBlock
    },
    percent() {
      return (this.currentBlock / this.highestBlock) * 100
    }
  }
}
</script>
