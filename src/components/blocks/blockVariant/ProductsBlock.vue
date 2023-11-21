<template>
    <v-card-actions class="d-flex flex-row">
        <ProductCard class="mx-4" v-for="product of products" :key="`block-${1}-product-${product}`" :index="product"></ProductCard>
    </v-card-actions>
</template>

<script>
    import ProductCard from "../../products/ProductCard";
    import {getStatic} from "../../../utils/settings";
    export default {
        name: "ProductsBlock",
        components: {ProductCard},
        props: {
            content: {}
        },
        data: () => {
            return {
                products: []
            }
        },
        methods: {
            getStatic
        },
        mounted() {
            this.products = this.content.Description.split(',');
            console.log('products: ', this.products)
        }
    }
</script>

<style scoped>

</style>
