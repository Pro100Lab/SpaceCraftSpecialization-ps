<template>
    <v-card elevation="0" class="mx-auto" color="transparent">
        <v-card-title>
            Панель состояния
        </v-card-title>
        <v-row>
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        Продажи
                    </v-card-title>
                    <GChart
                            type="LineChart"
                            :data="charts.money.chartData"
                            :options="charts.money.chartOptions"
                    >
                    </GChart>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        Посещения пользователей
                    </v-card-title>
                    <GChart
                            type="LineChart"
                            :data="charts.clients.chartData"
                            :options="charts.clients.chartOptions"
                    >
                    </GChart>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="6">
                <v-card>

                    <v-card-title>
                        Устройства
                    </v-card-title>
                    <GChart
                            type="PieChart"
                            :data="charts.devices.chartData"
                            :options="charts.devices.chartOptions"
                    >
                    </GChart>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        С каких браузеров к нам заходят
                    </v-card-title>
                    <GChart
                            type="PieChart"
                            :data="charts.browsers.chartData"
                            :options="charts.browsers.chartOptions"
                    >
                    </GChart>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import { GChart } from 'vue-google-charts/legacy'

    export default {
        name: "Analyze",
        components: {GChart},
        data: () => {
            return {
                charts: {
                    money: {
                        chartData: [
                            ['Дата', 'Подняли денег'],
                            ['апрель', 0],
                            ['май', 0],
                            ['июнь', 0],
                            ['июль', 0],
                        ],
                        chartOptions: {
                            chart: {
                                title: 'Company Performance',
                                subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                            },
                            height: 500
                        }
                    },
                    clients: {
                        chartData: [
                            ['Year', 'Количество уникальных пользователей'],
                            ['апрель', 0],
                            ['май', 0],
                            ['июнь', 0],
                            ['июль', 14],
                        ],
                        chartOptions: {
                            chart: {
                                title: 'Company Performance',
                                subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                            },
                            height: 500
                        }
                    },
                    browsers: {
                        chartData: [
                            ['Браузер', 'Кол-во клиентов'],
                            ['Chrome', 11],
                            ['Explorer', 2],
                            ['Yandex', 2],
                            ['Safari', 2]
                        ],
                        chartOptions: {
                            chart: {
                                title: 'Company Performance',
                                subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                            },
                            height: 500
                        }
                    },
                    devices: {
                        chartData: [
                            ['Устройство', 'Кол-во пользователей'],
                            ['Android', 11],
                            ['IOS ', 2],
                            ['Windows', 2],
                            ['CentOS', 2],
                            ['Mac OS', 7],
                        ],
                        chartOptions: {
                            chart: {
                                title: 'Company Performance',
                                subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                            },
                            height: 500
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
