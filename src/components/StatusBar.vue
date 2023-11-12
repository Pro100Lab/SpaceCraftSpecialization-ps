<template>
    <v-sheet dark :style="cssProps">
        <v-card-actions class="d-flex flex-row justify-space-around elevation-4">
            <v-icon v-on:click="navigateBack" v-if="backLink">
                mdi-chevron-left
            </v-icon>
            <search-bar/>
            <v-icon color="white" v-on:click="showChatStackPanel">mdi-chat-processing-outline</v-icon>
        </v-card-actions>
    </v-sheet>
</template>

<script>
    import SearchBar from "./utility/SearchBar";
    import getLoader from "../utils/customizeOptions";
    import eventBus from "../utils/eventBus";
    import router from "../router";
    import loader from "../utils/customizeOptions";

    export default {
        name: "StatusBar",
        components: {SearchBar},
        data: () => {
            return {
                back: null,
                name: '',
                cssProps: {},
                backLink: '',
                siteLogo: null,
                path: [],
            }
        },
        computed: {
            isMobile: function() {
                return window.innerWidth < 960;
            }
        },
        methods: {
            showChatStackPanel() {
                eventBus.$emit('stack-panel-push', 'chat_list');
            },
            navigateBack() {
                router.push(this.backLink);

                this.path.splice(this.path.length - 1, 1);
                this.makeBackLink();
            },
            makeBackLink() {
                if(this.path && this.path.length > 1) {
                    this.backLink = this.path[this.path.length - 2].href || this.path[this.path.length - 2].to;
                } else {
                    this.backLink = '';
                }
                console.log('nav - changed');
                console.log(this.backLink);
                console.log(this.path);
            }
        },
        async beforeMount() {
            await getLoader().loadOptions();

            this.cssProps = getLoader().getAsObject(['StatusBar', 'CSSProps'], this.isMobile);
            this.siteLogo = loader().getOption(['Header', 'MainBar', 'Logo', 'Image']);

            eventBus.$on('navigation-changed', path => {
                this.path = path;
                this.makeBackLink();
            })
        }
    }
</script>

<style scoped>

</style>
