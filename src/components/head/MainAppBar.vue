<template>
    <v-sheet :style="cssProps" class="py-1">
        <div class="app-bar__main-scope mx-auto">
            <v-row class="ma-0" align="end">
                <!--<logo>-->
                <v-col cols="3">
                    <v-row class="ma-0" align="center">
                        <v-col cols="4" class="pa-0">
                            <v-img :src="logo.image"
                                   v-if="logo.image"
                                   alt="SpaceCraftImage"
                                   v-on:click="goToMain()"
                                   contain
                                   style="cursor: pointer;"
                            />
                        </v-col>
                        <!--</logo>-->
                        <v-col cols="7" class="pa-0">
                            <v-card-title class="app-bar__adaptive-title"
                                          :style="{color: logo.textColor}"
                                          v-html="logo.title"
                                          v-if="logo.title">
                            </v-card-title>
                            <v-card-subtitle
                                    class="app-bar__adaptive-subtitle"
                                    :style="{color: logo.textColor}"
                                    v-html="logo.subtitle"
                                    v-if="logo.subtitle"
                            >
                            </v-card-subtitle>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col  cols="6">
                    <v-row align="end">
                        <v-col cols="7" class="d-flex flex-column align-start justify-end">
                            <div class="d-flex flex-row">
                                <v-icon size="16" class="app-bar__adaptive-features mx-1">mdi-clock-outline</v-icon>
                                <span class="app-bar__adaptive-features-long">пн-пт 9:00-18:00</span>
                            </div>
                            <div class="d-flex flex-row">
                                <v-icon size="16" class="app-bar__adaptive-features mx-1">mdi-map-marker-outline
                                </v-icon>
                                <span class="app-bar__adaptive-features-long overflow-x-hidden">Екатеринбург, ул. Анатолия Муранова, 18, 6.2</span>
                            </div>
                        </v-col>
                        <v-col class="app-bar__adaptive-phone d-flex flex-column align-center justify-end" cols="5">+7
                            (912) 291-16-65
                        </v-col>
                    </v-row>
                    <v-row class="d-flex flex-row">
                        <v-col cols="7">
                            <search-bar></search-bar>
                        </v-col>
                        <v-col cols="5">
                            <v-btn dark class="rounded-xxl elevation-0" style="width: 100%; height: 40px;"
                                   :color="common.color" v-on:click="showCallView = true">
                                <span class="app-bar__adaptive-phone-btn">Заказать звонок</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>


                <v-col class="d-flex flex-column" cols="3">
                    <v-row align="end">
                        <v-col class="d-flex flex-column align-center justify-center pb-0" cols="4">
                            <v-badge color="red" overlap bordered :content="favourite" :value="favourite > 0">
                                <v-icon x-small :color="common.color" class="app-bar__adaptive-icons"
                                        v-on:click="profile.openFavourite()">mdi-heart
                                </v-icon>
                            </v-badge>
                            <span class="app-bar__adaptive-features-long">избранное</span>
                        </v-col>

                        <v-col class="d-flex flex-column align-center justify-center pb-0" cols="4">
                            <v-badge color="red" overlap bordered :content="compare" :value="compare > 0">
                                <v-icon small :color="common.color" class="app-bar__adaptive-icons"
                                        v-on:click="$router.push('/compare')">mdi-abacus
                                </v-icon>
                            </v-badge>
                            <span class="app-bar__adaptive-features-long">сравнить</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="d-flex flex-column align-center justify-center " cols="4">
                            <v-icon class="app-bar__adaptive-icons" :color="common.color"
                                    v-on:click="profile.openCart()">mdi-cart-variant
                            </v-icon>
                            <span class="app-bar__adaptive-features-long">корзина</span>
                        </v-col>
                        <v-divider class="my-3" vertical></v-divider>

                        <v-col class="d-flex flex-column align-start justify-center" cols="8">
                            <p class="app-bar__adaptive-icons-text font-weight-bold ma-0">{{cart}}
                                товар{{ending}}
                            </p>
                            <p class="app-bar__adaptive-icons-text ma-0" v-if="cart">на сумму
                                {{normalizePrice(cartSum)}} руб.
                            </p>
                        </v-col>
                    </v-row>

                    <!--</search and shortcuts>-->
                </v-col>
            </v-row>
        </div>

        <v-overlay
                style="position:fixed;"
                :value="showCallView"
                v-on:click="showCallView = false"
                :absolute="true"
        >
            <v-card class="d-flex flex-column justify-center align-center"
                    v-on:click.stop="">
                <transition name="slide-fade">
                    <div v-if="!callOpts.requestSent">
                        <v-card-actions>
                            <v-card-title class="justify-center">
                                Заказать обратный звонок
                            </v-card-title>
                            <v-spacer/>
                            <v-btn class="transparent elevation-0" v-on:click="showCallView = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-card-actions>
                        <v-form class="mt-2 mx-8" v-model="callOpts.valid">
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
                    </div>
                    <v-card-title class="text-center pa-2 white--text" v-if="callOpts.requestSent">
                        Спасибо за заявку<br/>Мы перезвоним вам в ближайшее время!
                    </v-card-title>
                </transition>
            </v-card>
        </v-overlay>


    </v-sheet>
</template>

