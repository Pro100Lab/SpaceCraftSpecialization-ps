<template>
    <v-sheet
            :dark="settings.schema === 'dark'"
            :class="cssClass"
            :style="cssProps || {width: settings.block.width,
                                 background: settings.block.background}">
        <template v-if="title && title!=='<p></p>'">
            <v-card-title style="font-weight: normal"
                          class="text-break text-center pb-4"
                          v-html="title.replace('\n', '&lt;br/&gt;')"/>
        </template>
        <text-block
                v-if="blockType===1"
                :content="blockInfo"
        />
        <image-left-text-right
                v-else-if="blockType===2"
                :content="blockInfo"
        />
        <text-left-image-right
                v-else-if="blockType===3"
                :content="blockInfo"
        />
        <two-images
                v-else-if="blockType===4"
                :content="blockInfo"
        />
        <three-images
                v-else-if="blockType===5"
                :content="blockInfo"
        />
        <prices-block
                v-else-if="blockType===6"
                :content="blockInfo"
        />
        <slider-with-images
                v-else-if="blockType===7"
                :content="blockInfo"
        />
        <slider-with-three-images
                v-else-if="blockType===8"
                :content="blockInfo"
        />
        <products-block
            v-else-if="blockType===9"
            :content="blockInfo"
        />
        <booking-block
                v-else-if="blockType===10"
                :content="blockInfo"/>
        <yandex-map-block
                v-else-if="blockType===11"
                :content="blockInfo"
        />
        <category-block
                v-else-if="blockType===12"
                :content="blockInfo"
        />
    </v-sheet>
</template>

<script>
    import {getURL} from "../../utils/settings";
    import axios from "axios";
    import BookingBlock from "./blockVariant/BookingBlock";
    import getLoader from "../../utils/customizeOptions";
    import CategoryBlock from "./blockVariant/CategoryBlock";
    import TextLeftImageRight from "./blockVariant/TextLeftImageRight";
    import TwoImages from "./blockVariant/TwoImages";
    import ThreeImages from "./blockVariant/ThreeImages";
    import PricesBlock from "./blockVariant/PricesBlock";
    import SliderWithImages from "./blockVariant/SliderWithImages";
    import SliderWithThreeImages from "./blockVariant/SliderWithThreeImages";
    import YandexMapBlock from "./blockVariant/YandexMapBlock";
    import ImageLeftTextRight from "./blockVariant/ImageLeftTextRight";
    import TextBlock from "./blockVariant/TextBlock";
    import ProductsBlock from "./blockVariant/ProductsBlock";

    export default {
        name: "BlockInfo",
        components: {
            ProductsBlock,
            TextBlock,
            ImageLeftTextRight,
            YandexMapBlock,
            SliderWithThreeImages,
            SliderWithImages,
            PricesBlock,
            ThreeImages,
            TwoImages,
            TextLeftImageRight,
            CategoryBlock,
            BookingBlock},
        props: ['idx', 'info'],
        data() {
            return {
                loaded: false,
                title: '',
                cardWidth: window.innerWidth/4,
                blockInfo: null,
                blockType: null,
                settings: {
                    schema: null,
                    block: {}
                },
                cssProps: {

                },
                cssClass: ''
            }
        },
        computed: {
            isMobile: function() {
                return window.innerWidth < 960;
            }
        },
        methods: {
            async loadBlock(id) {
                const response = await axios.get(getURL(`block/${id}`));
                this.blockInfo = response.data;
            },
            getURL,
            putInfo(info) {
                this.blockType = info['Type'];
                this.title = info['Title'];
                this.description = info['Description'];
                this.cssProps = info['CSSProps'];
                this.cssClass = info['CSSClass'] || this.cssClass;
            },
        },
        async mounted() {
            await getLoader().loadOptions();
            this.settings.schema = getLoader().getOption(['Common', 'Schema']);
            this.settings.block.width = (this.isMobile && getLoader().getOption(['Common', 'Block', 'Mobile', 'Width']) )
                || getLoader().getOption(['Common', 'Block', 'Width']);
            this.settings.block.background = getLoader().getOption(['Common', 'Block', 'Background']);

            this.cssClass = this.cssClass || getLoader().getOption(['Common', 'Block', 'Class']);
            console.log('settings: ', this.settings);


            if(this.info) {
                this.blockInfo = this.info;
                this.putInfo(this.blockInfo);
            }

            if(!this.info && this.idx) {
                this.loadBlock(this.idx);
            }

        },
    }
</script>
