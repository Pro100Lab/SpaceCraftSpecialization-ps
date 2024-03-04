<template>
    <vueper-slides
            class="no-shadow px-16"
            :bullets="true"
            :arrows="true"
            :slide-ratio="1 / 10"
            slide-multiple
            :gap="1"
            autoplay
            pauseOnTouch
            :dragging-distance="70"
            prevent-y-scroll
            :visible-slides="3"
    >
        <vueper-slide v-for="(image, index) of images"
                      :key="`image-${index}-${image}`"
                      contain
                      :link="linkTo(image)"
                      :image="getStatic(image)"
        >
        </vueper-slide>
    </vueper-slides>
</template>
<script>
    import {getStatic} from "../../../utils/settings";
    import { VueperSlides, VueperSlide } from 'vueperslides'
    import 'vueperslides/dist/vueperslides.css';

    export default {
        name: 'SliderWithThreeImages',
        components: { VueperSlides, VueperSlide },
        props: {
            content: {}
        },
        data: () => {
            return {
                images: []
            }
        },
        methods: {
            getStatic,
            linkTo(text) {
                text;
            }
        },
        mounted() {
            this.images = this.content.Content;
        }
    }
</script>
