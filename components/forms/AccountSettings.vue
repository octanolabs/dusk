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
                    autocomplete="off"
                    :rules="[rules.required, rules.minlen]"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-divider
                    style="max-width:15px;margin-top:10px;margin-right:5px"
                  />
                  <v-subtitle>
                    {{ $t('account.locale.title') }}
                  </v-subtitle>
                  <v-divider style="margin-top:10px;margin-left:5px" />
                </v-row>
                <v-row class="px-5">
                  <p>
                    <small>
                      {{ $t('account.locale.info') }}
                    </small>
                  </p>
                </v-row>
                <v-row class="px-4">
                  <v-select
                    v-model="account.locale"
                    :items="langs"
                    :label="$t('account.locale.label')"
                    item-text="name"
                    item-value="code"
                    outlined
                    @change="changeLocale()"
                  ></v-select>
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
                      account.showPassphrase ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :type="showPassphrase ? 'text' : 'password'"
                    :rules="[rules.required]"
                    @click:append="showPassphrase = !showPassphrase"
                  ></v-text-field>
                </v-row>
                <v-row class="px-4">
                  <v-spacer />
                  <v-btn color="primary" type="submit" :disabled="spin">
                    <v-icon v-if="spin === true">mdi-cog mdi-spin</v-icon>
                    <span v-else>
                      <v-icon>mdi-content-save-settings</v-icon>
                      {{ $t('common.save') }}
                    </span>
                  </v-btn>
                </v-row>
              </v-flex>
            </form>
          </v-tab-item>
          <v-tab-item :key="1">
            <form @submit.prevent="changePassphrase">
              <v-flex class="pa-4">
                <v-row class="px-4">
                  <v-text-field
                    v-model="passphrase.new"
                    class="input-group--focused"
                    :label="$t('account.passphrase.new')"
                    name="newPassphrase"
                    :append-icon="showPassphrase ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassphrase ? 'text' : 'password'"
                    :rules="[rules.required, rules.mustContain]"
                    @click:append="showPassphrase = !showPassphrase"
                  ></v-text-field>
                </v-row>
                <v-row class="px-4">
                  <v-text-field
                    v-model="passphrase.confirm"
                    class="input-group--focused"
                    :label="$t('account.passphrase.confirm')"
                    name="confirmPassphrase"
                    :append-icon="showPassphrase ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassphrase ? 'text' : 'password'"
                    :rules="[rules.required, rules.mustMatch]"
                    @click:append="showPassphrase = !showPassphrase"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-divider
                    style="max-width:15px;margin-top:10px;margin-right:5px"
                  />
                  <v-subtitle>
                    {{ $t('account.bcrypt.title') }}
                  </v-subtitle>
                  <v-divider style="margin-top:10px;margin-left:5px" />
                </v-row>
                <v-row class="px-5">
                  <p>
                    <small>
                      {{ $t('account.bcrypt.info') }}
                    </small>
                  </p>
                </v-row>
                <v-row class="px-4">
                  <v-combobox
                    v-model="passphrase.bcrypt"
                    :items="[8, 10, 12, 14, 16]"
                    :label="
                      '2^' +
                        passphrase.bcrypt +
                        ' ' +
                        $t('account.bcrypt.label')
                    "
                    outlined
                  ></v-combobox>
                </v-row>
                <v-divider />
                <v-row class="px-4">
                  <v-text-field
                    v-model="passphrase.current"
                    class="input-group--focused"
                    :label="$t('account.passphrase.enter')"
                    name="currentPassphrase"
                    :append-icon="showPassphrase ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassphrase ? 'text' : 'password'"
                    :rules="[rules.required]"
                    @click:append="showPassphrase = !showPassphrase"
                  ></v-text-field>
                </v-row>
                <v-row class="px-4">
                  <v-spacer />
                  <v-btn color="primary" type="submit" :disabled="spin">
                    <v-icon v-if="spin === true">mdi-cog mdi-spin</v-icon>
                    <span v-else>
                      <v-icon>mdi-content-save-settings</v-icon>
                      {{ $t('common.save') }}
                    </span>
                  </v-btn>
                </v-row>
              </v-flex>
            </form>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-sheet>
    <v-snackbar v-model="snackbar.show" top right :color="snackbar.color">
      {{ snackbar.text }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
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
        username: this.$auth.user.username,
        locale: this.$i18n.locale
      },
      passphrase: {
        current: '',
        new: '',
        confirm: '',
        bcrypt: this.$auth.user.bcrypt
      },
      snackbar: {
        show: false,
        text: '',
        color: 'primary'
      },
      showPassphrase: false,
      testPassphrase: new RegExp(
        /^(?=.*\d)(?=(.*\W){2})(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,72}$/
      ),
      testUsername: new RegExp(/^([a-z]{4,32})$/),
      spin: false,
      rules: {
        required: (value) => !!value || this.$t('common.required'),
        minlen: (value) =>
          this.testUsername.test(value) || this.$t('account.username.minlen'),
        mustContain: (value) =>
          this.testPassphrase.test(value) ||
          this.$t('account.passphrase.validation'),
        mustMatch: (value) =>
          this.passphrase.new === value ||
          this.$t('account.passphrase.mustmatch')
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
      return this.$i18n.locales
    },
    lang() {
      return this.$i18n.locales[this.$i18n.locale]
    }
  },
  methods: {
    changeLocale() {
      this.$i18n.setLocale(this.account.locale)
    },
    saveSettings() {
      this.spin = true
      const self = this
      axios
        .post('/session/update-settings', {
          username: this.account.username,
          maxAttempts: this.account.attempts,
          locktime: this.account.locktime,
          password: this.account.password,
          locale: this.account.locale
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
    },
    changePassphrase() {
      this.spin = true
      const self = this
      axios
        .post('/session/change-passphrase', {
          new: this.passphrase.new,
          password: this.passphrase.current,
          bcrypt: this.passphrase.bcrypt
        })
        .then(function(response) {
          if (!response.data.success) {
            self.snackbar.text = self.$t('account.changed.error')
            self.snackbar.show = true
            self.snackbar.color = 'secondary'
          } else {
            self.snackbar.text = self.$t('account.changed.success')
            self.snackbar.show = true
            self.snackbar.color = 'primary'
          }
          self.passphrase.current = ''
          self.passphrase.new = ''
          self.passphrase.confirm = ''
          self.spin = false
        })
        .catch(function(e) {
          self.snackbar.text = self.$t(e)
          self.snackbar.show = true
          self.snackbar.color = 'secondary'
          self.passphrase.current = ''
          self.passphrase.new = ''
          self.passphrase.confirm = ''
          self.spin = false
        })
    }
  }
}
</script>
