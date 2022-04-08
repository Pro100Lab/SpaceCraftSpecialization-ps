<template>
  <v-app>
    <AdminBar class="app-bar"/>
      <Navigation class="main-nav fill-height" />
      <v-main class="mx-10 main-app">
        <router-view/>
      </v-main>
  </v-app>
</template>

<style scoped lang="scss">
    .main-app {
      position: absolute;
      width: 80vw;
      left: 15vw;
      top: 5rem;
    }

  .main-nav {
    position: absolute;
    top: 4rem;
    max-width: 15vw;
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
