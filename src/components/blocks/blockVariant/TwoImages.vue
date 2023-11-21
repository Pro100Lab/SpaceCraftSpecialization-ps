<template>
    <div class="d-flex flex-row justify-space-around">
        <v-img
                v-for="image of images" :key="image"
                    class="rounded-xxl"
                    style="max-width: 45vw;"
                    :src="getStatic(image)"
                    contain
            >
            </v-img>
    </div>
</template>
<script>
    import {getStatic} from "../../../utils/settings";

    export default {
        name: 'TwoImages',
        props: {
            content: {}
        },
        data: () => {
            return {
                images: []
            }
        },
        methods: {
            getStatic
        },
        mounted() {
            this.images = this.content.Content;
        }
    }
</script>
