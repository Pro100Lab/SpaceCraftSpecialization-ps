<template>
    <v-hover v-slot="{ hover }">
        <v-card
                color="white"
                :elevation="hover ? 6 : 0"
                width="240"
                class="d-flex flex-column fill-height py-2"
                v-on:click="goToCategory(id)"
        >
            <v-img :src="getURL(`static/${image}`)"
                   class="v-image__image--cover"
                   height="150"
                    v-if="image"/>
            <v-card-title class="text-left text-wrap text-break"
                          v-if="title">
                {{title}}
            </v-card-title>
        </v-card>
    </v-hover>
</template>

<script>
    import {getURL} from '../../utils/settings.js';
    export default {
        name: "CategoryCard",
        props: ['id', 'title', 'description', 'image'],
        methods: {
            getURL,
            goToCategory(id) {
                this.$router.push(`/category/${id}`)
            }
        }
    }
</script>

<style scoped>

</style>
