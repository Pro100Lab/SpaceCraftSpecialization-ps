<template>
    <v-card dark class="elevation-0" :class="customClass || ''" style="width: 100%; background: rgba(0,0,0,0.7)">
        <template v-if="title">
        <v-card-title style="color: white;font-weight: normal"
                      class="text-break text-center pb-4"
                      v-html="title.replace('\n', '&lt;br/&gt;')"/>
        </template>
        <div v-if="blockType===1">
            <v-card-text class="text-break"
                         style="font-size: 1rem"
                         v-if="description"
                         v-html="description.replaceAll('\n', '&lt;br/&gt;')"
            />
        </div>
        <div v-else-if="blockType===2">
            <v-row>
                <v-col cols="6">
                    <v-card-text
                            style="font-size: 1rem"
                            class="text-break"
                            v-if="description"
                            v-html="description.replaceAll('\n', '&lt;br/&gt;')"
                    />
                </v-col>
                <v-col cols="6">
                    <v-img
                            class="rounded-xl"
                            style="max-height: 400px"
                            contain :src="getURL(`static/${images[0]}`)"
                    >
                    </v-img>
                </v-col>
            </v-row>
        </div>
        <div v-else-if="blockType===3">
            <v-row>
                <v-col cols="6">
                    <v-img
                            class="rounded-xl"
                            style="max-height: 400px"
                            v-if="images && images.length > 0"
                            contain :src="getURL(`static/${images[0]}`)"
                    >
                    </v-img>
                </v-col>
                <v-col cols="6">
                    <v-card-text
                            style="font-size: 1rem"
                            class="text-break"
                            v-if="description"
                            v-html="description.replaceAll('\n', '&lt;br/&gt;')"
                    />
                </v-col>
            </v-row>
        </div>
        <div v-else-if="blockType===4">
            <v-row>
                <v-col cols="6" v-for="image of images" :key="image">
                    <v-img
                            class="rounded-xl"
                            style="max-height: 400px"
                            :src="getURL(`static/${image}`)"
                            contain
                    >
                    </v-img>
                </v-col>
            </v-row>
        </div>
        <div v-else-if="blockType===5">
            <v-row class="ma-0">
                <v-col cols="4" v-for="image of images" :key="image">
                    <v-img
                            style="max-height: 400px"
                            :src="getURL(`static/${image}`)"
                            class="rounded-xl"
                            contain>
                    </v-img>
                </v-col>
            </v-row>
        </div>
        <div v-else-if="blockType===6">
            <v-sheet
                    v-for="line in content"
                    :key="line.item[0]"
                    :color="line.color"
                    class="py-1 px-4 d-flex flex-row justify-space-between"
            >
                <v-card-title
                        class="text-break py-0" style="font-weight: 300"
                        v-html="line.item[0]"
                />
                <v-card-title
                        v-if="line.item.length > 1"
                        class="text-break py-0" style="font-weight: 500; min-width: 20vw"
                        v-html="line.item[1]"
                />

            </v-sheet>
        </div>
        <div v-else-if="blockType===7">
            <div v-if="images && images.length > 1">
                <vueper-slides
                        class="no-shadow"
                        slide-multiple
                        :arrows="false"
                        :bullets="false"
                        autoplay
                        pauseOnTouch
                        :dragging-distance="70"
                        prevent-y-scroll
                        :slide-ratio="1 / 3"
                >
                    <vueper-slide v-for="image of images"
                                  :key="image"
                                  :image="getURL(`static/${image}`)"
                    >
                    </vueper-slide>
                </vueper-slides>
            </div>
            <div v-else>
                <v-img
                        class="rounded-xl"
                        style="background-size: cover"
                       :src="getURL(`static/${images[0]}`)">

                </v-img>
            </div>
        </div>
        <div v-else-if="blockType===8" >
            <vueper-slides
                    class="no-shadow"
                    :bullets="false"
                    :slide-ratio="1 / 10"
                    slide-multiple
                    :gap="1"
                    autoplay
                    pauseOnTouch
                    :dragging-distance="70"
                    prevent-y-scroll
                    :visible-slides="5"
            >
                <vueper-slide v-for="image of images"
                              :key="image"
                              contain
                              :link="linkTo(image)"
                              :image="getURL(`static/${image}`)"
                >
                </vueper-slide>
            </vueper-slides>
        </div>
        <div v-else-if="blockType===10">
            <booking-block></booking-block>
        </div>
        <div v-else-if="blockType===11">
            <v-sheet height="300" class="my-2">
                <yandex-map :coords="coords" :zoom="18">
                    <ymap-marker
                            marker-id="123"
                            :coords="coords"
                            :balloon-template="balloonTemplate"
                    ></ymap-marker>
                </yandex-map>
            </v-sheet>
        </div>
        <v-overlay v-on:click="dialogInfo.show = false"
                   v-model="dialogInfo.show"
        >

        </v-overlay>
        <ProductView
                v-if="dialogInfo.show"
                class="view-adaptive"
                v-bind="{dialogInfo}"/>
    </v-card>
</template>

