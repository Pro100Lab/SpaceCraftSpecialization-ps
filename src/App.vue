<template>
  <v-app>
    <AdminBar v-if="authorized" class="app-bar" :exit="() => {authorized = false}"/>

    <template v-if="authorized">
      <Navigation class="main-nav fill-height"  />
      <v-main class="mx-10 main-app">
        <router-view/>
      </v-main>
    </template>
    <template v-else>
      <authorization :authorized-call-back="() => {authorized = true;}"></authorization>
    </template>
  </v-app>
</template>

<style>
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

    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(141, 35, 35, 0.3);
      -webkit-border-radius: 10px;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 10px;
      border-radius: 10px;
      background: rgba(203, 52, 52, 1);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }

    ::-webkit-scrollbar-thumb:window-inactive {
      background: rgba(238, 58, 58, 0.3);
    }

    .period-checked:hover {
      color: #00b8d4;
    }

</style>

<script>


import AdminBar from "./components/AdminBar";
import Navigation from "./components/Navigation";
import Authorization from "./views/Authorization";
import eventBus from "./utils/eventBus";

export default {
  name: 'App',
  components: {Authorization, Navigation, AdminBar},
  data: () => ({
    //
    authorized: false
  }),
  watch: {
    authorized() {
      if(!this.authorized) {
        window.localStorage.setItem('auth-token', null);
        eventBus.$emit('profile-set', {});
      }
    }
  }
};
</script>
