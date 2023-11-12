<template>
    <v-col v-if="products.length > 0" class="px-0">
        <v-row v-for="row of this.productRows" :key="`row-${row.idx}`" class="d-flex flex-row">
            <v-col v-for="product of row.col" :key="`col-${product.id}`" class="d-flex flex-row"
                   :cols="row.col.length === gridCols ? 12/gridCols : 12/row.col.length">
                <Card
                        v-bind="{
                     id: product.id,
                     title: product.title,
                     description: product.description,
                     images: product.images,
                     width: cardWidth,
                     price: product.price,
                     specialPrice: product.specialPrice,
                     sale: product.sale,
                     salePercent: product.salePercent,
                     available: product.available,
                     actions: {onProductView, goToProduct},
                     favourite: favouriteIds.indexOf(product.id) !== -1,
                     compare: compareIds.indexOf(product.id) !== -1}"
                        :style="{'width': '100%'}"

                />
            </v-col>
        </v-row>
    </v-col>
</template>

<script>
    import eventBus from "../../utils/eventBus";
    import {normalizePrice} from "../../utils/settings";
    import Card from "./Card";

    export default {
        name: "ProductsGrid",
        components: {Card},
        data: () => ({
            eventBus,
            productRows: [],
        }),
        props: ['gridCols', 'cardWidth', 'windowWidth', 'onProductView','products', 'favouriteIds', 'compareIds'],
        mounted() {
            if (this.products && this.products.length > 0) {
                this.productRows = this.getProductRows();
            }
        },
        watch: {
          products(value) {
              if (!this.products) return;
              console.log('products grid, new products: ', this.products);
                this.products = value;
                this.productRows = this.getProductRows();
          },
            gridCols() {
              this.productRows = this.getProductRows();
            }
        },
        methods: {
            getProductRows: function () {
                let offset = 0;
                let productCol = [];
                let productRows = [];
                this.products.forEach((value, index) => {
                    productCol.push(value);
                    if(productCol.length === this.gridCols || index === this.products.length - 1) {
                        productRows.push({idx: offset++, col: productCol});
                        productCol = [];
                    }
                })
                return productRows;
            },

            goToProduct(id) {
                this.$router.push(`/product/${id}`)
            },
            normalizePrice: normalizePrice
        }
    }
</script>

<style scoped lang="scss">
    .slide-fade-enter-active {
        transition: all .3s;
    }
    .slide-fade-leave-active {
        transition: all .3s;
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(-200px);
        opacity: 0;
    }

    .img-hover-zoom {
        height: 300px; /* [1.1] Set it as per your need */
        overflow: hidden; /* [1.2] Hide the overflowing of child elements */
    }

    /* [2] Transition property for smooth transformation of images */
    .img-hover-zoom img {
        transition: transform .5s ease;
    }

    /* [3] Finally, transforming the image when container gets hovered */
    .img-hover-zoom:hover img {
        transform: scale(1.5);
    }
</style>
