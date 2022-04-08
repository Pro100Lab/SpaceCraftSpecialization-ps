<template>
    <v-row class="d-flex flex-row">
        <v-col cols="10">
        <v-card elevation="0">
            <v-card-title>
                Каталог
            </v-card-title>
            <v-data-table
                    :headers="headers"
                    :items="items"
                    :items-per-page="20"
                    dense
                    :loading="loading"
                    loading-text="Много данных, загружаем!"
            >
                <template v-slot:item.Title="{item}">
                    <div class="text-truncate" style="max-width: 200px;">
                        {{ item.Title }}
                    </div>
                </template>
                <template v-slot:item.Description="{item}">
                    <div class="text-truncate" style="max-width: 200px;">
                        {{ item.Description }}
                    </div>
                </template>
                <template v-slot:item.DetailedDescription="{item}">
                    <div class="text-truncate" style="max-width: 200px;">
                        {{ item.DetailedDescription }}
                    </div>
                </template>
                <template v-slot:item.Properties="{item}">
                    <div class="text-truncate" style="max-width: 200px;">
                        {{ item.Properties }}
                    </div>
                </template>
                <template v-slot:item.Images="{item}">
                    <div class="text-truncate" style="max-width: 200px;">
                        {{ item.Images }}
                    </div>
                </template>
            </v-data-table>
        </v-card>
        </v-col>
        <v-col cols="2">
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
                items: [],
                loading: true
            }
        },
        mounted() {
            this.items = [];
            axios.get(getURL(`admin/products`))
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

                    for(const item of resp_items) {
                        let newItem = item;
                        newItem['Properties'] = JSON.stringify(item['Properties'])
                        this.items.push(newItem);
                    }
                    this.loading = false;
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
