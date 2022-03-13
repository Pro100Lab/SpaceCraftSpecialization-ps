<template>
    <v-card
            class="d-flex"
            :loading="loading"
    >
        <v-row class="d-flex" v-if="!loading">
            <v-col cols="8">
                <v-carousel
                        cycle
                        hide-delimiter-background
                        delimiter-icon="mdi-minus"
                >
                    <v-carousel-item
                            v-for="image of this.images"
                            :key="image" :src="image"
                            contain
                    >
                    </v-carousel-item>
                </v-carousel>
            </v-col>
            <v-col cols="4" >
                <div class="px-4 py-4">
                    <v-card-actions class="mx-2">
                        <router-link class="text-wrap text-center my-3" :to="`/product/${this.id}`">Перейти к товару</router-link>
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
                    <v-card-title class="my-2 text-break">
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
                    <v-card-subtitle class="text-break">
                        {{ this.description }}
                    </v-card-subtitle>
                    <v-btn class="rounded-t-0" color="blue" block v-on:click="onCartClicked()"
                    > Добавить в корзину</v-btn>
                </div>
            </v-col>
        </v-row>
        <v-divider/>
    </v-card>
</template>

<script>
    import {getURL, normalizePrice} from "../../settings";
    import axios from 'axios';
    import eventBus from "../../eventBus";

    export default {
        name: "ProductView",
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
                loading: true,
            }
        },
        props: ['dialogInfo'],
        mounted() {
            axios.get(getURL(`product/${this.dialogInfo.id}`), {withCredentials: true})
                .then(response => {
                    this.id = this.dialogInfo.id;
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
                    this.loading = false;
                });
        },
        methods: {
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
                eventBus.$emit('product-updated', this.id, 'favourite');
            },
            onCompareClicked() {
                this.compare = !this.compare;
                if (this.compare ) {
                    this.onItemClick('Товар добавлен в сравнения', 'открыть сравнения', 'compare');
                }
                this.updateProduct('Compare', this.id);
                eventBus.$emit('product-updated', this.id, 'compare');
            },
            onCartClicked() {
                this.onItemClick('Товар добавлен в корзину', 'открыть корзину', 'cart');
                this.updateProduct('Cart', this.id);
            }
        }
    }
</script>

<style scoped>

</style>
