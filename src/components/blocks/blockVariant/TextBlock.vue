<template>
    <v-card-text class="text-break"
                 style="font-size: 1rem"
                 v-if="description"
                 v-html="description.replaceAll('\n', '&lt;br/&gt;')"
    />
</template>
<script>
    import {getStatic} from "../../../utils/settings";

    export default {
        name: 'TextBlock',
        props: {
            content: {}
        },
        data: () => {
            return {
                description: ''
            }
        },
        methods: {
            getStatic
        },
        mounted() {
            console.log('text block content: ', this.content);
            this.description = this.content.Description;
        }
    }
</script>
