<template>
    <v-card class="fill-height">
        <v-card-title>
            Поиск
        </v-card-title>
        <v-divider class="my-2"/>

        <div class="mx-4" v-if="products && products.length > 0">
            <v-virtual-scroll
                    :bench="20"
                    :items="products"
                    height="800"
                    item-height="170"
                    style="overflow-x: hidden"
            >
                <template v-slot:default="{ item }">
                    <v-list-item :key="item.id">
                        <v-row style="width: 100%">
                            <ProductHCard
                                    v-bind="{
                            idx: item.id,
                            title: item.title,
                            price: item.price,
                            amount: item.amount,
                            source: item.images[0]
                            }"/>
                        </v-row>
                    </v-list-item>
                    <v-divider/>
                </template>
            </v-virtual-scroll>
        </div>
        <v-card-title v-if="!products || products.length === 0"
                      class="d-flex flex-column align-center justify-center ">
            По вашему запросу ничего не найдено!
        </v-card-title>
    </v-card>
</template>

<script>
    import ProductHCard from "../products/ProductHCard";
    export default {
        name: "SearchStackPanel",
        components: {ProductHCard},
        props: ['searchRequest', 'products']
    }
</script>

<style scoped>

</style>
