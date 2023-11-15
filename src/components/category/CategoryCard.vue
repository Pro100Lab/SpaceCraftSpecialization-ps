<template>
    <v-hover v-slot="{ hover }" class="scale">
        <v-card
                :elevation="hover ? 6 : 0"
                width="240"
                class="d-flex flex-column fill-height py-2 transparent"
                v-on:click="goToCategory(id)"
        >
            <v-img :src="getStatic(image)"
                   class="v-image__image--cover"
                   :class="hover ? 'scaled' : 'unscaled'"
                   height="150"
                   contain
                    v-if="image"/>
            <v-card-title class="text-left text-wrap text-break category-card-adaptive"
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
        display: block; /* Убираем небольшой отступ снизу */
    }
</style>
