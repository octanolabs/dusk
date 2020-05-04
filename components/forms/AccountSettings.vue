<template>
  <v-bottom-sheet v-model="showme" persistent inset flat>
    <v-sheet class="text-center" height="60vh" flat>
      <v-flex style="position:relative">
        <v-btn
          color="secondary"
          fab
          absolute
          top
          right
          @click.stop="showme = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-tabs>
          <v-tab :key="0">{{ $t('account.account') }}</v-tab>
          <v-tab :key="1">{{ $t('account.changePassphrase') }}</v-tab>
          <v-tab-item :key="0">
            <form @submit.prevent="login">
              <v-card-text>
                <v-col :cols="12">
                  <v-row>
                    <v-col :cols="12">
                      <v-text-field
                        v-model="username"
                        class="input-group--focused"
                        :label="$t('login.username')"
                        name="username"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col :cols="6">
                      <v-combobox
                        v-model="attempts"
                        :items="[3, 5, 8, 13, 21]"
                        :label="$t('account.attempts.title')"
                        outlined
                      ></v-combobox>
                    </v-col>
                    <v-col :cols="6">
                      <v-card outlined flat>
                        <v-card-title>
                          {{ $t('account.locktime.title') }}
                        </v-card-title>
                        <v-subtitle>
                          {{ $t('account.locktime.info') }}
                        </v-subtitle>
                        <v-combobox
                          v-model="locktime"
                          :items="[180, 1800, 3600]"
                          :label="$t('account.locktime.title')"
                          outlined
                        ></v-combobox>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-card-text>
            </form>
          </v-tab-item>
          <v-tab-item :key="1"></v-tab-item>
        </v-tabs>
      </v-flex>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  model: {
    prop: 'show',
    event: 'account-settings-state-change'
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      attempts: 5,
      locktime: 3600,
      password: '',
      username: 'dusk',
      spin: false,
      rules: {
        required: (value) => !!value || this.$t('login.required')
      }
    }
  },
  computed: {
    showme: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('account-settings-state-change', val)
      }
    }
  }
}
</script>
