<template>
    <div class="d-flex flex-row align-end">
        <v-menu
                offset-y bottom
                rounded
                ref="menu"
        >
            <template v-slot:activator="{ on }">
                <v-text-field
                        style="cursor: text"
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        single-line
                        outlined
                        rounded
                        placeholder="Поиск по товарам"
                        color="black"
                        v-on="on"
                        v-on:click="window.innerWidth <= 1280 ? showSearchPanel() : ''"
                        v-model="search"
                        :loading="loading"
                >

                </v-text-field>
            </template>
            <div v-if="!iMobile">
                <v-card v-if="noData" v-on:click="showSearchPanel()">
                    <v-card-subtitle>
                        По вашему запросу ничего не найдено
                    </v-card-subtitle>
                </v-card>
                <v-card
                        v-for="(item, index) in this.searchInfo"
                        :key="index"
                        class="adaptive-search"
                        v-on:click="goToProduct(item['@Product'])"
                >
                    <HorizontalCard v-bind="{
                       idx: item['@Product'],
                       title: item['Title'],
                       price: item['Properties'][0],
                       specialPrice: item['specialPrice'],
                       sale: item['sale'],
                       salePercent: item['salePercent'],
                       source: item['Images'] && item['Images'].length > 0 ? item['Images'][0] : '',
                       toSearch: true,
                    }"
                    />
                    <v-divider/>
                </v-card>
                <v-card v-if="hasMore" v-on:click="showSearchPanel()">
                    <v-card-title>
                        Показать ещё {{hasMore}} {{calculateName(hasMore)}}
                    </v-card-title>
                </v-card>
            </div>
        </v-menu>
        <v-tooltip bottom v-if="hasMore">
            <template v-slot:activator="{on, attrs}">
                <v-icon v-on="on" v-bind="attrs" v-on:click="showSearchPanel()">
                    mdi-text-search
                </v-icon>
            </template>
            <span>
                Последний поиск
            </span>
        </v-tooltip>
    </div>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../../utils/settings";
    import HorizontalCard from "../products/HorizontalCard";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "SearchBar",
        components: {HorizontalCard},
        data: () => {
            return {
                searchString: '',
                search: '',
                searchInfo: [],
                hasMore: 0,
                noData: false,
                loading: false,
                iMobile: false,
                window,
            }
        },
        methods: {
            searchOut() {
                this.searchInfo = [];
                this.search = '';
                this.hasMore = 0;
                this.noData = false
            },
            showSearchPanel() {
                eventBus.$emit('stack-panel-open', 'search', {'search': this.search});
            },
            calculateName(amount) {
                if( amount > 10 && amount < 20) {
                    return 'товаров'
                }
                switch (amount%10) {
                    case 1: return 'товар';
                    case 2:
                    case 3:
                    case 4: return 'товара';
                    default: return 'товаров';
                }
            },
            goToProduct(idx) {
                this.$router.push(`/product/${idx}`)
            }
        },
        mounted() {
        },
        watch: {
            search(val) {
                if (!val) {
                    this.searchOut();
                    return;
                }
                if(val.length < 2) {
                    return;
                }
                if (this.loading)
                    return;

                this.loading = true;
                axios.post(getURL('product/search'), {'search': this.search}, {withCredentials: true})
                    .then(response => {
                        this.searchInfo = response.data;
                        if(this.searchInfo.length > 3) {
                            this.hasMore = this.searchInfo.length - 3;
                            this.searchInfo = this.searchInfo.slice(0,3);
                        } else
                            this.hasMore = 0;
                        this.noData = !this.searchInfo.length;
                        this.loading = false;
                    });
            }
        }
    }
</script>

<style scoped>
    .adaptive-search {
        max-width: 30vw;
    }

    @media screen and (max-width: 1280px) {
        .adaptive-search {
            max-width: 50%;
        }
    }

    @media screen and (max-width: 960px) {
        .adaptive-search {
            max-width: 70%;
        }
    }
</style>
