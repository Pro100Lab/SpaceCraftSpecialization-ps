<template>
    <v-card v-for="info of informations" :key="info.id">
        <v-card-title v-if="info.title">
            {{info.title}}
        </v-card-title>
        <v-card-subtitle v-if="info.description">
            {{info.description}}
        </v-card-subtitle>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../settings";

    export default {
        name: "Information",
        data: () => {
            return {
                informations: []
            }
        },
        mounted() {
            axios.get(getURL(`info/${this.$route.params.info_id}`))
                .then(response => {
                    const info = response.data;
                    this.informations = info.informations;
                })
        }
    }
</script>

<style scoped>

</style>
