<template>
    <v-card class="elevation-4" :loading="loading">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear
                    :active="isActive"
                    color="deep-purple"
                    height="4"
                    indeterminate
            ></v-progress-linear>
        </template>
        <v-expansion-panels v-if="expands">
            <v-expansion-panel v-model="expanded">
            <v-expansion-panel-header class="d-flex flex-row align-center justify-center">
            <v-card-title class="mb-0 pb-0">
                Фильтр
            </v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-card-actions>
                    <v-btn elevation="0" class="rounded-0 transparent mt-4" v-on:click="restoreFilter()">
                        Сбросить
                    </v-btn>
                </v-card-actions>
                <v-col class="px-4" >
                    <v-list>
                        <v-card v-for="filter of rangers" :key="filter.id" style="border: solid 1px gray; border-radius: 3px "
                                     class="d-flex flex-column align-start my-1">
                            <v-card-title class="text-center my-0 pt-1 pb-0 text-break" style="font-size: 1rem">{{filter.name}}</v-card-title>
                            <a class="my-1 px-4" style="font-size: 0.9rem"
                                    v-if="filter.name === 'Мощность охлаждения, кВт'"
                                    v-on:click="eventBus.$emit('stack-panel-open', 'calculate', {'button': 'Применить'})"
                            >Рассчитать</a>
                            <v-card-actions style="width: 90%">
                                <v-text-field
                                        v-model="filter.range[0]"
                                        class="my-0 py-0 mx-2"
                                        hide-details
                                        single-line
                                        type="number"
                                        hide-spin-buttons
                                        @change="$set(filter.range, 0, $event)"
                                />
                                <v-spacer/>-
                                <v-text-field
                                        v-model="filter.range[1]"
                                            hide-spin-buttons
                                            class="my-0 py-0 mx-2"
                                            hide-details
                                            single-line
                                            type="number"
                                            @change="$set(filter.range, 1, $event)"
                                    />
                            </v-card-actions>
                            <v-range-slider
                                    class="my-0 py-0 mx-auto"
                                    style="width: 90%"
                                    hide-details
                                    v-model="filter.range"
                                    :max="filter.max * 1.1"
                                    :min="filter.min"
                                    :step="filter.name === 'Цена' ? 500 : 0.01"
                            />
                        </v-card>
                        <v-card color="#f5f2f2" v-for="filter of checkers" :key="filter.id" style="border: solid 1px gray; border-radius: 3px"
                                class="d-flex flex-column align-start my-1">
                            <v-expansion-panels>
                                <v-expansion-panel v-model="filter.expanded">
                                    <v-expansion-panel-header>
                                        <v-card-title class="text-center my-0 pt-1 pb-1 text-break" style="font-size: 1rem">{{filter.name}}</v-card-title>
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-list-item class="nowrap-overflow my-0 py-0" v-for="value of filter.values" :key="`${filter.id}-${value.name}`">
                                            <v-checkbox
                                                    class="my-0 py-0"
                                                    v-model="value.checked"
                                                    :label="value.name"
                                                    :ripple="false"
                                                    hide-details
                                            >
                                            </v-checkbox>
                                        </v-list-item>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-card>
                    </v-list>
                </v-col>
            <v-spacer/>
            <v-card-actions>
                <v-btn block
                       color="blue"
                       v-on:click="setFilter()">
                    Применить
                </v-btn>
            </v-card-actions>
            </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <div v-else>
                <v-card-actions class="d-flex flex-row align-center justify-center">
                    <v-card-title class="mb-0 pb-0">
                        Фильтр
                    </v-card-title>
                    <v-spacer/>
                    <v-btn elevation="0" class="rounded-0 transparent mt-4" v-on:click="restoreFilter()">
                        Сбросить
                    </v-btn>
                </v-card-actions>
                    <v-col class="px-4 overflow-y-auto common__filter">
                        <v-list>
                            <v-card v-for="filter of rangers" :key="filter.id" style="border: solid 1px gray; border-radius: 3px"
                                    class="d-flex flex-column align-start my-1">
                                <v-card-title class="text-center my-0 pt-1 pb-0 text-break" style="font-size: 1rem">{{filter.name}}</v-card-title>
                                <a class="my-1 px-4" style="font-size: 0.9rem"
                                   v-if="filter.name === 'Мощность охлаждения, кВт'"
                                   v-on:click="eventBus.$emit('stack-panel-open', 'calculate', {'button': 'Применить'})"
                                >Рассчитать</a>
                                <v-card-actions style="width: 90%">
                                    <v-text-field
                                            :value="filter.range[0]"
                                            class="my-0 py-0 mx-2"
                                            hide-details
                                            single-line
                                            type="number"
                                            hide-spin-buttons
                                            @change="$set(filter.range, 0, $event)"
                                    />
                                    <v-spacer/>-
                                    <v-text-field
                                            :value="filter.range[1]"
                                            hide-spin-buttons
                                            class="my-0 py-0 mx-2"
                                            hide-details
                                            single-line
                                            type="number"
                                            @change="$set(filter.range, 1, $event)"
                                    />
                                </v-card-actions>
                                <v-range-slider
                                        class="my-0 py-0 mx-auto"
                                        style="width: 90%"
                                        v-model="filter.range"
                                        :max="filter.max * 1.1"
                                        :min="filter.min"
                                        :step="filter.name === 'Цена' ? 500 : Math.round( (filter.max + filter.min) * 10 ) / 1000"
                                />
                            </v-card>
                            <v-card v-for="filter of this.checkers" :key="filter.id" style="border: solid 1px gray; border-radius: 3px"
                                    class="d-flex flex-column align-start my-1">
                                <v-expansion-panels>
                                    <v-expansion-panel v-model="filter.expanded">
                                        <v-expansion-panel-header class="mx-0 pl-0">
                                            <v-card-title class="my-0 pt-1 pb-1 text-break" style="font-size: 1rem">{{filter.name}}</v-card-title>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <div class=" my-0 py-0" v-for="value of filter.values" :key="`${filter.id}-${value.name}`">
                                                <v-checkbox
                                                        class="my-0 py-0"
                                                        v-model="value.checked"
                                                        :label="value.name"
                                                        :ripple="false"
                                                        hide-details
                                                >
                                                </v-checkbox>
                                            </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-card>
                        </v-list>
                    </v-col>
                    <v-spacer/>
                    <v-card-actions>
                        <v-btn block
                               color="blue"
                               v-on:click="setFilter()">
                            Применить
                        </v-btn>
                    </v-card-actions>
        </div>
    </v-card>
