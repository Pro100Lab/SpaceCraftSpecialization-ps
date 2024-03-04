<template>
    <div :class="content.isMobile ? 'd-flex flex-column align-center py-1' : 'd-flex flex-row align-start justify-space-around py-1'" style="height: 100%">
        <v-card-text
                style="font-size: 1rem; height: 100%"
                class="text-break overflow-y-auto"
                v-if="description"
                v-html="description.replaceAll('\n', '&lt;br/&gt;')"
        />
        <v-img
                class="rounded-xxl"
                style="max-width: 50%; max-height: 100%"
                contain :src="getStatic(images[0])"
        >
        </v-img>
    </div>
</template>
<script>
    import {getStatic} from "../../../utils/settings";

    export default {
        name: 'TextLeftImageRight',
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
            console.log('content: ', this.content);
        }
    }
</script>
