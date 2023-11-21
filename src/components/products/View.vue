<template>
    <div>
        <v-overlay v-on:click="dialogInfo.show = false"
                   v-model="dialogInfo.show"
        >

        </v-overlay>
        <v-card
                class="view-adaptive"
                v-if="dialogInfo.show"
                :loading="loading"
        >
            <v-row v-if="!loading" class="fill-height">
                <v-col cols="8" class="d-flex flex-column justify-center fill-height">
                    <v-carousel
                            cycle
                            class="ma-2"
                            :hide-delimiters="!images || images.length <= 1"
                            :hide-delimiter-background="!images || images.length <= 1"
                            :show-arrows="!images || images.length !== 1"
                            delimiter-icon="mdi-minus"
                            height="100%"
                    >
                        <v-carousel-item
                                v-for="image of this.images"
                                :key="image" :src="getStatic(image)"
                                contain>
                        </v-carousel-item>
                    </v-carousel>
                </v-col>
                <v-divider vertical/>

                <v-col cols="4" class="fill-height " >
                    <v-card-actions style="background-color: #f5f5f5">
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
                        <v-spacer/>
                        <v-btn elevation="0" v-on:click="eventBus.$emit('product-view-closed')">
                            <v-icon>
                                mdi-close
                            </v-icon>
                        </v-btn>
                    </v-card-actions>
                    <v-col class="fill-height overflow-y-auto">
                        <div class="py-4">
                            <v-card-title class="text-break">
                                {{ this.title }}
                            </v-card-title>
                            <v-card-actions class="mx-2 my-0 py-0">
                                <h4 style="font-size: 0.8rem; color: rgba(165,0,0,0.5)" v-if="!available">• Нет в наличии</h4>
                                <h4 style="font-size: 0.8rem; color: rgba(0,165,0,0.5)" v-else-if="available === 'В наличии'">• {{available}}</h4>
                                <h4 style="font-size: 0.8rem; color: rgba(165,105,0,0.5)" v-else>• {{available}}</h4>
                            </v-card-actions>
                            <v-card-title v-if="price">
                                <span><strong>{{price}} Руб.</strong></span>
                            </v-card-title>
                            <v-card-subtitle v-if="specialPrice">
                                <br/><p style="color: purple" class="ma-0"><strong>{{specialPrice}} Руб.</strong></p>
                                <br/><p style="color: purple" class="ma-0"><strong>Выгода: {{sale}} Руб. ({{salePercent}}%)</strong></p>
                            </v-card-subtitle>
                            <v-card-subtitle style="font-size: 0.8rem;">Артикул: {{art}}</v-card-subtitle>
                            <v-card-subtitle class="text-break"  v-html="description.replaceAll(';', '&lt;br/&gt;• ')
                                                                            .replaceAll('. ', '&lt;br/&gt;• ')">
                            </v-card-subtitle>
                            <a class="text-wrap text-center py-3 mx-4" v-on:click="goToProduct">Перейти к товару</a>
                        </div>
                        <v-btn v-if="price" dark class="rounded-xxl" :color="common.color" block v-on:click="onCartClicked(needSetup)"
                        > В корзину</v-btn>
                    </v-col>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
    import {getStatic, getURL, normalizePrice} from "../../utils/settings";
    import axios from 'axios';
    import eventBus from "../../utils/eventBus";
    import loader from "../../utils/customizeOptions";

    export default {
        name: "ProductView",
        data: () => {
            return {
                index: 0,
                art: null,
                title: '',
                description: '',
                detailed: '',
                price: '',
                images: [],
                properties: [],
                favourite: false,
                compare: false,
                available: '',
                loading: true,
                needSetup: false,
                eventBus,
                sale: 0,
                salePercent: 0,
                specialPrice: 0,
                noPhoto: null,
                dialogInfo: {
                    show: false,
                    index: null
                },
                common: {
                    color: 'primary'
                }
            }
        },
        async beforeMount() {
            await loader().loadOptions();
            this.noPhoto = loader().getOption(['Common', 'NoPhoto']);
            this.common.color = loader().getOption(['Common', 'Schema', 'Colors', 'Primary']);

        },
        beforeDestroy() {
            eventBus.$off('product-view-open', this.onProductView);
            eventBus.$off('product-view-closed', this.onProductViewClosed);
            console.log('view destroy');
        },
        mounted() {
            console.log('view mounted');

            eventBus.$on('product-view-open', this.onProductView);
            eventBus.$on('product-view-closed', this.onProductViewClosed);

        },
        methods: {
            getURL, getStatic,
            onItemClick: function(text, linkName, link) {
                eventBus.$emit('snack-show', text, linkName, link);
            },
            loadProduct() {
                axios.get(getURL(`product/${this.dialogInfo.index}`), {withCredentials: true})
                    .then(response => {
                        const product_info = response.data.product_info;
                        this.title = product_info.title;
                        this.description = product_info.description;
                        this.detailed = product_info.detailed;
                        this.price = normalizePrice(product_info.price);
                        this.images = product_info.images.length >  0 ? product_info.images : [this.noPhoto];
                        this.favourite = product_info.favourite;
                        this.compare = product_info.compare;
                        this.art = product_info.art;
                        this.available = product_info.available;
                        if(product_info.specialPrice) {
                            console.log('calculate prices')
                            this.specialPrice = product_info.specialPrice;

                            this.sale = parseInt(product_info.price) - parseInt(product_info.specialPrice);
                            this.salePercent = (parseInt(product_info.price) - parseInt(product_info.specialPrice)) / parseInt(product_info.specialPrice) * 100
                            this.salePercent = Math.round(this.salePercent * 100) / 100
                        }
                        for(const [key, value] of Object.entries(product_info.props)) {
                            if (key && key.length > 1 && value && value.length > 1) {
                                let new_line = `${key}: ${value}`;
                                this.properties.push(new_line);
                            }
                        }
                        this.loading = false;
                    });
            },
            updateProduct(placeholder, id, needSetup) {
                axios.post(getURL('product/update'), {placeholder, id, needSetup}, {withCredentials: true}).then(() => {
                    eventBus.$emit('update-main-bar');
                });
            },
            onFavouriteClicked() {
                this.favourite = !this.favourite;
                if( this.favourite ) {
                    this.onItemClick('Товар добавлен в избранное', 'открыть избранное', 'favourite');
                }
                this.updateProduct('Favourite', this.index);
                eventBus.$emit('product-updated', this.index, 'favourite');
            },
            onCompareClicked() {
                this.compare = !this.compare;
                if (this.compare ) {
                    this.onItemClick('Товар добавлен в сравнения', 'открыть сравнения', 'compare');
                }
                this.updateProduct('Compare', this.index);
                eventBus.$emit('product-updated', this.index, 'compare');
            },
            onCartClicked() {
                this.onItemClick('Товар добавлен в корзину', 'открыть корзину', 'cart');
                this.updateProduct('Cart', this.index, this.needSetup);
            },
            onProductView(index) {
                console.log('on product view: ', index);
                this.dialogInfo.index = index;
                this.dialogInfo.show = true;
                this.index = index;
                this.loadProduct();
            },
            goToProduct() {
                this.$router.push(`/product/${this.index}`);
                this.onProductViewClosed();
            },
            onProductViewClosed() {

                this.index = null;
                this.dialogInfo.index = null;
                this.dialogInfo.show = false;
            },
        }
    }
</script>

<style scoped>
    .view-adaptive {
        width: 70vw;
        overflow-y: hidden;
        overflow-x: hidden;
        position: fixed;
        left: 15%;
        top: 10%;
        bottom: 10%;
        z-index: 10;
    }
</style>
