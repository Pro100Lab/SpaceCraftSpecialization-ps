<template>
    <v-container class="elevation-0 transparent">
        <v-row v-for="product of products" :key="product.id">
            <HorizontalCard
                    class="mt-1"
                    v-bind="{
                       idx: product.id,
                       title: product.title,
                       price: product.price,
                       specialPrice: product.specialPrice,
                       sale: product.sale,
                       salePercent: product.salePercent,
                       description: product.description,
                       available: product.available,
                       source: product.images && product.images.length > 0 ? product.images[0] : '',
                       actions: {...actions, onHeartClick, onAbacusClick, onCartClick, onProductView, goToProduct},
                       favourite: favouriteIds.indexOf(product.id) !== -1,
                       compare: compareIds.indexOf(product.id) !== -1
                    }"
            />
        </v-row>
    </v-container>
</template>

<script>
    import HorizontalCard from "./HorizontalCard";
    import eventBus from "../../utils/eventBus";
    export default {
        name: "ProductsList",
        components: {HorizontalCard},
        props: ['products', 'favouriteIds', 'compareIds', 'actions', 'onProductView'],
        methods: {
            onItemClick: function(text, linkName, link) {
                eventBus.$emit('snack-show', text, linkName, link);
            },
            onHeartClick: function(id) {
                const idInArray = this.favouriteIds.indexOf(id);
                if( idInArray !== -1 ) {
                    this.favouriteIds.splice(idInArray, 1);
                } else {
                    this.favouriteIds.push(id);
                    this.onItemClick('Товар добавлен в избранное', 'открыть избранное', 'favourite');
                }
                this.actions.productToFavourite(id);
            },
            onAbacusClick: function(id) {
                const idInArray = this.compareIds.indexOf(id);
                if( idInArray !== -1 ) {
                    this.compareIds.splice(idInArray, 1);
                } else {
                    this.compareIds.push(id);
                    this.onItemClick('Товар добавлен в сравнения', 'открыть сравнения', 'compare');
                }

                this.actions.productToCompare(id);
            },
            onCartClick: function(id) {
                this.onItemClick('Товар добавлен в корзину', 'открыть корзину', 'cart');
                this.actions.productToCart(id);
            },
            goToProduct(id) {
                this.$router.push(`/product/${id}`)
            },
        }
    }
</script>

<style scoped>

</style>
