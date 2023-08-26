<template>
    <v-card elevation="0">
        <v-card-actions>
            <v-card-title>
                Каталог товаров
            </v-card-title>
            <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                    <v-icon color="green" class="mx-2" v-on:click="showDialog = true" dark
                            v-on="on"
                            v-bind="attrs"
                    >mdi-plus-circle-outline</v-icon>
                </template>
                <span>Добавить товар</span>
            </v-tooltip>

        </v-card-actions>
        <v-card-actions>
            <v-text-field
                    v-model="search"
                    label="поискнуть"
                    class="mr-4"
                    rounded
                    outlined
            ></v-text-field>
            <v-combobox label="Бренд"
                        outlined rounded
                        class="mx-2"
                        style="max-width: 200px"
                        @change="loadProducts"
                        :items="brands" v-model="currentBrand">
            </v-combobox>
            <v-combobox
                    label="Категория"
                    outlined rounded
                    class="mx-2"
                    style="max-width: 200px"
                    @change="loadProducts"
                    :items="Object.keys(categories).map(function(key) { return categories[key]; })" v-model="currentCategory">
            </v-combobox>

            <v-spacer></v-spacer>
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon x-large v-on:click="saveFile()"
                            v-bind="attrs"
                            v-on="on">
                        mdi-content-save
                    </v-icon>
                </template>
                <span>Сохранить</span>
            </v-tooltip>

            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn                                   v-bind="attrs"
                                                             v-on="on"
                                                             style="max-width: 20px"
                                                             class="transparent elevation-0"
                    >
                    <v-file-input dense
                                  accept="text/csv" class="mt-4"
                                  @change="loadFile"
                                  v-model="fileToLoad"

                    >
                    </v-file-input>
                    </v-btn>
                </template>
                <span>Загрузить</span>
            </v-tooltip>

        </v-card-actions>
        <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="100"
                dense
                :search="search"
                :loading="loading"
                style="height: 70vh; cursor: pointer"

                v-on:click:row="(item, _) => editItem(item)"
                loading-text="Много данных, загружаем!"
                class="overflow-y-auto"
        >

            <template v-slot:item.Title="{item}">
                <strong class="text-break" style="max-width: 200px;">
                    {{ item.Title }}
                </strong>
            </template>
            <template v-slot:item.@Category="{item}">
                <div class="text-break" style="max-width: 200px;">
                    {{ item['@Category'] }}
                </div>
            </template>
            <template v-slot:item.Images="{item}">
                <div v-on:click.stop class="d-flex flex-column justify-start py-1 overflow-y-auto" style="max-width: 200px; max-height: 100px">
                    <v-img v-for="img of item.Images" :key="img" contain style="max-height: 100px" class="my-1" :src="getURL(`static/${img}`)"/>
                </div>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                        color="red"
                        large
                        v-on:click.stop="deleteItem(item)"
                >
                    mdi-close
                </v-icon>
            </template>
        </v-data-table>

        <v-dialog
                v-model="showDialog"
        >
            <product-dialog :idx="selectedProductId"></product-dialog>
        </v-dialog>
    </v-card>

</template>

