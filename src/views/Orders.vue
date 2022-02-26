<template>
    <v-card>
        <v-card-title>
            Продажи
        </v-card-title>
        <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="50"
                dense
        >
        </v-data-table>
    </v-card>
</template>

<script>
    import axios from "axios";
    import {getURL} from "../settings";

    export default {
        name: "Orders",
        data: () => {
            return {
                headers: [],
                items: []
            }
        },
        mounted() {
            axios.get(getURL('session/orders'))
                .then(response => {
                    const resp_items = response.data;
                    if (resp_items && resp_items.length > 0) {
                        const resp_keys = Object.keys(resp_items[0]);
                        console.log(resp_keys)
                        for(const key of resp_keys) {
                            this.headers.push({text: key, value: key})
                        }
                        console.log(this.headers);
                    }
                    this.items = resp_items;
                })
        }
    }
</script>

<style scoped>

</style>
