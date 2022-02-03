<template>
  <v-app :style="{'background-color': '#e0dede'}">
    <div>
        <MainAppBar
                v-bind:on-cart-click="() => {openStackPanel('cart')}"
                v-bind:on-heart-click="() => {openStackPanel('heart')}"
                v-bind:on-abacus-click="() => {openStackPanel('abacus')}"
                v-bind:on-calculate-click="() => {openStackPanel('calculate')}"
        />
        <MinorAppBar/>
        <v-row align="center" class="my-lg-4">
            <v-overlay
                    style="position:fixed;"
                    :value="stackPanelOpts.show"
                    v-on:click="closeStackPanel"
                    :absolute="true"
            >
            </v-overlay>
            <v-main>
                <router-view/>
            </v-main>
            <transition name="slide-fade">
                <StackPanel class="main__stack-panel-right" v-if="stackPanelOpts.show" v-bind="stackPanelName"/>
            </transition>
        </v-row>

    </div>
  <Footer class="main__footer"/>
  </v-app>
</template>

<style lang="scss">
    .slide-fade-enter-active {
        transition: all .3s;
    }
    .slide-fade-leave-active {
        transition: all .3s;
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(200px);
        opacity: 0;
    }

    .main__stack-panel-right {
        position: fixed;
        right: 0;
        top: 0;
        height: 100%;
        width: 25%;
        z-index: 100;
    }

    .main__footer {
        /*position: absolute;*/
        /*bottom: 0;*/
        width: 100%;
    }
</style>

<script>
import MainAppBar from "./components/MainAppBar";
import MinorAppBar from "./components/MinorAppBar";
import Footer from "./components/Footer";
import StackPanel from "./components/stack-panels/StackPanel";

export default {
  name: 'App',
  components: {StackPanel, Footer, MinorAppBar, MainAppBar},
  data: () => ({
    stackPanelOpts: {
        show: false,
        name: ''
    },
      stackPanelNames: {

      }
  }),
    methods: {
      openStackPanel(contentType) {
          this.stackPanelOpts.show = true;
          this.stackPanelOpts.name = contentType;
          return contentType;
      },
        closeStackPanel() {
          this.stackPanelOpts.show = false;
        }
    },
    computed: {
      stackPanelName: function () {
          return this.stackPanelOpts.name;
      }
    }
};
</script>
