<template>
  <v-app>
    <v-app-bar
      app
      color="transparent"
      white
    >
      <div class="d-flex align-center">
        <v-img
          alt="NAH Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo_nah.png"
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
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>
