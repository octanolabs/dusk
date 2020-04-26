<template>
  <v-list two-line>
    <v-card>
      <div class="d-flex flex-no-wrap justify-space-between">
        <div>
          <v-card-title class="headline">
            {{ client.name }}
            <v-chip small color="primary" outlined label class="ml-3">
              {{ platform }}
            </v-chip>
          </v-card-title>
          <v-card-subtitle v-text="client.desc"></v-card-subtitle>
          <v-card-actions>
            <v-chip label outlined color="primary">
              {{ releases.length }} versions available
            </v-chip>
            <v-chip
              :color="downloaded > 0 ? 'primary' : 'secondary'"
              label
              outlined
              class="ml-2"
            >
              {{ downloaded }} versions downloaded
            </v-chip>
          </v-card-actions>
        </div>
        <v-avatar class="ma-3" size="125" tile>
          <v-img :src="require('~/static/clients/' + client.tag + '.png')" />
        </v-avatar>
      </div>
    </v-card>
    <v-divider />
    <template v-for="(item, key, index) in releases">
      <v-list-item :key="index">
        <v-list-item-avatar>
          <v-progress-circular
            v-if="item.status === 1"
            :rotate="-90"
            :size="100"
            :width="15"
            :value="item.progress"
            color="grey"
          />
          <v-icon v-if="!item.status === 0 && isDownloading" class="secondary">
            mdi-cloud-off-outline
          </v-icon>
          <v-icon
            v-if="!item.status || (item.status === 0 && !isDownloading)"
            class="secondary"
          >
            mdi-cloud-download-outline
          </v-icon>
          <v-icon v-if="item.status === -1" class="secondary">
            mdi-cloud-alert
          </v-icon>
          <v-icon v-if="item.status === 2" class="primary">
            mdi-cloud-check-outline
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            v{{ item.version }} - {{ item.tag }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ item.note }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text>
            {{ humanFileSize(item.download.size, true) }}
          </v-list-item-action-text>
          <a
            :href="
              'https://github.com/ubiq/go-ubiq/releases/tag/v' + item.version
            "
            target="_blank"
            style="text-decoration:none;"
          >
            <v-icon color="grey lighten-1">
              mdi-information-outline
            </v-icon>
          </a>
        </v-list-item-action>
      </v-list-item>
      <v-divider />
    </template>
  </v-list>
</template>

<script>
export default {
  props: {
    client: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    isDownloading() {
      return false
    },
    downloaded() {
      return this.client.downloaded
    },
    releases() {
      return this.client.releases || []
    },
    platform() {
      return this.$store.state.clientInfo.platform
    }
  },
  methods: {
    humanFileSize(bytes, si) {
      const thresh = si ? 1000 : 1024
      let u = -1
      let b = bytes
      if (Math.abs(bytes) < thresh) {
        return `${bytes} B`
      }

      const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

      do {
        b /= thresh
        u += 1
      } while (Math.abs(b) >= thresh && u < units.length - 1)

      return `${b.toFixed(2)} ${units[u]}`
    }
  }
}
</script>
