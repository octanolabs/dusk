<template>
  <v-container>
    <v-row v-if="!!instance">
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    </v-row>
    <v-row v-if="!!instance" no-gutters>
      <v-list two-line style="width:100%">
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
          <v-list-item-action>
            <v-btn icon><v-icon>mdi-console</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon><v-icon>mdi-power</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon><v-icon>mdi-restart</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon><v-icon>mdi-database-remove</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon><v-icon>mdi-trash-can-outline</v-icon></v-btn>
          </v-list-item-action>
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
        <v-col v-if="!!instance" :cols="12" class="d-flex">
          <v-col :cols="6">
            <v-card outlined>
              <v-card-title>Details</v-card-title>
              <v-card-text>
                <v-simple-table>
                  <template v-slot:default>
                    <tbody class="text-left">
                      <tr>
                        <th>name</th>
                        <td>{{ instance.name }}</td>
                      </tr>
                      <tr>
                        <th>id</th>
                        <td>{{ instance.id }}</td>
                      </tr>
                      <tr>
                        <th>client</th>
                        <td>{{ instance.client.name }}</td>
                      </tr>
                      <tr>
                        <th>version</th>
                        <td>{{ instance.version }}</td>
                      </tr>
                      <tr>
                        <th>network</th>
                        <td>{{ network.name }}</td>
                      </tr>
                      <tr>
                        <th>created</th>
                        <td>{{ new Date(instance.timestamp) }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="6">
            <v-card outlined class="pa-0">
              <v-card-title>Supervisor</v-card-title>
              <v-card-text>
                <v-simple-table>
                  <template v-slot:default>
                    <tbody class="text-left">
                      <tr>
                        <th>pid</th>
                        <td>{{ instance.supervisor.pid }}</td>
                      </tr>
                      <tr>
                        <th>group</th>
                        <td>{{ instance.supervisor.group }}</td>
                      </tr>
                      <tr>
                        <th>name</th>
                        <td>{{ instance.supervisor.name }}</td>
                      </tr>
                      <tr>
                        <th>state</th>
                        <td>{{ instance.supervisor.statename }}</td>
                      </tr>
                      <tr>
                        <th>stderr</th>
                        <td>{{ instance.supervisor.stderr_logfile }}</td>
                      </tr>
                      <tr>
                        <th>stdout</th>
                        <td>{{ instance.supervisor.stdout_logfile }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-col>
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
