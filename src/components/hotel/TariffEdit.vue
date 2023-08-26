<template>
    <v-card class="transparent elevation-0">
        <v-card-actions class="mt-4 px-0">

            <v-btn color="green" v-on:click="createTariffLocal" style="color: white">
                <v-icon color="white"  class="mr-2">
                    mdi-plus-circle
                </v-icon>
                Создать тариф
            </v-btn>
        </v-card-actions>

        <div class="d-flex flex-row">
            <v-list
                    dense
                    width="300"
            >
                <v-list-item-group
                        v-model="selectedTariff"
                >
                    <v-list-item
                            v-for="tariff of parentTariffs"
                            :key="`tariff-${tariff['@Tariff']}`"
                            :value="tariff['@Tariff']"
                    >
                        <v-list-item-content>
                            <v-list-item-title>
                                {{tariff['Name']}}
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-icon>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                            color="red"
                                            v-on="on"
                                            v-bind="attrs"
                                            v-on:click="deleteTariff(tariff)"
                                    >mdi-trash-can-outline</v-icon>

                                </template>
                                <span>Удалить</span>
                            </v-tooltip>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list-item-group>

            </v-list>
            <v-card class="mx-4" v-if="hasSelectedTariff">
                <div class="d-flex flex-row">
                    <form class="pa-2">
                            <v-text-field style="max-width: 200px" class="pb-0"
                                          v-model="tariffsCache[selectedTariff].Name"
                            >
                            </v-text-field>
                        <v-card-actions class="d-flex flex-row align-center mb-4 pa-0">
                            <v-card-subtitle class="pa-0 pr-2">
                                Цены
                            </v-card-subtitle>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn color="green"
                                           icon v-on="on"
                                           v-bind="attrs"
                                           v-on:click="createSubTariff"
                                    >
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>Добавить цену</span>
                            </v-tooltip>
                        </v-card-actions>
                        <div v-for="subTariff of childrenTariffs[selectedTariff]" :key="subTariff['@Tariff']" class="d-flex flex-row">
                            <v-text-field dense label="Ночей от" v-model="subTariff['PeriodFrom']" class="px-2">

                            </v-text-field> <v-icon>mdi-minus</v-icon>
                            <v-text-field dense label="Ночей до" v-model="subTariff['PeriodTo']" class="px-2">

                            </v-text-field>
                            <v-text-field dense label="Цена" type="number" v-model="subTariff['Price']" class="px-2">

                            </v-text-field>

                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                            color="red"
                                            v-on="on"
                                            v-bind="attrs"
                                            v-on:click="deleteTariff(subTariff)"
                                    >mdi-close</v-icon>

                                </template>
                                <span>Удалить</span>
                            </v-tooltip>
                        </div>
                    </form>
                    <block-picker :initial-block-ids="tariffsCache[selectedTariff]['Blocks']"></block-picker>
                </div>
                <v-btn v-if="mode==='create'" color="green" block v-on:click="createTariff(tariffsCache[selectedTariff])">Создать</v-btn>
                <v-btn v-if="mode==='update'" color="yellow" block v-on:click="updateTariff(tariffsCache[selectedTariff])">Обновить</v-btn>
            </v-card>
        </div>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../../settings";
    import BlockPicker from "../BlockPicker";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "TariffEdit",
        components: {BlockPicker},
        data: () => {
            return {
                tariffs: [],
                tariffsCache: {},
                parentTariffs: [],
                childrenTariffs: {},
                selectedTariff: null,
                mode: null,
            }
        },
        mounted() {
            this.loadTariffs();
        },
        methods: {
            tariffsChanged() {
              eventBus.$emit('tariffs-changed');
            },
            importChildren(tariffs) {
                let childrenTariffs = {};
                tariffs.forEach(tariff => {
                    const section = tariff['Section'];
                    if(section !== null) {
                        if(!childrenTariffs[section])
                            childrenTariffs[section] = [];

                        childrenTariffs[tariff['Section']].push(tariff);
                    }
                })

                return childrenTariffs;
            },
            importParents(tariffs) {
                let parentTariffs = [];
                tariffs.forEach(tariff => {
                    if(tariff['Section'] === null) {
                        parentTariffs.push(tariff);
                    }
                })
                return parentTariffs;
            },
            importCache(tariffs) {
                let tariffsCache = {}
                tariffs.forEach(tariff => {
                    tariffsCache[tariff['@Tariff']] = tariff;
                })
                return tariffsCache;
            },
            loadTariffs() {
                axios.get(getURL('admin/tariff/list')).then(res=> {
                    this.tariffs = res.data;

                    this.parentTariffs = this.importParents(this.tariffs);
                    this.tariffsCache = this.importCache(this.tariffs);

                    this.childrenTariffs = this.importChildren(this.tariffs);
                })
            },
            deleteTariff(tariff, child = false) {
                axios.delete(getURL(`admin/tariff/${tariff['@Tariff']}`)).then(() => {
                    this.loadTariffs(child);
                })
            },
            createTariff(subTariff) {
                axios.post(getURL('admin/tariff/create'), subTariff).then(res => {
                    this.selectedTariff = res.data.idx;
                    delete this.tariffsCache[-1];

                    let allTariffs = this.childrenTariffs[subTariff['@Tariff']] || [];

                    if(allTariffs.length > 0) {
                        allTariffs.forEach(tariff => {
                            tariff['Section'] = res.data.idx;
                        })

                        axios.all(allTariffs.map(data => axios.post(getURL('admin/tariff/create'), data))).then(() => {
                            this.loadTariffs();
                            this.tariffsChanged();
                        })
                    } else {
                        this.loadTariffs();
                        this.tariffsChanged();
                    }
                })

            },
            updateTariff(subTariff) {
                let allTariffs = [subTariff, ...(this.childrenTariffs[subTariff['@Tariff']] || []) ];

                const existsTariffs = allTariffs.filter(tariff => {
                    return tariff['@Tariff'] >= 0;
                })
                const virtualTariffs = allTariffs.filter(tariff => {
                    return tariff['@Tariff'] < 0;
                })

                axios.all(existsTariffs.map(data => axios.post(getURL('admin/tariff/update'), data))).then(() => {
                    if(virtualTariffs.length > 0) {
                        axios.all(virtualTariffs.map(data => axios.post(getURL('admin/tariff/create'), data))).then(() => {
                            this.loadTariffs();
                            this.tariffsChanged();
                        })
                    } else {
                        this.loadTariffs();
                        this.tariffsChanged();
                    }
                });

            },
            createTariffLocal() {
                if(this.tariffsCache[-1])
                    return;

                let tariff = {
                    '@Tariff': -1,
                    'Name': null,
                    'Section': null,
                    'PeriodFrom': null,
                    'PeriodTo': null,
                    'Blocks': [],
                    'Price': null
                };

                this.tariffs.push(tariff);

                this.parentTariffs.push(tariff);
                this.childrenTariffs[-1] = [];
                this.tariffsCache[-1] = tariff;

                this.selectedTariff = -1;
                this.mode = 'create';
            },
            createSubTariff() {
                // Гарантируем уникальный отрицательный ид
                const idx = ( this.childrenTariffs[this.selectedTariff].length + 2) * -1;
                this.childrenTariffs[this.selectedTariff].push({
                    '@Tariff': idx,
                    'Name': null,
                    'Section': this.selectedTariff,
                    'PeriodFrom': null,
                    'PeriodTo': null,
                    'Blocks': [],
                    'Price': null
                });

                if( this.selectedTariff === -1 ) {
                    const tmpName = this.tariffsCache[this.selectedTariff]['Name'];
                    this.tariffsCache[this.selectedTariff]['Name'] = '';
                    this.tariffsCache[this.selectedTariff]['Name'] = tmpName;
                }
            }
        },
        watch: {
            selectedTariff() {
                if(this.hasSelectedTariff && this.selectedTariff !== -1)
                    this.mode = 'update';
                else if (!this.hasSelectedTariff && this.selectedTariff !== -1)
                    this.mode = null;
            }
        },
        computed: {
            creationMode: function() {
                return this.mode === 'create';
            },
            hasSelectedTariff: function() {
                return Number.isInteger(this.selectedTariff);
            }
        }
    }
</script>

<style scoped>

</style>
