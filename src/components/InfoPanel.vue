<template>
    <v-sheet class="fill-height rounded-0 elevation-0 fill-height white" style="width: 100%">
        <v-card style="width: 60%; background-color: #f5f5f5" class="rounded-0 elevation-0 mx-auto fill-height">
        <v-card-actions class="d-flex flex-row">
            <v-btn v-for="btn of infoItems" :key="btn.id"
                   class="transparent text-capitalize fill-height"
                   elevation="0"
                   :to="btn.link"
                   style="height: inherit; font-size: 0.8rem">
                {{btn.name}}
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
                    {
                        id: 0,
                        name: 'О компании',
                        link: '/about'
                    },
                    {
                        id: 1,
                        name: 'Отзывы',
                        link: '/comments'
                    },
                    {
                        id: 2,
                        name: 'Фото работ',
                        link: '/gallery'
                    },
                    {
                        id: 3,
                        name: 'Доставка',
                        link: '/delivery'
                    },
                    {
                        id: 4,
                        name: 'Оплата',
                        link: '/payment'
                    },
                    {
                        id: 5,
                        name: 'Гарантия',
                        link: '/warranty'
                    },
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

<style scoped>

</style>