<script>
    import axios from 'axios';
    import {normalizePrice, getURL} from "../../utils/settings";
    import eventBus from "../../utils/eventBus";
    import * as profile from "../../utils/profile";
    import loader from "../../utils/customizeOptions";
    import SearchBar from "../utility/SearchBar";

    export default {
        name: "MainAppBar",
        components: {SearchBar},
        data: () => ({
            profile,
            items: [
                {title: '+7 963 040 47 18', phone: true}
            ],
            cart: 0,
            viewed: 0,
            cartSum: 0,
            compare: 0,
            favourite: 0,
            showCallView: false,
            gridCols: 4,
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
            },
            logo: {
                image: null,
                title: null,
                subtitle: null,
                textColor: null,
            },
            cssProps: {background: 'white'},
            blockId: null,
            common: {color: 'primary'},
            cols: [
                {
                    name: 'logo',
                    cols: 2,
                },
                {
                    name: 'icons',
                    cols: 4,
                }
            ]
        }),
        async mounted() {
            this.loadUserInfo();

            await loader().loadOptions();
            this.logo.image = loader().getOption(['Header', 'MainBar', 'Logo', 'Image']);
            this.logo.title = loader().getOption(['Header', 'MainBar', 'Logo', 'Title']);
            this.logo.subtitle = loader().getOption(['Header', 'MainBar', 'Logo', 'Subtitle']);
            this.logo.textColor = loader().getOption(['Header', 'MainBar', 'Logo', 'Text']);
            this.blockId = loader().getOption(['Header', 'MainBar', 'Block']);
            this.common.color = loader().getOption(['Common', 'Schema', 'Colors', 'Primary']);

            this.cols = loader().getAsObjects(['Header', 'MainBar', 'Row'])
            console.log('cols settings: ', this.cols);
            this.cssProps.backgroundColor = loader().getOption(['Header', 'Background'])
            eventBus.$on('update-main-bar', () => {
                this.loadUserInfo();
            })

            eventBus.$on('show-callback', () => {
                this.showCallView = true;
            })
        },
        computed: {
            ending: function () {
                let end = 'ов';
                if (this.cart > 9 && this.cart < 20)
                    end = 'ов'
                switch (this.cart % 10) {
                    case 1:
                        end = '';
                        break;
                    case 2:
                    case 3:
                    case 4:
                        end = 'а';
                        break;
                    default:
                        end = 'ов';
                }
                return end;
            }
        },
        methods: {
            normalizePrice,
            goToMain() {
                this.$router.push('/')
            },
            getCall() {
                this.callOpts.requestSent = true;
                axios.post(getURL('session/checkout'), {
                    requisites: {
                        firstName: this.callOpts.name,
                        lastName: '',
                        phone: this.callOpts.phone,
                        email: '',
                        address: '',
                        comment: 'Заказ звонка',
                        paymentMethod: '',
                    },
                    total: 0
                }, {withCredentials: true});
                setTimeout(() => {
                    this.showCallView = false
                    this.callOpts.name = null;
                    this.callOpts.valid = false;
                    this.callOpts.requestSent = false;
                    this.callOpts.phone = '+7'
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
                axios.get(getURL('session/products/Cart'), {withCredentials: true})
                    .then(response => {
                        const session_info = response.data;
                        this.cartSum = session_info['total_price'];
                    });
            }
        }
    }
</script>

<style>
    .app-bar__main-scope {
        width: 70vw;
        font-family: system-ui, -apple-system, Arial, sans-serif;
    }

    @font-face {
        font-family: "Moniqa";
        src: local("Moniqa"),
        url(./../../assets/fonts/Moniqa-ExtLtCondItaHeading.ttf) format("truetype");
    }

    @font-face {
        font-family: "Moniqa-Thin";
        src: local("Moniqa-Thin"),
        url(./../../assets/fonts/Moniqa-ExtLtCondItaDisplay.ttf) format("truetype");
    }

    .app-bar__adaptive-title {
        font-size: calc(var(--index) * 1) !important;
        line-height: calc(var(--index) * 1) !important;
        font-weight: bold;
        cursor: default;
    }

    .app-bar-moniqa {
        font-family: Moniqa, serif;
    }

    .app-bar-moniqa-thin {
        font-family: Moniqa-Thin, serif;
    }

    .app-bar__adaptive-subtitle {
        font-size: calc(var(--index) * 1);
        line-height: calc(var(--index) * 1);
        font-weight: normal;
        cursor: default;
    }

    .app-bar__adaptive-phone {
        font-size: calc(var(--index) * 0.9);
    }

    .app-bar__adaptive-phone-btn {
        font-size: calc(var(--index) * 0.7);
        font-weight: 400;
    }


    .app-bar__adaptive-features {
        font-size: calc(var(--index) * 0.7);
    }

    .app-bar__adaptive-features-long {
        font-size: calc(var(--index) * 0.45);
    }

    .app-bar__adaptive-icons {
        font-size: calc(var(--index) * 1) !important;
    }

    .app-bar__adaptive-icons-text {
        font-size: calc(var(--index) * 0.6) !important;
    }

    @media screen and (max-width: 1280px) {
        .app-bar__main-scope {
            width: 85vw;
        }

        .app-bar__adaptive-features {
            font-size: calc(var(--index) * 0.8) !important;
        }
    }

    @media screen and (max-width: 960px) {
        .app-bar__main-scope {
            width: 100%;
        }

        .app-bar__adaptive-features {
            font-size: calc(var(--index) * 0.9) !important;
        }
    }

    .v-ripple__container {
        display: none !important;
    }

    .slide-fade-enter-active {
        transition: all .3s;
    }

    .slide-fade-leave-active {
        transition: all .3s;
    }

    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(200px);
        opacity: 0;
    }
</style>
