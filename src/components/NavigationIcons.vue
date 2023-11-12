<template>
    <v-sheet dark :style="cssProps">
        <v-card-actions  class="d-flex flex-row justify-space-around elevation-4">
            <div v-for="icon of navigationIcons" :key="`nav-icon-${icon.Name}`" class="d-flex flex-column align-center">
                <v-btn color="transparent" elevation="0" v-on:click="processNavigationIcon(icon)">
                    <div class="d-flex flex-column align-center">
                    <v-icon :color="icon.Color || 'black'">{{icon.Value}}</v-icon>
                    <h6>{{icon.Name}}</h6>
                    </div>
                </v-btn>
            </div>
        </v-card-actions>
    </v-sheet>
</template>

<script>
    import getLoader from "../utils/customizeOptions";
    import eventBus from "../utils/eventBus";
    import router from "../router";

    export default {
        name: "NavigationIcons",
        data: () => {
            return {
                navigationIcons: [],
                cssProps: {}
            }
        },
        computed: {
            isMobile: function() {
                return window.innerWidth < 960;
            }
        },
        methods: {
            processNavigationIcon(icon) {
                if(icon.StackPanel) {
                    eventBus.$emit('stack-panel-push', icon.StackPanel, {name: icon.Name} );
                } else if (icon.Link) {
                    eventBus.$emit('stack-panel-close');
                    router.push(icon.Link);
                }
            }
        },
        async beforeMount() {
            await getLoader().loadOptions();

            this.navigationIcons = getLoader().getAsObjects(['NavigationIcons', 'Icons']);
            this.cssProps = getLoader().getAsObject(['NavigationIcons', 'CSSProps'], this.isMobile)
            console.log('icons: ')
            console.log(this.navigationIcons);
        }
    }
</script>

<style scoped>

</style>
