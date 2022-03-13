<template>
    <v-card>
    <v-toolbar elevation="0"
               class="mx-auto"
               style="width: 60%"
    >
        <a href="/">
            <v-avatar tile >
            <v-img :src="require('../assets/flagman-logo.png')"
                   alt="Флагман. Всё о кондиционерах"
                   contain
                   aspect-ratio="1"
            />
            </v-avatar>
        </a>

        <v-toolbar-title class="mx-4 text-center">
            Флагман
        </v-toolbar-title>
        <v-spacer/>
        <SearchBar/>
        <v-spacer/>
        <div class="mx-4 text-center">
            <v-menu offset-y link>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                            color="transparent"
                            v-bind="attrs"
                            v-on="on"
                            :ripple="false"
                            class="elevation-0"
                    >
                        <v-icon class="mx-2">
                            mdi-phone
                        </v-icon>
                        Позвонить
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                            v-for="(item, index) in items"
                            :key="index"
                    >
                        <a v-if="item.phone" style="color: black" :href="`tel:${item.title}`">{{ item.title }}</a>
                        <a v-else style="color: black" v-on:click="showCallView = true">{{ item.title }}</a>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <v-spacer/>
        <v-divider vertical/>
        <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
            <v-badge overlap bordered :content="cart" class="mx-4" :value="cart > 0">
            <v-icon large v-bind="attrs" v-on="on" v-on:click="onCartClick()">mdi-cart-variant</v-icon>
            </v-badge>
        </template>
            <span>
                Корзина с товарами
            </span>
        </v-tooltip>
        <v-divider vertical/>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-badge  overlap bordered  :content="favourite" class="mx-4" :value="favourite > 0">
                <v-icon large v-bind="attrs" v-on="on" v-on:click="onHeartClick()">mdi-heart</v-icon>
                </v-badge>
            </template>
            <span>
                Сердечко
            </span>
        </v-tooltip>
        <v-divider vertical/>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-badge overlap bordered :content="compare"  class="mx-4" :value="compare > 0">
                <v-icon large v-bind="attrs" v-on="on" v-on:click="onAbacusClick()">mdi-abacus</v-icon>
                </v-badge>
            </template>
            <span>
                Сравнить товары
            </span>
        </v-tooltip>
        <v-divider vertical/>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-icon large class="mx-4" v-bind="attrs" v-on="on" v-on:click="onCalculateClick()">mdi-calculator</v-icon>
            </template>
            <span>
                Рассчитать мощность
            </span>
        </v-tooltip>

        </v-toolbar>

        <v-overlay
                style="position:fixed;"
                :value="showCallView"
                v-on:click="showCallView = false"
                :absolute="true"
        >
        </v-overlay>

        <v-card style="width: 30%; height: 40%; position: fixed; bottom:30%; left:35%; z-index: 100" v-if="showCallView">
            <v-card-title class="justify-center">
                Заказать обратный звонок
            </v-card-title>

            <v-form class="mt-2 mx-8" v-model="callOpts.valid">
                <v-text-field
                        label="Введите ваше имя"
                        v-model="callOpts.name"
                        :rules="callOpts.nameRule"
                        required
                >
                </v-text-field>
                <v-text-field
                        class="my-4"
                        label="Введите телефон"
                        v-model="callOpts.phone"
                        :rules="callOpts.phoneRule"
                        required
                >
                </v-text-field>
            </v-form>
            <v-card-actions>
                <v-btn :disabled="!callOpts.valid" block color="blue" v-on:click="getCall()">
                    Отправить заявку
                </v-btn>
            </v-card-actions>
            <h4 class="text-center" style="color: green" v-if="callOpts.requestSent">
                Спасибо за заявку!<br/>Мы перезвоним вам в ближайшее время!
            </h4>
        </v-card>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../settings";
    import eventBus from "../eventBus";
    import SearchBar from "./SearchBar";

    export default {
        name: "MainAppBar",
        components: {SearchBar},
        data: () => ({
            items: [
                { title: '+7 963 040 47 18', phone: true },
                { title: '+7 800 555 35 35', phone: true },
                { title: 'Заказать звонок', phone: false}
            ],
            cart: 0,
            viewed: 0,
            compare: 0,
            favourite: 0,
            showCallView: false,
            callOpts: {
                requestSent: false,
                valid: false,
                name: '',
                nameRule: [
                    v => !!v || 'Имя обязательно',
                    v => v.length > 3 || 'Минимальная длина поля - 4 символа',
                    v => !/[\da-zA-Z]/.test(v) || 'Имя может содержать только русские буквы и пробелы'
                ],
                phone: '+7',
                phoneRule: [
                    v => !!v || 'Телефон обязателен, иначе мы не сможем позвонить!',
                    v => v.length > 10 || 'Минимальная длина поля - 10 символов',
                    v => !/[a-zA-Zа-яА-ЯёЁ]/.test(v) || 'Телефон должен состоять из цифр и символов "(", ")", "-"'
                ],
            }
        }),
        props: {
            onCartClick: Function,
            onHeartClick: Function,
            onAbacusClick: Function,
            onCalculateClick: Function,
        },
        mounted() {
            this.loadUserInfo();
            eventBus.$on('update-main-bar', () => {
                this.loadUserInfo();
            })

            eventBus.$on('show-callback', () => {
                this.showCallView = true;
            })
        },
        methods: {
            getCall() {
                this.callOpts.requestSent = true;
                setTimeout(() => {
                    this.showCallView = false
                    this.callOpts.phone = null;
                    this.callOpts.name = null;
                    this.callOpts.requestSent = false;
                }, 2000)
            },
            loadUserInfo() {
                axios.get(getURL('session'), {withCredentials: true})
                    .then(response => {
                        const session_info = response.data;
                        this.cart = session_info.cart;
                        this.viewed = session_info.viewed;
                        this.compare = session_info.compare;
                        this.favourite = session_info.favourite;
                    });
            }
        }
    }
</script>

<style scoped>
    .v-icon:not(.on-hover) {
        color: darkblue;
    }

    .v-icon:hover {
        color: blue
    }
</style>
