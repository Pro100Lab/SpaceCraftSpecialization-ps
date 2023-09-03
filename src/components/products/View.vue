<template>
    <v-card
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
                            :key="image" :src="getURL(`static/${image}`)"
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
                                <h4 style="font-size: 0.8rem; color: rgba(0,165,0,0.5)">• В наличии</h4>
                            </v-card-actions>
                            <v-card-title>
                                <span><strong>{{price}} Руб.</strong></span>
                            </v-card-title>
                            <v-card-subtitle v-if="specialPrice">
                                <br/><p style="color: purple" class="ma-0"><strong>{{specialPrice}} Руб.</strong></p>
                                <br/><p style="color: purple" class="ma-0"><strong>Выгода: {{sale}} Руб. ({{salePercent}}%)</strong></p>
                            </v-card-subtitle>
                            <v-card-subtitle style="font-size: 0.8rem;">Артикул: {{art}}</v-card-subtitle>

                            <v-row class="mx-3 flex-nowrap" v-if="this.title !== 'Стандартная установка кондиционера'">
                                <v-checkbox label="Требуется установка" v-model="needSetup" />
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-icon
                                                v-on="on"
                                                v-bind="attrs"
                                                class="ml-4"
                                                small
                                                dense
                                        >
                                            mdi-help-circle
                                        </v-icon>
                                    </template>
                                    <span>
                                Стоимость установки расчитывается индивидуально
                            </span>
                                </v-tooltip>
                            </v-row>
                            <v-row class="mx-4 my-4 d-flex flex-row align-center "
                                   style="font-size: 0.8rem; display: inline"
                                   v-if="this.title !== 'Стандартная установка кондиционера'"
                            >
                        <span>
                        Обратите <b>внимание</b>, цена установки рассчитывается отдельно по ценам, указанным в <a href="/category/2"> разделе работ</a>. Конечная цена складывается из необходимых расходных материалов
                    </span>
                            </v-row>
                            <v-card-subtitle class="text-break"  v-html="description.replaceAll(';', '&lt;br/&gt;• ')
                                                                            .replaceAll('. ', '&lt;br/&gt;• ')">
                            </v-card-subtitle>
                            <router-link class="text-wrap text-center py-3 mx-4" :to="`/product/${this.id}`">Перейти к товару</router-link>
                        </div>
                        <v-btn class="rounded-t-0 mb-5" color="blue" block v-on:click="onCartClicked(needSetup)"
                        > В корзину</v-btn>
                    </v-col>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import {getURL, normalizePrice} from "../../utils/settings";
    import axios from 'axios';
    import eventBus from "../../utils/eventBus";

    export default {
        name: "ProductView",
        data: () => {
            return {
                id: 0,
                art: null,
                title: '',
                description: '',
                detailed: '',
                price: '',
                images: [],
                properties: [],
                favourite: false,
                compare: false,
                loading: true,
                needSetup: false,
                eventBus,
                sale: 0,
                salePercent: 0,
                specialPrice: 0
            }
        },
        props: ['dialogInfo'],
        mounted() {
            axios.get(getURL(`product/${this.dialogInfo.id}`), {withCredentials: true})
                .then(response => {
                    this.id = this.dialogInfo.id;
                    const product_info = response.data.product_info;
                    this.title = product_info.title;
                    this.description = product_info.description;
                    this.detailed = product_info.detailed;
                    this.price = normalizePrice(product_info.price);
                    this.images = product_info.images;
                    this.favourite = product_info.favourite;
                    this.compare = product_info.compare;
                    this.art = product_info.art;
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
        methods: {
            getURL,
            onItemClick: function(text, linkName, link) {
                eventBus.$emit('snack-show', text, linkName, link);
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
                this.updateProduct('Cart', this.id, this.needSetup);
            }
        }
    }
</script>

<style scoped>

</style>
