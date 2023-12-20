<template>
    <div class="d-flex flex-row justify-center align-center" style="height: 100%">
        <v-img
                class="rounded-xxl"
                contain
                style="max-height: 100%"
                :src="getStatic(images[0])"
        >
        </v-img>
        <v-card-text
                style="font-size: 1rem"
                class="text-break text-left"
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
