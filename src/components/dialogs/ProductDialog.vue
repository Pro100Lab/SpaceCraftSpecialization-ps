<template>
    <v-card class="overflow-hidden">
        <v-card-actions
                style="background: gray"
        >
            <v-card-title class="white--text">
                {{formTitle}}
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn v-on:click="close">Закрыть</v-btn>
            <v-btn color="red" style="color: white" v-on:click="clearForm">
                Очистить
            </v-btn>
        </v-card-actions>

        <v-sheet class="pa-6" >
            <v-row>
                <v-col
                        cols="4"
                >
                    <v-card-title class="px-0">Основное</v-card-title>
                    <v-sheet class="overflow-y-auto overflow-x-hidden pa-2" style="height: 60vh">

                    <v-text-field
                            v-model="title"
                            label="Название"
                    ></v-text-field>
                    <v-text-field
                            v-model="articul"
                            label="Артикул"
                    ></v-text-field>
                    <v-combobox label="Категория"
                                :items="Object.keys(categories).map(function(key) { return categories[key]; })"
                                v-model="category">
                    </v-combobox>
                    <rich-editor-field
                            v-model="description"
                            title="Описание"
                    ></rich-editor-field>
                    <rich-editor-field
                            v-model="detailedDescription"
                            title="Подробное описание"
                    ></rich-editor-field>
                    </v-sheet>
                </v-col>
                <v-col
                        cols="4"
                >
                    <v-card-title>
                        Свойства
                    </v-card-title>
                    <v-sheet class="overflow-y-auto overflow-x-hidden" style="height: 60vh">
                        <v-row v-for="key of allProperties" :key="key" class="px-4">
                            <v-col>
                                <span v-html="key + ':'">
                                </span>
                            </v-col>
                            <v-col>
                                <v-text-field dense v-model="properties[key]">

                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
                <v-col cols="4">
                    <v-card-actions>
                        <v-card-title>
                            Изображения
                        </v-card-title>
                        <v-file-input placeholder="Загрузить"
                                      accept="image/*" class="px-4"
                                      v-model="selectedFile" />
                    </v-card-actions>
                    <v-sheet class="overflow-y-auto overflow-x-hidden" style="height: 60vh">
                        <v-row v-for="image of images" :key="image">
                            <v-col cols="8">
                                <v-img style="max-height: 100px"
                                       :src="getURL(`static/${image}`)" contain alt="image here">
                                </v-img>
                            </v-col>
                            <v-col cols="2" class="d-flex flex-column justify-center">
                                <v-icon color="red" v-on:click="images.splice(images.indexOf(image), 1)">
                                    mdi-delete
                                </v-icon>
                            </v-col>
                        </v-row>

                    </v-sheet>

                </v-col>
            </v-row>
        </v-sheet>
        <v-card-actions
                style="background: gray"
        >
            <v-btn block color="green" style="color: white; display: inline" v-on:click="save()">
                {{idx !== null ? 'Обновить' : 'Добавить'}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {getURL} from "../../settings";
    import axios from "axios";
    import eventBus from "../../utils/eventBus";
    import RichEditorField from "../RichEditorField";

    export default {
        name: "ProductDialog",
        components: {RichEditorField},
        props: ['idx'],
        data: () => {
            return {
                title: '',
                description: '',
                category: '',
                properties: {},
                images: [],
                detailedDescription: '',
                articul: '',
                categories: {},
                categoriesReversed: {},
                allProperties: [],
                selectedFile: null,
                fileToLoad: null,
            }
        },
        methods: {
            getURL,
            close () {
                eventBus.$emit('product-not-updated');
            },

            save () {
                axios.post(getURL('admin/products'), {
                    action: this.idx !== null ? 'update' : 'create',
                    item: {
                        id: this.idx,
                        title: this.title,
                        description: this.description,
                        detailed: this.detailedDescription,
                        category: this.category,
                        properties: this.properties,
                        images: this.images
                    }}).then(() => {

                    eventBus.$emit( 'products-updated' );

                    this.loadProduct();

                })
            },
            loadProduct() {
                axios.get(getURL(`product/${this.idx}`))
                    .then(resp => {
                        const info = resp.data;
                        const product = info.product_info || {};

                        this.title = product.title;
                        this.properties = product.props;
                        this.images = product.images;
                        this.description = product.description;
                        this.detailedDescription = product.detailed;
                        this.articul = product.art;
                        this.category = product.category;
                    });
            },
            clearForm() {
                this.title = '';
                this.description = '';
                this.category = '';
                this.properties = {};
                this.images = [];
                this.detailedDescription = '';
                this.articul = '';
            }
        },
        computed: {
            formTitle() {
                return this.idx === null ? 'Новый товар' : 'Изменить товар'
            },
        },
        mounted() {
            if(this.idx)
                this.loadProduct();
            axios.get(getURL(`admin/category_ids`)).then(response => {
                this.categories = response.data;
                function swap(json){
                    const ret = {};
                    for(const key in json){
                        ret[json[key]] = key;
                    }
                    return ret;
                }
                this.categoriesReversed = swap(this.categories);
            })
            axios.get(getURL(`admin/properties`)).then(response => {
                this.allProperties = response.data;
            })
        },
        destroyed() {
            this.clearForm();
        },
        watch: {
            idx(newIdx) {
                if(newIdx) {
                    this.loadProduct();
                } else {
                    this.clearForm();
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
                                this.images.push(response.data);
                                this.selectedFile = null
                            })
                    }
                }
            }
        },
    }
</script>

<style scoped>

</style>
