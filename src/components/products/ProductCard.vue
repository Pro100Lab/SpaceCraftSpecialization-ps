<template>
    <v-card >
        <v-hover v-slot="{ hover }">
            <v-card color="white"
                    :elevation="hover ? 6 : 0"
                    class="d-flex flex-column fill-height scale">
                <v-img
                        :width="width ? width*0.5: 'auto'"
                        contain
                        height="150px"
                        class="mx-2 my-2 mx-auto"
                        :class="hover? 'scaled' : 'unscaled'"
                        :src="info.images && info.images.length > 0 ? getStatic(info.images[0]) : getStatic(noPhoto)"
                        alt=""
                        :style="isMobile ? {} : {cursor: 'zoom-in'}"
                        v-on:click="isMobile ? actions.goToProduct(index) : onProductView()"
                >
                </v-img>
                    <v-card-title
                            style="font-size: 15px; line-height: 19px; cursor: pointer"
                            class="text-left text-wrap text-break"
                            v-on:click="actions.goToProduct(index)"
                    >
                        {{info.title}}
                    </v-card-title>
                <v-divider></v-divider>
                <v-card-actions class="mx-2 my-0 py-0">
                    <h4 style="font-size: 0.8rem; color: rgba(165,0,0,0.5)" v-if="!info.available">• Нет в наличии</h4>
                    <h4 style="font-size: 0.8rem; color: rgba(0,165,0,0.5)" v-else-if="info.available === 'В наличии'">• {{info.available}}</h4>
                    <h4 style="font-size: 0.8rem; color: rgba(165,105,0,0.5)" v-else>• {{info.available}}</h4>
                </v-card-actions>
                <v-card-actions class="mx-2">
                    <span v-if="info.price"><strong>{{normalizePrice(info.price)}} Руб.</strong></span>
                    <span v-else>Цена договорная</span>
                    <v-spacer/>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="mx-2"
                                    v-bind="attrs"
                                    v-on="on"
                                    :color="favourite ? 'red': 'gray'"
                                    v-on:click="processClick('favourite')"
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
                                    v-on:click="processClick('compare')"
                            >mdi-abacus</v-icon>
                        </template>
                        <span>
                            Сравнить
                        </span>
                    </v-tooltip>
                </v-card-actions>
                <v-card-subtitle v-if="info.specialPrice">
                    <br/><p style="color: purple" class="ma-0"><strong>{{info.specialPrice}} Руб.</strong></p>
                    <br/><p style="color: purple" class="ma-0"><strong>Выгода: {{info.sale}} Руб. ({{info.salePercent}}%)</strong></p>
                </v-card-subtitle>
                <v-btn
                        v-if="info.price"
                        dark
                        class="rounded-t-0 text-break"
                        :color="common.color"
                        v-on:click="processClick('cart')"
                >В корзину</v-btn>
            </v-card>
        </v-hover>
    </v-card>
</template>

<script>
    import {getStatic, getURL, normalizePrice} from "../../utils/settings";
    import eventBus from "../../utils/eventBus";
    import loader from "../../utils/customizeOptions";
    import axios from 'axios';

    export default {
        name: "ProductCard",
        props: ['index', 'product', 'actions', 'favourite', 'compare', 'width'],
        data: () => {
            return {
                eventBus,
                noPhoto: null,
                common: {color: 'primary'},
                info: {},
            }
        },
        computed: {
            isMobile: function() {
                return window.innerWidth < 960;
            }
        },
        async beforeMount() {
            await loader().loadOptions();
            this.noPhoto = loader().getOption(['Common', 'NoPhoto']);
            this.common.color = loader().getOption(['Common', 'Schema', 'Colors', 'Primary']);

            console.log('this.product: ', this.product);

            if(this.product) {
                this.info = this.product;
            }

            if(!this.product) {
                if(this.index)
                    this.loadProduct();
            }
        },
        methods: {
            normalizePrice, getURL, getStatic,
            processClick(type) {
                eventBus.$emit('product-meta-updated', this.index, type);
            },
            onProductView() {
                eventBus.$emit('product-view-open', this.index);
            },
            loadProduct() {
                axios.get(getURL(`product/${this.index}`)).then(response => {
                    this.info = response.data.product_info;
                })
            }
        }
    }
</script>

<style scoped>
    .scale {
        display: inline-block; /* Строчно-блочный элемент */
        overflow: hidden; /* Скрываем всё за контуром */
    }
    .scaled {
        transition: .2s; /* Время эффекта */
        display: block; /* Убираем небольшой отступ снизу */
        transform: scale(1.2) /* Увеличиваем масштаб */
    }

    .unscaled {
        transition: .2s; /* Время эффекта */
    }
</style>
