<template>
    <v-sheet color="transparent" class="category__all-controls">
        <v-row>
            <v-col class="fill-height">
                <v-card color="white" style="width: 100%" >
                    <BreadCrumbs v-bind:crumbs="this.breadCrumbs"></BreadCrumbs>
                    <BlockInfo v-if="title && description" v-bind="{title, description}"/>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="d-flex justify-start flex-row">
        <CategoryGrid v-if="categories.length > 0"
                      v-bind="{categories}"
        />
        </v-row>
        <v-row v-if="categories.length === 0">
            <v-col cols="3">
            <ProductFilter
                    v-if="hasFilters"
                    v-bind="{filters: this.filters, applyFilter}"
                    id="product_filter"
                    style="min-width: 25%; min-height: 35rem"/>
            </v-col>
            <v-col cols="9" >
                <div ref="productsColsRef" >
                <ProductPresets v-if="showPresets"/>
                <div v-for="(products, $index) in productsGroups" :key="$index">
                    <ProductsGrid
                            v-bind="{
                                    onProductView: onProductView,
                                    products: products,
                                    actions: { productToCart: productToCart,
                                               productToCompare: productToCompare,
                                               productToFavourite: productToFavourite
                                    },
                                    favouriteIds,
                                    compareIds
                    }"/>
                </div>
                </div>
            <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler"></infinite-loading>
            </v-col>
            <v-dialog
                v-model="dialogInfo.show"
                max-width="70%"
            >
                <ProductView style="overflow-x: hidden; overflow-y: hidden;"
                             v-if="dialogInfo.show"
                             v-bind="{dialogInfo}"/>
            </v-dialog>
        </v-row>
    </v-sheet>
</template>

<script>
    import BreadCrumbs from "../components/BreadCrumbs";
    import ProductFilter from "../components/products/ProductFilter";
    import ProductsGrid from "../components/products/ProductsGrid";
    import ProductView from "../components/products/ProductView";
    import {getURL} from "../settings";
    import axios from 'axios';
    import eventBus from "../eventBus";
    import BlockInfo from "../components/blocks/BlockInfo";
    import CategoryGrid from "../components/category/CategoryGrid";
    import InfiniteLoading from 'vue-infinite-loading';
    import ProductPresets from "../components/products/ProductPresets";

    export default {
        name: "Category",
        data: () => ({
            breadCrumbs: [],
            filters: {},
            hasFilters: true,
            dialogInfo: {
                show: false,
                id: 0
            },
            productsGroups: [],
            page: 0,
            favouriteIds: [],
            compareIds: [],
            title: '',
            description: '',
            categories: [],
            infiniteId: + new Date(),
            filterProps: [],
            presetsInfo: {},
            presetsFilters: {sorting: null, pageSize: 20, displayFormat: 'grid', displayPages: 'scroll'},
            showPresets: false
        }),
        methods: {
          onProductView(id) {
              this.dialogInfo.id = id;
              this.dialogInfo.show = true;
            },
            updateProduct(placeholder, id) {
                axios.post(getURL('product/update'), {placeholder, id}, {withCredentials: true}).then(() => {
                    eventBus.$emit('update-main-bar');
                });
            },
            productToFavourite(id) {
                this.updateProduct('Favourite', id);
            },
            productToCompare(id) {
                this.updateProduct('Compare', id);
            },
            productToCart(id) {
                this.updateProduct('Cart', id);
            },
            applyFilter(props) {
              console.log('filters updated: ');
              console.log(props);
                this.page = 0;
                this.productsGroups = [];
                this.infiniteId += 1;
                this.filterProps = props
            },
            infiniteHandler($state) {
                axios.post(getURL(`category/${this.$route.params.category_id}`),
                    {
                        pageSize: 20,
                        offset: this.page,
                        filter: this.filterProps
                    }, {withCredentials: true})
                    .then(response => {
                        this.page += 1;
                        const category_info = response.data;
                        const products = category_info.products_info;
                        const filters = category_info.filters_info || {};
                        if( !this.filters || this.filters.length === 0 ) {
                            this.filters = filters;
                        }
                        if (products.length > 0) {
                            $state.loaded();
                            this.productsGroups.push(products);
                        } else {
                            $state.complete();
                        }
                    });
            }
        },
        beforeMount() {
            eventBus.$on('stack-panel-open', () => {
                this.dialogInfo.show = false;
            });

            eventBus.$on('sorting-changed', (sorting) => {
                this.presetsFilters.sorting = sorting;
            })

            eventBus.$on('page-size-changed', (pageSize) => {
                this.presetsFilters.pageSize = pageSize;
            })

            eventBus.$on('page-display-changed', (displayPages) => {
                this.presetsFilters.displayPages = displayPages;
            })

            eventBus.$on('display-format-changed', (displayFormat) => {
                this.presetsFilters.displayFormat = displayFormat;
            })

            eventBus.$on('product-updated', (id, type) => {
                console.log('product updated: ', id, type);
                if (type === 'compare') {
                    const idInArray = this.compareIds.indexOf(id);
                    if( idInArray !== -1 ) {
                        this.compareIds.splice(idInArray, 1);
                    } else {
                        this.compareIds.push(id);
                    }
                } else if (type === 'favourite') {
                    const idInArray = this.favouriteIds.indexOf(id);
                    console.log('favourite ids before: ', this.favouriteIds);
                    if( idInArray !== -1 ) {
                        this.favouriteIds.splice(idInArray, 1);
                    } else {
                        this.favouriteIds.push(id);
                    }
                    console.log('favourite ids after: ', this.favouriteIds);
                }
            });

            axios.post(getURL(`category/${this.$route.params.category_id}`),
                {
                    pageSize: 20,
                    offset: this.page
                }, {withCredentials: true})
                .then(response => {
                    this.page += 1;
                    const category_info = response.data;
                    const products = category_info.products_info;
                    this.breadCrumbs = category_info.breadcrumbs;
                    this.productsGroups.push(products);
                    this.filters = category_info.filters_info || {};
                    this.favouriteIds = category_info.favourite_ids || [];
                    this.compareIds = category_info.compare_ids || [];
                    this.hasFilters = Object.keys(this.filters).length > 0;
                    this.showPresets = category_info.products_info.length > 0;
                    const block_info = category_info.block_info;
                    this.title = block_info.title;
                    this.description = block_info.description;
                    this.categories = category_info.categories;
                });
        },
        components: {
            ProductPresets,
            CategoryGrid, BlockInfo, ProductView, ProductsGrid, ProductFilter, BreadCrumbs, InfiniteLoading}
    }
</script>

<style scoped >
    .category__all-controls {
        width: 70%;
        margin: 0 auto;
    }

</style>
