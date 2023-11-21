<template>
    <div class="d-flex flex-row justify-space-around">
            <v-img
                    v-for="image of images" :key="image"
                    style="max-width: 30vw;"
                    :src="getStatic(image)"
                    class="rounded-xl"
                    contain>
            </v-img>
    </div>
</template>
<script>
    import {getStatic} from "../../../utils/settings";

    export default {
        name: 'ThreeImages',
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
