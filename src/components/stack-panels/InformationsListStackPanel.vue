<template>
    <v-list>
        <template v-for="(page, index) of infoPages">
            <v-divider class="ml-4" v-if="index !== 0" :key="`info-divider-${index}`"></v-divider>
            <v-list-item dense :key="`page-index-${index}`" v-on:click="openInformationPage(page)">
                <v-list-item-title>
                    {{page.name}}
                </v-list-item-title>
                <v-list-item-icon>
                    <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-icon>
            </v-list-item>
        </template>

    </v-list>
</template>

<script>
    import loader from "../../utils/customizeOptions";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "InformationsListStackPanel",
        components: {},
        methods: {
            openInformationPage(page) {
                const page_url = page.value.replace('/', '');
                eventBus.$emit('stack-panel-push', 'information', {page: page_url, userName: page.name})
            }
        },
        mounted() {
            loader().loadOptions();
            this.infoPages = loader().getOptions(['Footer', 'Information']);

            console.log('info pages: ', this.infoPages);
        },
        data: () => {
            return {
                infoPages: []
            }
        }
    }
</script>

<style scoped>

</style>
