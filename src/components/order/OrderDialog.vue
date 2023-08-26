<template>
    <v-card dark class="elevation-0">
        <v-card-actions>
            <v-card-title>
                Бронирование
            </v-card-title>
            <v-btn color="red"
                   v-if="mode==='update'"
                   v-on:click="deleteOrder"
            >
                <v-icon>mdi-trash</v-icon>
                Удалить
            </v-btn>

            <v-spacer/>

            <v-btn v-on:click="throwEvent('order-not-changed')">
                <v-icon>mdi-close
                </v-icon>
                Закрыть
            </v-btn>
        </v-card-actions>
        <div class="d-flex flex-row">
            <v-form v-model="validateForms" class="pl-2">
                <v-card-subtitle>
                    Реквизиты
                </v-card-subtitle>
                <v-date-picker
                        locale="ru-RU"
                        :selected-items-text="`${!dates[0] || !dates[1] ? '' : 'ночей: ' + nights}`"
                        v-model="dates"
                        range
                >
                </v-date-picker>
                <v-text-field label="Имя" v-model="name"></v-text-field>
                <v-text-field label="Телефон" v-model="phone"></v-text-field>
                <div class="d-flex flex-row">
                <v-text-field label="Цена" v-model="price"></v-text-field>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                                    class="px-1"
                                    v-on="on"
                                    v-bind="attrs"
                                    v-on:click="calculatePrice"
                            >
                                mdi-cash-multiple
                            </v-icon>
                        </template>
                        <span>Рассчитать стоимость</span>
                    </v-tooltip>

                </div>
            </v-form>
            <div class="px-2">
                <v-card-subtitle>Мест: {{ selectedPlaces.length }}</v-card-subtitle>
                <v-form v-model="validateForms" style="max-height: 58vh; min-width: 20vw;" class="overflow-y-auto">
                    <v-treeview
                            :items="tree"
                            v-model="selectedPlaces"
                            :open.sync="openNodes"
                            hoverable
                            selection-type="leaf"
                            activatable
                            style="cursor: pointer; background: #424242"
                            selectable
                    >

                    </v-treeview>
                </v-form>
            </div>

        </div>
        <v-card-actions v-if="mode === 'create'">
            <v-btn v-on:click="createOrder('Оплачен')">
                Создать [Оплачен]
            </v-btn>
            <v-btn v-on:click="createOrder('Подтвержден')">
                Создать [Подтвержден]
            </v-btn>
        </v-card-actions>
        <v-card-actions v-else-if="mode === 'update'">
            <v-btn block v-on:click="updateOrder">
                Обновить
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../../settings";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "OrderDialog",
        props: [
            'placeId',
            'initDates',
            'placesCache',
            'mode',
            'orderId',
            'modelId'
        ],
        data: () => {
            return {
                dates: [null, null],
                oldDates: [null, null],
                nights: 0,
                oldNights: 0,
                name: null,
                phone: null,
                validateForms: false,
                selectedPlaces: [],
                openNodes: [],
                tree: [],
                price: 0
            }
        },
        mounted() {
            if( this.initDates ) {
                this.dates = this.initDates
                console.log(this.dates);
            }
            axios.get(getURL('admin/place/tree')).then(res=>{
                this.tree = res.data;
                this.tree.forEach( node => {
                    this.openNodes.push(node.id)
                })

                if(this.orderId)
                    this.loadOrder();
                else {
                    if(this.placeId !== null)
                        this.selectedPlaces = [this.placeId];

                }
            })
        },
        methods: {
            throwEvent(name) {
                eventBus.$emit(name, this.modelId);
            },
            calculatePrice() {
                axios.post(getURL('admin/order/calculate'), {
                    dates: this.dates,
                    places: this.selectedPlaces,
                    guests: this.selectedPlaces.length,
                    nights: this.nights,
                }).then(resp => {
                    this.price = resp.data.price;
                })
            },
            createOrder(status) {
                axios.post(getURL(`admin/order/create`), {
                    requisites: {
                        firstName: this.name,
                        phone: this.phone,
                        dateOpen: this.dates[0],
                        dateClose: this.dates[1],
                        guests: this.selectedPlaces.length,
                        comment: ''
                    },
                    price: this.price,
                    status: status,
                    date: (new Date()).toISOString().substr(0,10),
                    places: this.selectedPlaces
                }).then((res) => {

                    res.data;
                    this.throwEvent('order-changed');
                })
            },
            deleteOrder() {
                axios.delete(getURL(`admin/order/${this.orderId}`)).then(()=> {
                    this.throwEvent('order-changed');
                })
            },
            updateOrder() {
                axios.post(getURL(`admin/order/update`), {
                    id: this.orderId,
                    requisites: {
                        firstName: this.name,
                        phone: this.phone,
                        dateOpen: this.dates[0],
                        dateClose: this.dates[1],
                        guests: this.selectedPlaces.length,
                        comment: ''
                    },
                    price: this.price,
                    date: (new Date()).toISOString().substr(0,10),
                    places: this.selectedPlaces
                }).then(() => {
                    this.throwEvent('order-changed');
                })
            },
            async loadOrder() {
                const promise = await axios.get(getURL(`admin/order/${this.orderId}`));

                const data = promise.data;
                const requisites = JSON.parse(data['Requisites']);
                this.phone = requisites.phone;
                this.name = requisites.firstName;
                this.selectedPlaces = data['Places'];
                this.price = data['Amount'];
                this.dates = [requisites['dateOpen'], requisites['dateClose']];
            },
            calculateNights() {
                const datesEntered = this.dates[0] && this.dates[1] && this.dates[0].length === 10 && this.dates[1].length === 10;
                if( !datesEntered )
                    return;

                if( this.dates[0] > this.dates[1] ) {
                    let tmp = this.dates[0];
                    this.dates[0] = this.dates[1];
                    this.dates[1] = tmp;
                }

                let nights = Math.ceil((Math.abs(new Date(this.dates[1]) - new Date(this.dates[0]))) / 3600000 / 24);
                if( isNaN(nights) )
                    nights = 0;
                if( nights !== this.nights )
                    this.nights = nights;
            }
        },
        watch: {
            dates() {
                if (this.dates === this.oldDates)
                    return;

                this.oldDates = this.dates;
                this.calculateNights();
            },
            selectedPlaces() {
                if(this.selectedPlaces.length > 0 && this.nights > 0)
                    this.calculatePrice();
            },
            nights() {
                if (this.nights === this.oldNights )
                    return;

                this.oldNights = this.nights;
                if(this.selectedPlaces.length > 0 && this.nights > 0)
                    this.calculatePrice();
            }
        }
    }
</script>

<style scoped>

</style>
