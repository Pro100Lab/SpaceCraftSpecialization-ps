<template>
    <v-sheet dark :style="cssProps">
        <v-card-actions  class="d-flex flex-row justify-space-around elevation-4">
            <div v-for="icon of navigationIcons" :key="`nav-icon-${icon.Name}`" class="d-flex flex-column align-center">
                <v-btn color="transparent" elevation="0" v-on:click="processNavigationIcon(icon)">
                    <template v-if="icon.Name === 'Корзина'">
                        <div class="d-flex flex-column align-center">

                            <v-badge color="red" dot overlap top :content="cart" :value="cart > 0">
                                <v-icon :color="icon.Color || 'black'">{{icon.Value}}</v-icon>
                            </v-badge>
                            <h6>{{icon.Name}}</h6>
                        </div>

                    </template>
                    <template v-else>
                        <div class="d-flex flex-column align-center">
                            <v-icon :color="icon.Color || 'black'">{{icon.Value}}</v-icon>
                            <h6>{{icon.Name}}</h6>
                        </div>
                    </template>
                </v-btn>
            </div>
        </v-card-actions>
    </v-sheet>
</template>

<script>
    import getLoader from "../utils/customizeOptions";
    import eventBus from "../utils/eventBus";
    import router from "../router";
    import axios from "axios";
    import {getURL} from "../utils/settings";

    export default {
        name: "NavigationIcons",
        data: () => {
            return {
                navigationIcons: [],
                cssProps: {},
                cart: 0,
                viewed: 0,
                compare: 0,
                favourite: 0,
            }
        },
        computed: {
            isMobile: function() {
                return window.innerWidth < 960;
            }
        },
        mounted() {
            this.loadUserInfo();
            eventBus.$on('update-main-bar', () => {
                this.loadUserInfo();
            })
        },
        methods: {
            loadUserInfo() {
                axios.get(getURL('session'), {withCredentials: true})
                    .then(response => {
                        const session_info = response.data;
                        this.cart = session_info.cart;
                        this.viewed = session_info.viewed;
                        this.compare = session_info.compare;
                        this.favourite = session_info.favourite;
                    });
                axios.get(getURL('session/products/Cart'), {withCredentials: true})
                    .then(response => {
                        const session_info = response.data;
                        this.cartSum = session_info['total_price'];
                    });
            },
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
