<template>
    <v-sheet color="transparent" class="bottom-bar__main-scope overflow-x-hidden pb-2">
        <v-row>
            <v-col class="fill-height">
                <BreadCrumbs id="crumbs" v-bind:crumbs="breadCrumbs"></BreadCrumbs>
                <BlockInfo
                        v-if="title && description"
                        v-bind="{info: {'Type': 1, 'Description': description}, customClass: 'rounded-t-0'}"/>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <CategoryGrid v-bind="{categories}"/>
                <category-products class="my-2" :crumbs="breadCrumbs"></category-products>
            </v-col>
        </v-row>
        <v-row v-if="blocks && blocks.length > 0">
            <v-col class="fill-height">
                <BlockInfo
                        v-for="(info, index) of blocks"
                        :key="info['@Block']"
                        v-bind="{info, customClass: rounder(index, blocks.length, true)}"/>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script>
    import BreadCrumbs from "../components/utility/BreadCrumbs";
    import {getURL} from "../utils/settings";
    import axios from 'axios';
    import BlockInfo from "../components/blocks/BlockInfo";
    import {rounder} from "../utils/blockRoundCounter";
    import CategoryProducts from "./category/CategoryProducts";
    import CategoryGrid from "../components/category/CategoryGrid";
    import eventBus from "../utils/eventBus";

    export default {
        name: "Category",
        data: () => ({
            breadCrumbs: [],
            title: '',
            description: '',
            categories: [],
            blocks: [],
            loaded: false,
        }),
        methods: {
            calculateGridCols() {
                const windowWidth = window.innerWidth;
                this.windowWidth = windowWidth;
                const catBlockSize = this.hasFilters ? 1 : 9/12;
                if( windowWidth > 1536 ) {
                    this.windowWidth = catBlockSize * 0.7 * windowWidth + 24;
                    this.cardWidth = this.windowWidth * 0.23;
                }
                if( windowWidth <= 1536 ) {
                    this.windowWidth = catBlockSize * 0.7 * windowWidth + 24;
                    this.cardWidth = this.windowWidth / 3.1;
                }
                if( windowWidth <= 1280 ) {
                    this.windowWidth = catBlockSize * 0.8 * windowWidth;
                    this.cardWidth = this.windowWidth * 0.48;
                }
                if( windowWidth <= 960 ) {
                    this.windowWidth = catBlockSize * 0.95 * windowWidth;
                    this.cardWidth = 0.95 * this.windowWidth;
                }
                this.gridCols = Math.floor(this.windowWidth/this.cardWidth);
            },
            async loadBlock(id) {
                return await axios.get(getURL(`block/${id}`));
            },

            loadCategories(props) {
                axios.post(getURL(`category/${this.$route.params.category_id}`),
                    {
                        offset: 0,
                    }, {withCredentials: true})
                    .then(async response => {
                        const category_info = response.data;
                        this.breadCrumbs = category_info.breadcrumbs;
                        const block_info = category_info.block_info;
                        if( block_info )
                        {
                            this.title = block_info.title;
                            this.description = block_info.description;
                        }
                        if(!props)
                            this.categories = category_info.categories;

                        for(const blockId of block_info.blocks || []) {
                            const blockInfo = await this.loadBlock(blockId);
                            this.blocks.push(blockInfo.data)
                        }
                        this.loaded = true;
                    });
            },
            rounder,
        },
        beforeMount() {
            this.calculateGridCols();

            window.addEventListener('resize', () => {
                this.calculateGridCols();
            });

            this.loadCategories();

            eventBus.$on('crumbs-changed', crumbs => {
                this.breadCrumbs = crumbs;
            })
        },

        components: {
            CategoryProducts,
            BlockInfo,
            CategoryGrid,
            BreadCrumbs}
    }
</script>

<style scoped >
    .bottom-bar__main-scope {
        width: 70%;
        margin: 0 auto;
    }
    @media screen and (max-width: 1280px){
        .bottom-bar__main-scope {
            width: 85%;
        }
    }
    @media screen and (max-width: 960px){
        .bottom-bar__main-scope {
            width: 95%;
        }
    }
</style>
