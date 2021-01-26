<template>
  <v-app>
    <v-app-bar
      app
      color="white"
      white
    >
      <div class="d-flex align-center">
        <v-img
          alt="NAH Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo_nah_2.png"
          transition="scale-transition"
          width="60"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://nahelou.github.io/"
        target="_blank"
        text
      >
        <span class="mr-2">Projets</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
    <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
