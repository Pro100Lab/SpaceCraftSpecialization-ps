<template>
    <v-card id='cart-card' ref="cartCard" class="fill-height elevation-0 overflow-x-hidden" color="white">
        <transition  name="slide-fade" mode="out-in">
            <div id="order-cart-info" ref="orderCartInfo" v-if="!this.isOrdering" key="cart">
                <v-card-actions>
                    <v-card-title>
                        Корзина
                    </v-card-title>
                    <v-spacer/>
                    <v-btn v-on:click="eventBus.$emit('stack-panel-close')"
                           class="transparent elevation-0">
                        Закрыть
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </v-card-actions>
                <v-divider/>
                <div class="mx-2" v-if="products && products.length > 0">
                    <v-virtual-scroll
                            :bench="20"
                            :items="products"
                            height="700"
                            width="100%"
                            item-height="200"
                            style="overflow-x: hidden"
                    >
                        <template v-slot:default="{ item }">
                            <v-list-item :key="item.id">
                                <v-row style="width: 100%">
                                    <v-col cols="9">
                                        <HorizontalCard
                                                v-bind="{
                                        idx: item.id,
                                        title: item.title,
                                        price: item.price,
                                        amount: item.amount,
                                        source: item.images[0]
                                        }"/>
                                    </v-col>
                                    <v-col cols="2" class="d-flex flex-row justify-center">
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
                            <v-divider/>
                        </template>
                    </v-virtual-scroll>
                    <v-divider/>
                    <v-row style="width: 100%" class="d-flex flex-row justify-center align-center">
                        <v-card-title>Итого: {{normalizePrice(totalPrice)}} руб.</v-card-title>
                        <v-spacer/>
                        <v-btn color="blue" v-on:click="toOrdering()">Оформить заказ<v-icon>mdi-chevron-right</v-icon></v-btn>
                    </v-row>
                </div>
            </div>
            <div key="ordering" id="order-user-info" ref="orderUserInfo" v-if="this.isOrdering">
                <v-card-actions>
                    <v-card-title>
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
                    <v-card-title>
                        Для подтверждения заказа, введите ваши данные
                    </v-card-title>
                    <v-form
                            style="width: 60%"
                            class="mx-10"
                            ref="form"
                            v-model="valid"
                            lazy-validation
                    >
                        <v-text-field
                                label="Имя"
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
<!--                    <v-card-title>-->
<!--                        Способы оплаты-->
<!--                    </v-card-title>-->
<!--                    <v-radio-group-->
<!--                            class="mx-4"-->
<!--                            :error-messages="radioError"-->
<!--                            v-model="requisites.paymentMethod">-->
<!--                        <v-radio v-for="method of paymentMethods"-->
<!--                                 :key="method.id"-->
<!--                                 :label="method.value"-->
<!--                                 :value="method.value"-->
<!--                                 :readonly="method.disabled"-->
<!--                                 :ripple="true"-->
<!--                                 :color="method.disabled ? 'gray' : 'black'"-->
<!--                        >-->

<!--                        </v-radio>-->
<!--                    </v-radio-group>-->
<!--                    <v-divider/>-->
                    <v-textarea class="mx-4"
                                v-model="requisites.comment"
                                label="Комментарий к заказу"
                    >
                    </v-textarea>
                    <v-divider/>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn block color="blue" v-on:click="validateAndOrder()">Подтвердить заказ</v-btn>
                    </v-card-actions>
                </div>
            </div>
        </transition>
        <v-card-title v-if="!products || products.length === 0"
                      class="d-flex flex-column align-center justify-center ">
            В корзине пусто!
        </v-card-title>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL, normalizePrice} from "../../utils/settings";
    import HorizontalCard from "../products/HorizontalCard";
    import eventBus from "../../utils/eventBus";

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
                valid: false,
                radioError: null
            }
        },
        methods: {
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
                this.$refs.form.validate();
                if (!this.requisites.paymentMethod || !this.requisites.paymentMethod.length === 0) {
                    this.radioError = 'Выберете тип оплаты'
                } else {
                    this.radioError = '';
                    axios.post(getURL('session/checkout'), {
                        requisites: this.requisites,
                        total: this.totalPrice
                    }, {withCredentials: true}).then(()=> {
                        this.loadCart();
                        this.toCart();
                    })
                }
            }
        },
        mounted() {
            this.loadCart();
        }
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
