<template>
    <div class="d-flex flex-row overflow-x-auto py-3">
        <v-col class="mx-1" :cols="isMobile ? 8 : 3"  v-for="product of products"  :key="`block-${1}-product-${product}`">
        <ProductCard :index="product"></ProductCard>
        </v-col>
    </div>
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
        computed: {
            isMobile: function() {
                return window.innerWidth < 960;
            }
        },
        mounted() {
            this.products = this.content.Description.split(',');
            console.log('products: ', this.products)
        }
    }
</script>

<style scoped>

</style>
