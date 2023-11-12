<template>
    <v-card
            class="card-flex"
            style="width: 100%;"
            :ripple="false"
            :elevation="Number.isInteger(elevation) ? elevation : 4"
    >
        <v-row class="mt-1" align="center">
            <v-col cols="2">
                <v-img :src="getStatic(source || noPhoto)"
                       contain
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
                    <span v-if="price"><strong>{{normalizePrice(price)}} Руб.</strong></span>
                    <span v-else><strong>Цена договорная</strong></span>
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
                    <h4 style="font-size: 0.8rem; color: rgba(165,0,0,0.5)" v-if="!available">• Нет в наличии</h4>
                    <h4 style="font-size: 0.8rem; color: rgba(0,165,0,0.5)" v-else-if="available === 'В наличии'">• {{available}}</h4>
                    <h4 style="font-size: 0.8rem; color: rgba(165,105,0,0.5)" v-else>• {{available}}</h4>
                </v-card-actions>
                <v-btn
                        dark
                        v-if="price"
                        class="rounded-xl overflow-hidden mx-auto"
                        :color="common.color"
                        v-on:click="actions.onCartClick(idx)"
                        style="width: 100%;"
                >в корзину</v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import {normalizePrice, getURL, getStatic} from "../../utils/settings";
    import loader from "../../utils/customizeOptions";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "HorizontalCard",
        props: ['idx', 'price', 'specialPrice', 'sale', 'salePercent',
            'amount', 'title', 'description', 'source', 'actions',
            'favourite', 'compare', 'toSearch', 'elevation',
            'available'
        ],
        methods: {
            getURL, getStatic,
            normalizePrice,
            goToProduct(idx) {
                eventBus.$emit('stack-panel-close');
                this.$router.push(`/product/${idx}`)
            }
        },
        async beforeMount() {
            await loader().loadOptions();
            this.noPhoto = loader().getOption(['Common', 'NoPhoto']);
            this.common.color = loader().getOption(['Common', 'Schema', 'Colors', 'Primary']);
        },
        data () {
            return {
                noPhoto: null,
                common: {color: 'primary'}
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
