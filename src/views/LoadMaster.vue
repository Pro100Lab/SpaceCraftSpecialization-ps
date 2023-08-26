<template>
    <v-card style="height: 80vh" class="d-flex flex-column justify-start elevation-0">
        <v-card-title class="pb-0" v-if="step === 1  || step === 4">
            Мастер загрузки <v-spacer></v-spacer>
            <v-btn class="elevation-0" color="transparent" v-on:click="showSettingsDialog = true"><v-icon large>mdi-cog</v-icon> Настройки</v-btn>
        </v-card-title>

        <v-row class="pt-10">
            <v-scroll-x-transition mode="out-in" name="slide-fade">

            <v-col :cols="3" v-if="step === 1 || step === 4" style="background: linear-gradient(90deg, rgba(34,193,195,0.3) 0%, rgba(255,255,255,0.3) 100%)">
                <v-btn dark v-on:click="dropAll" color="red" elevation="20" block>КРАСНАЯ КНОПКА!!!</v-btn>

                <v-sheet class="fill-height transparent overflow-y-auto" style="max-height: 80vh; direction: rtl"  >
                    <v-list class="transparent" style="direction: ltr">
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="text-h6">
                                    Файлы
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="!filesList.length" >
                            <v-list-item-content>
                                <v-list-item-title>
                                    Нет загруженных файлов
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item-group
                                v-model="selectedFileIndex"
                                mandatory
                                color="indigo"
                                class="elevation-4"
                        >
                            <transition-group name="list" tag="p">
                                <v-list-item v-for="file of filesList" :key="file.name">
                                    <v-list-item-icon>
                                        <v-icon color="#003300">
                                            {{ file.name.indexOf('xls') !== -1 ? 'mdi-microsoft-excel' : 'mdi-file-delimited' }}
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>{{file.name}}</v-list-item-title>
                                    <v-list-item-icon>
                                        <v-scale-transition mode="out-in">

                                            <v-icon
                                                    v-if="fileStatuses[file.name] === 'loaded'"
                                                    v-on:click.stop="deleteFileRemote(file)"
                                                    color="red">
                                                mdi-close
                                            </v-icon>


                                            <v-icon
                                                    v-if="fileStatuses[file.name] === 'succeed'"
                                                    color="green"
                                            >
                                                mdi-check
                                            </v-icon>

                                            <v-icon
                                                    v-if="fileStatuses[file.name] === 'error'"
                                                    color="red">
                                                mdi-exclamation
                                            </v-icon>

                                            <v-progress-circular
                                                    v-if="fileStatuses[file.name] === 'loading'"
                                                    indeterminate
                                                    size="20"
                                                    width="3"
                                                    color="primary"
                                            ></v-progress-circular>

                                        </v-scale-transition>
                                    </v-list-item-icon>
                                </v-list-item>
                            </transition-group>
                        </v-list-item-group>
                    </v-list>
                </v-sheet>
            </v-col>
            </v-scroll-x-transition>

            <v-col :cols="step === 1 || step === 4 ? 9 : 12">
                <v-sheet style="height: 70vh">
                    <v-scroll-x-transition mode="out-in" name="slide-fade">
                        <first-load-window v-if="step === 1"></first-load-window>
                        <second-check-headers :selectedFile="selectedFile" :status="selectedFileStatus" v-if="step === 2"></second-check-headers>
                        <third-check-content :selectedFile="selectedFile" :status="selectedFileStatus" v-if="step === 3"></third-check-content>
                        <fourth-flush :selectedFile="selectedFile" :status="selectedFileStatus" :filesToBeSent="fileNamesList" v-if="step === 4"></fourth-flush>
                    </v-scroll-x-transition>
                </v-sheet>
                <v-card-actions class="d-flex flex-row justify-center">
                    <v-btn rounded :disabled="step === 1" v-on:click="step--" color="rgba(34,193,195,0.15)">
                        <v-icon>mdi-chevron-double-left</v-icon>
                    </v-btn>

                    <step-bread-crumbs
                            :files-to-be-sent="fileNamesList"
                            :step="step"
                            :stepChange="stepChangeCallback"
                            style="width: 50%"
                            class="mx-10"></step-bread-crumbs>
                    <v-btn rounded :disabled="step === 4 || !fileNamesList.length" v-on:click="step++" color="rgba(253,187,45,0.6)">
                        <v-icon>mdi-chevron-double-right</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-col>
        </v-row>
        <v-dialog v-model="showSettingsDialog">
            <update-dialog></update-dialog>
        </v-dialog>
    </v-card>
</template>

