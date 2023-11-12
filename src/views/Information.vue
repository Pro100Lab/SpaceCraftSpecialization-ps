<template>
    <v-col class="pa-0">
        <BreadCrumbs :crumbs="crumbs" v-if="crumbs && crumbs.length > 0"/>
        <BlockInfo
                v-for="info in blocks"
                :key="info['@Block']"
                v-bind="{idx: info['@Block'], info}"/>
    </v-col>
</template>

<script>
    import axios from 'axios';
    import {getURL} from "../utils/settings";
    import BreadCrumbs from "../components/utility/BreadCrumbs";
    import BlockInfo from "../components/blocks/BlockInfo";
    import {rounder} from "../utils/blockRoundCounter";

    export default {
        name: "Information",
        components: {BlockInfo, BreadCrumbs},
        props: ['page'],
        data: () => {
            return {
                title: '',
                info: '',
                blocks: [],
                crumbs: [],
                carousel: false,
            }
        },
        methods: {
        rounder,
          async loadBlock(id) {
              return await axios.get(getURL(`block/${id}`));
          }
        },
        mounted() {
            const page = this.page ? this.page : '' || this.$route.params.info_id ? this.$route.params.info_id : '' ;

            axios.get(getURL(`info/${page}`))
                .then(async response => {
                    const info = response.data;
                    const blockIds = info['Blocks'] || [];
                    for(const blockId of blockIds) {
                        const blockInfo = await this.loadBlock(blockId);
                        this.blocks.push(blockInfo.data)
                    }
                    this.title = info['Title'];
                    this.info = info['Info'];
                    this.crumbs = info['Crumbs'] || [];
                    this.carousel = this.title === 'Главная';
                })
        }
    }
</script>

<style scoped>
    .information__view {
        display: flex;
        width: 70vw;
        flex-direction: column;
        justify-content: space-between;
        margin: 0 auto;
    }

    @media screen and (max-width: 1280px) {
        .information__view {
            width: 85vw;
            margin: 0 auto;
        }
    }

    @media screen and (max-width: 960px) {
        .information__view {
            width: 100vw;
        }
    }
</style>
