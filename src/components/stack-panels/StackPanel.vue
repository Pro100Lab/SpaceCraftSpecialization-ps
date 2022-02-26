<template>
    <v-card color="white">
        <CompareStackPanel v-if="panelName==='compare'"/>
        <FavouriteStackPanel v-else-if="panelName==='favourite'"/>
        <CartStackPanel v-else-if="panelName==='cart'"/>
        <CalculateStackPanel v-else-if="panelName==='calculate'"/>
    </v-card>
</template>

<script>
    import CompareStackPanel from "./CompareStackPanel";
    import FavouriteStackPanel from "./FavouriteStackPanel";
    import CartStackPanel from "./CartStackPanel";
    import CalculateStackPanel from "./CalculateStackPanel";
    export default {
        name: "StackPanel",
        components: {CalculateStackPanel, CartStackPanel, FavouriteStackPanel, CompareStackPanel},
        props: ['panelName']
    }
</script>

<style scoped>

</style>
