<template>
    <v-app :style="cssProps">
        <div>
            <!--<header>-->
            <InfoPanel class="main__info-panel"/>
            <MainAppBar class="main__app-bar"/>
            <MinorAppBar class="minor__app-bar"/>
            <!--<header/>-->

            <!--<router/main view>-->
            <v-row class="my-lg-4 responsiveContainer">
                <v-main>
                    <router-view :key="$route.fullPath"/>
                </v-main>
            </v-row>
            <!--<router/main view>-->

            <Footer/>

            <!--<absolute components>-->
            <ShortCuts/>
            <StackPanel/>
            <SnackController/>
            <!--<absolute components/>-->
        </div>
    </v-app>
</template>

<style>
    :root {
        --index: calc(1vh + 1vw);
    }

    .main__info-panel {
        position: absolute;
        top: 0;
        height: calc(var(--index) * 2);
        z-index: 3;
        width: 100%;
    }

    .main__app-bar {
        position: absolute;
        top: calc(var(--index) * 2);
        height: calc(var(--index) * 8);
        width: 100%;
    }

    .minor__app-bar {
        position: absolute;
        top: calc(var(--index) * 10);
        height: calc(var(--index) * 2);
        width: 100%;
    }

    .responsiveContainer {
        padding-bottom: var(--index);
        padding-top: calc(var(--index) * 12.5);
        margin: 0 auto;
        min-height: 40vh;
    }

    @media screen and (max-width: 1280px) {
        .main__info-panel {
            height: calc(var(--index) * 3);
        }

        .main__app-bar {
            top: calc(var(--index) * 3);
            height: calc(var(--index) * 8);
        }

        .minor__app-bar {
            top: calc(var(--index) * 11);
            height: calc(var(--index) * 4);
        }

        .responsiveContainer {
            padding-bottom: var(--index);
            padding-top: calc(var(--index) * 16);
        }
    }

    @media screen and (max-width: 960px) {
        .main__info-panel {
            height: calc(var(--index) * 2.5);
        }

        .main__app-bar {
            top: calc(var(--index) * 2.5);
            height: calc(var(--index) * 8);
        }

        .minor__app-bar {
            top: calc(var(--index) * 10.5);
            height: calc(var(--index) * 6.5);
        }

        .responsiveContainer {
            padding-bottom: var(--index);
            padding-top: calc(var(--index) * 18);
        }
    }

    #helpers-left .v-icon:not(.on-hover) {
        color: gray;
    }

    #helpers-left .v-icon:hover {
        color: blue
    }

    #helpers-right .v-icon:not(.on-hover) {
        color: white;
    }

    #helpers-right .v-icon:hover {
        color: blue
    }
</style>

<script>
    import MainAppBar from "./components/head/MainAppBar";
    import MinorAppBar from "./components/head/MinorAppBar";
    import Footer from "./components/Footer";
    import StackPanel from "./components/stack-panels/StackPanel";
    import SnackController from "./components/utility/SnackController";
    import InfoPanel from "./components/head/InfoPanel";
    import ShortCuts from "./components/utility/ShortCuts";

    export default {
        name: 'App',
        components: {ShortCuts, InfoPanel, SnackController, StackPanel, Footer, MinorAppBar, MainAppBar},
        data: () => ({
            cssProps: {
                // background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${require('@/assets/background.png')})`,
                background: `url(${require('@/assets/background.png')})`,
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundColor: 'black'
            },

        }),
    };
</script>
