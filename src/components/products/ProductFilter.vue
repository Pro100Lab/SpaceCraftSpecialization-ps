<template>
    <v-card class="rounded-b-xxl" :loading="loading">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear
                    :active="isActive"
                    color="deep-purple"
                    height="4"
                    indeterminate
            ></v-progress-linear>
        </template>
        <div>
            <v-card-actions class="d-flex flex-row align-center justify-center my-0 py-0">
                <v-card-title class="mb-0 pb-0">
                    Фильтр
                </v-card-title>
                <v-spacer/>
                <v-btn elevation="0" class="rounded-xxl transparent mt-4" v-on:click="restoreFilter">
                    Сбросить
                </v-btn>
            </v-card-actions>
            <v-col class="px-4">
                <v-list>
                    <v-card v-for="filter of rangeFilters" :key="`${filter.name}-${filter.id}`"
                            class="d-flex flex-column align-start my-1 elevation-0">
                        <v-card-title class="text-center my-0 pt-1 pb-0 text-break"
                                      style="font-size: 1rem">{{filter.name.indexOf('Цена') !== -1 ? 'Цена': filter.name}}
                        </v-card-title>
                        <a class="my-1 px-4" style="font-size: 0.9rem"
                           v-if="filter.name === 'Мощность охлаждения, кВт'"
                           v-on:click="eventBus.$emit('stack-panel-push', 'calculate', {'button': 'Применить'})"
                        >Рассчитать</a>
                        <v-card-actions style="width: 90%">
                            <v-text-field
                                    :value="normalizePrice(Math.round(filter.values[0]))"
                                    class="my-0 py-0 mx-2"
                                    hide-details
                                    label="от"
                                    dense
                                    @change="$set(filter.values, 0, $event)"
                            />
                            <v-spacer/>-
                            <v-text-field
                                    :value="normalizePrice(Math.round(filter.values[1]))"
                                    class="my-0 py-0 mx-2"
                                    hide-details
                                    label="до"
                                    dense
                                    @change="$set(filter.values, 1, $event)"
                            />
                        </v-card-actions>
                        <v-range-slider
                                class="my-0 py-0 mx-auto"
                                style="width: 90%"
                                dense
                                color="rgba(0,23,228,0.7)"
                                hide-details
                                v-model="filter.values"
                                :max="filter.max * 1.1"
                                :min="filter.min"/>
                    </v-card>
                    <v-card v-for="filter of checkBoxFilters" :key="`${filter.name}-${filter.id}`"
                            class="d-flex flex-column align-start my-1 elevation-0">
                        <v-expansion-panels>
                            <v-expansion-panel v-model="filter.expanded">
                                <v-expansion-panel-header class="py-0 mx-0 pl-0">
                                    <v-card-title class="py-0 text-break" style="font-size: 1rem">{{filter.name}}</v-card-title>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <div class=" my-0 py-0" v-for="value of filter.values" :key="`${filter.id}-${value.name}`">
                                        <v-checkbox
                                                class="my-0 py-0"
                                                v-model="value.checked"
                                                :label="value.name"
                                                :ripple="false"
                                                hide-details
                                                dense
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
                       dark
                       class="rounded-xxl"
                       :color="common.color"
                       v-on:click="setFilter">
                    Применить
                </v-btn>
            </v-card-actions>
        </div>
    </v-card>
</template>

