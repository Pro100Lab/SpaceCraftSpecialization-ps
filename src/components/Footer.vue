<template>
    <v-card :color="background" class="d-flex flex-column elevation-0">
        <section class="fl-footer">
        <div class="footer__main-scope mx-auto">
            <v-sheet :class="`transparent d-flex ${isMobile ?
            'flex-column align-center' : 'flex-row justify-space-between align-start'}`"
                     style="height: 70%" dark>
                <div class="d-flex flex-column justify-center align-start mt-4">
                    <div class="d-flex flex-column align-center">
                        <v-img :src="logo.image"
                               v-if="logo.image"
                               alt="Лого"
                               contain
                               class="footer__logo"
                               style="cursor: pointer"
                               v-on:click="goToMain()"
                        />
                        <div
                                v-if="logo.title"
                                class="d-flex flex-column align-center justify-end">
                            <v-card-title class="footer__title py-2"
                            v-html="logo.title"
                            >
                            </v-card-title>
                        <v-card-subtitle
                                v-if="logo.subtitle"
                                v-html="logo.subtitle"

                                class="text-break footer__subtitle" >

                        </v-card-subtitle>
                        </div>
                    </div>
                </div>

                <div class="d-flex flex-column mt-4" v-if="infoPages && infoPages.length > 0">
                    <p class="footer__title"><strong>Информация</strong></p>
                    <div class="d-flex" :class="isMobile ? 'flex-column justify-start align-start' : 'd-flex flex-row'">
                        <div class="d-flex flex-column align-start">
                            <v-btn v-for="info of infoPages.slice(0, 3)"
                                   :key="info.name"
                                   :ripple="false"
                                   class="px-0 no-background-hover hrefWrap transparent text-capitalize fill-height minor-bar__adaptive-font my-1"
                                   elevation="0"
                                   :to="info.value"
                                   style="height: inherit;">
                                <span class="footer__subtitle hover-underline-animation">{{info.name}}</span>
                            </v-btn>
                        </div>
                            <div class="d-flex flex-column align-start">
                                <v-btn v-for="info of infoPages.slice(3, 6)"
                                       :key="info.name"
                                       :ripple="false"
                                       class="px-3m no-background-hover hrefWrap transparent text-capitalize fill-height minor-bar__adaptive-font my-1"
                                       elevation="0"
                                       :to="info.value"
                                       style="height: inherit;">
                                    <span class="footer__subtitle hover-underline-animation">{{info.name}}</span>
                                </v-btn>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-column justify-center align-start mt-4" v-if="contacts && contacts.length > 0">
                    <p class="footer__title"><strong>Контакты</strong></p>
                    <div v-for="(contact, i) of contacts" :key="i" class="d-flex flex-row align-center pb-1">
                        <v-icon small class="footer__subtitle" v-if="contact.name">{{contact.value}}</v-icon>
                        <span class="ml-2 hrefWrap footer__subtitle">{{contact.name}}</span>
                    </div>
                    <div class="d-flex flex-row py-2">
                        <a v-for="social of socials" :key='`social-${social.name}`'
                           :href="social.value">
                            <v-img class="SocIcon mr-1"
                                   :src="socIcons[social.name]"
                                   target="_blank" rel="noopener noreferrer">
                            </v-img>
                        </a>
                    </div>
                </div>
            </v-sheet>
            <v-sheet class="transparent mx-auto text-center d-flex flex-row footer__main-scope" dark style="height: 20%">
                <div class="mx-auto text-center my-0 py-0">
                    <p style="text-align: left;" class="py-2 footer__subtitle"
                       v-html="cookiesText"
                    >
                    </p>
                </div>
                <div  class="my-0 py-0">
                    <v-btn class="transparent mx-2"
                           :elevation="0"
                           :ripple="true"
                           v-on:click="eventBus.$emit('show-callback')"
                    ><span class="footer__title" v-if="callMe && callMe.text">{{callMe.text}}</span></v-btn>
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
    import loader from "../utils/customizeOptions";
    import * as fb from '../assets/icon/ic-facebook.svg';
    import * as inst from '../assets/icon/ic-instargam.svg';
    import * as tw from '../assets/icon/ic-twitter.svg';
    import * as vk  from '../assets/icon/ic-vkontakte.svg';
    import * as whatapp from '../assets/icon/ic-whatsapp.svg';

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
                infoPages: [],
                cookiesText: '',
                contacts: [],
                socials: [],
                socIcons: {
                    'VK': vk,
                    'WhatsApp': whatapp,
                    'FB': fb,
                    'Inst': inst,
                    'Twitter': tw
                },
                logo: {
                    image: null,
                    title: null,
                    subtitle: null,
                },
                callMe: {
                    text: null
                },
                background: null
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
        },
        async mounted() {
            await loader().loadOptions();
            this.infoPages = loader().getOptions(['Footer', 'Information']);
            this.contacts = loader().getOptions(['Footer', 'Contacts']);
            this.socials = loader().getOptions(['Footer', 'Social']);
            this.cookiesText = loader().getOption(['Footer', 'Cookies']);

            this.logo.image = loader().getOption(['Footer', 'Logo', 'Image']);
            this.logo.title = loader().getOption(['Footer', 'Logo', 'Title']);
            this.logo.subtitle = loader().getOption(['Footer', 'Logo', 'Subtitle']);

            this.callMe.text = loader().getOption(['Footer', 'CallMe', 'Text']);

            this.background = loader().getOption(['Footer', 'Background']);
        }
    }
</script>

<style>
    .footer__logo {
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
