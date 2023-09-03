<template>
    <v-card  class="elevation-0 transparent mx-auto" :style="{'width': `${mainWidth}vw`}" style="min-height: 500px">
        <BreadCrumbs :crumbs="[{text: 'Главная', href:'/', disabled: false}, {text: 'Сравнить товары', href: '', disabled: true}]"/>
        <div v-if="products && products.length > 0">
        <v-card color="white" id="bound-scroll-x" class="d-flex flex-column overflow-hidden" rounded="0">
            <div class="d-flex flex-row py-2" style="height: 10vh; padding-right: 1em;">
                <div class="product__adaptive-column">

                </div>
                <div v-for="product of products" :key="product.id" class="product__adaptive-column" >
                    <v-img  :src="product.images && product.images.length > 0 ? getURL(`static/${product.images[0]}`) : ''"
                            style="height: 70%; width: 70%"
                            class="mx-auto text-end"
                            contain >
                        <v-icon color="rgba(62, 25, 192, 0.7)"
                                large

                                class="my-1" v-on:click="deleteItem(product)">mdi-trash-can</v-icon>
                    </v-img>
                </div>
            </div>
            <div class="d-flex flex-row align-start pt-2" >
                <div class="text-center product__adaptive-column">
                    <v-card-title class="text__description"></v-card-title>
                </div>
                <v-card-title v-for="product of products" :key="product.id" class="text__description product__adaptive-column">
                    <router-link :to="`product/${product.id}`">
                        {{product.title}}
                    </router-link>
                </v-card-title>
            </div>
        </v-card>
        <div class="d-flex flex-row">
            <v-card id="bound-scroll-y" rounded="0"
                    class="d-flex flex-column overflow-y-hidden overflow-x-hidden bound-scroll-y product__adaptive-column"
                    style="padding-bottom: 1em">
                <div class="d-flex flex-row align-center" style="min-height: 7vh; max-height: 7vh" v-for="(key, id) in properties" :key="key"
                     :class="itemRowBackground(id)">
                    <div class="text-left property__fixed product__adaptive-column">
                        <v-card-title class="text__description text-break">{{key}}</v-card-title>
                    </div>
                </div>
            </v-card>
            <v-sheet id="scrollable" class="d-flex flex-column overflow-x-auto overflow-y-auto"
                     style="width: 100%;"
            @scroll="makeScroll">
                <div class="d-flex flex-row align-center justify-center text-center text__description"
                     style="min-height: 7vh; max-height: 7vh"
                     v-for="(key, id) in properties" :key="key"
                     :class="itemRowBackground(id)" :style="{width: `${products.length*15}vw`}">
                    <h4 v-for="product of products" :key="product.id" class="text-center product__adaptive-column">
                        {{product.props[key] || '-'}}
                    </h4>
                </div>
            </v-sheet>
        </div>
        </div>
        <v-card color="white" v-else rounded="0" class="text-center">
            <h2 class="text-center py-4">
                Нет товаров для сравнения
            </h2>
            <router-link to="/category/4" class="text-center">Выбрать кондиционер</router-link>
        </v-card>
    </v-card>

</template>

<script>
    import {getURL, normalizePrice} from "../utils/settings";
    import axios from 'axios';
    import eventBus from "../utils/eventBus";
    import BreadCrumbs from "../components/utility/BreadCrumbs";
    // import $ from "jquery";

    export default {
        name: "Compare",
        components: {BreadCrumbs},
        data: () => {
            return {
                products: [],
                initialHeaders: [{
                    text: '',
                    value: 'actions',
                    filterable: false
                }, {
                    text: 'Название',
                    value: 'name'
                }],
                headerNames: [],
                properties: [],
            }
        },
        methods: {
            normalizePrice, getURL,
            itemRowBackground: function (idx) {
                return idx % 2 ? 'style-1' : 'style-2';
            },
            deleteItem(item) {
                axios.post(getURL(`product/update`), {id: item.id, placeholder: 'Compare'},
                    {withCredentials: true})
                    .then(()=> {
                        this.products.splice(this.products.indexOf(item), 1);

                        eventBus.$emit('product-updated', item.id, 'compare');
                        eventBus.$emit('update-main-bar');
                        this.loadCompare();
                    })
            },
            loadCompare() {
                axios.get(getURL('session/products/Compare'), {withCredentials: true}).then(
                    response => {
                        this.products = (response.data || {}).products || [];
                        if( this.products && this.products.length > 0 ) {
                            this.products.forEach(item => {
                                const props = item.props;
                                for(const [key, value] of Object.entries(props)) {
                                    if(!value || value.length <= 1)
                                        continue;

                                    if(this.properties.indexOf(key) === -1) {
                                        this.properties.push(key);
                                    }
                                }
                            });
                        }
                    }
                )
            },
            async makeScroll() {
                console.log('scroll...')
                const boundScrollY = document.getElementById('bound-scroll-y');
                const boundScrollX = document.getElementById('bound-scroll-x');
                const scrollable = document.getElementById('scrollable');

                if( scrollable  )
                {
                    if (boundScrollX) {
                        boundScrollX.scrollLeft = scrollable.scrollLeft > boundScrollX.scrollWidth ? boundScrollX.scrollWidth : scrollable.scrollLeft;
                    }

                    if (boundScrollY) {
                        boundScrollY.scrollTop = scrollable.scrollTop > boundScrollY.scrollHeight ? boundScrollY.scrollHeight : scrollable.scrollTop;

                    }
                }
            }
        },
        computed: {
            mainWidth: function () {
                return 15 + (this.products.length > 5 ? 80 : this.products.length > 0 ? 15 * this.products.length : 70);
            }
        },
        mounted() {
            this.loadCompare();
        }
    }
</script>

<style scoped>
    .bind-scroll-y {

    }
    .product__adaptive-column {
        min-width: 15vw;
        max-width: 15vw;
    }

    .property__fixed {
        position: relative;
    }

    .text__description {
        font-size: 0.9rem;
    }
    @media screen and (max-width: 1280px) {
        .product__adaptive-column {
            min-width: 30vw;
            max-width: 30vw;
        }
    }

    @media screen and (max-width: 768px) {
        .product__adaptive-column {
            min-width: 40vw;
            max-width: 40vw;
        }
    }

    @media screen and (max-width: 512px) {
        .product__adaptive-column {
            min-width: 50vw;
            max-width: 50vw;
        }
    }
    .style-1 {
        background-color: rgba(255, 255, 255, 0.6)
    }
    .style-2 {
        background-color: rgba(133, 179, 212, 0.29)
    }
</style>
