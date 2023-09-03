<template>
    <v-card class="rounded-5"
            color="white">
        <div class="px-4 py-4">
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
                        class="elevation-0 rounded-5 mx-2 my-1 text-capitalize "
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
        <v-card-actions class="overflow-auto overflow-y-hidden">
            <v-select
                    label="Сортировка:"
                    class="mx-2"
                    style="width: 250px; min-width: 200px; font-size: 12px; font-weight: bold"
                    dense
                    outlined
                    hide-details
                    :items="sortBy"
                    v-model="sortSelect"
                    v-on:change="changeFormat()"
            />
            <v-spacer style="width: 500px"/>
            <v-divider vertical class="mx-2"/>
            <v-select label="Формат отображения:"
                      class="mx-2"
                      style="width: 250px; min-width: 200px; font-size: 12px; font-weight: bold"
                      dense
                      outlined
                      hide-details
                      :items="pageFormats"
                      v-model="pageFormat"
                      v-on:change="changeFormat()"

            />
            <v-divider vertical class="mx-2"/>
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
                selectedBrand: '',
                selectedSquare: '',
                displayPage: 'grid'
            }
        },
        mounted() {
          eventBus.$on('filter-manual-changed', () => {
              this.selectedBrand = null;
          })
        },
        methods: {
            isItemSelected(item) {
                return this.selectedBrand === item || this.selectedSquare === item;
            },
            changeItem(category, item) {
                if( !this.isItemSelected(item) ) {
                    this.itemAdded(category, item);
                } else {
                    this.itemDeleted(category);
                }
            },
            itemAdded(category, item) {
                if( category === 'Бренд' )
                    this.selectedBrand = item;
                if( category === 'Площадь охлаждения')
                    this.selectedSquare = item;
                eventBus.$emit('filter-add', this.selectedBrand, this.selectedSquare);
            },
            itemDeleted(category) {
                if( category === 'Бренд' )
                    this.selectedBrand = '';
                if( category === 'Площадь охлаждения')
                    this.selectedSquare = '';
                eventBus.$emit('filter-delete', this.selectedBrand, this.selectedSquare);
            },
            changeDisplay(displayPage) {
                this.displayPage = displayPage;
                this.changeFormat();
            },
            changeFormat() {
                eventBus.$emit('format-changed', this.sortSelect, this.pageFormat, this.pageSize, this.displayPage);
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
