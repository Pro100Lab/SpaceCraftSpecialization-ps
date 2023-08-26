<template>
    <v-card elevation="0">
        <v-card-actions>
            <v-card-title>
                Вкладки
            </v-card-title>
        </v-card-actions>
        <v-row>
            <v-col cols="3" class="tabs__tabs-selector">
                <v-card-actions class="d-flex flex-row align-center">
                    <v-card-title class="pa-0">
                        Структура вкладок
                    </v-card-title>
                    <v-tooltip top>
                        <template v-slot:activator="{on, attrs}">
                            <v-icon color="green" class="mx-2" v-on:click="showDialog = true" dark
                                    v-on="on"
                                    v-bind="attrs"
                            >mdi-plus-circle-outline</v-icon>
                        </template>
                        <span>Добавить вкладку</span>
                    </v-tooltip>
                </v-card-actions>

                <category-tree  :items="items"></category-tree>
            </v-col>
            <v-col cols="9">

                <v-data-table
                        :headers="headers"
                        :items="selectedItems"
                        :items-per-page="50"
                        dense
                        style="height: 80vh; cursor: pointer"
                        v-on:click:row="(item, _) => editItem(item)"
                        class="overflow-y-auto"
                >
                    <template v-slot:item.Title="{item}">
                        <strong style="max-width: 130px;">
                            {{ item.Title }}
                        </strong>
                    </template>
                    <template v-slot:item.Description="{item}">
                        <div class="text-truncate" style="max-width: 130px;">
                            {{ item.Description }}
                        </div>
                    </template>
                    <template v-slot:item.Image="{item}">
                        <v-img contain style="max-width: 5vw" :src="getURL(`static/${item.Image}`)"/>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon
                                color="red"
                                v-on:click.stop="deleteItem(item)"
                        >
                            mdi-close
                        </v-icon>
                    </template>
                    <template v-slot:item.Blocks="{item}">
                        <div style="max-height: 100px" class="overflow-y-auto my-2">
                        <div class="d-flex flex-column"  v-for="block of item.Blocks" :key="block">
                            <span>
                                {{block}}:
                                <template v-if="block in blocksCache">
                                {{blockTypes[blocksCache[block].Type].info}}
                                <b>{{blocksCache[block].Title.replaceAll(rega, '')}}</b>
                                    </template>
                                <template v-else>
                                    <b style="color: red">Несуществующий блок!</b>
                                </template>
                            </span>
                        </div>
                        </div>
                    </template>
                    <template v-slot:no-data>
                        <v-card-title>Нет данных</v-card-title>
                        <v-btn
                                color="primary"
                                @click="loadCategory"
                                class="my-4"
                        >
                            Перезагрузить
                        </v-btn>
                    </template>

                </v-data-table>
            </v-col>

        </v-row>

        <v-dialog v-model="showDialog">
            <v-card class="overflow-y-hidden">
                <v-card-actions
                        style="background: gray"
                >
                    <v-card-title class="white--text">
                        Редактор категории товаров
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn v-on:click="showDialog=false">Закрыть</v-btn>
                    <v-btn color="red" style="color: white" v-on:click="cleanForm()">
                        Очистить
                    </v-btn>
                </v-card-actions>

                <v-sheet class="overflow-y-auto pa-4">
                    <v-row>
                        <v-col cols="4">
                            <v-text-field label="Заголовок" color="green" v-model="title"/>
                            <v-text-field color="green" label="Раздел" v-model="section" />
                            <rich-editor-field v-model="description" title="Описание" />
                        </v-col>
                        <v-col cols="4">
                            <block-picker :initial-block-ids="blocks" style="height: 450px"></block-picker>
                        </v-col>
                        <v-col cols="4">
                            <v-card class="elevation-0">
                                <v-card-title>
                                    Изображения
                                </v-card-title>
                                <v-spacer/>
                                <v-card-actions v-if="image && image.length">
                                    <v-img :src="getURL(`static/${image}`)" contain width="30%" alt="image here">
                                    </v-img>
                                    <v-icon large color="red" v-on:click="deleteImage(image)">
                                        mdi-close
                                    </v-icon>
                                    <v-spacer/>
                                </v-card-actions>
                                <v-file-input outlined dense placeholder="Выберете фоточку" accept="image/*" v-model="selectedFile" />
                            </v-card>
                        </v-col>
                    </v-row>


                </v-sheet>

                <v-card-actions
                        style="background: gray"
                >
                    <v-btn block color="green" style="color: white; display: inline" v-on:click="createUpdateBlock()">
                        {{this.idx !== null ? 'Обновить' : 'Добавить'}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    import axios from "axios";
    import {getURL} from "../settings";
    import CategoryTree from "../components/CategoryTree";
    import eventBus from "../utils/eventBus";
    import BlockPicker from "../components/BlockPicker";
    import RichEditorField from "../components/RichEditorField";

    export default {
        name: "Category",
        components: {RichEditorField, BlockPicker, CategoryTree},
        data: () => {
            return {
                rega: /<.*?>/gm,
                blockTypes: {
                    1: { name: 'block-1.png', info: 'Текст с заголовком'},
                    2: { name: 'block-2.png', info: 'Текст с картинкой слева'},
                    3: { name: 'block-3.png', info: 'Текст с картинкой справа'},
                    4: { name: 'block-4.png', info: 'Заголовок и две картинки'},
                    5: { name: 'block-5.png', info: 'Заголовок и три картинки'},
                    6: { name: 'block-6.png', info: 'Цены'},
                    7: { name: 'block-7.png', info: 'Слайдер с картинками'},
                    8: { name: 'block-7.png', info: 'Слайдер с 3 активными элементами'},
                    9: { name: 'block-7.png', info: 'Слайдер с товарами'},
                    10: { name: 'block-7.png', info: 'Бронирование'},
                    11: { name: 'block-11.png', info: 'Яндекс карты'}
                },
                TableMap: {
                    'Actions': 'Действия',
                    '@Category': 'Идентификатор',
                    'Title': 'Заголовок',
                    'Description': 'Описание',
                    'Image': 'Изображения',
                    'Section': 'Родительская категория',
                    'Blocks': 'Контент',
                    'Presets': 'Пресеты'
                },
                headers: [],
                idx: null,
                items: [],
                title: '',
                description: '',
                section: '',
                image: '',
                blocks: '',
                selectedFile: null,
                showDialog: false,
                blocksCache: {},
                treeNodesSelected: [],
                tree: [],
                selectedItems: []
            }
        },
        mounted() {
            this.loadBlocks().then(()=> {
                this.loadCategory();
            })
            eventBus.$on('category-parents-changed', parents => {
                this.treeNodesSelected = parents;
                this.loadSelectedCategories();
            })
        },
        destroyed() {
            this.blocks = '';
        },
        watch: {
            showDialog: function(newValue) {
                if( !newValue )
                    this.cleanForm();
            },
            selectedFile(value) {
                if ( value ) {
                    const reader = new FileReader();
                    console.log(value);
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
                                this.image = response.data;
                                this.selectedFile = null;
                            })
                    }
                }
            }
        },
        methods: {
            loadSelectedCategories() {
                this.selectedItems = [];
                for(const item of this.items) {
                    if( this.treeNodesSelected.length > 0 ) {
                        if (this.treeNodesSelected.indexOf(item['@Category']) !== -1 ||
                            this.treeNodesSelected.indexOf(item['Section']) !== -1) {
                            let newItem = item;
                            newItem['Properties'] = JSON.stringify(item['Properties'])
                            this.selectedItems.push(newItem);
                        }
                    } else {
                        let newItem = item;
                        newItem['Properties'] = JSON.stringify(item['Properties'])
                        this.selectedItems.push(newItem);
                    }
                }
            },
            loadCategory() {
                let items = [];
                this.headers = [];
                axios.get(getURL('admin/categories', {withCredentials: true}))
                    .then(response => {
                        const resp_items = response.data;
                        if (resp_items && resp_items.length > 0) {
                            const resp_keys = Object.keys(resp_items[0]);
                            console.log(resp_keys)
                            for(const key of resp_keys) {
                                this.headers.push({text: this.TableMap[key] || key, value: key })
                            }
                            console.log(this.headers);
                        }

                        for(const item of resp_items) {
                            let newItem = item;
                            newItem['Properties'] = JSON.stringify(item['Properties'])
                            items.push(newItem);
                        }

                        this.headers.push({ text: 'Действия', value: 'actions', sortable: false });
                        this.items = items;
                        this.loadSelectedCategories();
                    });

            },
            deleteImage(image) {
                console.log('delete')
                console.log(image)
                axios.post(getURL('admin/content'), {
                    action: 'delete',
                    link: image
                }, {withCredentials:true});
                this.image='';
            },
            createUpdateBlock() {
                axios.post(getURL('admin/categories'), {
                    id: this.idx,
                    action: this.idx !== null ? 'update' : 'create',
                    title: this.title,
                    description: this.description,
                    section: this.section,
                    blocks: this.blocks,
                    image: this.image
                }, {withCredentials: true})
                    .then( ()=> {
                        this.showDialog = false;
                        this.loadCategory();
                    });
            },
            cleanForm() {
                this.selectedBlockType = 1;
                this.title = '';
                this.idx = null;
                this.description = '';
                this.section = '';
                this.image = '';
                this.blocks = '';
            },
            editItem(item) {
                this.showDialog = true;
                this.idx = item['@Category'];
                this.image = item['Image']
                this.title = item['Title']
                this.section = item['Section'];
                this.description = item['Description'];
                this.blocks = item['Blocks'];
                console.log(item);
            },
            deleteItem(item) {
                axios.post(getURL('admin/categories'), {
                    action: 'delete',
                    id: item['@Category']
                }, {withCredentials: true})
                    .then( ()=> {
                        this.loadCategory();
                    });
            },
            getURL,
            async loadBlocks() {
                let response = await axios.get(getURL('admin/blocks'))
                let blocks = response.data;
                blocks.forEach(block => {
                    this.blocksCache[block['@Block']] = block;
                })
                console.log(this.blocksCache);
            },
        }
    }
</script>

<style scoped>

    .tabs__tabs-selector {
        background: rgb(121, 171, 172);
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(255, 255, 255, 0.5) 100%);
    }

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