</template>

<script>
    import eventBus from "../../utils/eventBus";

    export default {
        name: "ProductFilter",
        data () {
            return {
                eventBus,
                rangers: [],
                checkers: [],
                brandFilter: {},
                squareFilter: {},
                expanded: true,
                loading: false,
            }
        },
        props: ['filters', 'applyFilter', 'expands'],
        mounted() {
            if (this.filters && this.filters.length > 0) {
                this.rangers = this.getRangers();
                this.checkers = this.getCheckers();
                this.applyQueryFilter();
            } else {
                this.$watch('filters', () => {
                    if (!this.filters) return;
                    this.rangers = this.getRangers();
                    this.checkers = this.getCheckers();
                    this.applyQueryFilter();
                })
            }
            eventBus.$on('filter-add', (brand, square) => {
                if(brand && brand.length > 0) {
                    this.brandFilter = {
                        id: '11',
                        name: 'Бренд',
                        values: [brand]
                    };
                }
                if( square && square.length > 0)
                {
                    const squareValue = parseInt(square);

                    this.squareFilter = {
                        id: '24',
                        name: 'Площадь охлаждения',
                        range: [squareValue, 999]
                    };
                }
                this.setFilter([this.brandFilter, this.squareFilter], false, false)
            });
            eventBus.$on('filter-delete', (brand, square) => {
                if(!brand || brand.length === 0) {
                    this.brandFilter = {};
                }
                if(!square || square.length === 0) {
                    this.squareFilter = {};
                }
                this.setFilter(null, false, false);
            });

            eventBus.$on('min-cooling-power-changed', value => {
                console.log(value);
                for (let ranger of this.rangers) {
                    if(ranger.name === 'Мощность охлаждения, кВт') {
                        console.log(ranger)

                        let newValue = parseFloat(value);
                        if(ranger.max < newValue)
                            newValue = ranger.max;
                        if(ranger.min > newValue)
                            newValue = ranger.min;
                        console.log(newValue)
                        ranger.range = [newValue, newValue+2 > ranger.max ? ranger.max : newValue + 2]

                        this.setFilter();
                        return;
                    }
                }
            });
        },
        destroyed() {
            eventBus.$off('min-cooling-power-changed');
            eventBus.$off('filter-delete');
            eventBus.$off('filter-add');
        },
        methods: {
            applyQueryFilter() {
                if( this.$route.query.price || this.$route.query.cool || this.$route.query.brand || this.$route.query.inverter )
                    this.setFilter(null, false, true);
            },
            getRangers(primaryOnly = true) {
                let range_filters = [];
                for(const value of Object.values(this.filters)) {
                    if ( primaryOnly && !value.primary )
                        continue;
                    if (value.type === 'range') {
                        let filterMin = parseFloat(value.values[0]);
                        let filterMax = parseFloat(value.values[0]);
                        if (value.name === "Цена" && this.$route.query.price)
                            value.range = this.$route.query.price.split('-');
                        if (value.name === 'Мощность охлаждения, кВт' && this.$route.query.cool)
                            value.range = this.$route.query.cool.split('-');

                        let filterValues = value.values;
                        filterValues.forEach(value => {
                            let filterValue = parseFloat(value);
                            if (filterValue < filterMin )
                                filterMin = filterValue;
                            if (filterValue > filterMax )
                                filterMax = filterValue;
                        });
                        console.log('filter: ')
                        console.log(value);
                        range_filters.push({
                            id: value.id,
                            name: value.name,
                            min: filterMin,
                            max: filterMax,
                            range: [value.range ? value.range[0] : filterMin, value.range ? value.range[1] :  filterMax]
                        });
                    }
                }
                return range_filters;
            },
            getCheckers(primaryOnly = true) {
                let check_filters = [];
                for(const value of Object.values(this.filters)) {
                    if ( primaryOnly && !value.primary )
                        continue;

                    if (value.type === 'radio') {
                        let newValue = value;
                        let newValues = [];
                        let checkedValues = '';
                        if (value.name === 'Бренд' && this.$route.query.brand)
                            checkedValues = this.$route.query.brand;
                        if (value.name === 'Инверторное управление' && this.$route.query.inverter)
                            checkedValues = this.$route.query.inverter;
                        value.values.forEach(item => {
                            if(!item.name)
                                newValues.push({name: item, checked: checkedValues.indexOf(item) !== -1});
                            else
                                newValues.push(item);
                        });

                        newValue.values = newValues;
                        newValue.expanded = newValue.values.length <= 3;
                        console.log(newValue)
                        check_filters.push(newValue);
                    }
                }
                return check_filters;
            },
            setFilter(filterItems, restoreFilter, restoreState) {
                if(!filterItems) {
                    filterItems = [...this.rangers, ...this.checkers];
                    eventBus.$emit('filter-manual-changed');
                }
                else
                    filterItems = [];
                if(Object.keys(this.brandFilter).length > 0)
                    filterItems.push(this.brandFilter);
                if(Object.keys(this.squareFilter).length > 0)
                    filterItems.push(this.squareFilter);

                this.loading = true
                setTimeout(() => (this.loading = false), 1000);

                this.applyFilter(filterItems, restoreFilter, restoreState)
            },
            restoreFilter() {
                window.history.replaceState(null, '', null);

                this.rangers = [];
                this.rangers = this.getRangers();
                this.checkers = []
                this.checkers = this.getCheckers();
                this.checkers.forEach(checker => {
                    checker.values.forEach(checkerValue=>{
                        checkerValue.checked = false;
                    });
                })
                this.setFilter(null, true);
            }
        }
    }
</script>

<style scoped>
    .v-messages {
        display: none !important;
    }
    .nowrap-overflow {
        flex-wrap: nowrap;
        overflow-x: auto;
    }
    .common__filter {
        max-height: 60vh;
    }
    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-track {
        background-color: lightblue;
    }

    ::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }
</style>
