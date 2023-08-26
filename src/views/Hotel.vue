<template>
    <v-card elevation="0">
        <v-card-title>
            Управление гостиницей
        </v-card-title>
        <v-tabs v-model="tab">
            <v-tab v-for="tab of tabs" :key="tab">
                {{tab}}
            </v-tab>
        </v-tabs>
        <template v-if="tab===0">
            <place-edit></place-edit>
        </template>
        <template v-else-if="tab===1">
            <tariff-edit></tariff-edit>
        </template>
    </v-card>
</template>

<script>
    import PlaceEdit from "../components/hotel/PlaceEdit";
    import TariffEdit from "../components/hotel/TariffEdit";
    export default {
        name: "Hotel.vue",
        components: {TariffEdit, PlaceEdit},
        data: () => {
            return {
                tab: 0,
                tabs: ['Места', 'Тарифы']
            }
        }
    }
</script>

<style scoped>

</style>
