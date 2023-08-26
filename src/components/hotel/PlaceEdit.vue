<template>
    <v-card class="elevation-0 transparent">
        <v-card-actions class="mt-4 px-0">
            <v-btn color="green " v-on:click="mode='create'" style="color: white">
                <v-icon color="white"  class="mr-2">
                mdi-plus-circle
            </v-icon>
            Создать местечко
            </v-btn>

        </v-card-actions>
        <div class="d-flex flex-row ">
            <div class="place-edit__tree-wrap overflow-y-auto">
                <div class="place-edit__tree-container ">
                <v-treeview
                        :items="tree"
                        style="cursor: pointer"
                        hoverable
                        dense
                        activatable
                        :open.sync="open"
                        :active.sync="selectedPlaces"
                >
                    <template v-slot:prepend="{item}">
                        <v-icon v-if="item.Section !== null">mdi-bed-empty</v-icon>
                        <v-icon v-else>
                            mdi-door
                        </v-icon>
                    </template>
                    <template v-slot:append="{ item }">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                        small color="red"
                                        v-on="on"
                                        v-bind="attrs"
                                        v-on:click.self="deletePlace(item)"
                                >
                                    mdi-trash-can-outline
                                </v-icon>
                            </template>
                            <span>Удалить</span>
                        </v-tooltip>
                    </template>
                </v-treeview>
                </div>
            </div>

            <place-dialog
                    class="mx-5 fill-height"
                    v-if="mode"
                    :idx="selectedPlaces.length > 0 ? selectedPlaces[0] : null"
                    :mode="mode"
                    :places="tree"
                    :tariffs="tariffs"
            >

            </place-dialog>

        </div>
    </v-card>
</template>

<script>
    import PlaceDialog from "../dialogs/PlaceDialog";
    import {getURL} from "../../settings";
    import axios from 'axios';
    import eventBus from "../../utils/eventBus";

    export default {
        name: "PlaceEdit",
        components: {PlaceDialog},
        data: () => {
            return {
                selectedPlaces: [],
                tree: [],
                open: [],
                mode: null,
                tariffs: [],
            }
        },
        mounted() {
            this.loadPlaces();
            this.loadTariffs();
            eventBus.$on('places-changed', () => {
                this.loadPlaces();
            });
            eventBus.$on('tariffs-changed', () => {
                this.loadTariffs();
            })
        },
        methods: {
            loadTariffs() {
                axios.get(getURL('admin/tariff/list')).then(res => {
                    this.tariffs = res.data.filter(tariff=> {
                        return tariff['Section'] === null;
                    })
                })
            },
            loadPlaces() {
                axios.get(getURL('admin/place/tree')).then(res => {
                    this.tree = res.data;
                    this.tree.forEach(node => {
                        this.open.push(node.id);
                    })
                })
            },
            deletePlace(item) {
                console.log('delete', item);
                axios.delete(getURL(`admin/place/${item.id}`)).then(() => {
                    this.loadPlaces();
                })
            }
        },
        watch: {
            mode() {
                if( this.mode === 'create')
                    this.selectedPlaces = [];
            },
            selectedPlaces() {
                if( this.selectedPlaces.length > 0 )
                    this.mode = 'update';
                else if (this.mode !== 'create')
                    this.mode = null;
            }
        }
    }
</script>

<style>
    .place-edit__tree-wrap {
        max-height: 70vh;

        direction: rtl;
    }
.place-edit__tree-container {
    direction: ltr;
}
</style>
