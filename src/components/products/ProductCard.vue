<template>
    <v-card>
        <v-hover v-slot="{ hover }">
            <v-card
                    :elevation="hover ? 6 : 0"
                    width="250"
                    class="d-flex flex-column fill-height">
                <v-img
                        height="150"
                        contain
                        :src="images ? images[0] : 'https://www.lg.com/ru/images/air-conditioners-split-systems/md05959896/gallery/medium01.jpg'"
                        alt=""
                        style="cursor: zoom-in"
                        v-on:click="actions.onProductView(id, title, description)"
                />
                    <v-card-title
                            style="font-size: 15px; line-height: 19px; cursor: pointer"
                            class="text-left text-wrap text-break"
                            v-on:click="actions.goToProduct(id)"
                    >
                        {{title}}
                    </v-card-title>
                <v-divider></v-divider>
                <v-card-actions class="mx-2">
                    <span><strong>{{normalizePrice(price)}} Руб.</strong></span>
                    <v-spacer/>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="mx-2"
                                    v-bind="attrs"
                                    v-on="on"
                                    :color="favourite ? 'red': 'gray'"
                                    v-on:click="actions.onHeartClick(id)"
                            >mdi-heart</v-icon>
                        </template>
                        <span>
                            В избранное
                        </span>
                    </v-tooltip>
                    <v-tooltip top >
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="mx-2"
                                    v-bind="attrs"
                                    v-on="on"
                                    :color="compare ? 'orange': 'gray'"
                                    v-on:click="actions.onAbacusClick(id)"
                            >mdi-abacus</v-icon>
                        </template>
                        <span>
                            Сравнить
                        </span>
                    </v-tooltip>
                </v-card-actions>
                <v-btn
                        class="rounded-t-0"
                        color="blue"
                        v-on:click="actions.onCartClick(id)"
                > Добавить в корзину</v-btn>
            </v-card>
        </v-hover>
    </v-card>
</template>

<script>
    import {normalizePrice} from "../../settings";
    import eventBus from "../../eventBus";

    export default {
        name: "ProductCard",
        props: ['id', 'title', 'description', 'images', 'price', 'actions', 'favourite', 'compare'],
        data: () => {
            return {
                eventBus
            }
        },
        methods: {
            normalizePrice
        }
    }
</script>

<style scoped>

</style>
