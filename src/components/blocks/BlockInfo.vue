<template>
    <v-card>
        <v-card-title>
        {{title}}
        </v-card-title>
        <v-card-subtitle>
            {{description}}
        </v-card-subtitle>
    </v-card>

</template>

<script>
    export default {
        name: "BlockInfo",
        props: ['title', 'description', 'presets']
    }
</script>

<style scoped>

</style>
