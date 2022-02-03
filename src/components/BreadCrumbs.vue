<template>
    <v-card>
        <v-breadcrumbs :items="crumbs"/>
    </v-card>
</template>

<script>
    export default {
        name: "BreadCrumbs",
        props: ['crumbs']
    }
</script>

<style scoped>

</style>
