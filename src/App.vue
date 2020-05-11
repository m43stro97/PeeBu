<template>
  <div id="app" class="container-fluid">
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" :src="bg" app>
        <v-list dense nav class="py-0">
          <v-list-item two-line :class="miniVariant && 'px-0'">
            <v-list-item-avatar> </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="white--text">PeeBu</v-list-item-title>
              <v-list-item-subtitle class="white--text"
                >Project of Quality Software</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-for="item in items" :key="item.title" :to="item.url">
            <v-list-item-icon color="white">
              <v-icon color="white">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="white--text">
                {{item.title}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- <v-list-item>
            <v-list-item-icon>
              <v-icon color="white">mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text">
                {{item.title}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item> -->
        </v-list>
      </v-navigation-drawer>
      <v-app-bar
        app
        fixed
        dense
        src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        prominent
      >
        <v-app-bar-nav-icon
          class="white--text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-toolbar-title class="white--text">
          PeeBu
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-content fill-height fluid>
        <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    drawer: false,
    items: [
      { title: "Home", icon: "mdi-home", url: "/"},
      { title: "Statistics", icon: "mdi-chart-line" , url: "/statistics"}
    ],
    miniVariant: false,
    expandOnHover: false,
    background: true,
  }),
  computed: {
    bg() {
      return this.background
        ? "https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        : undefined;
    },
  },
};
</script>
