<template>
    <v-card color="white">
        <CompareStackPanel v-if="panelName==='compare'" :prop="prop"/>
        <FavouriteStackPanel v-else-if="panelName==='favourite'" :prop="prop"/>
        <CartStackPanel v-else-if="panelName==='cart'" :prop="prop"/>
        <CalculateStackPanel v-else-if="panelName==='calculate'" :prop="prop"/>
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
        props: ['panelName', 'prop']
    }
</script>

<style scoped>

</style>
