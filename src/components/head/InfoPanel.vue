<template>
    <v-sheet class="rounded-0 elevation-0" color="white">
        <v-card style="background-color: #f5f5f5" class="rounded-0 elevation-0 mx-auto info-panel__main-scope">
            <v-card-actions class="d-flex flex-row justify-start">
                <v-btn v-for="btn of infoItems" :key="btn.id"
                       class="transparent text-capitalize"
                       elevation="0"
                       :to="btn.link"
                       style="height: inherit;">
                    <span class="info-panel__adaptive-font">{{btn.name}}</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-sheet>
</template>

<script>
    export default {
        name: "InfoPanel",
        data () {
            return {
                infoItems: [
                    // {
                    //     id: 0,
                    //     name: 'О компании',
                    //     link: '/about'
                    // },
                    {
                        id: 1,
                        name: 'Отзывы',
                        link: '/comments'
                    },
                    {
                        id: 2,
                        name: 'Галерея',
                        link: '/gallery'
                    },
                    // {
                    //     id: 3,
                    //     name: 'Доставка',
                    //     link: '/delivery'
                    // },
                    {
                        id: 4,
                        name: 'Оплата',
                        link: '/payment'
                    },
                    // {
                    //     id: 5,
                    //     name: 'Гарантия',
                    //     link: '/warranty'
                    // },
                    {
                        id: 6,
                        name: 'Полезная информация',
                        link: '/payload'
                    },
                    {
                        id: 7,
                        name: 'Контакты',
                        link: '/contacts'
                    }
                ]
            }
        }
    }
</script>

<style>

    .info-panel__main-scope {
        overflow: auto;
        overflow-y: hidden;
        width: 70vw;
    }

    .info-panel__adaptive-font {
        font-size: calc(var(--index) * 0.5);
        font-weight: initial;
    }
    @media screen and (max-width: 1280px){
        .info-panel__main-scope {
            overflow: auto;
            overflow-y: hidden;
            width: 85%;
            margin: 0 auto;
        }
        .info-panel__adaptive-font {
            font-size: calc(var(--index) * 0.8);
        }
    }
    @media screen and (max-width: 960px){
        .info-panel__main-scope {
            width: 100%;
            margin: 0 auto;
        }
        .info-panel__adaptive-font {
            font-size: calc(var(--index) * 0.8);
        }
    }
</style>
