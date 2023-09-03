<template>
    <v-card class="fill-height" color="white">
        <div class="mx-4" v-if="products && products.length > 0">
            <v-virtual-scroll
                    :bench="20"
                    :items="products"
                    height="800"
                    style="overflow-x: hidden"
                    item-height="130"
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
                                amount: item.amount,
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
            Нет товаров для сравнения!
        </v-card-title>
    </v-card>
</template>

<script>
    import HorizontalCard from "../products/HorizontalCard";
    import {getURL, normalizePrice} from "../../utils/settings";
    import axios from 'axios';
    import eventBus from "../../utils/eventBus";

    export default {
        name: "CompareStackPanel",
        components: {HorizontalCard},
        data: () => {
            return {
                products: []
            }
        },
        methods: {
            normalizePrice,
            deleteItem(item) {
                axios.post(getURL(`product/update`), {id: item.id, placeholder: 'Compare'},
                    {withCredentials: true})
                    .then(()=> {
                        this.loadCompare();
                        eventBus.$emit('product-updated', item.id, 'compare');
                        eventBus.$emit('update-main-bar');
                    })
            },
            loadCompare() {
                axios.get(getURL('session/products/Compare'), {withCredentials: true}).then(
                    response => {
                        const productsData = response.data;
                        this.products = productsData.products;
                    }
                )
            }
        },
        mounted() {
            this.loadCompare();
        }
    }
</script>

<style scoped>

</style>
