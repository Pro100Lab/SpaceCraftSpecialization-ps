<template>
    <v-card class="d-flex flex-column px-4">
        <v-card-title>
            Фильтр
        </v-card-title>
        <v-text-field
                label="Название товара"
                outlined>

        </v-text-field>
        <v-text-field
                label="Категория товара"
                outlined>

        </v-text-field>
        <v-text-field
                label="Количество"
                outlined>
        </v-text-field>
        <v-btn color="blue" class="my-4">
            Применить
        </v-btn>
    </v-card>
</template>

<script>
    export default {
        name: "CatalogFilter"
    }
</script>

<style scoped>

</style>
