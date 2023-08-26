<template>
    <v-card>
        <v-card-actions>
            <v-card-title>
                Настройки загрузки
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn class="transparent elevation-0" v-on:click="closeDialog">
                <v-icon color="black">mdi-close</v-icon>
                Закрыть
            </v-btn>
        </v-card-actions>
        <v-container class="mx-auto">
            <v-switch class="px-2" color="yellow" label="Только обновить" v-model="updateOnly" inset>
            </v-switch>

            <v-switch class="px-2" color="green" label="Создать или обновить" v-model="createOnly" inset>
            </v-switch>

            <div class="d-flex flex-row justify-start">
                <v-switch class="px-2" color="black" label="Обновить, создать, удалить по категории" v-model="allByCategory" inset>
                </v-switch>
                <v-combobox label="Категория"
                            v-if="allByCategory"
                            outlined rounded
                            class="mx-2"
                            :items="Object.keys(allCategories).map(function(key) { return allCategories[key]; })"
                            v-model="category">
                </v-combobox>
            </div>
            <div class="d-flex flex-row justify-start">
                <v-switch class="px-2" color="black" label="Обновить, создать, удалить по бренду" v-model="allByBrand" inset>
                </v-switch>
                <v-combobox
                        v-if="allByBrand"
                        label="Бренд"
                        outlined rounded
                        class="mx-2"
                        :items="allBrands"
                        v-model="brand">
                </v-combobox>
            </div>
        </v-container>

        <v-card-actions>
            <v-btn block color="green" v-on:click="saveConfig">
                Применить
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {getURL} from "../../settings";
    import axios from 'axios';
    import eventBus from "../../utils/eventBus";
    export default {
        name: "UpdateDialog",
        data: () => {
            return {
                updateOnly: false,
                createOnly: false,
                allByCategory: false,
                allByBrand: false,
                category: '',
                brand: '',

                allBrands: [],
                allCategories: {},
                categoriesReversed: {}
            }
        },
        mounted() {
            axios.get(getURL('admin/draft/settings')).then(resp => {
                this.updateOnly = resp.data.updateOnly;
                this.createOnly = resp.data.createOnly;
                this.allByCategory = resp.data.allByCategory;
                this.allByBrand = resp.data.allByBrand;
                this.category = resp.data.category;
                this.brand = resp.data.brand;
            });
            axios.post(getURL(`admin/products/filter`), {
                brand: null,
                category: null
            })
                .then(response => {
                    const resp_items = response.data;

                    for(const item of resp_items) {
                        const props = item['Properties'] || {};
                        const brand = props['Бренд'] || item['Бренд'];
                        if (brand && this.allBrands.indexOf(brand) === -1) {
                            this.allBrands.push(brand);
                        }
                    }
                });

            axios.get(getURL(`admin/category_ids`)).then(response => {
                let categories = response.data;
                const remove = [2,3,4,22,23,24,25];
                for(const rem of remove) {
                    delete categories[rem];
                }
                this.allCategories = categories;
                function swap(json){
                    const ret = {};
                    for(const key in json){
                        ret[json[key]] = key;
                    }
                    return ret;
                }
                this.categoriesReversed = swap(this.allCategories);
            });
        },
        methods: {
            closeDialog() {
                eventBus.$emit('settings-dialog-closed');
            },
            saveConfig() {
                axios.post(getURL('/admin/draft/settings'), {
                    'updateOnly': this.updateOnly,
                    'createOnly': this.createOnly,
                    'allByCategory': this.allByCategory,
                    'allByBrand': this.allByBrand,
                    'brand': this.brand,
                    'category': this.category
                }).then(()=> {
                    this.closeDialog();
                })
            }
        },
        watch: {
            updateOnly(newValue) {
                if( newValue ) {
                    this.createOnly = false;
                    this.allByBrand = false;
                    this.allByCategory = false;
                    this.category = null;
                    this.brand = null;
                }
            },
            createOnly(newValue) {
                if (newValue) {
                    this.updateOnly = false;
                    this.allByBrand = false;
                    this.allByCategory = false;
                    this.category = null;
                    this.brand = null;
                }
            },
            allByCategory(newValue) {
                if( newValue ) {
                    this.updateOnly = false;
                    this.createOnly = false;
                } else {
                    this.category = null;
                }
            },
            allByBrand( newValue ) {
                if( newValue ) {
                    this.updateOnly = false;
                    this.createOnly = false;
                } else {
                    this.brand = null;
                }
            }
        }
    }
</script>

<style scoped>

</style>
