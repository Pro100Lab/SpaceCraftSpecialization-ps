<template>
    <v-list class="px-2">
        <template  v-for="(currency, index) of currencies">
            <v-divider v-if="index !== 0" :key="`currency-divider-${index}`" class="mx-4"/>
            <v-list-item :key="`currency-${index}`"
                         class="rounded-xxl"
                         :style="{
                'background-color': selectedCurrency === currency[`@Currency`] ? '#0017e4' : '#E3F2FD',
                'color': selectedCurrency === currency[`@Currency`] ? 'white': 'black'}"
                         dense
            >
                <v-list-item-title
                        v-on:click="selectCurrency(currency)"
                >{{currency.Name}}</v-list-item-title>
                <v-list-item-icon>
                    <v-icon v-if="selectedCurrency !== currency[`@Currency`]">mdi-chevron-right</v-icon>
                    <v-icon v-else color="white" small>mdi-check</v-icon>
                </v-list-item-icon>
            </v-list-item>
        </template>
    </v-list>
</template>

<script>
    import {getURL} from "../../utils/settings";
    import axios from 'axios';
    import eventBus from "../../utils/eventBus";
    import {getUser} from "../../utils/profile";

    export default {
        name: "CurrencyStackPanel",
        data: () => {
            return {
                currencies: [],
                selectedCurrency: null,
            }
        },
        mounted() {
            axios.get(getURL('currency/load_all')).then(res => {
                this.currencies = res.data;
            });
            this.selectedCurrency = getUser().user.Profile.currency;
            console.log('selected currency: ', this.selectedCurrency)
        },
        methods: {
            selectCurrency(currency) {
                axios.post(getURL('currency/select'), {
                    currency: currency['@Currency']
                }, {withCredentials: true}).then(() => {
                    getUser().user.currency = currency['@Currency'];
                    eventBus.$emit('stack-panel-pop');
                })
            }
        }
    }
</script>

<style scoped>

</style>
