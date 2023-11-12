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
                        :src="images && images.length > 0 ? getStatic(images[0]) : getStatic(noPhoto)"
                        alt=""
                        :style="isMobile ? {} : {cursor: 'zoom-in'}"
                        v-on:click="isMobile ? actions.goToProduct(id) : actions.onProductView(id, title, description)"
                >
                </v-img>
                    <v-card-title
                            style="font-size: 15px; line-height: 19px; cursor: pointer"
                            class="text-left text-wrap text-break"
                            v-on:click="actions.goToProduct(id)"
                    >
                        {{title}}
                    </v-card-title>
                <v-divider></v-divider>
                <v-card-actions class="mx-2 my-0 py-0">
                    <h4 style="font-size: 0.8rem; color: rgba(165,0,0,0.5)" v-if="!available">• Нет в наличии</h4>
                    <h4 style="font-size: 0.8rem; color: rgba(0,165,0,0.5)" v-else-if="available === 'В наличии'">• {{available}}</h4>
                    <h4 style="font-size: 0.8rem; color: rgba(165,105,0,0.5)" v-else>• {{available}}</h4>
                </v-card-actions>
                <v-card-actions class="mx-2">
                    <span v-if="price"><strong>{{normalizePrice(price)}} Руб.</strong></span>
                    <span v-else>Цена договорная</span>
                    <v-spacer/>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="mx-2"
                                    v-bind="attrs"
                                    v-on="on"
                                    :color="favourite ? 'red': 'gray'"
                                    v-on:click="processClick('favourite', id)"
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
                                    v-on:click="processClick('compare', id)"
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
                <v-btn
                        v-if="price"
                        dark
                        class="rounded-t-0 text-break"
                        :color="common.color"
                        v-on:click="processClick('cart', id)"
                >В корзину</v-btn>
            </v-card>
        </v-hover>
    </v-card>
</template>

<script>
    import {getStatic, getURL, normalizePrice} from "../../utils/settings";
    import eventBus from "../../utils/eventBus";
    import loader from "../../utils/customizeOptions";

    export default {
        name: "Card",
        props: ['id', 'title', 'description', 'images', 'price', 'specialPrice', 'sale', 'salePercent',
            'actions', 'favourite', 'compare', 'width', 'available'],
        data: () => {
            return {
                eventBus,
                noPhoto: null,
                common: {color: 'primary'}
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
        },
        methods: {
            normalizePrice, getURL, getStatic,
            processClick(type, id) {
                eventBus.$emit('product-meta-updated', id, type);
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
