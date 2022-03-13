<template>
    <v-card class="fill-height rounded-0">
        <v-breadcrumbs :items="crumbs"/>
    </v-card>
</template>

<script>
    export default {
        name: "BreadCrumbs",
        props: ['crumbs'],
    }
</script>

<style scoped>

</style>
