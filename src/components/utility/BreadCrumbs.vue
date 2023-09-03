<template>
    <v-card class="fill-height rounded-b-0" color="rgba(0,0,0,0.5)">
        <v-breadcrumbs dark :items="crumbs" v-if="crumbs"/>
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
