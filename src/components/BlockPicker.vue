<template>
    <v-card
            class="elevation-0 d-flex flex-column pa-3 my-3"
            style="background: rgba(0,0,0,0.03); min-width: 30vw"

    >
        <v-card-title class="mx-0 px-0 mt-0 pt-0 mb-4">Контент</v-card-title>

        <v-sheet class="overflow-y-auto overflow-x-hidden" >
        <template v-for="blockId of blockIds">
        <v-row v-on:click="selectBlock(blockId)"
               :key="blockId * Math.random() * 1000"
               style="cursor: pointer"
                 :style="{'background': blockIds.indexOf(blockId) % 2 ? 'rgba(236, 255, 230, 0.7)' : 'rgba(204, 245, 255, 0.5)'}"
        class="align-center pl-1">
            <v-col cols="1">
                <span>{{blockId}}:</span>
            </v-col>
            <v-col cols="4" v-if="blocksCache[blockId]">
                {{blockTypes[blocksCache[blockId]['Type']].info}}
                <b v-html="blocksCache[blockId]['Title'].replace('/n', '')"></b>

            </v-col>
            <v-col cols="9" v-else>
                <p style="color: red">Несуществующий блок!</p>
            </v-col>
            <v-col cols="5" v-if="blocksCache[blockId]">
                <div class="d-flex flex-row py-1 overflow-x-auto">
                <v-img v-for="image of blocksCache[blockId]['Content']"
                       contain
                       class="mx-1"
                       style="max-width: 5vw; max-height: 60px"
                       :key="image"
                       :src="getURL(`static/${image}`)"
                >

                </v-img>
                </div>
            </v-col>
            <v-col cols="1">
                <v-icon color="red" large v-on:click.stop="removeBlock(blockId)">mdi-close</v-icon>
            </v-col>
        </v-row>
        </template>
        </v-sheet>
        <v-row class="align-center">
            <v-col cols="8">
                <v-select
                        v-model="newBlock"
                        :items="blocksData"
                        placeholder="Выбрать существующий блок"
                        menu-props="auto"
                        item-text="name"
                        item-value="id"
                >

                </v-select>
            </v-col>
            <v-col cols="3">
                <v-btn color="green" class="white--text justify-center align-center"
                v-on:click.stop="selectBlock(null)">
                    <v-icon color="white">mdi-plus</v-icon>
                    новый блок
                </v-btn>
            </v-col>
        </v-row>
        <v-dialog v-model="showBlockDialog" id="block-dialog">
            <block-dialog :idx="currentBlockId"></block-dialog>
        </v-dialog>
    </v-card>
</template>

<script>
    import eventBus from "../utils/eventBus";
    import axios from 'axios';
    import {getURL} from "../settings";
    import BlockDialog from "./dialogs/BlockDialog";

    export default {
        name: "BlockPicker",
        components: {BlockDialog},
        props: ['initialBlockIds'],
        data: () => {
            return {
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
                currentBlockId: null,
                showBlockDialog: false,
                blocksData: [],
                blockIds: [],
                blocksCache: {},
                newBlock: null
            }
        },
        mounted() {
            console.log('mounted: initialBlockIds', this.initialBlockIds)

            this.loadBlocks();
            this.blockIds = this.initialBlockIds;

            eventBus.$on('block-updated', () => {
                this.loadBlocks();
                this.currentBlockId = null;
                this.showBlockDialog = false;
            })
            eventBus.$on('block-created', (idx) => {
                this.blockIds.push(idx);
                this.currentBlockId = null;
                this.showBlockDialog = false;

                this.loadBlocks();
            });
            eventBus.$on('block-not-changed', () => {
                this.currentBlockId = null;
                this.showBlockDialog = false;
            })
        },
        destroyed() {
            this.newBlock = null;
            this.blockIds = [];
            this.blocksCache = {};
            this.blocksData = [];
        },
        watch: {
          initialBlockIds: function(newBlockIds) {
              console.log('watch initial block ids: ', newBlockIds)
              if( newBlockIds !== this.blockIds ) {
                  this.blockIds = newBlockIds;
              }
          },
            blockIds: function() {
              this.notifyBlocksChanged();
            },
            newBlock: function(newBlock) {
              if(newBlock) {
                  this.blockIds.push(newBlock);
                  this.$nextTick(() => {
                      this.newBlock = null;
                  })
              }
            }
        },
        methods: {
            selectBlock(idx) {
                this.currentBlockId = idx;
                this.showBlockDialog = true;
            },
            removeBlock(idx) {
                this.blockIds.splice(this.blockIds.indexOf(idx), 1);
            },
            notifyBlocksChanged() {
                eventBus.$emit('block-ids-changed', this.blockIds);
            },
            async loadBlocks() {
                let response = await axios.get(getURL('admin/blocks'))
                let blocks = response.data;
                let blocksCache = {};
                let blocksData = [];
                blocks.forEach(block => {
                    const id = block['@Block']
                    blocksCache[id] = block;

                    const re = /<.*?>/gm;
                    let title = block['Title'].replaceAll(re, '');
                    blocksData.push({id, 'name': `${id}. ${this.blockTypes[block['Type']].info}: ${title}`})
                });
                this.blocksData = blocksData;
                this.blocksCache = blocksCache;
            },
            getURL
        }
    }
</script>

<style scoped>

</style>
