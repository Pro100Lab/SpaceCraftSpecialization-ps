<template>
    <v-card class="overflow-hidden">
        <v-card-actions
                style="background: gray"
        >
            <v-card-title class="white--text">
                Редактор блока информации
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn v-on:click="closeForm()">Закрыть</v-btn>
            <v-btn color="red" style="color: white" v-on:click="cleanForm()">
                Очистить
            </v-btn>
        </v-card-actions>

        <v-sheet class="pa-2">
            <v-row>
                <v-col cols="6">
                    <rich-editor-field v-model="title" title="Заголовок"></rich-editor-field>
                    <v-switch v-model="enableRichEditor" color="green" label="Текстовый редактор"></v-switch>
                    <rich-editor-field v-model="description" title="Текст" v-if="enableRichEditor"></rich-editor-field>
                    <v-textarea v-model="description" label="Текст" v-else></v-textarea>
                </v-col>
                <v-col cols="6">
                    <v-card-title>Тип блока</v-card-title>

                    <v-btn-toggle v-model="selectedBlockType" label="Тип блока" class="d-flex flex-row overflow-auto">
                        <v-btn  v-for="[idx, value] of Object.entries(this.blockTypes)" :key="idx" :value="idx" >
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-img :src="require(`../../assets/${value.name}`)" contain
                                           style="max-width: 60px; max-height: 100%;"
                                           v-bind="attrs"
                                           v-on="on"/>
                                </template>
                                <span>{{value.info}}</span>

                            </v-tooltip>
                        </v-btn>
                    </v-btn-toggle>
                    <v-card-title>
                        Изображения
                    </v-card-title>
                    <v-spacer/>
                    <v-card-actions class="d-flex flex-row align-start justify-center" v-for="image of images" :key="image">
                        <div style="width: 90%" >
                            <v-img class="pa-1" :src="getURL(`static/${image}`)" style="max-height: 200px" contain alt="image here">
                            </v-img>
                        </div>
                        <v-icon large v-on:click.stop="deleteImage(image)" color="red">
                            mdi-close
                        </v-icon>

                    </v-card-actions>
                    <v-card-actions>
                        <v-file-input
                                outlined dense
                                placeholder="Выберите изображение"
                                accept="image/*" class="mx-2" v-model="selectedFile" />
                    </v-card-actions>
                </v-col>
            </v-row>
        </v-sheet>
        <v-card-actions
                style="background: gray"
        >
            <v-btn block color="green" style="color: white; display: inline" v-on:click="createUpdateBlock()">
                {{idx ? 'Обновить' : 'Добавить'}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import RichEditorField from "../RichEditorField";
    import axios from "axios";
    import {getURL} from "../../settings";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "BlockDialog",
        components: {RichEditorField},
        props: ['idx'],
        data: () => {
            return {
                eventBus,
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
                selectedBlockType: '1',
                title: '',
                description: '',
                enableRichEditor: true,
                images: [],
                selectedFile: null,
                fileLink: '',
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
            }
        },
        destroyed() {
            this.cleanForm();
            eventBus.$emit('block-not-changed');
        },
        mounted() {
            console.log('mounted with id: ', this.idx)

            if(this.idx) {

                axios.get(getURL(`block/${this.idx}`)).then(resp => {
                    const item = resp.data;
                    this.images = item['Content'] || []
                    this.title = item['Title']
                    this.selectedBlockType = String(item['Type']);
                    this.description = item['Description'];
                })
            }
        },
        watch: {
            idx: function(newIdx) {
                console.log('watch id: ', newIdx)
                if(newIdx) {
                    this.loadBlock();
                }
                else {
                    this.cleanForm();
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
                                if(Array.isArray(this.images)) {
                                    this.images.push(response.data);
                                } else {
                                    this.images[response.data] = response.data;
                                }
                                this.selectedFile = null;
                            })
                    }
                }
            }
        },
        methods: {
            loadBlock(){
                axios.get(getURL(`block/${this.idx}`)).then(resp => {
                    const item = resp.data;
                    this.images = item['Content'] || []
                    this.title = item['Title']
                    this.selectedBlockType = String(item['Type']);
                    this.description = item['Description'];
                })
            },
            changeTitle(text) {
                this.title = text
            },
            changeDescription(text) {
                this.description = text
            },
            closeForm() {
                this.cleanForm();
                eventBus.$emit('block-not-changed')
            },
            deleteImage(image) {
                axios.post(getURL('admin/content'), {
                    action: 'delete',
                    link: image
                }, {withCredentials:true});
                if(Array.isArray(this.images)) {
                    this.images.splice(this.images.indexOf(image), 1);
                } else {
                    delete this.images[image];
                }
                axios.post(getURL('admin/blocks'), {
                    id: this.idx,
                    action: this.idx ? 'update' : 'create',
                    type: this.selectedBlockType,
                    title: this.title,
                    description: this.description,
                    images: this.images
                }, {withCredentials: true});
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
            createUpdateBlock() {
                axios.post(getURL('admin/blocks'), {
                    id: this.idx,
                    action: this.idx ? 'update' : 'create',
                    type: this.selectedBlockType,
                    title: this.title,
                    description: this.description,
                    images: this.images
                }, {withCredentials: true})
                    .then((resp)=> {
                            const data = resp.data;
                            const idx = data ? data['@Block'] : null;
                            eventBus.$emit(this.idx ? 'block-updated' : 'block-created', idx );
                    });
            },
            cleanForm() {
                this.selectedBlockType = '1';
                this.title = '';
                this.description = ''
                this.images = [];
                this.selectedFile = null;
            },
            editItem(item) {
                this.images = item['Content'] || []
                this.title = item['Title']
                this.selectedBlockType = String(item['Type']);
                this.description = item['Description'];
            },
            deleteItem(item) {
                axios.post(getURL('admin/blocks'), {
                    action: 'delete',
                    id: item['@Block']
                }, {withCredentials: true})
                    .then( ()=> {
                        eventBus.$emit('blocks-updated', this.idx ? this.idx : null);
                    });
            },
            getURL,
        }
    }
</script>

<style scoped>

</style>
