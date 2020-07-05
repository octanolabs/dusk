<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center mt-12">
        <octano-logo />
        <h1 style="color:#6fceb7">
          octano<span style="color:#e76754">dusk</span>
        </h1>
      </div>
      <v-card>
        <form v-if="!authenticated" autocomplete="off" @submit.prevent="login">
          <v-card-text>
            <v-text-field
              v-model="formUsername"
              class="input-group--focused"
              :label="$t('login.username')"
              name="username"
              :rules="[rules.required]"
              autocomplete="off"
            ></v-text-field>
            <v-text-field
              v-model="formPassword"
              class="input-group--focused"
              :label="$t('login.passphrase')"
              name="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :rules="[rules.required]"
              autocomplete="off"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" type="submit" :disabled="spin">
              <v-icon v-if="spin === true">mdi-cog mdi-spin</v-icon>
              <span v-else>{{ $t('login.login') }}</span>
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-flex>
    <v-snackbar v-model="snackbar" top right color="secondary">
      {{ formError }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import OctanoLogo from '~/components/Logo.vue'

export default {
  components: {
    OctanoLogo
  },
  data() {
    return {
      formError: null,
      formPassword: '',
      formUsername: '',
      showPassword: false,
      snackbar: false,
      spin: false,
      rules: {
        required: (value) => !!value || this.$t('login.required')
      }
    }
  },
  computed: {
    authenticated() {
      return this.$store.state.authenticated
    }
  },
  methods: {
    async login() {
      try {
        this.spin = true
        await this.$auth.loginWith('local', {
          data: { username: this.formUsername, password: this.formPassword }
        })
        this.formPassword = ''
        this.formError = null
        this.spin = false
        this.$router.push({ path: '/' })
      } catch (e) {
        this.formError = this.$t('login.error')
        this.snackbar = true
        this.formPassword = ''
        this.spin = false
      }
    }
  }
}
</script>
