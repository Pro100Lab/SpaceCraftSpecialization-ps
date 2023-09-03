<template>
    <v-card class="fill-height elevation-0" color="white">
        <div class="mx-4" v-if="products && products.length > 0">
            <v-virtual-scroll
                    :bench="20"
                    :items="products"
                    height="800"
                    item-height="200"
                    style="overflow-x: hidden"
            >
                <template v-slot:default="{ item }">
                    <v-list-item :key="item.id">
                        <v-row style="width: 100%">
                            <v-col cols="10">
                                <HorizontalCard
                                        v-bind="{
                                idx: item.id,
                                title: item.title,
                                price: item.price,
                                source: item.images[0]
                                }"/>
                            </v-col>
                            <v-col cols="2" class="d-flex flex-row justify-center">
                                <v-row class="d-flex flex-row align-center justify-center">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon
                                                    color="red"
                                                    large
                                                    v-on="on"
                                                    v-bind="attrs"
                                                    v-on:click="deleteItem(item)"
                                            >
                                                mdi-trash-can-outline
                                            </v-icon>
                                        </template>
                                        <span>
                                            Удалить
                                        </span>
                                    </v-tooltip>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider/>
                </template>
            </v-virtual-scroll>
        </div>
        <v-card-title v-if="!products || products.length === 0"
                      class="d-flex flex-column align-center justify-center ">
            Нет избранных товаров!
        </v-card-title>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../../utils/settings";
    import HorizontalCard from "../products/HorizontalCard";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "FavouriteStackPanel",
        components: {HorizontalCard},
        data() {
            return {
                products: [],
            }
        },
        methods: {
            deleteItem(item) {
                axios.post(getURL(`product/update`), {id: item.id, placeholder: 'Favourite'}, {withCredentials: true}).then(
                    () => {
                        this.loadFavourite();
                        eventBus.$emit('product-updated', item.id, 'favourite');
                        eventBus.$emit('update-main-bar');
                    }
                )
            },
            loadFavourite() {
                axios.get(getURL('session/products/Favourite'), {withCredentials: true}).then(
                    response => {
                        const productsData = response.data;
                        this.products = productsData.products;
                    }
                )
            }
        },
        mounted() {
            this.loadFavourite();
        }
    }
</script>

<style scoped>

</style>
