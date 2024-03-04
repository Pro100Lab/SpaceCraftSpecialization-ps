<template>
    <v-sheet color="transparent" class="bottom-bar__main-scope rounded-5">
        <BreadCrumbs v-bind:crumbs="breadcrumbs"></BreadCrumbs>
        <v-card class="my-3 overflow-hidden">
            <v-row v-if="!isMobile">
                <v-col cols="8" class="d-flex flex-column justify-center">
                    <v-carousel
                            cycle
                            class="ma-2"
                            :hide-delimiters="!images || images.length <= 1"
                            :show-arrows="images && images.length > 1"
                            delimiter-icon="mdi-minus"
                    >
                        <v-carousel-item
                                v-for="image of this.images"
                                :key="image" :src="getStatic(image)"
                                contain>
                        </v-carousel-item>
                    </v-carousel>
                </v-col>
                <v-col cols="4" >
                    <div class="px-4 py-4">
                        <v-card-actions class="px-2">
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
                                    <v-icon class="px-2"
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
                        <v-card-actions class="px-2 my-0 py-0">
                            <h4 style="font-size: 0.8rem; color: rgba(165,0,0,0.5)" v-if="!available">• Нет в наличии</h4>
                            <h4 style="font-size: 0.8rem; color: rgba(0,165,0,0.5)" v-else-if="available === 'В наличии'">• {{available}}</h4>
                            <h4 style="font-size: 0.8rem; color: rgba(165,105,0,0.5)" v-else>• {{available}}</h4>
                        </v-card-actions>
                        <v-card-title class="mt-2" v-if="!productChat && price">
                            <span><strong>{{price}} Руб.</strong></span>
                        </v-card-title>
                        <v-card-title v-else>
                            <span><strong>Цена договорная</strong></span>
                        </v-card-title>
                        <v-card-subtitle class="mt-2" v-if="specialPrice">
                            <br/><p style="color: purple" class="ma-0"><strong>{{specialPrice}} Руб.</strong></p>
                            <br/><p style="color: purple" class="ma-0"><strong>Выгода: {{sale}} Руб. ({{salePercent}}%)</strong></p>
                        </v-card-subtitle>
                        <v-card-subtitle style="font-size: 0.8rem;">Артикул: {{art}}</v-card-subtitle>

<!--                        <v-row class="mx-3 flex-nowrap" v-if="this.title !== 'Стандартная установка кондиционера'">-->
<!--                            <v-checkbox label="Требуется установка" v-model="needSetup" />-->
<!--                            <v-tooltip top>-->
<!--                                <template v-slot:activator="{on, attrs}">-->
<!--                                    <v-icon-->
<!--                                            v-on="on"-->
<!--                                            v-bind="attrs"-->
<!--                                            class="pl-4"-->
<!--                                            small-->
<!--                                            dense-->
<!--                                    >-->
<!--                                        mdi-help-circle-->
<!--                                    </v-icon>-->
<!--                                </template>-->
<!--                                <span>-->
<!--                                Стоимость установки расчитывается индивидуально-->
<!--                            </span>-->
<!--                            </v-tooltip>-->
<!--                        </v-row>-->
<!--                        <v-row class="px-4 my-4 d-flex flex-row align-center "-->
<!--                               style="font-size: 0.8rem; display: inline"-->
<!--                               v-if="this.title !== 'Стандартная установка кондиционера'"-->
<!--                        >-->
<!--                        <span>-->
<!--                        Обратите <b>внимание</b>, цена установки рассчитывается отдельно по ценам, указанным в <a href="/category/2"> разделе работ</a>. Конечная цена складывается из необходимых расходных материалов-->
<!--                    </span>-->
<!--                        </v-row>-->
                        <v-card-subtitle class="text-break"  v-html="description.replaceAll(';', '&lt;br/&gt;• ')
                                                                            .replaceAll('. ', '&lt;br/&gt;• ')">
                        </v-card-subtitle>
                        <template v-if="!productChat && price">
                        <v-btn dark class="rounded-xl" :color="common.color" block v-on:click="onCartClicked()"
                        >В корзину</v-btn>
                        </template>
                        <template v-else>
                            <v-btn dark class="rounded-xl" :color="common.color" block v-on:click="selectedTab = tabs.indexOf('Онлайн чат')"
                            >Напишите нам</v-btn>
                        </template>
                        <v-spacer/>
                    </div>
                </v-col>
            </v-row>
            <div v-else class="d-flex flex-column align-center">
                <v-card-title class="text-break">
                    {{ this.title }}
                </v-card-title>
                <v-carousel
                        cycle
                        class="ma-2"
                        :hide-delimiters="!images || images.length <= 1"
                        :show-arrows="images && images.length > 1"
                        delimiter-icon="mdi-minus"
                >
                    <v-carousel-item
                            v-for="image of this.images"
                            :key="image" :src="getStatic(image)"
                            contain>
                    </v-carousel-item>
                </v-carousel>
                <div class="py-4">
                    <v-card-actions class="px-2">
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
                                <v-icon class="px-2"
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
                    <v-card-actions class="px-2 my-0 py-0">
                        <h4 style="font-size: 0.8rem; color: rgba(0,165,0,0.5)">• В наличии</h4>
                    </v-card-actions>
                    <v-card-title class="mt-2" v-if="!productChat && price">
                        <span><strong>{{price}} Руб.</strong></span>
                    </v-card-title>
                    <v-card-title v-else>
                        <span><strong>Цена договорная</strong></span>
                    </v-card-title>
                    <v-card-subtitle class="mt-2" v-if="specialPrice">
                        <br/><p style="color: purple" class="ma-0"><strong>{{specialPrice}} Руб.</strong></p>
                        <br/><p style="color: purple" class="ma-0"><strong>Выгода: {{sale}} Руб. ({{salePercent}}%)</strong></p>
                    </v-card-subtitle>
                    <v-card-subtitle style="font-size: 0.8rem;">Артикул: {{art}}</v-card-subtitle>

