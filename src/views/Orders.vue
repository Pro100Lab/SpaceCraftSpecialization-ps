<template>
    <v-card elevation="0">
        <v-card-title >
            Бронирования
        </v-card-title>
        <v-tabs v-model="selectedTab" class="mb-4">
            <v-tabs-slider color="black"></v-tabs-slider>
            <v-tab v-for="tab of tabs" :key="tab">
                {{tab}}
            </v-tab>
        </v-tabs>
        <template v-if="selectedTab === 0">
        <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="50"
                dense
        >
            <template v-slot:item.status="{ item }">
                <v-combobox
                        style="width: 200px; cursor: pointer"
                        v-model="item.status"
                        :items="statuses"
                        v-on:change="updateStatus(item)"
                        dense
                ></v-combobox>
            </template>
        </v-data-table>
        </template>
        <template v-if="selectedTab === 1">
            <order-dots></order-dots>
        </template>
    </v-card>
</template>

<script>
    import axios from "axios";
    import {getURL} from "../settings";
    import OrderDots from "../components/hotel/OrderDots";
    import eventBus from "../utils/eventBus";

    export default {
        name: "Orders",
        components: {OrderDots},
        data: () => {
            return {
                selectedTab: null,
                tabs: ['Бронирования', 'Загруженность комнат', 'Миграционный учёт'],
                headers: [{
                    text: 'Имя',
                    value: 'name'
                }, {
                    text: 'Номер телефона',
                    value: 'phone'
                }, {
                    text: 'Метод оплаты',
                    value: 'method'
                }, {
                    text: 'Дата заезда',
                    value: 'dateOpen',
                }, {
                    text: 'Дата выезда',
                    value: 'dateClose',
                }, {
                    text: 'Количество гостей',
                    value: 'guests',
                },
                    {
                    text: 'Комментарий',
                    value: 'comment'
                }, {
                   text: 'Сумма брони',
                   value: 'amount'
                    },
                    {
                    text: 'Статус',
                    value: 'status',
                }
                ],
                items: [],
                statuses: ['Принят к обработке', 'Подтвержден', 'Оплачен', 'Доставлен', ''],
            }
        },
        methods:{
            updateStatus(item) {
                axios.post(getURL('admin/order/update'), {id: item.id, status: item.status}).then(
                    () => {this.loadOrders()}
                )
            },
            loadOrders() {
                axios.get(getURL('admin/orders'))
                    .then(response => {
                        this.items = [];
                        const resp_items = response.data;
                        if (resp_items && resp_items.length > 0) {
                            resp_items.forEach(item=>{
                                item['Products'] = JSON.parse(item['Products']);
                                item['Requisites'] = JSON.parse(item['Requisites']);
                                const req = item['Requisites'];
                                let order = {
                                    id: item['@Order'],
                                    name : `${req.lastName || ''} ${req.firstName || ''}`,
                                    phone: req.phone,
                                    mail: req.email,
                                    address: req.address,
                                    comment: req.comment,
                                    dateOpen: req.dateOpen,
                                    dateClose: req.dateClose,
                                    guests: req.guests,
                                    amount: (item['Amount'] || 0 )+ ' р.',
                                    cart: JSON.stringify(item['Products']),
                                    method: req.paymentMethod,
                                    date: item['Date'],
                                    status: item['Status'] || 'Не обработан'
                                }
                                this.items.push(order);
                            })

                        }
                    })
            }
        },
        mounted() {
            this.loadOrders();

            eventBus.$on('order-changed', () => {
                this.loadOrders();
            })
        },
        watch: {
            selectedTab(newValue) {
                console.log(newValue)
            }
        }
    }
</script>

<style scoped>

</style>
