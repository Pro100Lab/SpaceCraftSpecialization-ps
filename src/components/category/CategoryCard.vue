<template>
    <v-hover v-slot="{ hover }" class="scale">
        <v-card
                :elevation="hover ? 6 : 0"
                width="240"
                class="d-flex flex-column fill-height"
                v-on:click="goToCategory(id)"
        >
            <v-img :src="getStatic(image)"
                   class="v-image__image--cover my-2"
                   :class="hover ? 'scaled' : 'unscaled'"
                   height="75"
                   contain
                    v-if="image"/>
            <v-card-title class="text-left text-wrap text-break category-card-adaptive my-0 text-break"
                          v-if="title">
                {{title}}
            </v-card-title>
        </v-card>
    </v-hover>
</template>

<script>
    import {getURL} from '../../utils/settings.js';
    import {getStatic} from "../../utils/settings";
    export default {
        name: "CategoryCard",
        props: ['id', 'title', 'description', 'image'],
        methods: {
            getURL, getStatic,
            goToCategory(id) {
                this.$router.push(`/category/${id}`)
            }
        }
    }
</script>

<style>
    .category-card-adaptive{
        font-size: calc(var(--index) * 0.9);
        line-height: calc(var(--index) * 1);
    }

    @media screen and (max-width: 1280px) {
        font-size: calc(var(--index) * 1.3);
        line-height: calc(var(--index) * 1.4);
    }
    .scale {
        display: inline-block; /* Строчно-блочный элемент */
        overflow: hidden; /* Скрываем всё за контуром */
    }
    .scaled {
        transition: .2s; /* Время эффекта */
        display: block; /* Убираем небольшой отступ снизу */
        transform: scale(1.15) /* Увеличиваем масштаб */
    }

    .unscaled {
        transition: .2s; /* Время эффекта */
        transform: scale(1) /* Увеличиваем масштаб */

    }
</style>
