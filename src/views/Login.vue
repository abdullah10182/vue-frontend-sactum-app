<template>
  <v-card class="elevation-1 pt-4">
    <v-form @submit.prevent="login()" ref="loginForm">
      <v-card-text>
        <v-text-field
          label="E-mail"
          name="login"
          v-model="email"
          :rules="emailRules"
          prepend-icon="mdi-account"
          type="email"
        ></v-text-field>
        <v-text-field
          id="password"
          label="Password"
          name="password"
          :rules="[(v) => !!v || 'Password is required']"
          prepend-icon="mdi-lock"
          v-model="password"
          type="password"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit" :loading="loader"
          >Login <v-icon right>mdi-arrow-right</v-icon></v-btn
        >
      </v-card-actions>
    </v-form>
  </v-card>
</template>


<script>
export default {
  data() {
    return {
      email: "",
      emailRules: [],
      password: "",
      loader: false,
    };
  },
  methods: {
    async login() {
      this.emailRules = [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ];
      setTimeout(() => {
        if (this.$refs.loginForm.validate()) {
          this.loader = true;
          this.$store
            .dispatch("getCsrfToken", {
              email: this.email,
              password: this.password,
            })
            .then((res) => {
              console.log(res);
              if (res) this.$router.push({ name: "Home" });
              this.loader = false;
            });
        }
      }, 0);
    },
  },
};
</script>
