<template>
    <div>
        <v-overlay
                style="position:fixed"
                :value="showHelp"
                :absolute="true">
            <v-card light class="main__stack-panel-right"
                    style="cursor: default; z-index: 5"
                v-if="showHelp"
            >
                <v-card-actions>
                    <v-card-title>Справочник</v-card-title>
                    <v-spacer>

                    </v-spacer>
                    <v-btn class="transparent elevation-0" v-on:click="showHelp = false"><v-icon>mdi-close</v-icon>Закрыть</v-btn>
                </v-card-actions>
                <v-card-subtitle v-html="helpInfo">

                </v-card-subtitle>
            </v-card>
        </v-overlay>
        <v-card
                width="256"
                class="mx-auto fill-height"
                style="position: fixed"
                dark

        >
            <v-navigation-drawer
                    class="base__nav-drawer"
                    permanent>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="text-h6">
                            Меню
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list
                        dense
                        nav
                >
                    <v-list-item
                            v-for="item in itemsUpper"
                            :key="item.title"
                            link
                            v-on:click="goTo(item.link)"
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title style="font-size: 16px">{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider class="my-5" ></v-divider>

                    <v-list-item
                            v-for="item in itemsMiddle"
                            :key="item.title"
                            link
                            v-on:click="goTo(item.link)"
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title style="font-size: 16px">{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider class="my-5" ></v-divider>
                    <v-list-item
                            v-for="item in itemsBottom"
                            :key="item.title"
                            link
                            v-on:click="goTo(item.link)"
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title style="font-size: 16px">{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider class="my-5" ></v-divider>
                    <v-list-item
                            v-for="item in itemsActions"
                            :key="item.title"
                            link
                            v-on:click="goTo(item.link)"
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title style="font-size: 16px">{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-list
                        dense
                        nav
                >
                    <v-list-item
                            link v-on:click="showHelp = true"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-help</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title style="font-size: 16px">Справочник</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-card-subtitle>
                    Space Craft Constructor<br/>
                    Версия: 2.15.001
                </v-card-subtitle>
            </v-navigation-drawer>
        </v-card>
    </div>

</template>
<script>
    import eventBus from "../utils/eventBus";
    import axios from 'axios';
    import {getURL} from "../settings";

    export default {
        name: "Navigation",
        mounted() {
            eventBus.$on('help-closed', () => {
                this.showHelp = false;
            });
            axios.get(getURL('admin/draft/settings')).then(resp => {
                this.helpInfo = resp.data['Справочник'];
            })
        },
        data () {
            return {
                itemsUpper: [
                    { title: 'Панель состояния', icon: 'mdi-speedometer', link: '/' },
                    { title: 'Бронирования', icon: 'mdi-book-account-outline', link: '/orders' },
                    { title: 'Аналитика', icon: 'mdi-google-analytics', link: '/analyze' },
                    { title: 'Гостиница', icon: 'mdi-home-city', link: '/hotel' },
                ],
                itemsMiddle: [
                    { title: 'Страницы', icon: 'mdi-pan-top-left', link: '/information' },
                    { title: 'Вкладки', icon: 'mdi-pan-bottom-left', link: '/category' },
                ],
                itemsBottom: [
                    { title: 'Блоки', icon: 'mdi-clipboard-list-outline', link: '/blocks' },
                    { title: 'Контент', icon: 'mdi-image', link: '/content' }
                ],
                itemsActions: [
                ],
                groups: [this.itemsUpper, this.itemsMiddle, this.itemsBottom],
                right: null,
                showHelp: false,
                helpInfo: null,
            }
        },
        methods: {
            goTo(link) {
                this.$router.push(link);
            }
        }
    }
</script>

<style scoped>
    .main__stack-panel-right {
        position: fixed;
        overflow-y: auto;
        right: 0;
        top: 0;
        height: 100%;
        z-index: 10;
        width: 40vw;
        min-width: 480px;
    }

    .base__nav-drawer {
        background: rgb(121, 171, 172);
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%);
    }
</style>
