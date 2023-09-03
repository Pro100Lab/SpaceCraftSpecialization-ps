<template>
    <v-card
            class="d-flex flex-row card-flex"
            style="width: 100%;"
            elevation="0"
            :ripple="false"
    >
        <v-row style="width: 100%;" class="mt-1 mx-1">
            <v-col cols="2">
                <v-img :src="getURL(`static/${source}`)"
                       contain
                       style="width: 100%;"
                       class="fill-height"
                       v-on:click="actions.onProductView(idx, title, description)"
                       :style="{cursor: actions ?'zoom-in' : ''}"

                />
            </v-col>
            <v-col :cols="actions ? 7 : toSearch ? 10 : 8" class="d-flex flex-column">
                <v-card-title class="mb-4 py-0 text-wrap text-break" v-on:click="goToProduct(idx)" style="cursor: pointer"
                >
                    {{title}}
                </v-card-title>
                <v-card-subtitle v-if="description" v-html="description.replaceAll('. ', '&lt;br/&gt;• ')
                                                                        .replaceAll(';', '&lt;br/&gt;• ')
"/>
                <div v-if="!actions">
                <v-card-subtitle v-if="price && amount">{{amount}} x {{normalizePrice(price)}} руб. = {{normalizePrice(parseInt(amount) * parseInt(price))}} руб.</v-card-subtitle>
                <v-card-subtitle v-if="price && !amount">{{normalizePrice(price)}} руб.</v-card-subtitle>
                    <v-card-subtitle v-if="specialPrice">
                        <br/><p style="color: purple" class="ma-0"><strong>{{specialPrice}} Руб.</strong></p>
                        <br/><p style="color: purple" class="ma-0"><strong>Выгода: {{sale}} Руб. ({{salePercent}}%)</strong></p>
                    </v-card-subtitle>
                </div>
            </v-col>
            <v-col cols="3" v-if="actions" class="d-flex flex-column px-5">
                <v-card-actions class="overflow-auto overflow-y-hidden">
                    <span><strong>{{normalizePrice(price)}} Руб.</strong></span>
                    <v-spacer/>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="mx-2"
                                    v-bind="attrs"
                                    v-on="on"
                                    :color="favourite ? 'red': 'gray'"
                                    v-on:click="actions.onHeartClick(idx)"
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
                                    v-on:click="actions.onAbacusClick(idx)"
                            >mdi-abacus</v-icon>
                        </template>
                        <span>
                                Сравнить
                            </span>
                    </v-tooltip>
                </v-card-actions>
                <v-card-subtitle v-if="specialPrice">
                    <br/><p style="color: purple" class="ma-0"><strong>{{specialPrice}} Руб.</strong></p>
                    <br/><p style="color: purple" class="ma-0"><strong>Выгода: {{sale}} Руб. ({{salePercent}}%)</strong></p>
                </v-card-subtitle>
                <v-card-actions>
                    <h4 style="font-size: 0.8rem; color: rgba(0,165,0,0.5)">• В наличии</h4>
                </v-card-actions>
                <v-btn
                        class="rounded-0 overflow-hidden mx-auto"
                        color="blue"
                        v-on:click="actions.onCartClick(idx)"
                        style="width: 100%;"
                >в корзину</v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import {normalizePrice, getURL} from "../../utils/settings";

    export default {
        name: "HorizontalCard",
        props: ['idx', 'price', 'specialPrice', 'sale', 'salePercent',
            'amount', 'title', 'description', 'source', 'actions', 'favourite', 'compare', 'toSearch'],
        methods: {
            getURL,
            normalizePrice,
            goToProduct(idx) {
                this.$router.push(`/product/${idx}`)
            }
        },
        data () {
            return {

            }
        },
    }
</script>

<style scoped>
    .card-border {
        border: 1px solid black;
    }

    .card-flex {
        width: 100%;
    }
</style>
