<template>
<!--  <v-app :style="{'background-color': '#e0dede'}">-->
    <v-app :style="cssProps">
    <div>
        <MainAppBar
                v-bind:on-cart-click="() => {openStackPanel('cart')}"
                v-bind:on-heart-click="() => {openStackPanel('favourite')}"
                v-bind:on-abacus-click="() => {openStackPanel('compare')}"
                v-bind:on-calculate-click="() => {openStackPanel('calculate')}"
        />
        <MinorAppBar/>
            <v-row align="center" class="my-lg-4 responsiveContainer">
                <v-main>

                    <router-view :key="$route.fullPath"/>
                </v-main>
            </v-row>
        <transition name="slide-fade">
            <div id="helpers" v-if="scY > 300" style="position: fixed; bottom: 20px; right: 40px; z-index: 1;">
                <v-icon
                        class="mx-2"
                        large
                        v-on:click="openStackPanel('cart')">mdi-cart</v-icon>
                <v-icon
                        class="mx-2"
                        large
                        v-on:click="openStackPanel('favourite')">mdi-heart</v-icon>
                <v-icon
                        class="mx-2"
                        large
                        v-on:click="openStackPanel('compare')">mdi-abacus</v-icon>
                <v-icon
                        class="mx-2"
                        large
                        :ripple="true"
                        v-on:click="toTop()">mdi-chevron-double-up</v-icon>
            </div>
        </transition>
        <v-overlay
              style="position:fixed;"
              :value="stackPanelOpts.show"
              v-on:click="closeStackPanel"
              :absolute="true"
        />
        <transition name="slide-fade">
          <StackPanel class="main__stack-panel-right"  v-if="stackPanelOpts.show" v-bind:panelName="stackPanelName"/>
        </transition>
        <SnackController/>
        <Footer class="main__footer"/>
    </div>
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
        z-index: 100;
        width: 40%;
    }

    .main__footer {
        position: absolute;
        bottom: 0;
        width: 100%;
    }

    .responsiveContainer {
        width: 100%;
        padding-bottom: 18rem;
    }
    #helpers .v-icon:not(.on-hover) {
        color: darkblue;
    }

    #helpers .v-icon:hover {
        color: blue
    }
</style>

<script>
import MainAppBar from "./components/MainAppBar";
import MinorAppBar from "./components/MinorAppBar";
import Footer from "./components/Footer";
import StackPanel from "./components/stack-panels/StackPanel";
import eventBus from "./eventBus";
import SnackController from "./components/SnackController";

export default {
  name: 'App',
  components: {SnackController, StackPanel, Footer, MinorAppBar, MainAppBar},
  data: () => ({
      cssProps: {
          backgroundImage: `url(${require('@/assets/background.png')})`,
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
      },
  scTimer: 0,
  scY: 0,
    stackPanelOpts: {
        show: false,
        name: '',
        width: 25
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
        },
        handleScroll: function () {
            if (this.scTimer) return;
            this.scTimer = setTimeout(() => {
                this.scY = window.scrollY;
                clearTimeout(this.scTimer);
                this.scTimer = 0;
            }, 100);
        },
        toTop: function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
        eventBus.$on('stack-panel-open', (panelName, panelWidth) => {
            this.stackPanelOpts.width = panelWidth || 25;
            this.openStackPanel(panelName);
        })
    },
    computed: {
      stackPanelName: function () {
          return this.stackPanelOpts.name;
      }
    }
};
</script>
