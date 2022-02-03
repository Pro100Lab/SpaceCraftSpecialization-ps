<template>
    <v-sheet color="transparent" class="my-4 category__all-controls">
        <v-card color="white">
            <BreadCrumbs v-bind:crumbs="this.startCrumbs"></BreadCrumbs>
        </v-card>
        <div class="d-flex flex-row mt-5">
                <ProductFilter style="min-width: 25%; min-height: 35rem"/>
                <ProductsGrid :gridRows="2" :gridCols="4" class="px-4" style="max-height: 40rem"/>
        </div>
    </v-sheet>
</template>

<script>
    import BreadCrumbs from "../components/BreadCrumbs";
    import ProductFilter from "../components/products/ProductFilter";
    import ProductsGrid from "../components/products/ProductsGrid";
    export default {
        name: "Category",
        data: () => ({
                startCrumbs: [
                    {
                        text: 'главная',
                        disabled: false,
                        href: '/'
                    },
                    {
                        text: 'категории',
                        disabled: true,
                        href: '/'
                    },
                    {
                        text: 'id',
                        disabled: true,
                        href: '/'
                    },
                ]

        }),
        components: {ProductsGrid, ProductFilter, BreadCrumbs}
    }
</script>

<style scoped>
    .category__all-controls {
        width: 70%;
        height: 50rem;
        margin: 0 auto;
    }
</style>
