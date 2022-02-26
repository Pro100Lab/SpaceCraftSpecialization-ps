<template>
    <div>
        <v-text-field
                hide-details
                prepend-icon="mdi-magnify"
                single-line
                placeholder="Поиск"
                color="black"
                v-model="search"
        >
        </v-text-field>

        <v-menu>
            <v-list-item
                    v-for="(item, index) in this.searchInfo"
                    :key="index"
                    link
                    :to="item.link"
            >
                <ProductHCard v-bind="{
                       idx: item['@Product'],
                       title: item['Title'],
                       price: item['Price'],
                       source: item['Images'] && item['Images'].length > 0 ? item['Images'][0] : ''
                    }"
                />
            </v-list-item>
        </v-menu>
    </div>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../settings";
    import ProductHCard from "./products/ProductHCard";

    export default {
        name: "SearchBar",
        components: {ProductHCard},
        data: () => {
            return {
                searchString: '',
                search: '',
                searchInfo: []
            }
        },
        watch: {
            search(val) {
                if (!val || val.length < 4)
                    return;

                if (this.isLoading)
                    return;

                this.loading = true;
                axios.post(getURL('product/search'), {'search': this.search}, {withCredentials: true})
                    .then(response => {
                        this.searchInfo = response.data;
                    });
            }
        }
    }
</script>

<style scoped>

</style>
