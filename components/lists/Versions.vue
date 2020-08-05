<template>
  <v-card>
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-list>
          <v-list-item>
            <v-list-item-avatar tile>
              <img
                v-if="client.icon"
                :src="require('~/packages' + client.duskpkg.path + client.icon)"
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
            :color="releases.length > 0 ? 'primary' : 'secondary'"
          >
            {{ client.platform }}
          </v-chip>
          <v-chip
            small
            label
            outlined
            :color="releases.length > 0 ? 'primary' : 'secondary'"
          >
            {{ releases.length }} release(s) available
          </v-chip>
        </v-card-actions>
      </div>
    </div>
    <v-divider />
    <v-list>
      <v-list-item v-for="item in releases" :key="item.version">
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
    <v-divider />
  </v-card>
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
