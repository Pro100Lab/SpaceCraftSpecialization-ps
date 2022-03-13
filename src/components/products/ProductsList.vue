<template>
    <v-list>
        <v-list-item v-for="product of products" :key="product.id">
            <ProductHCard
                    v-bind="{
                       idx: product['@Product'],
                       title: product['Title'],
                       price: product['Price'],
                       source: product['Images'] && product['Images'].length > 0 ? product['Images'][0] : ''
                    }"
            />
        </v-list-item>
    </v-list>
</template>

<script>
    import ProductHCard from "./ProductHCard";
    export default {
        name: "ProductsList",
        components: {ProductHCard},
        props: ['products']
    }
</script>

<style scoped>

</style>
