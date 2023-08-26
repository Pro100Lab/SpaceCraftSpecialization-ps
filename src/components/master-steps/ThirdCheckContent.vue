<template>
    <v-sheet>
        <v-card-title class="pt-0">Проверка содержания</v-card-title>
        <v-sheet
                elevation="10"
                class="rounded-lg overflow-y-auto"
        >
            <v-tabs v-model="tab">
                <v-tab v-for="tabName of tabs" :value="tabName" :key="tabName" :href="`#${tabName}`">{{tabName}}</v-tab>
                <v-menu bottom left v-if="otherTabs && otherTabs.length > 0">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                                variant="plain"
                                class="align-self-center me-4 rounded-0"
                                height="100%"
                                v-bind="attrs"
                                v-on="on"
                        >
                            Остальные
                            <v-icon end>
                                mdi-menu-down
                            </v-icon>
                        </v-btn>
                    </template>

                    <v-list class="bg-grey-lighten-3">
                        <v-list-item
                                v-for="item of otherTabs"
                                :key="item"
                                v-on:click="extendTab(item)"
                        >
                            {{ item }}
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-tabs>
            <v-data-table
                    :items="items"
                    :headers="headers"
                    height="500"
                    fixed-header
                    :item-class="itemRowBackground"
                    class="elevation-0 transparent"
                    :footer-props="{itemsPerPageText: 'Строк на странице'}"
                    :no-data-text="status === 'loading' ? 'Файл загружается' : 'Загружаем данные'"
            >
                <template v-slot:item.actions="item">
                    <v-icon v-on:click="deleteProduct(item)" color="red">mdi-close</v-icon>
                </template>
                <template v-slot:item.описание="item">
                    <p style="max-height: 70px; overflow-y: auto">{{item.item['описание']}}</p>
                </template>
            </v-data-table>
        </v-sheet>
    </v-sheet>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../../settings";

    export default {
        name: "ThirdCheckContent",
        props: ['selectedFile', 'status'],
        data: () => {
            return {
                items: [],
                headers: [],
                tabs: [],
                otherTabs: [],
                tab: null,
            }
        },
        mounted() {
            this.loadSubTasks()
        },
        watch: {
            selectedFile() {
                this.loadSubTasks();
            },
            tab() {
                this.loadProducts();
            }
        },
        methods: {
            extendTab(item) {
                axios.get(getURL(`/admin/draft/task/set_primary/${encodeURIComponent(item)}`)).then(() => {
                    this.loadSubTasks(item);
                });
            },
            itemRowBackground(item) {
                console.log('style: for item', item)
                return item.changed ? 'style-changed' : item.deleted ? 'style-deleted' : 'style-created'
            },
            loadSubTasks(activeTab) {
                if (this.selectedFile) {
                    const fileNameEncoded = encodeURIComponent(this.selectedFile);
                    axios.get(getURL(`/admin/draft/task/sub/${fileNameEncoded}`)).then(resp => {
                        this.tabs = resp.data.filter((obj) => {
                            return obj['Primary']
                        }).map(name => name['Name']);
                        this.otherTabs = resp.data.filter((obj) => {
                            return !obj['Primary']
                        }).map(name => name['Name']);

                        console.log('tabs: ', this.tabs);
                        console.log('other tabs: ', this.otherTabs);
                        if (activeTab) {
                            this.tabs.forEach(tab => {
                                if (tab === activeTab) {
                                    this.tab = tab;
                                }
                            });
                        } else {
                            this.tab = this.tabs[0];
                        }
                    });
                }
            },
            loadProducts() {
                if(this.tab) {
                    axios.post(getURL(`/admin/draft/product/list_by_task_with_diff`), {task: this.tab}).then(resp=>{
                        this.items = resp.data.items;
                        this.headers = [{align: 'start', text: 'Удалить', value: 'actions'} , ...resp.data.headers];
                    })
                }
            },
            deleteProduct(product) {
                if( product.item && product.item['@Product']) {
                    const product_id = product.item['@Product'];
                    axios.delete(getURL(`/admin/draft/product/delete/${product_id}`)).then(()=> {
                        this.loadProducts();
                    })
                }
            }
        }
    }
</script>

<style lang="css">
    .style-created {
        background-color: rgba(117, 161, 54, 0.3);
    }
    .style-changed {
        background-color: rgba(215, 192, 78, 0.3);
    }
    .style-deleted {
        background-color: rgba(215, 78, 149, 0.3);
    }
</style>
