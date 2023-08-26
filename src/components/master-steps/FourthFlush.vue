<template>
    <v-sheet
            style="min-height: 60vh; max-height: 60vh"
            elevation="10"
            class="rounded-lg pa-6"
    >
        <v-card-title class="pt-0">Отправка данных</v-card-title>

           <v-row>
               <v-col cols="6" v-if="filesToBeSent.length">
                   <v-card elevation="0" class="pa-5">
                       <v-card-title>
                           Загружено файлов: {{filesToBeSent.length}}
                       </v-card-title>
                       <v-card-title>
                           <v-icon class="mr-5" color="green">mdi-plus</v-icon> добавлено {{diffGlobal.created.length}} товаров
                       </v-card-title>
                       <v-card-title>
                           <v-icon class="mr-5" color="orange">mdi-tilde</v-icon> изменено {{diffGlobal.updated.length}} товаров
                       </v-card-title>
                       <v-card-title>
                           <v-icon class="mr-5" color="red">mdi-minus</v-icon> удалено {{diffGlobal.deleted.length}} товаров
                       </v-card-title>

                       <v-card-actions>
                           <v-btn v-on:click="flushAll" :disabled="inProcessAny" block rounded color="rgba(253,187,45,1)" dark>Обновить всё</v-btn>
                       </v-card-actions>
                   </v-card>
               </v-col>
               <v-col cols="6" v-if="diffLocal && selectedFile && filesToBeSent && filesToBeSent.length > 1">
                   <v-card elevation="0" color="rgba(0,0,0,0.1)" class="pa-5 rounded-xl">
                       <v-card-title>
                           Выбранный файл {{selectedFile}}
                       </v-card-title>
                       <v-card-title>
                           <v-icon class="mr-5" color="green">mdi-plus</v-icon> добавлено {{diffLocal.created.length}} товаров
                       </v-card-title>
                       <v-card-title>
                           <v-icon class="mr-5" color="orange">mdi-tilde</v-icon> изменено {{diffLocal.updated.length}} товаров
                       </v-card-title>
                       <v-card-title>
                           <v-icon class="mr-5" color="red">mdi-minus</v-icon> удалено {{diffLocal.deleted.length}} товаров
                       </v-card-title>

                       <v-card-actions>
                           <v-btn
                                   v-on:click="flushSingle"
                                   :disabled="inProcessAny || status === 'loading'"
                                   block
                                   rounded
                                   color="rgba(34,193,195,0.15)">
                               {{status === 'loading' ? 'Файл загружается' : 'Обновить один файл'}}
                               <v-progress-circular
                                       v-if="status === 'loading'"
                                       indeterminate
                                       size="20"
                                       class="mx-2"
                                       width="3"
                                       color="primary"
                               ></v-progress-circular>
                           </v-btn>
                       </v-card-actions>
                   </v-card>
               </v-col>
               <v-col v-if="!filesToBeSent.length" cols="12" class="d-flex flex-column justify-center align-center"
               style="height: 50vh">
                   <v-card-title>
                       Отличная работа! Все файлы отправлены
                   </v-card-title>
                   <v-card-subtitle>
                       Пора заварить кофеёк
                   </v-card-subtitle>
               </v-col>
           </v-row>
    </v-sheet>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../../settings";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "FourthFlush",
        data: () => {
            return {
                inProcessSingle: false,
                inProcessAll: false,
                diffGlobal: {'created': 0, 'updated': 0, 'selected': 0},
                diffLocal: null,
            }
        },
        mounted() {
            if (this.selectedFile) {
                this.loadDiffSelected();
            }
            this.loadDiffGlobal();
        },
        watch: {
          selectedFile() {
              this.loadDiffSelected();
          },
            filesToBeSent() {
              this.loadDiffGlobal();
            }
        },
        methods: {
            loadDiffSelected() {
                if (this.selectedFile) {
                    axios.post(getURL('admin/draft/product/get_diff'), {task: this.selectedFile}).then(resp =>{
                        this.diffLocal = resp.data;
                    })
                }
            },
            loadDiffGlobal() {
                if (this.selectedFile) {

                    axios.post(getURL('admin/draft/product/get_diff')).then(resp => {
                        this.diffGlobal = resp.data;
                    })
                }
            },
            flushSingle() {
                axios.post(getURL('admin/draft/flush'), {file: this.selectedFile, all: false}).then(() => {
                    eventBus.$emit('flush-file', this.selectedFile);
                })
            },
            flushAll() {
                axios.post(getURL('admin/draft/flush'), {all: true}).then(() => {
                    eventBus.$emit('flush-files');

                })
            }
        },
        computed: {
            inProcessAny: function() {
                return this.inProcessSingle || this.inProcessAll;
            }
        },
        props: ['selectedFile', 'filesToBeSent', 'status']
    }
</script>

<style scoped>

</style>
