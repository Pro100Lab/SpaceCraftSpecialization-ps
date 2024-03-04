<template>
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
                :fixed-height="height"
        >
            <vueper-slide v-for="(image, index) of images"
                          :key="`image-${index}-${image}`"
                          :image="getStatic(image)"

            >
            </vueper-slide>
        </vueper-slides>
    </div>
    <div v-else>
        <v-img
                :src="getStatic(images[0])"
                :height="height"
        >
        </v-img>
    </div>
</template>

<script>
    import {getStatic} from "../../../utils/settings";
    import 'vueperslides/dist/vueperslides.css';
    import { VueperSlides, VueperSlide } from 'vueperslides'

    export default {
        name: 'SliderWithImages',
        components: { VueperSlides, VueperSlide },
        props: {
            content: {}
        },
        data: () => {
            return {
                images: [],
                height: null,
            }
        },
        methods: {
            getStatic
        },
        mounted() {
            console.log('slider with images content: ', this.content);
            this.images = this.content.Content || [];
            if(typeof this.images === 'object') {
                this.images = Object.keys(this.images);
            }
            this.height = this.content.CSSProps && this.content.CSSProps.height ? this.content.CSSProps.height : 400;
        }
    }
</script>
