<template>
  <v-list>
    <v-list-item
      v-for="item in releases"
      :key="item.version"
      style="border-top:1px solid #363636;"
    >
      <v-list-item-avatar
        v-if="(item.status === 1 && !isDownloading) || isDownloading"
      >
        <v-icon v-if="item.status === 1" class="primary">
          mdi-cloud-check-outline
        </v-icon>
        <v-icon v-else class="secondary">
          mdi-cloud-sync-outline
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-avatar
        v-else
        style="cursor: pointer"
        @click.stop="downloadRelease(item)"
      >
        <v-icon
          v-if="!item.status || (item.status === 0 && !isDownloading)"
          class="secondary"
        >
          mdi-cloud-download-outline
        </v-icon>
        <v-icon v-else-if="item.status === -1" class="secondary">
          mdi-cloud-alert
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
        <a :href="item.info" target="_blank" style="text-decoration:none;">
          <v-icon color="grey lighten-1">
            mdi-information-outline
          </v-icon>
        </a>
      </v-list-item-action>
    </v-list-item>
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
  data() {
    return {
      errors: []
    }
  },
  computed: {
    isDownloading() {
      return this.$store.state.downloading.status
    },
    releases() {
      return this.client.releases || []
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
    },
    async downloadRelease(release) {
      try {
        await this.$store.dispatch('download', {
          client: this.client.name,
          version: release.version
        })
      } catch (e) {
        this.errors.push(e)
      }
    }
  }
}
</script>
