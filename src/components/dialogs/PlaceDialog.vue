<template>
    <v-card class="pa-4">
        <v-card-actions class="px-0">
        <v-card-title class="pa-0">{{mode === 'create'? 'Создание' : 'Обновление'}}</v-card-title>
        </v-card-actions>
        <div class="d-flex flex-row">
            <v-form style="min-width: 20vw;">
                <v-text-field label="Название" v-model="name"></v-text-field>
                <v-text-field label="Свойства" v-model="properties"></v-text-field>
                <v-select label="Комната"
                          v-if="mode==='create' || section !== null"
                          v-model="section"
                          :items="placesList"
                          item-text="name"
                          item-value="@Place"
                ></v-select>
                <v-select
                        label="Тариф"
                        v-model="tariff"
                        :items="tariffList"
                        item-text="Name"
                        item-value="@Tariff"
                ></v-select>
            </v-form>
            <div class="px-4">
                <block-picker :initial-block-ids="blocks"></block-picker>
            </div>
        </div>
        <v-card-actions>
            <template v-if="mode==='create'">
                <v-btn color="green" block v-on:click="createPlace">Создать</v-btn>
            </template>
            <template v-else-if="mode==='update'">
                <v-btn color="yellow" block v-on:click="updatePlace">Обновить</v-btn>
            </template>
        </v-card-actions>
    </v-card>
</template>

<script>
    import axios from "axios";
    import {getURL} from "../../settings";
    import BlockPicker from "../BlockPicker";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "PlaceDialog",
        components: {BlockPicker},
        props: ['idx', 'mode', 'places', 'tariffs'],
        data: () => {
            return {
                name: '',
                section: null,
                properties: [],
                blocks: [],
                tariff: null,
                tariffList: [],
                placesList: [],
                placesCache: {}
            }
        },
        mounted() {
            if (this.idx !== null) {
                this.loadPlace();
            }
            eventBus.$on('block-ids-changed', blocks => {
                this.blocks = blocks;
            });

            this.tariffList = this.tariffs;
            this.placesList = this.places;

            this.placesList.forEach(item => {
                this.placesCache[item.id] = item;
            })
            console.log('places cache: ');
            console.log(this.placesCache);
        },
        methods: {
            retrievePlace(sectionId) {
                if(sectionId === null) {
                    return null;
                }

                return this.placesCache[sectionId];
            },
            createPlace() {
                axios.post(getURL('admin/place/create'), {
                    name: this.name,
                    section: this.section,
                    properties: this.properties,
                    blocks: this.blocks,
                    tariff: this.tariff
                }).then(() => {
                    eventBus.$emit('places-changed');
                })
            },
            updatePlace() {
                axios.post(getURL('admin/place/update'), {
                    id: this.idx,
                    name: this.name,
                    section: this.section,
                    properties: this.properties,
                    blocks: this.blocks,
                    tariff: this.tariff
                }).then(() => {
                    eventBus.$emit('places-changed');
                })
            },
            loadPlace() {
                axios.get(getURL(`/admin/place/${this.idx}`)).then(res => {
                    const data = res.data;
                    this.name = data.name;
                    this.section = data.section;
                    this.properties = data.properties;
                    this.blocks = data.blocks;
                    this.tariff = data.tariff
                })
            }
        },
        watch: {
            idx() {
                if( this.idx !== null)
                    this.loadPlace();
                else {
                    this.name = null;
                    this.section = null;
                    this.properties = [];
                    this.blocks=[];
                    this.tariff=null;
                }
            },
            places() {
                this.placesList = this.places;
                this.placesCache = {};
                this.placesList.forEach(item => {
                    this.placesCache[item.id] = item;
                })
            },
            tariffs() {
              this.tariffList = this.tariffs;
            }
        }
    }
</script>

<style scoped>

</style>
