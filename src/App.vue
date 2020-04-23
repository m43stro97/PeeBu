<template>
  <v-app>
    <div>
      <v-toolbar
        dark
        prominent
        src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>PeeBu Software Quality</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>
      <LandingPage/>
    </div>
  </v-app>
</template>

<script>
import LandingPage from './components/LandingPage';

export default {
  name: 'App',

  components: {
    LandingPage,
  },

  data: () => ({
    //
  }),
};
</script>
