<template>
    <v-card class="rounded-t-0">
        <div class="px-4 py-4">
        <v-row v-for="(values, name) of this.presets" :key="`preset-${name}`"
               class="d-flex flex-row align-center justify-center px-2"
        >
            <div v-if="name">
                <v-card-subtitle>
                    <strong>
                        {{name}}:
                    </strong>
                </v-card-subtitle>
                <v-spacer/>
            </div>
            <v-hover v-slot="{ hover }"
                     v-for="preset of values"
                     :key="preset">
                <v-btn
                        class="elevation-0 rounded-0 mx-2 my-1 text-capitalize"
                        style="border: 1px solid blue; font-size: 0.8rem"
                        :style="{'background-color': hover ? 'blue' : 'white', 'color': hover ? 'white': 'blue'}"
                >
                    {{preset}}
                </v-btn>
            </v-hover>
        </v-row>
        <v-card-actions>
            <v-spacer/>
        </v-card-actions>
        <v-divider/>
        <v-card-actions>
            <v-select
                    label="Сортировка:"
                    class="mx-2"
                    style="width: 250px; min-width: 200px; font-size: 12px; font-weight: bold"
                    dense
                    outlined
                    hide-details
                    :items="sortBy"
                    v-model="sortSelect"
            />
            <v-select label="Размер страницы:"
                        class="mx-2"
                      style="width: 250px; min-width: 150px; font-size: 12px; font-weight: bold"
                      dense
                        outlined
                        hide-details
                        :items="pageSizes"
                      v-model="pageSize"

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

            />
            <v-divider vertical class="mx-2"/>
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs" large v-on:click="console.log()">
                        mdi-format-align-justify
                    </v-icon>
                </template>
                <span>
                    Списком
                </span>
            </v-tooltip>
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs" large v-on:click="console.log()">
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
    export default {
        name: "ProductPresets",
        props: ['Tags'],
        data () {
            return {
                enabledTags: [],
                sortBy: ['Сначала дорогие', 'Сначала дешевые', 'По алфавиту', 'Сначала новые', 'Лучшие продажи'],
                pageSizes: ['20', '30', '40'],
                sortSelect: 'Сначала дешевые',
                pageSize: '20',
                pageFormat: 'Постраничный',
                pageFormats: ['Постраничный', 'Лента'],
                presets: {
                    'Бренды': ['AC electric', 'Aero', 'Aeronik', 'Ballu', 'Carrier', 'Daikin',
                        'Electrolux', 'Fujitsu', 'Green', 'LG', 'Hisense', 'Kentatsu', 'Lanzkraft', 'Leberg',
                    'MDV', 'Midea', 'Mitsubishi Electric', 'Panasonic', 'Roda', 'Royal Clima', 'Sakata', 'Samsung',
                    'Shuft', 'Toshiba', 'Tosot', 'Xigma'],
                    'Подборки кондиционеров': ['Белые', 'Черные', 'Красные'],
                    'По площади охлаждения': ['35 м²', '50 м²', '30 м²','20 м²','25 м²','55 м²','24 м²']
                }
            }
        }
    }
</script>

<style scoped>

</style>
