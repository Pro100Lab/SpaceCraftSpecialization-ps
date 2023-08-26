<template>
    <v-card elevation="0">
        <v-card-actions>
            <v-card-title>
                Блоки
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn color="green" class="mx-2" v-on:click="showDialog = true" dark>Добавить</v-btn>

        </v-card-actions>


        <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="50"
                dense
                style="height: 80vh; cursor: pointer"
                v-on:click:row="(item, _) => editItem(item)"
                class="overflow-y-auto"
        >
            <template v-slot:item.Title="{item}">
                <div style="max-width: 300px;">
                    <strong v-html="item.Title">
                    </strong>
                </div>
            </template>
            <template v-slot:item.Type="{item}">
                <div style="max-width: 130px;">
                    {{ blockTypes[item.Type].info }}
                </div>
            </template>
            <template v-slot:item.Description="{item}">
                <div class="overflow-y-auto overflow-x-auto" style="max-width: 200px; max-height: 60px" v-html="item.Description">
                </div>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                        color="red"
                        v-on:click.stop="deleteItem(item)"
                >
                    mdi-close
                </v-icon>
            </template>
            <template v-slot:item.Content="{item}">
                <div v-on:click.stop class="d-flex flex-column overflow-y-auto" style="max-width: 200px; max-height: 60px">
                        <v-img contain style="max-width: 100px" v-for="image of item.Content" :key="image" :src="getURL(`static/${image}`)"/>
                </div>
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

        <v-dialog v-model="showDialog">
            <block-dialog :idx="idx"></block-dialog>
        </v-dialog>
    </v-card>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../settings";
    import BlockDialog from "../components/dialogs/BlockDialog";
    import eventBus from "../utils/eventBus";

    export default {
        name: "Blocks",
        components: {BlockDialog},
        mounted() {
            this.loadBlocks();
            eventBus.$on('block-updated', () => {
                this.loadBlocks();
            })
            eventBus.$on('block-created', (idx) => {
                this.blockIds.push(idx);
                this.loadBlocks();
            });
            eventBus.$on('block-not-changed', () => {
                this.showDialog = false;
            })
        },
        destroyed() {
            eventBus.$off('block-updated');
            eventBus.$off('block-created');
            eventBus.$off('block-not-changed');
        },
        data: () => {
            return {
                TableMap: {
                    'Actions': 'Действия',
                    '@Block': 'Идентификатор',
                    'Title': 'Заголовок',
                    'Description': 'Описание',
                    'Content': 'Изображения',
                    'Type': 'Тип'
                },
                headers: [],
                items: [],
                idx: null,
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
                showDialog: false,
            }
        },
        watch: {
          showDialog(newShowDialog) {
              if(!newShowDialog) {
                  this.idx = null;
              }
          }
        },
        methods: {
            loadBlocks() {
                this.items = [];
                this.headers = [];
                axios.get(getURL('admin/blocks', {withCredentials: true}))
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
                            newItem['Properties'] = JSON.stringify(item['Properties'])
                            this.items.push(newItem);
                        }
                        this.headers.push({ text: 'Действия', value: 'actions', sortable: false });

                    });
            },
            editItem(item) {
                this.showDialog = true;
                this.idx = item['@Block'];
            },
            deleteItem(item) {
                axios.post(getURL('admin/blocks'), {
                    action: 'delete',
                    id: item['@Block']
                }, {withCredentials: true})
                    .then( ()=> {
                        this.loadBlocks();
                    });
            },
            getURL,
        }
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
