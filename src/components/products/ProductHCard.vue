<template>
    <v-card
            class="d-flex flex-row card-flex"
            :to="`/product/${idx}`"
            elevation="0"
            :ripple="false"

    >
        <v-row style="width: 100%;" class="my-0">
            <v-col cols="2">
                <v-img :src="source ? source : ''"
                       contain
                       class="fill-height"
                />
            </v-col>
            <v-col cols="8" class="d-flex flex-column">
                <v-card-title class="mb-4 py-0 text-wrap text-break">
                    {{title}}
                </v-card-title>
                <v-card-subtitle v-if="price && amount">{{amount}} x {{normalizePrice(price)}} руб. = {{normalizePrice(parseInt(amount) * parseInt(price))}} руб.</v-card-subtitle>
                <v-card-subtitle v-if="price && !amount">{{normalizePrice(price)}} руб.</v-card-subtitle>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    // eslint-disable-next-line no-unused-vars
    import {normalizePrice} from "../../settings";

    export default {
        name: "ProductHCard",
        props: ['idx', 'price', 'amount', 'title', 'source'],
        methods: {
            normalizePrice
        }
    }
</script>

<style scoped>
    .card-border {
        border: 1px solid black;
    }

    .card-flex {
        width: 100%;
    }
</style>
