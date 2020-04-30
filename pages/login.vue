<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center mt-12">
        <logo />
        <h1 style="color:#6fceb7">
          octano<span style="color:#e76754">dusk</span>
        </h1>
      </div>
      <v-card>
        <form v-if="!authenticated" @submit.prevent="login">
          <v-card-text>
            <v-text-field
              v-model="formPassword"
              class="input-group--focused"
              :label="$t('login.passphrase')"
              name="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :rules="[rules.required]"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" type="submit">
              {{ $t('login.login') }}
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
import Logo from '~/components/Logo.vue'

export default {
  nuxtI18n: {
    paths: {
      en: '/login',
      es: '/iniciar-sesion',
      ru: '/авторизоваться'
    }
  },
  components: {
    Logo
  },
  data() {
    return {
      formError: null,
      formPassword: '',
      showPassword: false,
      snackbar: false,
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
        await this.$auth.loginWith('local', {
          data: { username: 'dusk', password: this.formPassword }
        })
        this.formPassword = ''
        this.formError = null
        // this.$router.push({ path: '/dashboard' })
      } catch (e) {
        this.formError = this.$t('login.error')
        this.snackbar = true
        this.formPassword = ''
      }
    }
  }
}
</script>