<script>
    import StepBreadCrumbs from "../components/master-steps/StepBreadCrumbs";
    import FirstLoadWindow from "../components/master-steps/FirstLoadWindow";
    import SecondCheckHeaders from "../components/master-steps/SecondCheckHeaders";
    import ThirdCheckContent from "../components/master-steps/ThirdCheckContent";
    import FourthFlush from "../components/master-steps/FourthFlush";
    import eventBus from "../utils/eventBus";
    import axios from "axios";
    import {getURL} from "../settings";
    import UpdateDialog from "../components/dialogs/UpdateDialog";
    export default {
        name: "LoadMaster",
        components: {UpdateDialog, FourthFlush, ThirdCheckContent, SecondCheckHeaders, FirstLoadWindow, StepBreadCrumbs},
        data: () => {
            return {
                step: 1,
                possibleStep: 1,
                filesList: [],
                selectedFileIndex: null,
                selectedFile: null,
                selectedFileStatus: null,
                fileNamesList: [],
                fileStatuses: {},
                showSettingsDialog: false,
            }
        },
        watch: {
            selectedFileIndex(newIndex) {
                if( newIndex !== null ) {
                    this.selectedFile = this.fileNamesList[newIndex];
                    this.selectedFileStatus = this.fileStatuses[this.selectedFile];
                } else {
                    this.selectedFile = null;
                    this.selectedFileStatus = null;
                }
            }
        },
        methods: {
            dropAll() {
              axios.get(getURL('/admin/draft/drop')).then(()=> {
                  this.filesList = [];
                  this.fileNamesList = [];
                  this.step = 1;
              })
            },
            removeFile(fileName) {
                this.filesList.splice(this.fileNamesList.indexOf(fileName), 1);
                this.fileNamesList.splice(this.fileNamesList.indexOf(fileName), 1);

                if (!this.filesList.length) {
                    this.step = 1;
                } else {
                    this.selectedFileIndex = 0;
                }
            },
            deleteFileRemote(file) {
                const fileEncoded = encodeURIComponent(file.name);
                axios.delete(getURL(`admin/draft/task/delete/${fileEncoded}`)).then(() => {
                    this.removeFile(file.name);
                })
            },
            stepChangeCallback(step) {
                this.step = step;
            },
            loadTasks() {
                axios.get(getURL('admin/draft/task/list')).then(res => {
                    this.fileNamesList = res.data || [];
                    this.fileNamesList.forEach(fileName => {
                        this.fileStatuses[fileName] = 'loaded';
                        this.filesList.push({name: fileName});
                    })
                })
            }
        },
        mounted() {
            this.loadTasks();
            eventBus.$on('flush-file', filename => {
                this.removeFile(filename);

                if(!this.fileNamesList.length) {
                    setTimeout(() => {
                        this.step = 1;
                    }, 1500)
                }
            })

            eventBus.$on('settings-dialog-closed', () => {
                this.showSettingsDialog = false;
            })

            eventBus.$on('flush-files', () => {
                this.filesList = [];
                this.fileNamesList = [];

                setTimeout(() => {
                    this.step = 1;
                }, 1500)
            })
            eventBus.$on('files-dropped', files => {
                // Можно загрузить файлы повторно, нужно обработать, чтобы не было одинаковых файлов
                files.forEach(file => {
                    if(this.fileStatuses[file.name] === 'error') {
                        this.removeFile(file.name);
                    }
                    if(this.fileNamesList.indexOf(file.name) === -1 ) {
                        this.filesList.push(file);
                        this.fileNamesList.push(file.name);
                        this.fileStatuses[file.name] = 'loading';

                        const reader = new FileReader();
                        reader.readAsArrayBuffer(file);
                        reader.onload = () => {
                            const blob = new Blob([reader.result]);
                            const formData = new FormData();
                            formData.append('table', blob);
                            formData.append('action', 'create');
                            formData.append('type', file.type);
                            formData.append('name', file.name);
                            axios.post(getURL('admin/draft/task/create'), formData)
                                .then( () => {
                                    console.log(file);

                                    this.fileStatuses[file.name] = 'succeed';

                                    setTimeout(() => {
                                        this.fileStatuses[file.name] = 'loaded';
                                        this.filesList = [...this.filesList];
                                        if(this.selectedFile) {
                                            this.selectedFileStatus = this.fileStatuses[this.selectedFile];
                                        }
                                        this.step = 2;
                                    }, 1500)

                                    this.filesList = [...this.filesList];
                                }).catch(
                                () => {
                                    this.fileStatuses[file.name] = 'error'

                                    this.filesList = [...this.filesList];

                                    if(this.selectedFile) {
                                        this.selectedFileStatus = this.fileStatuses[this.selectedFile];
                                    }
                                })
                        }
                    }
                })
            })
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
        -webkit-box-shadow: inset 0 0 6px rgba(141, 35, 35, 0.3);
        -webkit-border-radius: 10px;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        background: rgba(243, 44, 44, 0.3);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }

    ::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(238, 58, 58, 0.3);
    }

    .slide-fade-enter-active {
        transition: all .8s ease-out;
    }

    .slide-fade-leave-active {
        transition: all .4s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
        transform: translateX(20px);
        opacity: 0;
    }
</style>
