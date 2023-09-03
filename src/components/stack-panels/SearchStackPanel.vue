<template>
    <v-card class="fill-height " color="white">
        <v-text-field
                v-model="searchString"
                prepend-inner-icon="mdi-magnify"
                placeholder="Поиск"
                outlined
                class="mx-2"
                :loading="loading"
        />

        <div class="mx-4" v-if="searchInfo && searchInfo.length > 0">
            <v-virtual-scroll
                    :bench="20"
                    :items="searchInfo"
                    height="800"
                    item-height="170"
                    style="overflow-x: hidden;"
            >
                <template v-slot:default="{ item }">
                    <v-sheet v-on:click="goToProduct(item['@Product'])" 
                             style="cursor:pointer;"
                    >

                            <HorizontalCard
                                    v-bind="{
                               idx: item['@Product'],
                               title: item['Title'],
                               specialPrice: item['specialPrice'],
                               sale: item['sale'],
                               salePercent: item['salePercent'],
                               price: item['Properties'][0],
                               source: item['Images'] && item['Images'].length > 0 ? item['Images'][0] : '',
                               toSearch: true,
                            }"/>
                    </v-sheet>

                    <v-divider/>
                </template>
            </v-virtual-scroll>
        </div>
        <v-card-title v-if="searchString && searchString.length > 0 && !loading && (!searchInfo || searchInfo.length === 0)"
                      class="d-flex flex-column align-center justify-center ">
            По вашему запросу ничего не найдено!
        </v-card-title>
    </v-card>
</template>

<script>
    import HorizontalCard from "../products/HorizontalCard";
    import axios from "axios";
    import {getURL} from "../../utils/settings";
    import eventBus from "../../utils/eventBus";
    export default {
        name: "SearchStackPanel",
        components: {HorizontalCard},
        props: ['prop'],
        data () {
          return {
              searchString: '',
              searchInfo: [],
              loading: false,
          }
        },
        methods: {
            doSearch() {
                console.log('search', this.searchString)
                if (this.loading)
                    return;

                if( !this.searchString || this.searchString < 4)
                    return;
                this.loading = true;
                axios.post(getURL('product/search'), {'search': this.searchString}, {withCredentials: true})
                    .then(response => {
                        this.searchInfo = response.data;
                        this.loading = false;
                    });
            },
            updateProduct(placeholder, id) {
                axios.post(getURL('product/update'), {placeholder, id}, {withCredentials: true}).then(() => {
                    eventBus.$emit('update-main-bar');
                });
            },
            productToFavourite(id) {
                this.updateProduct('Favourite', id);
            },
            productToCompare(id) {
                this.updateProduct('Compare', id);
            },
            productToCart(id) {
                this.updateProduct('Cart', id);
            },
            goToProduct(idx) {
                eventBus.$emit('stack-panel-close');
                this.$router.push(`/product/${idx}`);
            }
        },
        watch: {
          searchString() {
              this.doSearch();
            }
        },
        mounted() {
            console.log(this.search);
            if(this.prop) {
                this.searchString = this.prop.search;
                this.doSearch();
            }
            else
            {
                const unwatch = this.$watch('search', () => {
                    if(!this.prop)
                        return;

                    this.searchString = this.prop.search;
                    this.doSearch();

                    unwatch();
                });
            }
        }
    }
</script>

<style scoped>

</style>
