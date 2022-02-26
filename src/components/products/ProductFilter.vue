<template>
    <v-card class="elevation-4">
        <v-card-title class="mb-0 pb-0">
            Фильтр
        </v-card-title>
        <v-col class="px-4">
            <v-list>
                <v-list-item v-for="filter of this.rangers" :key="filter.id" style="max-height: 100px; border: solid 1px gray; border-radius: 3px"
                             class="d-flex flex-column align-start my-1">
                    <v-subheader class="text-center my-1">{{filter.name}}</v-subheader>
                    <v-row>
                            <v-text-field
                                    :value="filter.range[0]"
                                    class="pt-0 px-4"
                                    hide-details
                                    single-line
                                    type="number"
                                    style="width: 10%;"
                                    hide-spin-buttons
                                    @change="$set(filter.range, 0, $event)"
                            ></v-text-field>
                            <v-text-field
                                    :value="filter.range[1]"
                                    hide-spin-buttons
                                    class="pt-0 px-4"
                                    hide-details
                                    single-line
                                    type="number"
                                    style="width: 10%"
                                    @change="$set(filter.range, 1, $event)"
                            ></v-text-field>
                    </v-row>
                    <v-row style="width: 100%">
                    <v-range-slider
                            v-model="filter.range"
                            :max="filter.max"
                            :min="filter.min"
                            :step="Math.round( (filter.max + filter.min) * 10 ) / 1000"
                            style="width: 80%"
                    >
                    </v-range-slider>
                    </v-row>
                </v-list-item>
                <v-list-item v-for="filter of this.checkers" :key="filter.id" class="d-flex flex-column align-start my-1"
                             style="border: solid 1px gray; border-radius: 3px">
                        <v-subheader>{{filter.name}}</v-subheader>
                        <v-list-item v-for="value of filter.values" :key="`${filter.id}-${value.name}`">
                            <v-checkbox
                                    v-model="value.checked"
                                    :label="value.name"
                                    :ripple="false"
                            >

                            </v-checkbox>
                        </v-list-item>
                </v-list-item>
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
    </v-card>
</template>

<script>
    export default {
        name: "ProductFilter",
        data () {
            return {
                rangers: [],
                checkers: []
            }
        },
        props: ['filters', 'applyFilter'],
        mounted() {
            if (this.filters && this.filters.length > 0) {
                this.rangers = this.getRangers();
                this.checkers = this.getCheckers();
            } else {
                const unwatch = this.$watch('filters', () => {
                    if (!this.filters) return;
                    this.rangers = this.getRangers();
                    this.checkers = this.getCheckers();
                    unwatch();
                })
            }

        },
        methods: {
            getRangers(primaryOnly = true) {
                let range_filters = [];
                for(const value of Object.values(this.filters)) {
                    if ( primaryOnly && !value.primary )
                        continue;
                    if (value.type === 'range') {
                        let filterMin = parseFloat(value.values[0]);
                        let filterMax = parseFloat(value.values[0]);
                        let filterValues = value.values;
                        filterValues.forEach(value => {
                            let filterValue = parseFloat(value);
                            if (filterValue < filterMin )
                                filterMin = filterValue;
                            if (filterValue > filterMax )
                                filterMax = filterValue;
                        });
                        range_filters.push({
                            id: value.id,
                            name: value.name,
                            min: filterMin,
                            max: filterMax,
                            range: [filterMin, filterMax]
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
                        value.values.forEach(item => {
                            newValues.push({name: item, checked: false});
                        });
                        newValue.values = newValues;
                        check_filters.push(newValue);
                    }
                }
                return check_filters;
            },
            setFilter() {
                this.applyFilter([...this.rangers, ...this.checkers])
            }

        }
    }
</script>

<style scoped>

</style>
