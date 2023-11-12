<template>
    <v-list>
        <v-list-item v-for="(order, index) of orders" :key="`order-${index}`">
            <v-list-item-title>
                Заказ от {{order.Date}} на сумму {{order.Amount}}
            </v-list-item-title>
            <v-list-item-content>
                <horizontal-card></horizontal-card>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script>
    import {getURL} from "../../utils/settings";
    import axios from 'axios';
    import HorizontalCard from "../products/HorizontalCard";

    export default {
        name: "OrdersHistory",
        components: {HorizontalCard},
        data: () => {
            return {
                orders: []
            }
        },
        mounted() {
            axios.get(getURL('order/my_list'), {withCredentials: true}).then(res => {
                this.orders = res.data;
            })
        }
    }
</script>

<style scoped>

</style>
