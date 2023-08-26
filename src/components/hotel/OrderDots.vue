<template>
    <v-card class="transparent elevation-0 pt-4">
        <v-divider class="py-2"></v-divider>

        <div class="d-flex flex-row justify-space-between">

            <!-- Сетка и даты -->
            <div class="orders-main d-flex flex-row px-2 overflow-y-auto">

                <!-- Комнаты и места -->
                <div class="row-names d-flex flex-column justify-start align-start name-col-long">
                        <span class="date-select d-flex flex-row text-center align-center t-head" >
                            <div style="width: 30px;">
                                <v-icon color="blue" v-on:click="incrOffset(-1)">mdi-chevron-left</v-icon></div>

                            <v-menu :close-on-content-click="false"
                                    v-model="showPeriodFilter"
                            >
                                <template v-slot:activator="{ on: menu, attrs }">
                                    <div class="period-checked" style="width: 200px;" v-bind="attrs" v-on="menu" v-html="date.name"></div>
                                </template>
                                <v-date-picker
                                        locale="ru-RU"
                                        v-model="customDates"
                                        :selected-items-text="`${!filters.customDates[0] || !filters.customDates[1] ?
                                         'Выберите 2 даты' : 'ночей: ' + nights}`"
                                        range
                                >
                                </v-date-picker>
                                <v-btn block v-on:click="applyCustomFilter">
                                    Применить
                                </v-btn>
                            </v-menu>

                            <div style="width: 30px;">
                                <v-icon color="blue" v-on:click="incrOffset(1)">mdi-chevron-right</v-icon>
                            </div>
                            <v-tooltip top
                                       v-if="filters.offset!==0">
                                <template v-slot:activator="{on, attrs}">
                                    <v-icon
                                            v-on="on"
                                            v-bind="attrs"
                                            small
                                            v-on:click="dropOffset"
                                    >mdi-calendar-arrow-left</v-icon>
                                </template>
                                <span>
                                    К текущей дате
                                </span>
                            </v-tooltip>
                        </span>

                    <div class="d-flex flex-column justify-start align-start dot-height"
                         v-for="room of rooms" :key="`room-${room.id}`">
                        <template v-if="room.section === null">
                            <div class=" d-flex flex-row colored-line" >
                                <div class="name-row-long" style="text-overflow: ellipsis">
                                    <v-icon class="pr-2">
                                        mdi-door
                                    </v-icon>
                                    {{room.name}}
                                </div>
                                <div class="name-row-short"></div>

                            </div>
                        </template>
                        <template v-else>
                            <div class="d-flex flex-row">
                                <div class="dot-height name-row-short"></div>
                                <div
                                        class="name-row-long" >
                                    <v-icon class="pr-2" small>
                                        mdi-bed-empty
                                    </v-icon>
                                    <span class="">
                                    {{room.name}}
                                    </span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <!-- Конец комнатам и местам -->

                <!-- Точки бронирования -->
                <div class="order-dots d-flex flex-row justify-start align-start">
                    <div class="name-dot d-flex flex-column justify-start align-start"
                         v-for="(date, index) in Object.entries(dates)"
                         :key="`${index + Math.random() * 1000}`"
                    >
                        <span class="t-head d-flex flex-column justify-center">
                            <div style="font-size: 14px;" v-html="date[1].userText"></div>
                        </span>
                        <template>

                            <!-- Перечисление точек -->
                            <div class="dot-height" v-for="room of rooms" :key="`room-${room.id}`">
                                <template v-if="room.section === null">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs}">
                                            <div v-on="on"
                                                 v-bind="attrs"
                                            >
                                                <v-icon class="name-dot colored-line" v-if="!room.busy[index]">
                                                    mdi-rhombus-split
                                                </v-icon>
                                                <v-icon class="name-dot colored-line" v-else-if="room.busy[index] < room.placeCount" color="orange">
                                                    mdi-rhombus-split
                                                </v-icon>
                                                <v-icon class="name-dot colored-line" v-else-if="room.busy[index] >= room.placeCount" color="red darken-4">
                                                    mdi-rhombus-split
                                                </v-icon>
                                            </div>
                                        </template>
                                        <template v-if="room.orders[index] && room.orders[index].length > 0">
                                            <v-list dark class="transparent">
                                                <v-list-item>
                                                    <div>
                                                    <v-card-title>{{room.name}}</v-card-title>
                                                    <v-card-subtitle>Мест занято {{room.busy[index] || 0 }}/{{room.placeCount}}</v-card-subtitle>
                                                    </div>
                                                </v-list-item>
                                                <v-list-item v-for="(orderId, idx) in room.orders[index]" :key="`${room.name}-order:${orderId}`">
                                                    {{idx + 1}}
                                                    <order-view :order-id="orderId" :order-cache="ordersCache" :places-cache="rooms">
                                                    </order-view>
                                                    <v-divider/>
                                                </v-list-item>
                                            </v-list>
                                        </template>
                                        <template v-else>
                                        <span>
                                            Пустое
                                        </span>
                                        </template>
                                    </v-tooltip>
                                </template>
                                <template v-else>

                                    <!-- Одно  место пустое -->
                                    <v-menu
                                            v-if="!room.busy[index]"
                                            :close-on-content-click="false"
                                            v-model="showOrderDialog[`${room.name}-${index}`]"
                                            top>
                                        <template v-slot:activator="{ on: menu, attrs }">
                                            <v-tooltip top>
                                                <template v-slot:activator="{ on: tooltip}">
                                                    <v-icon class="name-dot"
                                                            small
                                                            v-on="{ ...tooltip, ...menu }"
                                                            v-bind="attrs"
                                                    >
                                                        mdi-rhombus-outline
                                                    </v-icon>
                                                </template>
                                                <span>Добавить бронь</span>
                                            </v-tooltip>
                                        </template>
                                        <order-dialog :place-id="room.id"
                                                      :places-cache="placesCache"
                                                      :init-dates="[date[1].dateBegin, date[1].dateEnd]"
                                                      :model-id="`${room.name}-${index}`"
                                                      mode="create"
                                        ></order-dialog>
                                    </v-menu>

                                    <!-- Одно место забронировано -->
                                    <v-menu
                                            v-else
                                            :close-on-content-click="false"
                                            top
                                            v-model="showOrderDialog[`${room.name}-${index}`]"
                                    >
                                        <template v-slot:activator="{ on: menu, attrs }">
                                            <v-tooltip top>
                                                <template v-slot:activator="{ on: tooltip}">
                                                    <v-icon class="name-dot"
                                                            small
                                                            v-on="{ ...tooltip, ...menu }"
                                                            v-bind="attrs"
                                                            color="red darken-4">
                                                        mdi-rhombus
                                                    </v-icon>
                                                </template>
                                                <v-card class="elevation-0" color="transparent" dark>
                                                    <v-card-title>{{room.name}}</v-card-title>
                                                    <order-view :order-id="room.orders[index][0]" :order-cache="ordersCache">
                                                    </order-view>
                                                </v-card>
                                            </v-tooltip>
                                        </template>
                                        <order-dialog :places-cache="placesCache"
                                                      :order-id="room.orders[index][0]"
                                                      :model-id="`${room.name}-${index}`"
                                                      mode="update"
                                        ></order-dialog>
                                    </v-menu>

                                </template>
                            </div>
                            <!-- Конец Перечисление точек -->

                        </template>
                    </div>
                </div>
                <!-- Конец точкам бронирования -->

            </div>
            <!-- Конец сеток и даты -->

            <!-- Фильтры -->
            <v-card class="pa-4 filters d-flex flex-column align-start">
                <span>
                    <v-card-title>
                        <v-icon color="blue">
                            mdi-filter
                        </v-icon>
                        Фильтры
                    </v-card-title>
                </span>
                <div class="name-row-long">
                    <v-combobox label="По заполненности"
                                :items="filters.fill"
                                v-model="filters.fillValue"
                                @change="dropOffset"
                    >
                    </v-combobox>
                </div>

                <div class="name-row-long">
                    <v-combobox
                            label="Количество дней"
                            class="name-row-long"
                            :items="filters.count"
                            v-model="filters.countValue"
                            @change="dropOffset"
                    >

                    </v-combobox>
                </div>
                <v-spacer></v-spacer>
                <div class="d-flex flex-column justify-start align-start">
                    <v-card-title>
                        Обозначения:
                    </v-card-title>
                    <div><v-icon color="red darken-4" class="mx-1" >mdi-rhombus</v-icon> - место занято;</div>
                    <div><v-icon color="red darken-4" class="mx-1">mdi-rhombus-split</v-icon> - В комнате мест нет;</div>
                    <div><v-icon color="orange" class="mx-1">mdi-rhombus-split</v-icon> - В комнате есть места;</div>
                    <div><v-icon class="mx-1">mdi-rhombus-outline</v-icon>,
                        <v-icon class="mx-1">mdi-rhombus-split</v-icon> - Свободно полностью</div>
                </div>
            </v-card>
            <!-- Конец фильтрам -->

        </div>

    </v-card>
</template>

<script>
    import axios from "axios";
    import {getURL} from "../../settings";
    import OrderDialog from "../order/OrderDialog";
    import OrderView from "../order/OrderView";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "OrderDots",
        components: {OrderView, OrderDialog},
        data: () => {
            return {
                filters: {
                    fill: ['Только занятые', 'Только свободные', 'Все'],
                    fillValue: 'Все',
                    count: ['Неделя', 'Месяц', 'Забронированные дни'],
                    countValue: 'Неделя',
                    offset: 0,
                    customDates: [null, null]
                },
                date: {
                    name: ''
                },
                dates: {},
                rooms: [],
                placesCache: {},
                ordersCache: {},
                showPeriodFilter: false,
                showOrderDialog: {},
                nights: 1,
                customDates: [null, null]
            }
        },
        methods: {
            incrOffset(value) {
                this.filters.offset += value;
                this.loadPlaces();
            },
            applyCustomFilter() {
                this.filters.customDates = this.filters.customDates[0] < this.filters.customDates[1] ? this.filters.customDates :
                    [this.filters.customDates[1], this.filters.customDates[0]]

                this.showPeriodFilter = false;
                this.filters.countValue = this.nights
                this.filters.offset = 0;
                this.loadPlaces();
            },
            dropOffset() {
                this.filters.offset = 0;
                this.filters.customDates = [null, null];
                this.loadPlaces();
            },
            calculateColor(room) {
                return this.rooms.indexOf(room) % 2 === 0 ? 'colored-line' : '';
            },
            loadPlaces() {
                axios.post(getURL('admin/place/list'), this.filters).then(resp=>{
                    const data = resp.data;
                    this.dates = data.dates;
                    this.rooms = data.rooms;
                    this.date.name = data.name;
                    this.ordersCache = data.orders;
                    this.placesCache = data.placesCache;
                })
            }
        },
        mounted() {
            this.loadPlaces();
            eventBus.$on('order-changed', (modelId) => {
                this.showOrderDialog[modelId] = false;
                this.loadPlaces();
            });
            eventBus.$on('order-not-changed', (modelId) => {
                this.showOrderDialog[modelId] = false;
            });
        },
        watch: {
            filters() {
                this.loadPlaces();
            },
            customDates() {
                this.filters.customDates = this.customDates;
                let nights = Math.ceil((Math.abs(new Date(this.customDates[1]) - new Date(this.customDates[0]))) / 3600000 / 24);
                if( isNaN(nights) )
                    nights = 0;
                if( nights !== this.nights )
                    this.nights = nights;
            }
        }
    }
</script>

<style>
    .colored-line{
        background-color: rgba(40, 60, 40, 0.05);
    }

    .t-head {
        min-height: 50px;
        max-height: 50px;
    }

    .name-col-long {
        min-width: 300px;
        width: 300px;
        max-width: 300px;
    }

    .name-row-long {
        min-width: 250px;
        width: 250px;

        overflow-x: hidden;
        overflow-y: hidden;
    }

    .name-row-short {
        min-width: 50px;
        width: 50px;

        overflow-x: hidden;
        overflow-y: hidden;
    }

    .name-dot {
        width: 50px;
        min-width: 50px;
        max-width: 50px;
    }

    .dot-height {
        height: 25px;
        min-height: 25px;
        max-height: 25px;
    }

    .order-dots {
        max-width: 40vw;
        width: 40vw;
    }

    .orders-main {
        max-height: 70vh;
    }

</style>
