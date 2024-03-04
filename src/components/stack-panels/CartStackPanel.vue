<template>
    <v-card id='cart-card' ref="cartCard" class="fill-height elevation-0 overflow-x-hidden" color="white">
        <transition  name="slide-fade" mode="out-in">
            <div class="mx-2" id="order-cart-info" ref="orderCartInfo" v-if="!this.isOrdering" key="cart">
                <div class="px-2 d-flex flex-column justify-space-between" v-if="products && products.length > 0">
                    <v-list style="height: 70vh; overflow-y: auto">
                    <v-list-item v-for="item of products" :key="item.id">
                        <v-row style="width: 100%" v-if="item.amount && item.amount > 0">
                            <v-col cols="9">
                                <HorizontalCard
                                        v-bind="{
                                        idx: item.id,
                                        title: item.title,
                                        price: item.price,
                                        amount: item.amount,
                                        source: item.images && item.images.length > 0 ? item.images[0] : noPhoto,
                                        elevation: 0
                                        }"/>
                            </v-col>
                            <v-col cols="2" class="d-flex flex-row justify-center" v-if="item.amount">
                                <v-row class="d-flex flex-row align-center justify-center">
                                    <v-col cols="6">
                                        <v-text-field :value="item.amount" :readonly="true">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                        color="red"
                                                        v-on="on"
                                                        v-bind="attrs"
                                                        v-on:click="increaseCount(item)"
                                                >
                                                    mdi-plus-box
                                                </v-icon>
                                            </template>
                                            <span>
                                                    Больше
                                                </span>
                                        </v-tooltip>
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                        color="red"
                                                        v-on="on"
                                                        v-bind="attrs"
                                                        v-on:click="decreaseCount(item)"
                                                >
                                                    mdi-minus-box
                                                </v-icon>
                                            </template>
                                            <span>
                                                    Меньше
                                                </span>
                                        </v-tooltip>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                        color="red"
                                                        large
                                                        v-on="on"
                                                        v-bind="attrs"
                                                        v-on:click="deleteItem(item)"
                                                >
                                                    mdi-trash-can-outline
                                                </v-icon>
                                            </template>
                                            <span>
                                                        Удалить
                                                    </span>
                                        </v-tooltip>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-list-item>
                    </v-list>
                    <v-divider/>
                    <v-row class="d-flex flex-row justify-center align-center">
                        <v-card-title>Итого: {{normalizePrice(totalPrice)}} руб.</v-card-title>
                        <v-spacer/>
                        <v-btn color="blue" class="white--text" block v-on:click="toOrdering()">Оформить заказ<v-icon>mdi-chevron-right</v-icon></v-btn>
                    </v-row>
                </div>
            </div>
            <div key="ordering" id="order-user-info" ref="orderUserInfo" v-if="this.isOrdering">
                <v-card-actions>
                    <v-card-title class="text-break">
                        Оформление заказа на сумму {{normalizePrice(totalPrice)}} Руб.
                    </v-card-title>
                    <v-spacer/>
                    <v-btn class="transparent" elevation="0" v-on:click="toCart()">
                        Назад
                        <v-icon>
                            mdi-chevron-right
                        </v-icon>
                    </v-btn>

                </v-card-actions>
                <v-divider/>
                <div class="mx-2" v-if="products && products.length > 0">
                    <v-card-title class="text-break">
                        Для подтверждения заказа, введите ваши данные
                    </v-card-title>
                    <v-form
                            style="width: 60%"
                            class="mx-10"
                            ref="form"
                            v-model="orderFormValid"
                    >
                        <v-text-field
                                label="Имя"
                                required
                                :rules="[v => !!v || 'Обязательное поле']"
                                v-model="requisites.firstName"
                        />
                        <v-text-field
                                required
                                label="Телефон"
                                :rules="[v => !!v || 'Обязательное поле']"
                                v-model="requisites.phone"
                        />
                    </v-form>
                    <v-divider/>
                    <v-textarea class="mx-4"
                                v-model="requisites.comment"
                                label="Комментарий к заказу"
                    >
                    </v-textarea>
                    <v-divider/>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn :disabled="!orderFormValid" block class="white--text" color="blue" v-on:click="validateAndOrder">Подтвердить заказ</v-btn>
                    </v-card-actions>
                </div>
            </div>
        </transition>
        <template v-if="!products || products.length === 0">
            <v-card elevation="0" color="transparent" class="d-flex flex-column justify-center align-center py-16">
                <v-card-title>
                    Корзина пуста
                </v-card-title>
                <v-card-subtitle class="text-center black--text">
                    Воспользуйтесь поиском, чтобы найти всё,<br/> что нужно

                </v-card-subtitle>
                <template v-if="!authorized">
                <v-card-subtitle>
                    Если в корзине были товары - войдите, чтобы посмотреть список
                </v-card-subtitle>
                <v-btn color="blue" class="white--text rounded-xl text-capitalize" elevation="0"
                       v-on:click="makeAuthorizePanel"
                >Войти
                </v-btn>
                </template>
            </v-card>

        </template>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL, normalizePrice} from "../../utils/settings";
    import HorizontalCard from "../products/HorizontalCard";
    import eventBus from "../../utils/eventBus";
    import loader from "../../utils/customizeOptions";
    import {getUser} from "../../utils/profile";

    export default {
        name: "CartStackPanel",
        components: {HorizontalCard},
        data() {
            return {
                products: [],
                requisites: {
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: '',
                    address: '',
                    comment: '',
                    paymentMethod: '',
                },
                eventBus,
                totalPrice: null,
                isOrdering: false,
                paymentMethods: [{
                    id: 0,
                    value: 'Наличными при получении',
                    disabled: false
                }, {
                    id: 1,
                    value: 'Картой при получении',
                    disabled: false
                }, {
                    id: 2,
                    value: 'Онлайн оплата (временно не доступно)',
                    disabled: true
                }],
                comment: '',
                orderFormValid: false,
                radioError: null,
                noPhoto: null
            }
        },
        computed: {
            authorized: function() {
                return getUser().authorized;
            }
        },
        methods: {
            makeAuthorizePanel() {
                eventBus.$emit('stack-panel-push', 'authorize');
            },
            normalizePrice,
            increaseCount(item) {
                axios.get(getURL(`product/increase/${item.id}`), {withCredentials: true})
                    .then(() => {
                        this.loadCart();
                    })
            },
            decreaseCount(item) {
                axios.get(getURL(`product/decrease/${item.id}`), {withCredentials: true})
                    .then(() => {
                        this.loadCart();
                    })
            },
            deleteItem(item) {
                axios.get(getURL(`product/remove/${item.id}`), {withCredentials: true})
                    .then(() => {
                        this.loadCart();
                    })
            },
            loadCart() {
                eventBus.$emit('update-main-bar');
                axios.get(getURL('session/products/Cart'), {withCredentials: true}).then(
                    response => {
                        const productsData = response.data;
                        this.products = productsData.products;
                        this.totalPrice = productsData.total_price;
                    }
                )
            },
            toOrdering() {
                this.isOrdering = true;
                this.eventBus.$emit('show-actions-changed', false);
            },
            toCart() {
                this.isOrdering = false;
                this.eventBus.$emit('show-actions-changed', true);
            },
            validateAndOrder() {

                this.radioError = '';
                axios.post(getURL('session/checkout'), {
                    requisites: this.requisites,
                    total: this.totalPrice
                }, {withCredentials: true}).then(()=> {
                    this.loadCart();
                    this.toCart();
                })

            }
        },
        mounted() {
            this.loadCart();

            this.requisites.firstName = getUser().user.Name;
            this.requisites.phone = getUser().user.Profile.phone;
        },
        async beforeMount() {
            await loader().loadOptions();
            this.noPhoto = loader().getOption(['Common', 'NoPhoto']);
        },
    }
</script>

<style scoped>
    .slide-fade-enter-active {
        transition: all .6s;
    }
    .slide-fade-leave-active {
        transition: all .3s;
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(200px);
        opacity: 0;
    }
</style>