<!--                    <v-row class="mx-3 flex-nowrap" v-if="this.title !== 'Стандартная установка кондиционера'">-->
<!--                        <v-checkbox label="Требуется установка" v-model="needSetup" />-->
<!--                        <v-tooltip top>-->
<!--                            <template v-slot:activator="{on, attrs}">-->
<!--                                <v-icon-->
<!--                                        v-on="on"-->
<!--                                        v-bind="attrs"-->
<!--                                        class="pl-4"-->
<!--                                        small-->
<!--                                        dense-->
<!--                                >-->
<!--                                    mdi-help-circle-->
<!--                                </v-icon>-->
<!--                            </template>-->
<!--                            <span>-->
<!--                                Стоимость установки расчитывается индивидуально-->
<!--                            </span>-->
<!--                        </v-tooltip>-->
<!--                    </v-row>-->
<!--                    <v-row class="px-4 my-4 d-flex flex-row align-center "-->
<!--                           style="font-size: 0.8rem; display: inline"-->
<!--                           v-if="this.title !== 'Стандартная установка кондиционера'"-->
<!--                    >-->
<!--                        <span>-->
<!--                        Обратите <b>внимание</b>, цена установки рассчитывается отдельно по ценам, указанным в <a href="/category/2"> разделе работ</a>. Конечная цена складывается из необходимых расходных материалов-->
<!--                    </span>-->
<!--                    </v-row>-->
                    <v-card-subtitle class="text-break"  v-html="description.replaceAll(';', '&lt;br/&gt;• ')
                                                                            .replaceAll('. ', '&lt;br/&gt;• ')">
                    </v-card-subtitle>
                    <template v-if="!productChat">
                        <v-btn dark class="rounded-xl" :color="common.color" block v-on:click="onCartClicked()"
                        >В корзину</v-btn>
                    </template>
                    <template v-else>
                        <v-btn dark class="rounded-xl" :color="common.color" block v-on:click="selectedTab = tabs.indexOf('Онлайн чат')"
                        >Напишите нам</v-btn>
                    </template>
                    <v-spacer/>
                </div>
            </div>
            <v-tabs  v-model="selectedTab">
                <v-tab v-for="tab of tabs" :key="`product-tab-${tab}`" >{{tab}}</v-tab>
            </v-tabs>
            <template  v-if="selectedTab === tabs.indexOf('Описание товара') ">
                <v-card-text v-if="detailed && detailed.length > 0" v-html="detailed.replaceAll('. ', '&lt;br/&gt;')
                                                                        .replaceAll(';', '&lt;br/&gt;')
                                                                        .replaceAll('·', '•')">
                </v-card-text>
            </template>
            <transition name="slide-fade" v-else-if="selectedTab === tabs.indexOf('Характеристики')">
                <v-list class="mx-auto">
                    <template v-for="[key, value] of Object.entries(properties)">
                    <v-list-item  :key="`product-prop-${key}`" v-if="key.indexOf('Цена')  === -1" dense>
                        <v-row>
                            <v-col cols="8">
                                {{key}}
                            </v-col>
                            <v-col cols="4">
                                {{value}}
                            </v-col>
                        </v-row>
                    </v-list-item>
                    </template>
                </v-list>
            </transition>
            <template v-else-if="selectedTab === tabs.indexOf('Отзывы')"></template>
            <template v-else-if="selectedTab === tabs.indexOf('Онлайн чат')">
                <task-conversation
                        :idx="dialogId"
                        schema="light"
                        start-dialog-text="Чем я могу помочь?"
                        :disable-receivers="true"
                ></task-conversation>
            </template>
        </v-card>
    </v-sheet>