<script>
    import {getURL, normalizePrice} from "../../utils/settings";
    import ProductView from "../products/View"
    import axios from "axios";
    import eventBus from "../../utils/eventBus";
    import { VueperSlides, VueperSlide } from 'vueperslides'
    import 'vueperslides/dist/vueperslides.css';
    import BookingBlock from "./BookingBlock";

    export default {
        name: "BlockInfo",
        components: {BookingBlock, ProductView, VueperSlides, VueperSlide, },
        props: ['idx', 'info', 'customClass'],
        data() {
            return {
                coords: [56.079131, 63.638838],
                loaded: false,
                blockType: 1,
                title: '',
                description: '',
                images: [],
                content: [],
                cardWidth: window.innerWidth/4,
                dialogInfo: {
                    show: false,
                    id: 0
                },
                blockInfo: null,
                compareIds: [],
                favouriteIds: [],
                tns: null,
            }
        },
        computed: {
            balloonTemplate() {
                return `<h3>Хостел "Галактика"</h3>
        <v-card-subtitle>г. Шадринск, ул. Карла Маркса, д. 90Б</v-card-subtitle>`
            }
        },
        methods: {
            async loadBlock(id) {
                this.blockInfo = await axios.get(getURL(`block/${id}`));
                this.putInfo(this.blockInfo.data);
            },
            goToProduct(idx) {
                this.$router.push(`/product/${idx}`)
            },
            getURL,
            onProductView(id) {
                this.dialogInfo.id = id;
                this.dialogInfo.show = true;
            },
            putInfo(info) {
                this.blockType = info['Type'];
                this.title = info['Title'];
                this.description = info['Description'];
                const content = info['Content'];
                if( content && !Array.isArray(content) )
                    this.images = Object.keys(content);
                else
                    this.images = content;
                if(this.blockType === 6 || this.blockType === 8 || this.blockType === 9) {
                    const items = this.description.split('\n');
                    console.log('items: ',items)
                    const colors = ['rgba(175, 238, 238, 0.3)', 'rgba(135, 206, 235, 0.3)']
                    items.forEach((item, idx) => {
                        if(this.blockType === 9) {
                            axios.get(getURL(`product/${item}`), {withCredentials: true})
                                .then(response => {
                                    let content = {};
                                    content.id = item;
                                    const product_info = response.data.product_info;
                                    content.title = product_info.title;
                                    content.description = product_info.description;
                                    content.detailed = product_info.detailed;
                                    content.price = normalizePrice(product_info.price);
                                    content.images = product_info.images;
                                    content.favourite = product_info.favourite;
                                    content.compare = product_info.compare;
                                    if(content.favourite)
                                        this.favouriteIds.push(content.id);
                                    if(content.compare)
                                        this.compareIds.push(content.id);
                                    content.properties = [];
                                    for(const [key, value] of Object.entries(product_info.props)) {
                                        if (key && key.length > 1 && value && value.length > 1) {
                                            let new_line = `${key}: ${value}`;
                                            content.properties.push(new_line);
                                        }
                                    }
                                    this.content.push(content)
                                });
                        } else if (this.blockType === 6) {
                            const re = RegExp(/[\d\s]+руб./g);
                            const values = re.exec(item);
                            if( values && values.length )
                                item = item.replace(values[0], ': ' + values[0]);
                            item = item.replace('цена договорная', ': цена договорнaя')
                                .replace('договорная', ': договорная');

                            this.content.push({
                                'item': item.split(':'),
                                'color': colors[idx%2]
                            })
                        } else if (this.blockType === 8) {
                            this.content.push({
                                'item': item,
                                'color': colors[idx%2]
                            });
                        } else {
                            this.content.push({
                                'item': item,
                                'color': colors[idx%2]
                            })
                        }

                    })
                }
                console.log(this.content)
            },
            updateProduct(placeholder, id) {
                axios.post(getURL('product/update'), {placeholder, id}, {withCredentials: true}).then(() => {
                    eventBus.$emit('update-main-bar');
                });
            },
            productToFavourite(id) {
                this.updateProduct('Favourite', id);
            },
            productToCompare(id) {
                this.updateProduct('Compare', id);
            },
            productToCart(id) {
                this.updateProduct('Cart', id);
            },
        },
        mounted() {
            if(this.info) {
                this.blockInfo = this.info;
                this.putInfo(this.blockInfo);
            }
            if(!this.info && this.idx) {
                this.loadBlock(this.idx);
            }

            eventBus.$on('product-view-closed', ()=>{
                this.dialogInfo.show = false;
            })
            window.addEventListener('resize', ()=> {
                this.cardWidth = window.innerWidth/4;
                console.log('new width: ', this.cardWidth)
            })
        },
        watch: {
            info(newInfo) {
                this.putInfo(newInfo);
            }
        }
    }
</script>

<style scoped>
    .view-adaptive {
        width: 70vw;
        overflow-y: hidden;
        overflow-x: hidden;
        position: fixed;
        left: 15%;
        top: 10%;
        bottom: 10%;
        z-index: 100;
    }
    .row1{
        background-color: lightgray;
    }
    .row2{
        background-color: lightblue;
    }

    #slide-group .v-slide-group__content {
        justify-content: center;
    }


    #slide-group-1 .v-slide-group__content {
        justify-content: center;
    }

    .brandSlider{
        max-height: 400px;
    }
    .ymap-container {
        height: 100%;
    }
</style>
