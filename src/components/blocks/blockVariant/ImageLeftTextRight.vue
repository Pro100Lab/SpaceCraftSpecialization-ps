<template>
    <div :class="content.isMobile ? 'd-flex flex-column align-center py-1' : 'd-flex flex-row align-center justify-space-around py-1'" style="height: 100%">
        <v-img
                class="rounded-xxl"
                contain
                style="max-height: 100%"
                :src="getStatic(images[0])"
        >
        </v-img>
        <v-card-text
                style="font-size: 1rem"
                :class="content.isMobile ? 'text-center' : 'text-left' + ' text-break'"
                v-if="description"
                v-html="description.replaceAll('\n', '&lt;br/&gt;')"
        />

    </div>
</template>
<script>
    import {getStatic} from "../../../utils/settings";

    export default {
        name: 'ImageLeftTextRight',
        props: {
            content: {}
        },
        data: () => {
            return {
                images: [],
                description: ''
            }
        },
        methods: {
            getStatic
        },
        mounted() {
            this.images = this.content.Content;
            this.description = this.content.Description;
        }
    }
</script>
