<template>
  <v-app>
    <AdminBar class="app-bar"/>
    <v-row class="main-app">
      <Navigation class="main-nav fill-height" />
      <v-main class="mx-10">
        <router-view/>
      </v-main>
    </v-row>

  </v-app>
</template>

<style scoped lang="scss">
    .main-app {
      padding-left: 15%;
      padding-top: 8rem;
    }

  .main-nav {
    width: 20%;
    position: fixed;
    top: 0;
    padding-top: 4rem;
    left: 0;
  }

  .app-bar {
    width: 100%;
    height: 7rem;
  }
</style>

<script>

import AdminBar from "./components/AdminBar";
import Navigation from "./components/Navigation";
export default {
  name: 'App',
  components: {Navigation, AdminBar},
  data: () => ({
    //
  }),
};
</script>
