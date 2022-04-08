<template>
    <v-card elevation="0">
        <v-row>
            <v-col :cols="showBlocks ? 8 : 12" v-if="showEditor">
                <v-card-actions>
                    <v-card-title>
                        Блоки
                    </v-card-title>
                    <v-spacer/>
                    <v-btn v-on:click="showBlocks = !showBlocks">
                        {{showBlocks ? 'Развернуть' : 'Свернуть'}}
                    </v-btn>
                </v-card-actions>
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
                    <template v-slot:item.actions="{ item }">
                        <v-icon
                                small
                                class="mr-2"
                                v-on:click="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                                small
                                v-on:click="deleteItem(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:no-data>
                        <v-card-title>Нет данных</v-card-title>
                        <v-btn
                                color="primary"
                                v-on:click="loadBlocks()"
                                class="my-4"
                        >
                            Перезагрузить
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
            <v-divider vertical/>
            <v-col :cols="showEditor ? 4 : 0" v-if="showBlocks">
                <div class="px-2 d-flex flex-column">
                    <v-card-actions>
                    <v-card-title class="text-break">
                        Редактор блоков
                    </v-card-title>
                        <v-spacer/>
                        <v-btn v-on:click="showEditor = !showEditor">
                            {{showEditor ? 'Развернуть' : 'Свернуть'}}
                        </v-btn>
                    </v-card-actions>
                    <v-btn-toggle v-model="selectedBlockType" label="Тип блока" class="d-flex flex-row overflow-auto">
                        <v-btn v-for="[idx, value] of Object.entries(this.blockTypes)" :key="idx" :value="idx">
                            <v-img :src="require(`../assets/${value}`)" contain
                                   style="max-width: 60px; max-height: 100%;"/>
                        </v-btn>
                    </v-btn-toggle>
                    <v-textarea
                            class="mt-2"
                            label="Заголовок"
                            color="green"
                            v-model="title"
                            placeholder="Если заголовок будет пустой, то он не станет отображаться"
                    />
                    <v-textarea
                            color="green"
                            label="Описание"
                            v-model="description"
                            placeholder="Если нужно для этого типа блока"
                            :height="!showEditor ? '600px' : '200px'"
                    />
                    <v-card class="my-2">
                        <v-card-subtitle>
                            Фоточки
                        </v-card-subtitle>
                            <v-spacer/>
                        <v-card-actions v-for="image of images" :key="image">
                            <v-img :src="image" contain width="30%" alt="image here">
                            </v-img>
                            <v-spacer/>
                            <v-icon large v-on:click="deleteImage(image)">
                                mdi-trash-can
                            </v-icon>
                            <v-spacer/>
                        </v-card-actions>
                            <v-file-input outlined dense placeholder="Выберете фоточку" accept="image/*" class="mx-2" v-model="selectedFile" />
                    </v-card>
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
    import axios from 'axios';
    import {getURL} from "../settings";

    export default {
        name: "Blocks",
        mounted() {
            this.loadBlocks();
        },
        data: () => {
            return {
                headers: [{ text: 'Actions', value: 'actions', sortable: false }],
                idx: null,
                items: [],
                selectedBlockType: 1,
                title: '',
                description: '',
                images: [],
                selectedFile: '',
                blockTypes: {
                    1: 'block-1.png',
                    2: 'block-2.png',
                    3: 'block-3.png',
                    4: 'block-4.png',
                    5: 'block-5.png',
                    6: 'block-6.png',
                    7: 'block-7.png',
                },
                showBlocks: true,
                showEditor: true,
            }
        },
        watch: {
            selectedFile(value) {
                if ( value ) {
                    const reader = new FileReader();
                    console.log(value);
                    reader.readAsBinaryString(this.selectedFile);
                    reader.onload = () => {
                        const blob = new Blob([reader.result]);
                        const formData = new FormData();
                        formData.append('image', blob);
                        formData.append('action', 'create');
                        formData.append('type', value.type);
                        formData.append('name', value.name);
                        axios.post(getURL('admin/content'), formData, {withCredentials:true})
                        .then(response=> {
                            this.images.push(getURL(`static/${response.data}`));
                        })
                    }
                }
            }
        },
        methods: {
            deleteImage(image) {
                console.log('delete')
                console.log(image)
                axios.post(getURL('admin/content'), {
                    action: 'delete',
                    link: image
                }, {withCredentials:true});
                this.images.splice(this.images.indexOf(image), 1);
            },
            loadBlocks() {
                this.items = [];
                this.headers = [];
                axios.get(getURL('admin/blocks', {withCredentials: true}))
                    .then(response => {
                        const resp_items = response.data;
                        if (resp_items && resp_items.length > 0) {
                            const resp_keys = Object.keys(resp_items[0]);
                            for(const key of resp_keys) {
                                this.headers.push({text: key, value: key})
                            }
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
                axios.post(getURL('admin/blocks'), {
                    id: this.idx,
                    action: this.idx !== null ? 'update' : 'create',
                    type: this.selectedBlockType,
                    title: this.title,
                    description: this.description,
                    images: this.images
                }, {withCredentials: true})
                .then(()=> {
                   this.loadBlocks();
                });
              this.cleanForm();
            },
            cleanForm() {
                this.selectedBlockType = 1;
                this.title = '';
                this.description = ''
                this.idx = null;
                this.images = [];
                this.selectedFile = '';
            },
            editItem(item) {
                this.idx = item['@Block'];
                this.images = item['Content']
                this.title = item['Title']
                this.selectedBlockType = item['Type'];
                this.description = item['Description'];
            },
            deleteItem(item) {
                axios.post(getURL('admin/blocks'), {
                    action: 'delete',
                    id: item['@Block']
                }, {withCredentials: true})
                    .then( ()=> {
                        this.loadBlocks();
                    });
            }
        }
    }
</script>

<style scoped>

</style>
