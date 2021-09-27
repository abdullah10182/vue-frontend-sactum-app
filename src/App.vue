<template>
  <v-app>
    <v-main>
      <v-app-bar dense elevation="1">
        <v-toolbar-title></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="$store.dispatch('logout')" small> logout</v-btn>
      </v-app-bar>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