<script>
    import axios from 'axios';
    // import CatalogFilter from "../components/CatalogFilter";
    import {getURL} from "../settings";
    import {saveAs} from 'file-saver';
    import ProductDialog from "../components/dialogs/ProductDialog";
    import eventBus from "../utils/eventBus";

    export default {
        name: "Catalog",
        components: {ProductDialog},
        // components: {CatalogFilter},
        data: () => {
            return {
                TableMap: {
                    'Actions': 'Действия',
                    '@Product': 'Идентификатор',
                    'Title': 'Название',
                    'Description': 'Описание',
                    '@Category': 'Категория',
                    'Properties': 'Свойства',
                    'Images': 'Изображения',
                    'DetailedDescription': 'Подробное описание',
                    'Articul': 'Артикул'
                },
                headers: [],
                items: [],
                loading: true,
                search: '',
                categories: {},
                categoriesReversed: {},
                currentCategory: null,
                brands: [],
                currentBrand: null,
                showDialog: false,
                selectedProductId: null,
                selectedFile: null,
                fileToLoad: null,
            }
        },
        methods: {
            getURL,
            saveFile() {
                axios.post(getURL('admin/products/save'), {
                        brand: this.currentBrand,
                        category: this.currentCategory ? this.categoriesReversed[this.currentCategory] : null}, {
                        responseType: 'blob'
                    }
                ).then(response => {
                    saveAs(response.data, 'Флагман прайсы.csv');
                })
            },
            loadFile() {
                if ( this.fileToLoad ) {
                    const reader = new FileReader();
                    reader.readAsText(this.fileToLoad);
                    reader.onload = () => {
                        const blob = new Blob([reader.result]);
                        const formData = new FormData();
                        formData.append('file', blob);
                        formData.append('type', this.fileToLoad.type);
                        axios.post(getURL('admin/products/load'), formData, {withCredentials:true})
                            .then(()=> {
                                this.fileToLoad = null;
                                this.loadProducts();
                            })
                    }
                }
            },
            editItem (item) {
                this.selectedProductId = item['@Product']
                this.showDialog = true;
            },
            deleteItem (item) {
                this.selectedProductId = this.items.indexOf(item)
                const editedItem = Object.assign({
                    id: item['@Product']
                })
                axios.post(getURL('admin/products'), {
                    action: 'delete',
                    item: editedItem}).then(() => {

                    this.loadProducts();

                });
            },

            close () {
                this.selectedProductId = null;
                this.loadProducts();
            },
            loadProducts() {
                this.items = [];
                this.headers = [];
                axios.post(getURL(`admin/products/filter`), {
                    brand: this.currentBrand,
                    category: this.currentCategory ? this.categoriesReversed[this.currentCategory] : null
                })
                    .then(response => {
                        const resp_items = response.data;
                        if (resp_items && resp_items.length > 0) {
                            const resp_keys = Object.keys(resp_items[0]);
                            for(const key of resp_keys) {
                                this.headers.push({text: this.TableMap[key] || key, value: key })
                            }
                        }

                        for(const item of resp_items) {
                            let newItem = item;
                            const props = item['Properties'] || {};
                            const brand = props['Бренд'] || item['Бренд'];
                            if (brand && this.brands.indexOf(brand) === -1) {
                                this.brands.push(brand);
                            }

                            newItem['Properties'] = JSON.stringify(props);
                            newItem['Props'] = props;
                            this.items.push(newItem);
                        }

                        this.headers.push({ text: 'Действия', value: 'actions', sortable: false })
                        this.loading = false;
                    });
            }
        },
        mounted() {
            this.loadProducts();
            axios.get(getURL(`admin/category_ids`)).then(response => {
                let categories = response.data;
                const remove = [2,3,4,22,23,24,25];
                for(const rem of remove) {
                    delete categories[rem];
                }
                this.categories = categories;
                function swap(json){
                    const ret = {};
                    for(const key in json){
                        ret[json[key]] = key;
                    }
                    return ret;
                }
                this.categoriesReversed = swap(this.categories);
            });
            axios.get(getURL(`admin/properties`)).then(response => {
                this.allProperties = response.data;
            })

            eventBus.$on('product-not-updated', () => {
                this.showDialog = false;
                this.id
            })
            eventBus.$on('products-updated', () => {
                this.showDialog = false;
            })
        },
        watch: {
            showDialog(value) {
                if(!value) {
                    this.close();
                }
            },
            selectedFile(value) {
                if ( value ) {
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(this.selectedFile);
                    reader.onload = () => {
                        const blob = new Blob([reader.result]);
                        const formData = new FormData();
                        formData.append('image', blob);
                        formData.append('action', 'create');
                        formData.append('type', value.type);
                        formData.append('name', value.name);
                        axios.post(getURL('admin/content'), formData, {withCredentials:true})
                            .then(response=> {
                                this.editedItem.images.push(response.data);
                                this.selectedFile = null
                            })
                    }
                }
            }
        },
    }
</script>

<style scoped>

    /* scrollbar */
    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        -webkit-border-radius: 10px;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.3);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }

    ::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(255, 255, 255, 0.3);
    }

</style>
