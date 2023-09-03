<template>
    <v-card color="rgba(0,0,0,0.5)" class="d-flex flex-column">
        <section class="fl-footer">
        <div class="footer__main-scope mx-auto">
            <v-sheet class="transparent d-flex flex-row justify-space-between align-start" style="height: 70%" dark>
                <div class="d-flex flex-column justify-center align-start mt-4">
                    <div class="d-flex flex-column align-center">
                        <v-img :src="require('../assets/logo.png')"
                               alt="Галактика. Хостел и гостиница"
                               contain
                               class="py-2 footer__logo"
                               style="cursor: pointer"
                               v-on:click="goToMain()"
                        />
                        <div class="d-flex flex-column align-center justify-end">
                            <v-card-title class="footer__title py-2">
                                Галактика
                            </v-card-title>
                        <v-card-subtitle class="text-break footer__subtitle" >
                            Хостел и гостиница
                        </v-card-subtitle>
                        </div>
                    </div>
                </div>

                <div class="d-flex flex-column mt-4">
                    <p class="footer__title"><strong>Информация</strong></p>
                    <div class="d-flex" :class="isMobile ? 'flex-column justify-start align-start' : 'd-flex flex-row'">
                        <div class="d-flex flex-column align-start">
                            <v-btn v-for="info of infoPages.slice(0, 3)"
                                   :key="info.id"
                                   :ripple="false"
                                   class="px-0 no-background-hover hrefWrap transparent text-capitalize fill-height minor-bar__adaptive-font my-1"
                                   elevation="0"
                                   :to="info.id"
                                   style="height: inherit;">
                                <span class="footer__subtitle">{{info.text}}</span>
                            </v-btn>
                        </div>
                            <div class="d-flex flex-column align-start">
                                <v-btn v-for="info of infoPages.slice(3, 6)"
                                       :key="info.id"
                                       :ripple="false"
                                       class="px-3m no-background-hover hrefWrap transparent text-capitalize fill-height minor-bar__adaptive-font my-1"
                                       elevation="0"
                                       :to="info.id"
                                       style="height: inherit;">
                                    <span class="footer__subtitle">{{info.text}}</span>
                                </v-btn>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-column justify-center align-start mt-4">
                    <p class="footer__title"><strong>Контакты</strong></p>
                    <div v-for="(contact, i) of contacts" :key="i" class="d-flex flex-row align-center pb-1">
                        <v-icon small class="footer__subtitle" v-if="contact.icon">{{contact.icon}}</v-icon>
                        <span class="ml-2 hrefWrap footer__subtitle">{{contact.text}}</span>
                    </div>
                    <div class="d-flex flex-row py-2">
                        <a href="https://vk.com/galaxyhotels">
                            <v-img class="SocIcon mr-1" :src="require('../assets/icon/ic-vkontakte.svg')" target="_blank" rel="noopener noreferrer">
                            </v-img>
                        </a>

                        <a target="_blank" href="https://api.whatsapp.com/send/?phone=79512704641&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D1%85%D0%BE%D1%87%D1%83%20%D0%B7%D0%B0%D0%B1%D1%80%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D1%83%20%D0%B2%D0%B0%D1%81%20%D0%BD%D0%BE%D0%BC%D0%B5%D1%80%21&type=phone_number&app_absent=0">
                        <v-img class="SocIcon mx-1" :src="require('../assets/icon/ic-whatsapp.svg')">
                        </v-img>
                        </a>
                    </div>
                </div>
            </v-sheet>
            <v-sheet class="transparent mx-auto text-center d-flex flex-row footer__main-scope" dark style="height: 20%">
                <div class="mx-auto text-center my-0 py-0">
                    <p style="text-align: left;" class="py-2 footer__subtitle">Информация на сайте не является офертой. Вся информация на сайте представлена в информационных целях о реализуемой продукции и не является рекламой. Продолжая пользоваться сайтом, Вы подтверждаете, что принимаете Пользовательское соглашение и Политику обработки персональных данных, Политику в отношении файлов cookie.
                    </p>
                </div>
                <div  class="my-0 py-0">
                    <v-btn class="transparent mx-2"
                           :elevation="0"
                           :ripple="true"
                           v-on:click="eventBus.$emit('show-callback')"
                    ><span class="footer__title">Позвоните мне</span></v-btn>
                </div>
            </v-sheet>
        </div>
        </section>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../utils/settings";
    import eventBus from "../utils/eventBus";

    export default {
        name: "Footer",
        computed: {
          isMobile: function() {
              return window.innerWidth < 960;
          }
        },
        data: () => {
            return {
                eventBus,
                rootCategories: [],
                infoPages: [{
                    id: '/about',
                    text: 'О компании'
                },
                    {
                        id: '/comments',
                        text: 'Отзывы'
                    },
                    {
                        id: '/gallery',
                        text: 'Галерея'
                    },
                    {
                        id: '/payment',
                        text: 'Оплата'
                    },
                    {
                        id: '/payload',
                        text: 'Информация'
                    },
                    {
                        id: '/contacts',
                        text: 'Контакты'
                    }],
                contacts: [{
                    icon: 'mdi-map-marker',
                    text: 'г. Шадринск, ул. Карла Маркса 90Б'
                },
                    {
                        icon: 'mdi-phone',
                        text: '+7 (951) 270-46-41'
                    },
                    {
                        icon: 'mdi-clock-outline',
                        text: 'Каждый день: круглосуточно'
                    },
                    {
                        icon: 'mdi-email',
                        text: 'RazeTheShadow@yandex.ru',
                        processor: 'email'
                    }]
            }
        },
        methods: {
            goToPage(route) {
                this.$router.push(route);
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            },
            goToCategory(idx) {
                this.goToPage(`/category/${idx}`);

            },
            goToMain() {
                this.goToPage('/');
            }
        },
        beforeCreate() {
            axios.get(getURL('categories'))
                .then(response => {
                    this.rootCategories = response.data;
                });
        }
    }
</script>

<style>
    .footer__logo {
        height: calc(var(--index) * 7);
        max-width: calc(var(--index) * 7);
    }

    .footer__title {
        font-size: calc(var(--index) * 0.9)
    }
    .footer__subtitle {
        font-size: calc(var(--index) * 0.6)
    }

    .footer__main-scope {
        overflow-x: hidden;
        overflow-y: hidden;
        width: 70vw;
    }

    .SocIcon {
        max-width: calc(var(--index) * 1);
    }

    @media screen and (max-width: 1280px){
        .footer__main-scope {
            width: 80%;
        }

        .SocIcon {
            max-width: calc(var(--index) * 1.5);
        }
    }
    @media screen and (max-width: 960px){
        .footer__main-scope {
            width: 95%;
        }
        .SocIcon {
            max-width: calc(var(--index) * 3);
        }
        .footer__title {
            font-size: calc(var(--index) * 1.2)
        }
        .footer__subtitle {
            font-size: calc(var(--index) * 0.6)
        }

    }


    .hrefWrap {
        color: #ffffff;
    }

    .no-background-hover::before {
        background-color: transparent !important;
    }
</style>
