<template>
    <v-card elevation="0">
        <v-row>
            <v-col cols="8">
                <v-card-title>
                    Информация
                </v-card-title>
                <v-data-table
                        :headers="headers"
                        :items="items"
                        :items-per-page="50"
                        dense
                >
                    <template v-slot:item.Title="{item}">
                        <div class="text-truncate" style="max-width: 130px;">
                            {{ item.Title }}
                        </div>
                    </template>
                    <template v-slot:item.Description="{item}">
                        <div class="text-truncate" style="max-width: 130px;">
                            {{ item.Description }}
                        </div>
                    </template>
                    <template v-slot:item.Image="{item}">
                        <div class="text-truncate" style="max-width: 130px;">
                            {{ item.Description }}
                        </div>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon
                                small
                                class="mr-2"
                                @click="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                                small
                                @click="deleteItem(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:no-data>
                        <v-card-title>Нет данных</v-card-title>
                        <v-btn
                                color="primary"
                                @click="initialize"
                                class="my-4"
                        >
                            Перезагрузить
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
            <v-divider vertical/>
            <v-col cols="4">
                <div class="px-2">
                    <v-card-title>
                        Редактор
                    </v-card-title>

                    <v-text-field class="mt-2" label="Заголовок" color="green" v-model="title"/>
                    <v-textarea color="green" label="Описание" v-model="description" />
                    <v-text-field color="green" label="Блоки (через запятую)" v-model="blocks" />
                    <v-text-field color="green" label="Раздел" v-model="section" />
                    <v-text-field color="green" label="Изображение" v-model="image" />
                    <v-row>
                        <v-col cols="8">
                            <v-btn block color="green" style="color: white; display: inline" v-on:click="createUpdateBlock()">
                                {{this.idx !== null ? 'Обновить' : 'Добавить'}}
                            </v-btn>
                        </v-col>
                        <v-col cols="4">
                            <v-btn color="red" style="color: white" v-on:click="cleanForm()">
                                Очистить
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import axios from "axios";
    import {getURL} from "../settings";

    export default {
        name: "Category",
        data: () => {
            return {
                headers: [{ text: 'Actions', value: 'actions', sortable: false }],
                idx: null,
                items: [],
                title: '',
                description: '',
                section: '',
                image: '',
                blocks: '',
            }
        },
        mounted() {
            this.loadCategory();
        },
        methods: {
            loadCategory() {
                this.items = [];
                this.headers = [];
                axios.get(getURL('admin/categories', {withCredentials: true}))
                    .then(response => {
                        const resp_items = response.data;
                        if (resp_items && resp_items.length > 0) {
                            const resp_keys = Object.keys(resp_items[0]);
                            console.log(resp_keys)
                            for(const key of resp_keys) {
                                this.headers.push({text: key, value: key})
                            }
                            console.log(this.headers);
                        }

                        for(const item of resp_items) {
                            let newItem = item;
                            newItem['Properties'] = JSON.stringify(item['Properties'])
                            this.items.push(newItem);
                        }
                    });
                this.headers.push({ text: 'Actions', value: 'actions', sortable: false });
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
                        this.loadCategory();
                    });
                this.cleanForm();
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
            }
        }
    }
</script>

<style scoped>

</style>