<script>
    import eventBus from "../../utils/eventBus";
    import loader from "../../utils/customizeOptions";
    import {normalizePrice} from "../../utils/settings";

    var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

    export default {
        name: "ProductFilter",
        data () {
            return {
                eventBus,
                rangeFilters: [],
                checkBoxFilters: [],

                initialFilters: {},
                expanded: true,
                loading: false,
                common: {
                    color: 'primary'
                },
                filterHashes: new Set()
            }
        },
        props: ['filters', 'applyFilter', 'expands'],
        async beforeMount() {
            await loader().loadOptions();
            this.common.color = loader().getOption(['Common', 'Schema', 'Colors', 'Primary']);
        },
        watch: {
        },
        beforeDestroy() {
            console.log('before destroy filter');
            eventBus.$off('products-loaded', this.onProductsLoaded);
            eventBus.$off('products-added', this.onPresetAdd);
            eventBus.$off('preset-removed', this.onPresetsRemoved);
        },
        mounted() {
            console.log('mounted filter')
            if (this.filters && Object.keys(this.filters).length > 0) {
                this.initialFilters = this.filters;
                this.parseFilters(this.initialFilters);
                console.log('on mounted has filters: ', this.filters);
            }

            eventBus.$on('products-loaded', this.onProductsLoaded);
            eventBus.$on('preset-added', this.onPresetAdd);
            eventBus.$on('preset-removed', this.onPresetsRemoved);
        },
        methods: {
            onProductsLoaded() {
                this.loading = false;
            },
            onPresetAdd(category, item) {
                const presetFilter = this.checkBoxFilters.find(o => o.name === category)
                console.log('preset-added: ', category, item);
                if(presetFilter) {
                    const presetValue = presetFilter.values.find(o => o.name === item );
                    console.log('presetValue: ', presetValue);

                    presetValue.checked = true;

                    this.setFilter();
                }
            },
            onPresetsRemoved(category, item) {
                console.log('preset-removed: ', category, item);

                const presetFilter = this.checkBoxFilters.find(o => o.name === category)
                if(presetFilter) {
                    const presetValue = presetFilter.values.find(o => o.name === item );
                    console.log('presetValue: ', presetValue);

                    presetValue.checked = false;

                    this.setFilter();
                }
            },
            normalizePrice,
            hashRanger(ranger) {
                const rangerString = `ranger/${ranger.name}/${ranger.values[0]}/${ranger.values[1]}`
                return MD5(rangerString)
            },
            hashRadio(radio) {
                const radioString = `radio/${radio.name}/${radio.values.filter(o => o.checked === true)}`;
                return MD5(radioString);
            },
            parseFilters(filters, primaryOnly = true) {
                let rangeFilters = [];
                let checkFilters = [];

                for(const filterInfo of Object.values(filters)) {
                    const hashOnly = primaryOnly && !filterInfo.primary

                    if (filterInfo.type === 'range') {
                        const rangeFilter = {
                            id: filterInfo.id,
                            name: filterInfo.name,
                            min: filterInfo.values[0],
                            max: filterInfo.values[1],
                            type: 'range',
                            values: [filterInfo.values[0], filterInfo.values[1]],
                        }

                        this.filterHashes.add(this.hashRanger(rangeFilter));
                        if(hashOnly)
                            continue;

                        rangeFilters.push(rangeFilter);
                    }

                    if (filterInfo.type === 'radio') {
                        let radioFilter = filterInfo;
                        let valuesWithCheckedFlag = [];

                        filterInfo.values.forEach(item => {
                            if(item) {
                                if (!item.name)
                                    valuesWithCheckedFlag.push({name: item, checked: false});
                                else
                                    valuesWithCheckedFlag.push(item);
                            }
                        });

                        radioFilter.values = valuesWithCheckedFlag;
                        radioFilter.expanded = radioFilter.values.length <= 3;

                        this.filterHashes.add(this.hashRadio(radioFilter));
                        if(hashOnly)
                            continue;
                        checkFilters.push(radioFilter);
                    }
                }

                this.rangeFilters = rangeFilters;
                this.checkBoxFilters = checkFilters;
            },
            calculateChangedFilters() {
                let changedFilters = {};

                for(const rangeFilter of this.rangeFilters) {
                    const filterHash = this.hashRanger(rangeFilter);
                    if(!this.filterHashes.has(filterHash)) {
                        changedFilters[rangeFilter.name] = rangeFilter;
                    }
                }

                for(const radioFilter of this.checkBoxFilters) {
                    const filterHash = this.hashRadio(radioFilter);
                    if(!this.filterHashes.has(filterHash)) {
                        changedFilters[radioFilter.name] = radioFilter;
                    }
                }
                console.log('detected filter changes: ', changedFilters)

                return changedFilters;
            },
            setFilter() {
                eventBus.$emit('filter-applied', this.calculateChangedFilters());
                this.loading = true
            },
            restoreFilter() {
                this.parseFilters(this.initialFilters);
                eventBus.$emit('filter-applied');
            }
        }
    }
</script>

<style scoped>
    .v-messages {
        display: none !important;
    }

    .v-expansion-panel::before {
        box-shadow: none;
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
