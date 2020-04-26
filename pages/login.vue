<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center mt-4">
        <logo />
        <h1 style="color:#6fceb7">
          octano<span style="color:#e76754">dusk</span>
        </h1>
      </div>
      <v-card>
        <form v-if="!authenticated" @submit.prevent="login">
          <v-card-text>
            <p v-if="formError" class="error">
              {{ formError }}
            </p>
            <v-text-field
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :rules="[rules.required]"
              @click:append="showPassword = !showPassword"
              v-model="formPassword"
              class="input-group--focused"
              label="passphrase"
              name="password"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" type="submit">
              Login
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data() {
    return {
      formError: null,
      formPassword: '',
      showPassword: false,
      rules: {
        required: (value) => !!value || 'Required.'
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
        this.formError = e.message
      }
    }
  }
}
</script>
