<template>
    <v-col class="px-1" id="category-products">
        <v-row v-if="hasFilters && window.innerWidth <= 1280 && productsGroups.length > 0" >
            <v-col  cols="12">
                <ProductFilter
                        v-bind="{filters,
                                 expands: true}"
                />
            </v-col>
        </v-row>
        <v-row v-if="blocks && blocks.length > 0">
            <v-col class="fill-height">
                <BlockInfo
                        v-for="(info, index) of blocks"
                        :key="`${info['@Block']}-${index}`"
                        :info="info"/>
            </v-col>
        </v-row>
        <template v-if="productsGroups && productsGroups.length > 0">
        <v-row v-if="hasFilters" class="d-flex flex-row align-start justify-start" >
            <v-col v-if="window.innerWidth > 1280 && productsGroups.length > 0" cols="3">
                <ProductFilter v-bind="{filters}" v-if="!withoutFilter"/>
            </v-col>
            <v-col :cols="window.innerWidth > 1280 ? 9 : 12">
                <div ref="productsColsRef">
                    <ProductPresets
                            :presets="this.presets" :expands="window.innerWidth <= 1280"
                                    class="mb-2"
                    />
                    <template v-for="(productsGroup, $index) in productsGroups">
                        <ProductsGrid
                                :key="`products-grid-${$index}`"
                                id="product-grid"
                                v-if="presetsFilters.displayPages === 'grid'"
                                v-bind="{
                                        products: productsGroup,
                                        gridCols,
                                        cardWidth,
                                        windowWidth,
                                        favouriteIds,
                                        compareIds
                        }"/>
                        <ProductsList
                                :key="`product-list-${$index}`"
                                id="product-list"
                                v-if="presetsFilters.displayPages === 'list'"
                                v-bind="{
                                        products: productsGroup,
                                        favouriteIds,
                                        compareIds
                        }"/>
                    </template>
                    <infinite-loading v-if="presetsFilters.displayFormat === 'Лента'" :identifier="infiniteId" @infinite="infinityHandler" >
                        <v-card-title slot="spinner" class="white--text">Загрузка...</v-card-title>
                        <v-card-title slot="no-more" class="white--text">Вы всё просмотрели. Отличная работа!</v-card-title>
                        <v-card-title slot="no-results"></v-card-title>
                    </infinite-loading>
                    <template  v-if="presetsFilters.displayFormat === 'Постраничный'">
                        <div class="text-center" v-if="currentPage < totalPages">
                            <v-pagination
                                    v-model="currentPage"
                                    :length="totalPages"
                                    @input="loadHandler"
                            ></v-pagination>
                        </div>
                    </template>
                </div>
            </v-col>
        </v-row>
        </template>
    </v-col>

</template>