</template>

<script>
    import BreadCrumbs from "../utility/BreadCrumbs";
    import axios from 'axios';
    import {getStatic, getURL, normalizePrice} from "../../utils/settings";
    import eventBus from "../../utils/eventBus";
    import loader from "../../utils/customizeOptions";
    import TaskConversation from "./utils/Conversation";

    export default {
        name: "Product",
        components: {TaskConversation, BreadCrumbs},
        data: () => {
            return {
                id: 0,
                breadcrumbs: [],
                title: '',
                description: '',
                detailed: '',
                art: null,
                price: '',
                specialPrice: '',
                available: '',
                images: [],
                properties: {},
                favourite: false,
                compare: false,
                needSetup: false,
                sale: 0,
                salePercent: 0,
                productChat: false,
                noPhoto: null,
                common: {color: 'primary'},
                tabs: ['Описание товара', 'Характеристики', 'Онлайн чат'],
                selectedTab: 0,
                dialogId: null
            }
        },
        async beforeMount() {
            await loader().loadOptions();
            this.noPhoto = loader().getOption(['Common', 'NoPhoto']);
            this.common.color = loader().getOption(['Common', 'Schema', 'Colors', 'Primary']);

            this.loadProduct();
            this.createDialog();

            eventBus.$on('product-updated', () => {
                this.loadProduct();
            })
        },
        methods: {
            getURL, getStatic,
            createDialog() {
                axios.post(getURL('docflow/conversation/get_or_create'), {
                    key: this.$route.params.product_id
                }, {withCredentials: true}).then(res => {
                    this.dialogId = res.data.conversation;
                })
            },
            mounted() {
            },
            loadProduct() {
                axios.get(getURL(`product/${this.$route.params.product_id}`), {withCredentials: true})
                    .then(response => {
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
                        this.id = this.$route.params.product_id;
                        const product_info = response.data.product_info;
                        this.breadcrumbs = response.data.breadcrumbs;
                        this.title = product_info.title;
                        this.description = product_info.description;
                        this.detailed = product_info.detailed;
                        this.art = product_info.art;
                        this.available = product_info.available;
                        this.price = normalizePrice(product_info.price);
                        this.specialPrice = product_info.specialPrice ? normalizePrice(product_info.specialPrice) : null
                        this.productChat = product_info.product_chat;
                        if(product_info.specialPrice) {
                            this.sale = product_info.price - product_info.specialPrice;
                            this.salePercent = (product_info.price - product_info.specialPrice) / product_info.specialPrice * 100
                            this.salePercent = Math.round(this.salePercent * 100) / 100
                        }
                        this.images = product_info.images && product_info.images.length > 0 ? product_info.images : [this.noPhoto];
                        this.favourite = product_info.favourite;
                        this.compare = product_info.compare;
                        this.properties = product_info.props;
                    });
            },
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
                this.updateProduct('Favourite', this.id, this.needSetup);
            },
            onCompareClicked() {
                this.compare = !this.compare;
                if (this.compare ) {
                    this.onItemClick('Товар добавлен в сравнения', 'открыть сравнения', 'compare');
                }
                this.updateProduct('Compare', this.id, this.needSetup);
            },
            onCartClicked() {
                this.onItemClick('Товар добавлен в корзину', 'открыть корзину', 'cart');
                this.updateProduct('Cart', this.id, this.needSetup);
            }
        },
        computed: {
            isMobile: function() {
                return window.innerWidth < 960;
            }
        },
    }
</script>

<style scoped >
</style>
