<template>
    <v-sheet color="transparent" class="category__all-controls">
        <v-card>
            <BreadCrumbs v-bind:crumbs="breadCrumbs"></BreadCrumbs>
        </v-card>
        <v-card>
            <v-row class="mt-4">
                <v-col cols="8">
                <v-carousel
                        style="width: 100%"
                        hide-delimiters
                        cycle
                >
                    <v-carousel-item
                            v-for="image of this.images"
                            :key="image" :src="image"
                            contain>
                    </v-carousel-item>
                </v-carousel>
                </v-col>
                <v-col cols="4" >
                    <div class="px-4 py-4">
                        <v-card-actions class="mx-2">
                            <v-spacer/>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="mx-2"
                                            v-bind="attrs"
                                            v-on="on"
                                            :color="favourite ? 'red' : 'gray'"
                                            v-on:click="onFavouriteClicked()"
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
                                            :color="compare ? 'orange' : 'gray'"
                                            v-on:click="onCompareClicked()"
                                    >mdi-abacus</v-icon>
                                </template>
                                <span>
                                Сравнить
                            </span>
                            </v-tooltip>
                        </v-card-actions>
                    <v-card-title class="my-2">
                        {{ this.title }}
                    </v-card-title>
                    <v-card-title class="mt-2">
                        <span><strong>{{price}} Руб.</strong></span>
                    </v-card-title>
                    <v-row class="mx-3">
                        <v-checkbox label="Требуется установка (+ 10 000 Руб)"/>
                        <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                                <v-icon
                                        v-on="on"
                                        v-bind="attrs"
                                        class="mx-2"
                                        small
                                        dense
                                >
                                    mdi-help-circle
                                </v-icon>
                            </template>
                            <span>
                            Базовый набор: 2 метра колючей проволоки + Работа мастера
                        </span>
                        </v-tooltip>
                    </v-row>
                    <v-row class="mx-4 mt-0 mb-2 d-flex flex-row align-center" style="font-size: 0.8rem; display: inline">
                        Обратите внимание, цена установки указана за <a href="/category/2">базовый набор.</a> Конечная цена складывается из необходимых расходных материалов
                    </v-row>
                    <v-card-subtitle>
                        {{ this.description }}
                    </v-card-subtitle>
                    <v-btn class="rounded-t-0" color="blue" block v-on:click="onCartClicked()"
                    > Добавить в корзину</v-btn>
                    <v-spacer/>
                    </div>
                </v-col>
            </v-row>
            <v-divider/>
            <v-row class="my-10">
                <v-col cols="8">
                    <h3 class="px-8">Описание товара</h3>
                    <v-card-text v-if="detailed" class="px-8">
                    {{this.detailed}}
                    </v-card-text>
                </v-col>
                <v-divider vertical/>
                <v-col cols="4">
                    <h3 class="text-center">Характеристики</h3>
                    <v-list class="mx-auto">
                        <div  v-for="(value, idx) in properties" :key="idx">
                            <v-divider class="mr-2 my-1"/>
                            <v-list-item>{{value}}</v-list-item>
                        </div>
                    </v-list>
                </v-col>
            </v-row>
        </v-card>
    </v-sheet>
</template>

<script>
    import BreadCrumbs from "../components/BreadCrumbs";
    import axios from 'axios';
    import {getURL, normalizePrice} from "../settings";
    import eventBus from "../eventBus";

    export default {
        name: "Product",
        components: {BreadCrumbs},
        data: () => {
            return {
                id: 0,
                breadcrumbs: [],
                title: '',
                description: '',
                detailed: '',
                price: '',
                images: [],
                properties: [],
                favourite: false,
                compare: false,
            }
        },
        beforeMount() {
            this.loadProduct();

            eventBus.$on('product-updated', () => {
                this.loadProduct();
            })
        },
        methods: {
            loadProduct() {
                axios.get(getURL(`product/${this.$route.params.product_id}`), {withCredentials: true})
                    .then(response => {
                        this.id = this.$route.params.product_id;
                        const product_info = response.data.product_info;
                        this.breadCrumbs = response.data.breadcrumbs;
                        this.title = product_info.title;
                        this.description = product_info.description;
                        this.detailed = product_info.detailed;
                        this.price = normalizePrice(product_info.price);
                        this.images = product_info.images || [];
                        this.favourite = product_info.favourite;
                        this.compare = product_info.compare;
                        for(const [key, value] of Object.entries(product_info.props)) {
                            if (key && key.length > 1 && value && value.length > 1) {
                                let new_line = `${key}: ${value}`;
                                this.properties.push(new_line);
                            }
                        }
                    });
            },
            onItemClick: function(text, linkName, link) {
                eventBus.$emit('snack-show', text, linkName, link);
            },
            updateProduct(placeholder, id) {
                axios.post(getURL('product/update'), {placeholder, id}, {withCredentials: true}).then(() => {
                    eventBus.$emit('update-main-bar');
                });
            },
            onFavouriteClicked() {
                this.favourite = !this.favourite;
                if( this.favourite ) {
                    this.onItemClick('Товар добавлен в избранное', 'открыть избранное', 'favourite');
                }
                this.updateProduct('Favourite', this.id);
            },
            onCompareClicked() {
                this.compare = !this.compare;
                if (this.compare ) {
                    this.onItemClick('Товар добавлен в сравнения', 'открыть сравнения', 'compare');
                }
                this.updateProduct('Compare', this.id);
            },
            onCartClicked() {
                this.onItemClick('Товар добавлен в корзину', 'открыть корзину', 'cart');
                this.updateProduct('Cart', this.id);
            }
        }
    }
</script>

<style scoped >
    .category__all-controls {
        width: 70%;
        margin: 0 auto;
    }
</style>