<script>
    import Filter from "../../components/products/ProductFilter";
    import ProductsGrid from "../../components/products/Grid";
    import {getURL} from "../../utils/settings";
    import axios from 'axios';
    import eventBus from "../../utils/eventBus";
    import InfiniteLoading from 'vue-infinite-loading';
    import ProductPresets from "../../components/products/Presets";
    import ProductsList from "../../components/products/List";
    import {rounder} from "../../utils/blockRoundCounter";
    import BlockInfo from "../../components/blocks/BlockInfo";

    export default {
        name: "CategoryProducts",
        data: () => ({
            breadCrumbs: [],
            filters: {},
            hasFilters: false,
            productsGroups: [],
            page: 0,
            favouriteIds: [],
            compareIds: [],
            infiniteId: + new Date(),

            presets: [],
            presetsFilters: {sorting: 'Сначала дешевые',
                pageSize: 20,
                displayFormat: window.innerWidth > 1280 ? 'Постраничный' : 'Лента',
                displayPages: window.innerWidth > 1280 ? 'grid' : 'grid'},
            showPresets: true,

            window,
            gridCols: 4,
            cardWidth: 250,
            windowWidth: 1280,
            clientHeight: window.innerHeight,

            totalPages: 0,
            currentPage: 1,

            currentFilter: [],

            blocks: [],
        }),
        props: ['withoutFilter', 'crumbs', 'runTrigger'],
        watch: {
            filters() {
                this.hasFilters = this.filters && Object.keys(this.filters).length > 0;
                console.log('has filters: ', this.hasFilters)
            }
        },
        methods: {
            calculateGridCols() {
                const windowWidth = window.innerWidth;
                this.windowWidth = windowWidth;
                const catBlockSize = this.hasFilters && !this.withoutFilter ? 1 : 9/12;
                if( windowWidth > 1536 ) {
                    this.windowWidth = catBlockSize * 0.7 * windowWidth + 24;
                    this.cardWidth = this.windowWidth * 0.23;
                }
                if( windowWidth <= 1536 ) {
                    this.windowWidth = catBlockSize * 0.7 * windowWidth + 24;
                    this.cardWidth = this.windowWidth / 3.1;
                }
                if( windowWidth <= 1280 ) {
                    this.windowWidth = catBlockSize * 0.8 * windowWidth;
                    this.cardWidth = this.windowWidth * 0.48;
                }
                if( windowWidth <= 960 ) {
                    this.windowWidth = catBlockSize * 0.95 * windowWidth;
                    this.cardWidth = 0.95 * this.windowWidth;
                }
                this.gridCols = Math.floor(this.windowWidth/this.cardWidth);
            },
            async loadBlock(id) {
                return await axios.get(getURL(`block/${id}`));
            },
            updateProduct(placeholder, id) {
                axios.post(getURL('product/update'), {placeholder, id}, {withCredentials: true}).then(() => {
                    eventBus.$emit('update-main-bar');
                });
            },
            applyFilter(props) {
                this.currentPage = 1;
                console.log('apply filter');
                this.currentFilter = props

                console.log('applyFilter', props)
                console.log('presetsFilters: ', this.presetsFilters)

                if(this.presetsFilters.displayFormat === 'Постраничный')
                    this.loadHandler(this.currentPage);
                else {
                    this.loadProductsPage(props);
                }
            },
            infinityHandler($state) {
                this.loading = true;
                axios.post(getURL(`category/${this.$route.params.category_id}`),
                    {
                        pageSize: 20,
                        offset: this.page,
                        filter: this.currentFilter,
                        sort: this.presetsFilters.sorting
                    }, {withCredentials: true})
                    .then(response => {
                        const category_info = response.data;
                        const block_info = category_info.block_info;

                        this.loading = false;
                        this.page += 1;

                        this.blocks = block_info.blocks;

                        const products = category_info.products_info;
                        if (products.length > 19) {
                            $state.loaded();
                            this.productsGroups.push(products);
                        } else {
                            $state.complete();
                        }
                    });
            },
            scrollToCategoryTop() {
                const productsContainer = document.getElementById('product-grid') || document.getElementById('product-list');
                window.scrollTo({
                    top: productsContainer.offsetTop,
                    behavior: "smooth"
                });
            },
            loadHandler(page)
            {
                if(page > 1)
                    this.scrollToCategoryTop();

                console.log('set page: ', this.page);

                axios.post(getURL(`category/${this.$route.params.category_id}`),
                    {
                        pageSize: 20,
                        offset: this.currentPage - 1,
                        filter: this.currentFilter,
                        sort: this.presetsFilters.sorting
                    }, {withCredentials: true})
                    .then(response => {
                        const category_info = response.data;
                        const products = category_info.products_info;
                        this.breadCrumbs = category_info.breadcrumbs;

                        const block_info = category_info.block_info;
                        this.blocks = block_info.blocks;

                        this.totalPages = category_info.pages;
                        if(products && products.length > 0)
                            this.productsGroups = [products];

                        eventBus.$emit('products-loaded');
                    });
            },

            loadProductsPage(props) {
                console.log('load products: ', props)
                axios.post(getURL(`category/${this.$route.params.category_id}`),
                    {
                        pageSize: 20,
                        offset: this.currentPage - 1,
                        filter: props,
                        sort: this.presetsFilters.sorting
                    }, {withCredentials: true})
                    .then(async response => {
                        this.page = 1;

                        const category_info = response.data;
                        const block_info = category_info.block_info;

                        this.breadCrumbs = category_info.breadcrumbs;
                        if(category_info.products_info && category_info.products_info.length > 0)
                            this.productsGroups = [category_info.products_info];

                        if(!props) {
                            this.filters = category_info.filters_info || {};
                            this.favouriteIds = category_info.favourite_ids || [];
                            this.compareIds = category_info.compare_ids || [];
                            this.hasFilters = Object.keys(this.filters).length > 0;
                            this.categories = category_info.categories;
                            this.presets = category_info.presets || [];
                        }

                        this.totalPages = category_info.pages;
                        this.blocks = block_info.blocks;

                        eventBus.$emit('products-loaded');
                    });
            },
            rounder,
            processUpdateProduct(typeName, productId) {
                if (typeName === 'compare') {
                    const idInArray = this.compareIds.indexOf(productId);
                    if( idInArray !== -1 ) {
                        this.compareIds.splice(idInArray, 1);
                    } else {
                        this.compareIds.push(productId);
                    }
                } else if (typeName === 'favourite') {
                    const idInArray = this.favouriteIds.indexOf(productId);
                    if( idInArray !== -1 ) {
                        this.favouriteIds.splice(idInArray, 1);
                    } else {
                        this.favouriteIds.push(productId);
                    }
                }
            },

            onDisplayFormatChanged(presetsFilter) {
                this.presetsFilters = presetsFilter;
                console.log('presetsFilters: ', this.presetsFilters)

                this.loadProductsPage(this.currentFilter);
            },
            onProductUpdated(productId, typeName) {
                this.processUpdateProduct(typeName, productId)
            },
            onProductMetaUpdated(productId, typeName) {
                this.updateProduct(typeName, productId);
                eventBus.$emit('product-updated', productId, typeName);
            },
            onFilterApplied(props) {
                this.currentFilter = props;
                this.loadProductsPage(props);
            }
        },
        beforeDestroy() {
            eventBus.$off('presets/format-changed', this.onDisplayFormatChanged);
            eventBus.$off('product-updated', this.onProductUpdated);
            eventBus.$off('product-meta-updated', this.onProductMetaUpdated);
            eventBus.$off('filter-applied', this.onFilterApplied);



        },
        beforeMount() {
            this.calculateGridCols();

            window.addEventListener('resize', this.calculateGridCols);
            eventBus.$on('presets/format-changed', this.onDisplayFormatChanged);
            eventBus.$on('product-updated', this.onProductUpdated);
            eventBus.$on('product-meta-updated', this.onProductMetaUpdated);

            eventBus.$on('filter-applied', this.onFilterApplied);

            this.currentPage = parseInt(this.$route.query.page || '1');
            this.loadProductsPage();
        },


        components: {
            ProductsList,
            ProductPresets,
            BlockInfo,
            ProductsGrid, ProductFilter: Filter, InfiniteLoading}
    }
</script>

<style scoped>
    .bottom-bar__main-scope {
        width: 70vw;
        margin: 0 auto;
    }

</style>
