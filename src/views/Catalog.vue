<template>
    <v-row class="d-flex flex-row">
        <v-col cols="8">
        <v-card>
            <v-card-title>
                Каталог
            </v-card-title>
            <v-data-table
                    :headers="headers"
                    :items="items"
                    :items-per-page="50"
                    dense
            >
            </v-data-table>
        </v-card>
        </v-col>
        <v-col cols="3">
        <CatalogFilter/>
        </v-col>
    </v-row>

</template>

<script>
    import axios from 'axios';
    import CatalogFilter from "../components/CatalogFilter";
    import {getURL} from "../settings";
    export default {
        name: "Catalog",
        components: {CatalogFilter},
        data: () => {
            return {
                headers: [],
                items: []
            }
        },
        mounted() {
            axios.get(getURL(`${this.$route.params.catalog_name}/get_all`))
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
    .v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
    .v-data-table > .v-data-table__wrapper > table > thead > tr > td,
    .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
        height: 70px;
    }
</style>
