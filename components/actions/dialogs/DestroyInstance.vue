<template>
  <v-dialog v-model="show" width="500" persistent>
    <template v-if="!list" v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        :disabled="instance.supervisor.state === 20"
        v-on="on"
      >
        <v-icon color="secondary">mdi-delete</v-icon>
      </v-btn>
    </template>
    <template v-else v-slot:activator="{ on, attrs }">
      <v-list-item
        link
        :disabled="instance.supervisor.state === 20"
        v-bind="attrs"
        v-on="on"
      >
        <v-list-item-title>
          <v-icon color="secondary">mdi-delete</v-icon>
          Destroy Instance
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title primary-title>Destroy Instance</v-card-title>
      <v-card-text>
        <p>
          Are you sure you want to destroy
          <strong>{{ instance.name }}?</strong>
          <br />
          Enter <code class="elevation-0">{{ instance.id }}</code>
          to confirm.
        </p>
        <v-text-field
          v-model="confirm"
          class="input-group--focused"
          label="confirm"
          name="confirm"
          hide-details="auto"
          autocomplete="off"
          outlined
          dense
        ></v-text-field>
        <v-list dense>
          <v-list-item dense>
            <v-list-item-content v-if="instance">
              <v-list-item-title>Remove datadir</v-list-item-title>
              <v-list-item-subtitle v-if="instance.config">
                {{ instance.config.datadir }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="datadir.remove" />
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.stop="show = false">No</v-btn>
        <v-btn
          color="secondary"
          text
          :disabled="confirm !== instance.id"
          @click.stop="
            destroyInstance(instance.id)
            show = false
          "
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  middleware: 'auth',
  props: {
    instance: {
      type: Object,
      default() {
        return null
      }
    },
    list: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      show: false,
      confirm: '',
      datadir: {
        remove: false
      }
    }
  },
  methods: {
    destroyInstance(instanceId) {
      this.$store.dispatch('removeInstance', {
        id: instanceId,
        rmDatadir: this.datadir.remove
      })
    }
  }
}
</script>
