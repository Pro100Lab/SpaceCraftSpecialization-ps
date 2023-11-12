<template>
    <information :page="prop.page"></information>
</template>

<script>
    import Information from "../../views/Information";

    export default {
        name: "InformationStackPanel",
        components: {Information},
        props: ['prop']
    }
</script>

<style scoped>

</style>
