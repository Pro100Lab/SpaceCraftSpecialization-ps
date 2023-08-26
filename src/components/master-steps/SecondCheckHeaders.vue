<template>
    <v-sheet>
        <v-card-title class="pt-0">Проверка шапки</v-card-title>
        <v-sheet
                elevation="10"
                class="rounded-lg overflow-y-auto"
        >
            <v-tabs v-model="tab">
                <v-tab v-for="tabName of tabs" :value="tabName" :key="tabName" :href="`#${tabName}`">{{tabName}}
                    <v-btn icon v-on:click="removeTab(tabName)" class="ml-2"
                    ><v-icon small color="red">mdi-close</v-icon></v-btn
                    ></v-tab>
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
                <v-spacer></v-spacer>
                <v-switch class="px-2" color="green" label="скрыть отброшенные" v-model="hideTerminated" inset></v-switch>

            </v-tabs>
            <v-data-table
                    height="500"
                    fixed-header
                    hide-default-header
                    :no-data-text="status === 'loading' ? 'Файл загружается' : 'Загружаем данные'"
                    :items="items"
                    :footer-props="{itemsPerPageText: 'Строк на странице'}"
                    :headers="headersWithFilter.length > 0 ? headersWithFilter : headers"
            >
                <template v-slot:header="{ props }">
                    <tr class="px-2">
                        <th v-for="head in props.headers" :key="head.text" class="px-1" style="font-weight: normal; min-width: 200px">
                            <div class="d-flex flex-column" >
                                <v-card-actions class="mb-0 pb-0 mx-0 px-0">

                                    <v-tooltip v-if="head.primary" top>
                                        <template v-slot:activator="{on, attrs}">
                                            <v-icon
                                                    class="mr-1"
                                                    color="green"
                                                    v-on="on"
                                                    v-bind="attrs"
                                            >mdi-exclamation</v-icon>
                                        </template>
                                        <span>
                                        Основное свойство, нельзя изменить
                                    </span>
                                    </v-tooltip>

                                    <v-tooltip v-if="head.matched" top>
                                        <template v-slot:activator="{on, attrs}">
                                            <v-icon
                                                    class="mr-1"
                                                    color="green"
                                                    v-on="on"
                                                    v-bind="attrs"
                                            >mdi-checkbox-marked-circle-outline</v-icon>
                                        </template>
                                        <span>
                                        Найдено соответствие со свойством
                                    </span>
                                    </v-tooltip>

                                    <v-tooltip v-if="!head.matched" top>
                                        <template v-slot:activator="{on, attrs}">
                                            <v-icon
                                                    class="mr-1"
                                                    color="red"
                                                    v-on="on"
                                                    v-bind="attrs"
                                            >mdi-menu-down</v-icon>
                                        </template>
                                        <span>
                                        Не найдено соответствие со свойством, столбец будет отброшен
                                    </span>
                                    </v-tooltip>

                                    <v-tooltip v-if="head.images" top>
                                        <template v-slot:activator="{on, attrs}">
                                            <v-icon
                                                    class="mr-1"
                                                    color="yellow"
                                                    v-on="on"
                                                    v-bind="attrs"
                                            >mdi-image-area</v-icon>
                                        </template>
                                        <span>
                                        Найдены ссылки на изображения, будут загружены во внутренние ресурсы
                                    </span>
                                    </v-tooltip>

                                    <v-tooltip v-if="head.overriden && head.overriden.length > 0" top>
                                        <template v-slot:activator="{on, attrs}">
                                            <v-icon
                                                    class="mr-1"
                                                    color="green"
                                                    v-on="on"
                                                    v-bind="attrs"
                                            >mdi-swap-horizontal</v-icon>
                                        </template>
                                        <span>
                                        Название столбца {{head.overriden}} было распознано как {{head.text}}
                                    </span>
                                    </v-tooltip>

                                    <v-spacer></v-spacer>
                                    <v-tooltip v-if="!head.primary" top>
                                        <template v-slot:activator="{on, attrs}">
                                            <v-icon
                                                    class="mr-1"
                                                    color="red"
                                                    v-on="on"
                                                    v-bind="attrs"
                                                    @click="deleteProp(head)"
                                            >mdi-close</v-icon>
                                        </template>
                                        <span>
                                        Удалить свойство "{{head.text}}" из таблицы
                                    </span>
                                    </v-tooltip>
                                </v-card-actions>
                                <v-combobox class="mt-0 pt-0 px-2"
                                            :value="head.text"
                                            :items="[head.text, ...primaryList]"
                                            @change="swapProp(head.text, $event)"
                                >
                                </v-combobox>
                            </div>

                        </th>
                    </tr>
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
        name: "SecondCheckHeaders",
        props: ['selectedFile', 'status'],
        data: () => {
            return {
                items: [],
                headers: [],
                headersWithFilter: [],
                hiddenHeaders: [],
                tabs: [],
                tabIds: {},
                otherTabs: [],
                tab: null,
                primaryList: [],
                hideTerminated: false,
            }
        },
        mounted() {
            this.loadSubTasks();
            this.loadPrimaryProperties();
        },
        watch: {
          selectedFile() {
              this.loadSubTasks();
          },
            tab() {
              this.loadProducts();
            },
            hideTerminated(newValue) {
              if(newValue) {
                  this.headersWithFilter = this.headers.filter( value => {
                      return value.matched;
                  })
              } else {
                  this.headersWithFilter = [];
              }
            }
        },
        methods: {
            swapProp(oldProp, e) {
              axios.post(getURL('admin/draft/property/override'), {
                  'Name': oldProp,
                  'NewName': e
              }).then(() => {
                  this.loadProducts();
              })
            },
            removeTab(tabName) {
                const fileNameEncoded = encodeURIComponent(tabName);
                axios.delete(getURL(`admin/draft/task/delete/${fileNameEncoded}`)).then(()=>{
                    this.tabs.splice(this.tabs.indexOf(tabName), 1);
                })
            },
            removeTabs(tabs) {
                tabs.forEach(tab=>{
                    this.removeTab(tab['Name']);
                })
            },
            loadPrimaryProperties() {
              axios.get(getURL('admin/draft/property/primary_list')).then(res=> {
                  this.primaryList = res.data || [];
              })
            },
            deleteProp(header) {
                const encoded = encodeURIComponent(header['text']);
                axios.delete(getURL(`admin/draft/property/drop/${encoded}`)).then( () => {
                        this.hiddenHeaders.push(this.headers.splice(this.headers.indexOf(header), 1));
                    }
                )
            },
            extendTab(item) {
                axios.get(getURL(`/admin/draft/task/set_primary/${encodeURIComponent(item)}`)).then(() => {
                    this.loadSubTasks(item);
                });
            },
            loadSubTasks(activeTab) {
                if(this.selectedFile) {
                    const fileNameEncoded = encodeURIComponent(this.selectedFile);
                    axios.get(getURL(`/admin/draft/task/sub/${fileNameEncoded}`)).then(resp => {
                        this.tabs = resp.data.filter( (obj) => {return obj['Primary']} ).map(name => name['Name']);
                        this.otherTabs = resp.data.filter( (obj) => {return !obj['Primary']} ).map(name => name['Name']);

                        console.log('tabs: ', this.tabs);
                        console.log('other tabs: ', this.otherTabs)
                        if (activeTab) {
                            this.tabs.forEach(tab => {
                                if (tab === activeTab) {
                                    this.tab = tab;
                                }
                            });
                        } else {
                            this.tab = this.tabs[0];
                        }
                    })
                }
            },
            loadProducts() {
                this.hideTerminated = false;
                if(this.tab) {
                    axios.post(getURL(`/admin/draft/product/list_by_task`), {task: this.tab}).then(resp=>{
                        this.items = resp.data.items;
                        this.headers = resp.data.headers;
                    })
                }
            }
        }
    }
</script>

<style lang="css">

</style>
