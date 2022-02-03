<template>
    <v-card dark height="4rem">
    <v-toolbar elevation="0"
               dark
               color="transparent"
               class="mx-auto"
               width="60%"
    >
        <div class="text-center">
            <v-menu offset-y open-on-hover>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                            color="transparent"
                            v-bind="attrs"
                            v-on="on"
                    >
                        Монтаж и сервис
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                            v-for="(item, index) in inst_items"
                            :key="index"
                            link
                            :to="item.link"
                    >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <v-divider vertical/>
        <div class="text-center">
            <v-menu offset-y open-on-hover>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                            color="transparent"
                            v-bind="attrs"
                            v-on="on"
                    >
                        Кондиционеры
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                            v-for="(item, index) in conditions"
                            :key="index"
                            link
                            :to="item.link"
                    >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <v-divider vertical/>
        <div class="text-center">
            <v-menu offset-y open-on-hover>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                            color="transparent"
                            v-bind="attrs"
                            v-on="on"
                    >
                        Вентиляция
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                            v-for="(item, index) in air_items"
                            :key="index"
                            link
                            :to="item.link"
                    >
                        <v-list-item-title >{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </v-toolbar>
    </v-card>
</template>

<script>
    export default {
        name: "MinorAppBar",
        data: () => ({
            inst_items: [
                { title: 'Установка кондеев', link: '/category/1' },
                { title: 'Прокладка трассы', link: '/category/2' }
            ],
            conditions: [
                { title: 'Настенные кондеи', link: '/category/3' },
                { title: 'Мобильные кондеи', link: '/category/4' }
            ],
            air_items: [
                { title: 'Бытовые вентиляторы', link: '/category/5' },
                { title: 'Электрические вентиляторы', link: '/category/6' }
            ],
        })
    }
</script>

<style scoped>

</style>
