<template>
    <v-card
            width="256"
            class="mx-auto"
            dark
    >
        <v-navigation-drawer
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
                        v-for="item in items"
                        :key="item.title"
                        link
                        v-on:click="goTo(item.link)"
                >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-card>
</template>
<script>
    export default {
        name: "Navigation",
        data () {
            return {
                items: [
                    { title: 'Панель состояния', icon: 'mdi-speedometer', link: '/' },
                    { title: 'Каталог', icon: 'mdi-format-list-bulleted-square', link: '/catalog/product' },
                    { title: 'Продажи', icon: 'mdi-cart-variant', link: '/orders' }
                ],
                right: null,
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

</style>
