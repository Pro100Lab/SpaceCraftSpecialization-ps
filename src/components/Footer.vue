<template>
    <v-card dark height="18rem" class="d-flex flex-column">
        <v-row class="mx-auto text-left py-3" style="width: 70%; height: 70%">
            <v-col cols="3">
                <p><strong>Лого</strong></p>
            </v-col>
            <v-col cols="3">
                <p><strong>Каталог</strong></p>
                <v-row v-for="category of rootCategories" :key="category.id" class="my-1 d-flex flex-row align-center">
                    <v-icon>mdi-chevron-right</v-icon>
                    <router-link style="color: #ffffff; font-size: 0.9rem" :to="`/category/${category.id}`">{{category.title}}</router-link>
                </v-row>
            </v-col>
            <v-col cols="3">
                <p><strong>Информация</strong></p>
                <v-row>
                <v-col cols="4">
                    <v-row v-for="info of infoPages.slice(0, 3)" :key="info.id" class="my-1">
                        <router-link style="color: #ffffff; font-size: 0.9rem" :to="`/info/${info.id}`">{{info.text}}</router-link>
                    </v-row>
                </v-col>
                <v-col cols="8">
                    <v-row v-for="info of infoPages.slice(3, 6)" :key="info.id" class="my-1 ">
                        <router-link style="color: #ffffff; font-size: 0.9rem" :to="`/info/${info.id}`">{{info.text}}</router-link>
                    </v-row>
                </v-col>
                </v-row>
            </v-col>
            <v-col cols="3">
                <p><strong>Контакты</strong></p>
                <v-row v-for="(contact, i) of contacts" :key="i" class="my-3 ">
                    <v-icon small v-if="contact.icon">{{contact.icon}}</v-icon>
                    <span style="font-size: 0.8rem" class="ml-2">{{contact.text}}</span>
                </v-row>
            </v-col>
        </v-row>
        <v-row class="mx-auto text-center my-0 py-0" style="width: 70%; height: 20%">
            <v-spacer/>
            <v-col cols="8" class="mx-auto text-center my-0 py-0">
                <p style="font-size: 0.7rem; text-align: left;" class="py-2">Информация на сайте не является офертой. Вся информация на сайте представлена в информационных целях о реализуемой продукции и не является рекламой. Продолжая пользоваться сайтом, Вы подтверждаете, что принимаете Пользовательское соглашение и Политику обработки персональных данных, Политику в отношении файлов cookie.
                </p>
            </v-col>
            <v-col cols="3" class="mx-auto text-center my-0 py-0">
                <p style="font-size: 1.3rem;">
                    <a style="color:white" :href="`tel:+79630404718`">+7 (963) 040 47 18</a>
                    <v-btn class="transparent"
                           :elevation="0"
                           :ripple="true"
                           style="font-size: 0.9rem;"
                           v-on:click="eventBus.$emit('show-callback')"
                    >обратный звонок</v-btn>
                </p>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../settings";
    import eventBus from "../eventBus";

    export default {
        name: "Footer",
        data: () => {
            return {
                eventBus,
                rootCategories: [],
                infoPages: [{
                    id: 0,
                    text: 'О компании'
                },
                {
                    id: 1,
                    text: 'Фото работ'
                },
                {
                    id: 2,
                    text: 'Доставка'
                },
                {
                    id: 3,
                    text: 'Оплата'
                },
                {
                    id: 4,
                    text: 'Гарантия'
                },
                {
                    id: 5,
                    text: 'Пеолзная инофрмация'
                }],
                contacts: [{
                        icon: 'mdi-map-marker',
                        text: '620085, г. Екатеринбург,'
                    },
                    {
                        icon: 'mdi-phone',
                        text: '+7-932-125-27-27 с 10:00 до 18:00'
                    },
                    {
                        icon: 'mdi-email',
                        text: 'info@flagman.ru',
                        processor: 'email'
                    }]
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

<style scoped>
    .one-line {
        overflow: hidden;
        white-space: nowrap;
    }
</style>
