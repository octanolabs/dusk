<template>
  <v-bottom-sheet v-model="showme" persistent inset flat>
    <v-sheet class="text-center" flat>
      <v-flex style="position:relative">
        <v-btn
          color="secondary"
          fab
          absolute
          top
          right
          :disabled="spin"
          @click.stop="showme = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-tabs>
          <v-tab :key="0">{{ $t('account.account') }}</v-tab>
          <v-tab :key="1">{{ $t('account.changePassphrase') }}</v-tab>
          <v-tab-item :key="0">
            <form @submit.prevent="saveSettings">
              <v-flex class="pa-4">
                <v-row class="px-4">
                  <v-text-field
                    v-model="account.username"
                    class="input-group--focused"
                    :label="$t('account.username.label')"
                    name="username"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-divider
                    style="max-width:15px;margin-top:10px;margin-right:5px"
                  />
                  <v-subtitle>
                    {{ $t('account.attempts.title') }}
                  </v-subtitle>
                  <v-divider style="margin-top:10px;margin-left:5px" />
                </v-row>
                <v-row class="px-5">
                  <p>
                    <small>
                      {{ $t('account.attempts.info') }}
                    </small>
                  </p>
                </v-row>
                <v-row class="px-4">
                  <v-combobox
                    v-model="account.attempts"
                    :items="[3, 5, 8, 13, 21]"
                    :label="$t('account.attempts.label')"
                    outlined
                  ></v-combobox>
                </v-row>
                <v-row>
                  <v-divider
                    style="max-width:15px;margin-top:10px;margin-right:5px"
                  />
                  <v-subtitle>
                    {{ $t('account.locktime.title') }}
                  </v-subtitle>
                  <v-divider style="margin-top:10px;margin-left:5px" />
                </v-row>
                <v-row class="px-5">
                  <p>
                    <small>
                      {{ $t('account.locktime.info') }}
                    </small>
                  </p>
                </v-row>
                <v-row class="px-4">
                  <v-combobox
                    v-model="account.locktime"
                    :items="[180, 1800, 3600]"
                    :label="$t('account.locktime.label')"
                    outlined
                  ></v-combobox>
                </v-row>
                <v-divider />
                <v-row class="px-4">
                  <v-text-field
                    v-model="account.password"
                    class="input-group--focused"
                    :label="$t('account.passphrase.enter')"
                    name="password"
                    :append-icon="
                      account.showPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :type="account.showPassword ? 'text' : 'password'"
                    :rules="[rules.required]"
                    @click:append="account.showPassword = !account.showPassword"
                  ></v-text-field>
                </v-row>
                <v-row class="px-4">
                  <v-spacer />
                  <v-btn color="primary" type="submit" :disabled="spin">
                    <v-icon v-if="spin === true">mdi-cog mdi-spin</v-icon>
                    <span v-else>
                      <v-icon>mdi-content-save-settings</v-icon>
                      {{ $t('account.save') }}
                    </span>
                  </v-btn>
                </v-row>
              </v-flex>
              <v-snackbar
                v-model="snackbar.show"
                top
                right
                :color="snackbar.color"
              >
                {{ snackbar.text }}
                <v-btn dark text @click="snackbar = false">Close</v-btn>
              </v-snackbar>
            </form>
          </v-tab-item>
          <v-tab-item :key="1"></v-tab-item>
        </v-tabs>
      </v-flex>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import axios from 'axios'

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
      account: {
        attempts: this.$auth.user.maxAttempts,
        locktime: this.$auth.user.locktime,
        password: '',
        showPassword: false,
        username: this.$auth.user.username,
        locale: this.$auth.user.locale
      },
      passphrase: {
        current: '',
        new: '',
        confirm: '',
        bcrypt: 10
      },
      snackbar: {
        show: false,
        text: '',
        color: 'primary'
      },
      spin: false,
      rules: {
        required: (value) => !!value || this.$t('login.required'),
        minlen: (value) =>
          value.length >= 4 ? true : this.$t('account.username.minlen')
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
    },
    langs() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    }
  },
  methods: {
    saveSettings() {
      this.spin = true
      const self = this
      axios
        .post('/session/update-settings', {
          username: this.account.username,
          maxAttempts: this.account.attempts,
          locktime: this.account.locktime,
          password: this.account.password
        })
        .then(function(response) {
          if (!response.data.success) {
            self.snackbar.text = self.$t('account.updated.error')
            self.snackbar.show = true
            self.snackbar.color = 'secondary'
          } else {
            self.snackbar.text = self.$t('account.updated.success')
            self.snackbar.show = true
            self.snackbar.color = 'primary'
          }
          self.account.password = ''
          self.spin = false
        })
        .catch(function(e) {
          self.snackbar.text = self.$t(e)
          self.snackbar.show = true
          self.snackbar.color = 'secondary'
          self.account.password = ''
          self.spin = false
        })
    }
  }
}
</script>
