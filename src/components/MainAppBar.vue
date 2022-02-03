<template>
    <v-card height="5rem">
    <v-toolbar elevation="0"
               class="mx-auto py-4"
               width="60%"
               height="auto"
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

        <v-toolbar-title class="mx-4 mt-2 text-center">
            Флагман
        </v-toolbar-title>
        <v-spacer/>
        <v-text-field
                hide-details
                prepend-icon="mdi-magnify"
                single-line
                placeholder="Поиск"
                color="black"
        ></v-text-field>
        <div class="mx-4 text-center">
            <v-menu offset-y link>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                            color="transparent"
                            v-bind="attrs"
                            v-on="on"
                    >
                        Позвонить
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                            v-for="(item, index) in items"
                            :key="index"
                            link
                    >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <v-spacer/>
        <v-divider vertical/>
        <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
            <v-badge overlap bordered content="2" class="mx-4">
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
                <v-badge  overlap bordered  content="6" class="mx-4">
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
                <v-badge overlap bordered content="10"  class="mx-4">
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
        <v-spacer/>
    </v-toolbar>
    </v-card>
</template>

<script>
    export default {
        name: "MainAppBar",
        data: () => ({
            items: [
                { title: '+7 963 040 47 18' },
                { title: '+7 800 555 35 35' },
                { title: 'А позвоните-ка вы мне'}
            ],
        }),
        props: {
            onCartClick: Function,
            onHeartClick: Function,
            onAbacusClick: Function,
            onCalculateClick: Function,
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
