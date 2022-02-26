<template>
    <v-card>
        <v-card-title>
            <v-icon>
                mdi-cart-variant
            </v-icon>
            Последние заказы
        </v-card-title>
        <v-data-table
                :headers="this.headers"
                :items="this.orders"
                :items-per-page="5"
                class="elevation-1"
        >

        </v-data-table>
    </v-card>
</template>

<script>
    export default {
        name: "OrdersHistory",
        data: () => {
            return {
                orders: [
                    {
                        'No': 1,
                        'payer': 'Какой то непонятный человек',
                        'data': '31.01.2022'
                    }
                ],
                headers: [{
                    text: 'No',
                    align: 'start',
                    sortable: false,
                    value: 'No'
                },
                    { text: 'Покупатель', value: 'payer'},
                    {text: 'Добавлено', value: 'data'},
                    {text: 'Сумма', value: 'money'}
                ]
            }
        }
    }
</script>

<style scoped>

</style>
