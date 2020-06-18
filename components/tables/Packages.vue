<template>
  <v-data-table :headers="headers" :items="packages" :items-per-page="5" flat>
    <template v-slot:item.name="{ item }">
      <v-avatar size="28px" tile>
        <img
          v-if="item.icon"
          :src="require('~/packages' + item.path + item.icon)"
        />
        <v-icon v-else color="#222" v-text="O.o"></v-icon>
      </v-avatar>
      {{ item.name }}
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    packages: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      expanded: [],
      headers: [
        {
          text: this.$t('packages.name'),
          align: 'start',
          value: 'name'
        },
        { text: this.$t('packages.type'), value: 'type' },
        { text: this.$t('packages.version'), value: 'version' }
      ]
    }
  }
}
</script>
