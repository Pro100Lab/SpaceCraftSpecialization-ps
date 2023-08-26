<template>
    <v-card elevation="0">
        <v-card-actions>
            <v-card-title class="py-0">
                Страницы
            </v-card-title>
            <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                    <v-icon color="green" class="mx-2" v-on:click="showDialog = true" dark
                            v-on="on"
                            v-bind="attrs"
                    >mdi-plus-circle-outline</v-icon>
                </template>
                <span>Добавить страницу</span>
            </v-tooltip>

        </v-card-actions>
        <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="50"
                v-on:click:row="(item, _) => editItem(item)"
                style="height: 80vh; cursor: pointer"
                class="overflow-y-auto"
                dense
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
            <template v-slot:item.actions="{ item }">
                <v-icon
                        elevation="0"
                        dark
                        style="max-width: 100px; cursor: pointer"
                        color="red"
                        v-on:click.stop="deleteItem(item)"
                >
                    mdi-close
                </v-icon>
            </template>
            <template v-slot:item.Blocks="{item}">
                <div style="max-height: 100px;" class="overflow-y-auto py-2">
                <div class="d-flex flex-column" v-for="block of item.Blocks" :key="block * Math.random() * 100">
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
                        @click="loadInfo"
                        class="my-4"
                >
                    Перезагрузить
                </v-btn>
            </template>
        </v-data-table>
        <v-dialog id="info-dialog" v-model="showDialog">
            <v-card class="transparent elevation-0">
                <v-card-actions
                        style="background: gray"
                >
                    <v-card-title class="white--text">
                        Редактор записи информации
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn v-on:click="showDialog=false">Закрыть</v-btn>
                    <v-btn color="red" style="color: white" v-on:click="cleanForm()">
                        Очистить
                    </v-btn>
                </v-card-actions>

                <v-sheet class="overflow-y-auto pa-4">
                    <v-row>
                        <v-col cols="6">
                    <v-text-field class="pt-2" label="Заголовок" color="green" v-model="title"></v-text-field>
                    <v-text-field color="green" label="Роутинг" v-model="route" ></v-text-field>
                            <rich-editor-field v-model="description" title="Описание"></rich-editor-field>
                        </v-col>
                        <v-col cols="6">

                        <block-picker :initial-block-ids="this.blocks" style="height: 450px"></block-picker>
                        </v-col>

                    </v-row>
                </v-sheet>

                <v-card-actions style="background: gray">
                    <v-btn block  color="green" style="color: white; display: inline" v-on:click="createUpdateBlock()">
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
    import eventBus from "../utils/eventBus";
    import BlockPicker from "../components/BlockPicker";
    import RichEditorField from "../components/RichEditorField";

    export default {
        name: "Information",
        components: {RichEditorField, BlockPicker},
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
                    '@Information': 'Идентификатор',
                    'Title': 'Заголовок',
                    'Info': 'Описание',
                    'Blocks': 'Контент',
                    'Name': 'Ссылка'
                },
                headers: [],
                idx: null,
                items: [],
                title: '',
                description: '',
                blocks: [],
                route: '',
                blocksCache: {},
                showDialog: false
            }
        },
        methods: {
            loadInfo() {
                this.items = [];
                this.headers = [];

                axios.get(getURL('admin/information', {withCredentials: true}))
                    .then(response => {
                        const resp_items = response.data;
                        if (resp_items && resp_items.length > 0) {
                            const resp_keys = Object.keys(resp_items[0]);
                            console.log(resp_keys)
                            for(const key of resp_keys) {
                                if (key === 'id')
                                    continue;
                                this.headers.push({text: this.TableMap[key] || key, value: key })
                            }
                            console.log(this.headers);
                        }

                        for(const item of resp_items) {
                            let newItem = item;
                            newItem['Properties'] = JSON.stringify(item['Properties'])
                            this.items.push(newItem);
                        }
                        this.headers.push({ text: 'Действия', value: 'actions', sortable: false });
                    });
            },
            createUpdateBlock() {
                axios.post(getURL('admin/information'), {
                    id: this.idx,
                    action: this.idx !== null ? 'update' : 'create',
                    title: this.title,
                    description: this.description,
                    blocks: this.blocks,
                    name: this.route
                }, {withCredentials: true})
                    .then( ()=> {
                        this.loadInfo();
                    });
                this.showDialog = false;
            },
            cleanForm() {
                this.idx = null;
                this.blocks = [];
                this.title = '';
                this.route = '';
                this.description = '';
            },
            editItem(item) {
                console.log(item);
                this.idx = item['@Information'];
                this.blocks = item['Blocks']
                this.title = item['Title']

                this.route = item['Name'];
                this.description = item['Info'];
                this.showDialog = true;
            },
            deleteItem(item) {
                axios.post(getURL('admin/information'), {
                    action: 'delete',
                    id: item['@Information']
                }, {withCredentials: true})
                    .then( ()=> {
                        this.loadInfo();
                    });
            },
            async loadBlocks() {
                let response = await axios.get(getURL('admin/blocks'))
                let blocks = response.data;
                blocks.forEach(block => {
                    this.blocksCache[block['@Block']] = block;
                })
                console.log(this.blocksCache);
            }
        },
        watch: {
            showDialog: function(newValue) {
                if( !newValue )
                    this.cleanForm();
            }
        },
        mounted() {
            this.loadBlocks().then(() => {
                this.loadInfo();
            })
            eventBus.$on('block-ids-changed', ids => {
                this.blocks = ids;
            })
        },
        destroyed() {
            eventBus.$off('block-ids-changed');
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
