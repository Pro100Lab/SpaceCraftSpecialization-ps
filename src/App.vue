<template>
    <v-app :style="cssAppProps">
        <div>
            <!--<header>-->
            <template v-if="showHeader">
                <info-panel/>
                <main-app-bar/>
                <minor-app-bar/>
            </template>
            <template v-if="showStatusBar">
                <status-bar/>
            </template>
            <!--<router/main view>-->
            <v-main :style="cssBodyProps" style="min-height: 50vh;">
                <router-view :key="$route.fullPath"/>
            </v-main>
            <!--<router/main view>-->

            <template v-if="showFooter">
                <Footer/>
            </template>

            <!--<absolute components>-->
            <template v-if="showShortCuts">
                <short-cuts/>
            </template>

            <template v-if="showStackPanel">
                <stack-panel-controller/>
            </template>

            <template v-if="showSnackController">
                <snack-controller/>
            </template>

            <template v-if="showNavigationIcons">
                <navigation-icons></navigation-icons>
            </template>

            <product-view/>
            <!--<absolute components/>-->
        </div>
    </v-app>
</template>

<script>
    import MainAppBar from "./components/head/MainAppBar";
    import MinorAppBar from "./components/head/MinorAppBar";
    import Footer from "./components/Footer";
    import SnackController from "./components/utility/SnackController";
    import InfoPanel from "./components/head/InfoPanel";
    import ShortCuts from "./components/utility/ShortCuts";
    import loader from "./utils/customizeOptions";
    import NavigationIcons from "./components/NavigationIcons";
    import StatusBar from "./components/StatusBar";
    import StackPanelController from "./components/stack-panels/StackPanelController";
    import {getUser} from "./utils/profile";
    import ProductView from "./components/products/View";

    export default {
        name: 'App',
        components: {
            ProductView,
            StackPanelController,
            StatusBar,
            NavigationIcons, ShortCuts, InfoPanel, SnackController, Footer, MinorAppBar, MainAppBar},
        data: () => ({
            cssAppProps: {
            },
            cssBodyProps: {

            },
            showHeader: false,
            showFooter: false,
            showShortCuts: false,
            showStackPanel: false,
            showSnackController: false,
            showNavigationIcons: false,
            showHeaderMobile: false,
            showStatusBar: false,
        }),
        computed: {
            isMobile: function() {
                console.log('inner width: ', window.innerWidth)
                return window.innerWidth < 960;
            }
        },
        methods: {
            updateOptions() {
                const isMobile = window.innerWidth < 960;
                console.log('update options, is mobile: ', isMobile);
                this.cssBodyProps = loader().getAsObject(['Body', 'CSSProps'], isMobile);
                this.cssAppProps = loader().getAsObject(['App', 'CSSProps'], isMobile);

                // this.cssAppProps.background = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${require('@/assets/flagman-background.png')})`
                // this.cssAppProps.backgroundAttachment = 'fixed';
                this.showStatusBar = loader().getBool(['StatusBar'], isMobile);
                this.showHeader = loader().getBool(['Header'], isMobile);
                this.showFooter = loader().getBool(['Footer'], isMobile);
                this.showShortCuts = loader().getBool(['ShortCuts'], isMobile);
                this.showStackPanel = loader().getBool(['StackPanel'], isMobile);
                this.showSnackController = loader().getBool(['SnackController'], isMobile);
                this.showNavigationIcons = loader().getBool(['NavigationIcons'], isMobile);
            }
        },
        async beforeCreate() {
            await loader().loadOptions();

            this.updateOptions();

            getUser().trySession();
        },
        mounted() {
            window.addEventListener('resize', this.updateOptions);
        }
    };
</script>


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

    .hover-underline-animation {
        display: inline-block;
        position: relative;
        color: #ffffff;
    }

    .hover-underline-animation::after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 1px;
        bottom: 0;
        left: 0;
        background-color: #ebf8ff;
        transform-origin: bottom left;
        transition: transform 0.25s ease-out;
    }

    .hover-underline-animation:hover::after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }
</style>
