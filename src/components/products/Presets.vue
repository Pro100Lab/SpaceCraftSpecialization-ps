<template>
    <v-card class="rounded-5"
            color="white">
        <div class="px-4 py-4">
            <template v-if="Object.keys(presets || {}).length">
                <v-row v-for="(values, name) of presets" :key="`preset-${name}`"
                       class="d-flex flex-column align-center justify-center px-2"
                >
                    <div v-if="name">
                        <v-card-subtitle>
                            <strong>
                                {{name}}
                            </strong>
                        </v-card-subtitle>
                        <v-spacer/>
                    </div>
                    <div class="d-flex flex-row align-center justify-center"  v-if="expands" style="width: 100%" >
                        <v-slide-group id="slide-group" show-arrows>
                            <v-slide-item v-for="preset of values"
                                          :key="preset">
                                <v-btn
                                        class="elevation-0 rounded-5 mx-2 my-1 text-capitalize"
                                        style="border: 1px solid blue; font-size: 0.8rem"
                                        :style="{'background-color': (isItemSelected( preset ) || hover) ? 'blue' : 'white', 'color': (isItemSelected( preset ) || hover) ? 'white': 'blue'}"
                                        v-on:click="changeItem(name, preset)"
                                >
                                    {{preset}}
                                </v-btn>
                            </v-slide-item>
                        </v-slide-group>
                    </div>
                    <v-container class="scrollable text-center" v-else>
                        <v-hover v-slot="{ hover }"
                                 v-for="preset of values"
                                 :key="preset">
                            <v-btn
                                    class="elevation-0 rounded-xl mx-2 my-1 text-capitalize "
                                    style="border: 1px solid blue; font-size: 0.8rem; min-width: 162px;"
                                    :style="{'background-color': (isItemSelected( preset ) || hover) ?
                         'blue' : 'white', 'color': (isItemSelected( preset ) || hover) ? 'white': 'blue'}"
                                    v-on:click="changeItem(name, preset)"
                            >
                                {{preset}}
                            </v-btn>
                        </v-hover>
                    </v-container>
                </v-row>
                <v-card-actions>
                    <v-spacer/>
                </v-card-actions>
                <v-divider/>
            </template>
            <v-card-actions class="overflow-auto overflow-y-hidden pb-0">
                <v-select
                        label="Сортировка:"
                        style="width: 250px; min-width: 150px; font-size: 12px; font-weight: bold"
                        dense
                        outlined
                        hide-details
                        :items="sortBy"
                        v-model="sortSelect"
                        v-on:change="changeFormat()"
                />
                <v-spacer style="width: 500px"/>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-on="on" v-bind="attrs" large v-on:click="changeDisplay('list')">
                            mdi-format-align-justify
                        </v-icon>
                    </template>
                    <span>
                    Списком
                </span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-on="on" v-bind="attrs" large v-on:click="changeDisplay('grid')">
                            mdi-border-all
                        </v-icon>
                    </template>
                    <span>
                    Плиткой
                </span>
                </v-tooltip>
            </v-card-actions>
        </div>
    </v-card>
</template>

<script>
    import eventBus from "../../utils/eventBus";
    export default {
        name: "ProductPresets",
        props: ['presets', 'expands'],
        data () {
            return {
                enabledTags: [],
                sortBy: ['Сначала дорогие', 'Сначала дешевые'],
                pageSizes: ['20', '30', '40'],
                sortSelect: 'Не выбрано',
                pageSize: '20',
                pageFormat: 'Постраничный',
                pageFormats: ['Постраничный', 'Лента'],
                selectedPresets: new Set(),
                displayPage: 'grid'
            }
        },
        mounted() {
            eventBus.$on('filter-applied', (filters) => {
                if(filters && Object.keys(filters).length > 0) {
                    Object.values(filters).forEach(f => {
                        f.values.forEach(v => {
                            if(v.checked) {
                                this.selectedPresets.add(v.name);
                            } else {
                                this.selectedPresets.delete(v.name);
                            }
                        })
                    })
                } else {
                    this.selectedPresets = new Set();
                }
            })
        },
        methods: {
            isItemSelected(item) {
                return this.selectedPresets.has(item);
            },
            changeItem(category, item) {
                if( !this.isItemSelected(item) ) {
                    this.itemAdded(category, item);
                } else {
                    this.itemDeleted(category, item);
                }
            },
            itemAdded(category, item) {
                this.selectedPresets.add(item);
                eventBus.$emit('preset-added', category, item);
            },
            itemDeleted(category, item) {
                this.selectedPresets.delete(item);
                eventBus.$emit('preset-removed', category, item);
            },
            changeDisplay(displayPage) {
                this.displayPage = displayPage;
                this.changeFormat();
            },
            changeFormat() {
                eventBus.$emit('presets/format-changed', {
                    sorting: this.sortSelect,
                    pageSize: this.pageSize,
                    displayPages: this.displayPage,
                    displayFormat: this.pageFormat});
            }
        }
    }
</script>

<style scoped>
    @media screen and (max-width: 1280px) {
        .scrollable {
            overflow: auto;
            overflow-y: hidden;
        }
    }

    #slide-group .v-slide-group__content {
        justify-content: center;
    }
</style>
