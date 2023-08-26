<template>
    <v-sheet>
        <v-card-title class="pt-0">Загрузка файлов</v-card-title>
        <slot>
            <v-sheet
                    elevation="10"
                    v-on:drop.prevent="loadFile"

                    v-on:dragenter.prevent="setActive"
                    v-on:dragover.prevent="setActive"

                    v-on:dragleave.prevent="setInactive"
                    v-on:dragend.prevent="setInactive"

                    :color=" active ? 'rgba(34,193,195,0.3)' :'rgba(34,193,195,0.15)'"
                    style="min-height: 300px"
                    class="rounded-xl d-flex flex-column justify-center align-center fill-height">
                <v-card-title
                        class="text-break text-center" v-html="!active ?'Перенесите файлы для загрузки':'Отпустите файлы здесь '">
                </v-card-title>
                <v-icon color="#003300" v-if="active" x-large>mdi-arrow-down-left</v-icon>
                <v-icon color="#003300" v-if="!active" x-large>mdi-microsoft-excel</v-icon>
                <v-card-subtitle v-if="!active">
                    .xls, .xlsx, .csv
                </v-card-subtitle>
            </v-sheet>
        </slot>

    </v-sheet>
</template>

<script>
    import eventBus from "../../utils/eventBus";

    export default {
        name: "FirstLoadWindow",
        data: () => {
            return {
                active: false
            }
        },
        methods: {
            loadFile(e) {
                const possibleFormats = ['.xls', 'csv'];

                let correctFormatFiles = [];
                let transferFiles = [...e.dataTransfer.files];
                transferFiles.forEach(file => {
                    possibleFormats.forEach(format => {
                        if(file.name.indexOf(format) !== -1) {
                            correctFormatFiles.push(file);
                        }
                    })
                })

                if(correctFormatFiles.length) {
                    eventBus.$emit('files-dropped', correctFormatFiles);
                }
                console.log(this.filesList);
                this.active = false;
            },
            setActive() {
                this.active = true;
            },
            setInactive(e) {
                const prev_class = e.fromElement._prevClass;
                if(prev_class && prev_class.indexOf('card__title') !== -1 ||
                    prev_class.indexOf('card__subtitle') !== -1 ||
                    prev_class.indexOf('icon') !== -1 ||
                    prev_class.indexOf('elevation-10') !== -1
                )
                    return;

                console.log(e);

                this.active = false;
            }
        }
    }
</script>

<style scoped>
    .grado {
        background: rgb(255,255,255);
        background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(0,212,255,0.6) 40%, rgba(9,9,121,0.6) 100%);
    }
</style>
