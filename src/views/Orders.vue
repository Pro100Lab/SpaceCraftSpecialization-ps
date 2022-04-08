<template>
    <v-card elevation="0">
        <v-card-title >
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
                headers: [{
                    text: 'ФИО',
                    value: 'name'
                }, {
                    text: 'Номер телефона',
                    value: 'phone'
                }, {
                    text: 'Почта',
                    value: 'mail'
                }, {
                    text: 'Метод оплаты',
                    value: 'method'
                },{
                    text: 'Адрес',
                    value: 'address',
                }, {
                    text: 'Дата',
                    value: 'date',
                }, {
                    text: 'Комментарий',
                    value: 'comment'
                }, {
                   text: 'Сумма заказа',
                   value: 'amount'
                    }, {
                    text: 'Корзина',
                    value: 'cart'
                }, {
                    text: 'Оплачен',
                    value: 'paid',
                }
                ],
                items: []
            }
        },
        mounted() {
            axios.get(getURL('admin/orders'))
                .then(response => {
                    this.items = [];
                    const resp_items = response.data;
                    if (resp_items && resp_items.length > 0) {
                        resp_items.forEach(item=>{
                            console.log(item);

                            item['Products'] = JSON.parse(item['Products']);
                            item['Requisites'] = JSON.parse(item['Requisites']);
                            console.log(item);
                            const req = item['Requisites'];
                            let order = {
                                name : `${req.lastName} ${req.firstName}`,
                                phone: req.phone,
                                mail: req.email,
                                address: req.address,
                                comment: req.comment,
                                amount: (item['Amount'] || 0 )+ ' р.',
                                cart: JSON.stringify(item['Products']),
                                method: req.paymentMethod,
                                date: item['Date'],
                                paid: item['Paid']
                            }
                            this.items.push(order);
                        })

                    }
                })
        }
    }
</script>

<style scoped>

</style>
