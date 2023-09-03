<template>
    <v-col class="px-0" id="bottom">
        <v-row>
            <v-col v-if="!withoutFilter && hasFilters && window.innerWidth <= 1280" cols="12">
                <ProductFilter
                        v-bind="{filters, applyFilter,
                                 expands: true}"
                />
            </v-col>
        </v-row>
        <v-row v-if="blocks && blocks.length > 0">
            <v-col class="fill-height">
                <BlockInfo
                        v-for="(info, index) of blocks"
                        :key="info['@Block']"
                        v-bind="{info, customClass: rounder(index, blocks.length, true)}"/>
            </v-col>
        </v-row>
        <v-row class="d-flex flex-row align-start justify-start">
            <v-col v-if="!withoutFilter && hasFilters && window.innerWidth > 1280" cols="3">
                <div id="triggerWrapper">
                    <ProductFilter v-bind="{filters, applyFilter}" v-if="!withoutFilter"/>
                </div>
            </v-col>
            <v-col :cols="!withoutFilter && hasFilters && window.innerWidth > 1280 ? 9 : 12">
                <div ref="productsColsRef">
                    <ProductPresets v-if="showPresets" :presets="this.presets" :expands="window.innerWidth <= 1280"
                    class="mb-2"
                    />
                    <div v-for="(products, $index) in productsGroups" :key="$index">
                        <ProductsGrid
                                v-if="presetsFilters.displayPages === 'grid'"
                                v-bind="{
                                        onProductView: onProductView,
                                        products: products,
                                        actions: { productToCart: productToCart,
                                                   productToCompare: productToCompare,
                                                   productToFavourite: productToFavourite
                                        },
                                        gridCols,
                                        cardWidth,
                                        windowWidth,
                                        favouriteIds,
                                        compareIds
                        }"/>
                        <ProductsList v-if="presetsFilters.displayPages === 'list'"
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
                    <infinite-loading v-if="presetsFilters.displayFormat === 'Лента'" :identifier="infiniteId" @infinite="infinityHandler" >
                        <v-card-title slot="spinner" class="white--text">Загрузка...</v-card-title>
                        <v-card-title slot="no-more" class="white--text">Вы всё просмотрели. Отличная работа!</v-card-title>
                        <v-card-title slot="no-results"></v-card-title>
                    </infinite-loading>
                    <template  v-if="presetsFilters.displayFormat === 'Постраничный' && products">
                        <div class="text-center" v-if="products.length > 0 && totalPages > 1">
                            <v-pagination
                                    v-model="currentPage"
                                    :length="totalPages"
                                    @input="loadHandler"
                            ></v-pagination>
                        </div>
                    </template>
                </div>

                <v-overlay v-on:click="dialogInfo.show = false"
                           v-model="dialogInfo.show"
                >

                </v-overlay>
                <ProductView
                        v-if="dialogInfo.show"
                        class="view-adaptive"
                        v-bind="{dialogInfo}"/>
            </v-col>
        </v-row>
    </v-col>

</template>

<script>
    import Filter from "../../components/products/ProductFilter";
    import ProductsGrid from "../../components/products/Grid";
    import ProductView from "../../components/products/View";
    import {getURL} from "../../utils/settings";
    import axios from 'axios';
    import eventBus from "../../utils/eventBus";
    import InfiniteLoading from 'vue-infinite-loading';
    import ProductPresets from "../../components/products/Presets";
    import ProductsList from "../../components/products/List";
    import {rounder} from "../../utils/blockRoundCounter";
    import BlockInfo from "../../components/blocks/BlockInfo";
    import gsap from 'gsap';
    import ScrollTrigger from 'gsap/ScrollTrigger'

    export default {
        name: "CategoryProducts",
        data: () => ({
            filterQuery: '',
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
            infiniteId: + new Date(),
            filterProps: [],
            presetsFilters: {sorting: 'Сначала дешевые',
                pageSize: 20,
                displayFormat: window.innerWidth > 1280 ? 'Постраничный' : 'Лента',
                displayPages: window.innerWidth > 1280 ? 'grid' : 'list'},
            showPresets: false,
            blocks: [],
            totalPages: 0,
            gridCols: 4,
            cardWidth: 250,
            windowWidth: 1280,
            currentPage: 1,
            products: [],
            title: '',
            description: '',
            loading: false,
            window,
            clientHeight: window.innerHeight,
            ScrollTrigger,
            tls: null,
        }),
        props: ['withoutFilter', 'crumbs', 'runTrigger'],
        created() {
            this.scrollAnimation();
        },
        methods: {
            scrollAnimation() {
                setTimeout(()=>{
                    if(!this.runTrigger || this.tls)
                        return;
                    console.log(document.getElementById('crumbs') );
                    this.tls = gsap.timeline({
                        scrollTrigger: {
                            trigger: '#triggerWrapper',
                            start: "center center",
                            end: "+=" + ( Math.round( document.getElementsByTagName('main')[0].offsetHeight / 2 + 250 ) ),
                            pin: true,
                            invalidateOnRefresh: true,
                        }
                    })
                }, 500);

            },
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
            applyFilter(props, restoreFilter, restoreState) {
                console.log('apply filter');
                this.filterProps = props

                if(!restoreState) {
                    console.log('not restore')
                    this.page = 0;
                    this.productsGroups = [];
                    this.infiniteId += 1;
                    this.currentPage = 1;
                } else {
                    console.log('restore')
                    this.currentPage = parseInt(this.$route.query.page || '1');
                }
                this.filterQuery = ``;
                props.forEach(prop => {
                    console.log('prop: ' + JSON.stringify(prop))
                    let values = [];
                    if( prop.type === "radio") {
                        console.log('prop values: ' + prop.values)
                        prop.values.forEach( value => {
                            if (value.checked) {
                                values.push(value.name)
                            }
                        })
                    }
                    if( !restoreFilter ) {
                        if (prop.name === "Цена")
                            this.filterQuery += `&price=${prop.range[0]}-${prop.range[1]}`;
                        if (prop.name === 'Мощность охлаждения, кВт')
                            this.filterQuery += `&cool=${prop.range[0]}-${prop.range[1]}`;
                        if (prop.name === 'Бренд' && values.length > 0)
                            this.filterQuery += `&brand=${values}`;
                        if (prop.name === 'Инверторное управление' && values.length > 0)
                            this.filterQuery += `&inverter=${values}`
                    }
                })
                console.log('restore state with props', props)
                console.log('format: ', this.presetsFilters.displayFormat)
                if( !restoreState )
                    window.history.replaceState(null, '', `?page=${this.currentPage}${this.filterQuery}`);
                if(this.presetsFilters.displayFormat === 'Постраничный')
                    this.loadHandler(this.currentPage);
                else {
                    this.initialProductRequest(props);
                }
            },
            infinityHandler($state) {
                this.loading = true;
                axios.post(getURL(`category/${this.$route.params.category_id}`),
                    {
                        pageSize: 20,
                        offset: this.page,
                        filter: this.filterProps,
                        sort: this.presetsFilters.sorting
                    }, {withCredentials: true})
                    .then(response => {
                        this.page += 1;
                        const category_info = response.data;
                        this.crumbs = category_info.breadcrumbs;
                        const block_info = category_info.block_info;
                        this.blocks = block_info.blocks;

                            ScrollTrigger.refresh(true);

                        const products = category_info.products_info;
                        this.loading = false;
                        if (products.length > 19) {
                            $state.loaded();
                            this.productsGroups.push(products);
                            this.products = products;
                        } else {
                            $state.complete();
                        }
                    });
            },
            loadHandler(page)
            {
                if(page > 1) {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }

                console.log('set page: ', this.page);
                window.history.replaceState(null, '', `?page=${this.currentPage}${this.filterQuery}`);
                axios.post(getURL(`category/${this.$route.params.category_id}`),
                    {
                        pageSize: 20,
                        offset: this.currentPage - 1,
                        filter: this.filterProps,
                        sort: this.presetsFilters.sorting
                    }, {withCredentials: true})
                    .then(response => {
                        const category_info = response.data;
                        const products = category_info.products_info;
                        eventBus.$emit('crumbs-changed', category_info.breadcrumbs);
                        const block_info = category_info.block_info;
                        this.blocks = block_info.blocks;

                            ScrollTrigger.refresh(true);

                        this.totalPages = category_info.pages;
                        this.productsGroups = [products];
                        this.products = products;
                    });
            },
            initialProductRequest(props) {
                this.loading = true;
                console.log('initial load, props: ', props)
                axios.post(getURL(`category/${this.$route.params.category_id}`),
                    {
                        pageSize: 20,
                        offset: this.currentPage - 1,
                        filter: props,
                        sort: this.presetsFilters.sorting
                    }, {withCredentials: true})
                    .then(async response => {
                        this.productsGroups = [];
                        this.products = [];

                        this.page = 1;
                        const category_info = response.data;
                        const products = category_info.products_info;
                        eventBus.$emit('crumbs-changed', category_info.breadcrumbs);
                        this.products = products;
                        this.productsGroups.push(products);
                        const block_info = category_info.block_info;
                        if( block_info )
                        {
                            this.title = block_info.title;
                            this.description = block_info.description;
                        }
                        if(!props) {
                            this.filters = category_info.filters_info || {};
                            this.favouriteIds = category_info.favourite_ids || [];
                            this.compareIds = category_info.compare_ids || [];
                            this.hasFilters = Object.keys(this.filters).length > 0;
                            this.showPresets = category_info.presets && Object.keys(category_info.presets).length > 0;
                            this.categories = category_info.categories;
                            this.presets = category_info.presets || [];
                        }

                        this.totalPages = category_info.pages;
                        this.blocks = block_info.blocks;
                        ScrollTrigger.refresh(true);
                        this.loading = false;

                    });
            },
            rounder,
        },
        beforeMount() {
            this.calculateGridCols();
            window.addEventListener('resize', () => {
                this.calculateGridCols();
            });

            eventBus.$on('product-view-closed', () => {
                this.dialogInfo.show = false;
            })
            eventBus.$on('format-changed', (sortSelect, pageFormat, pageSize, displayPages) => {
                console.log('format changed: ', sortSelect)
                this.presetsFilters.sorting = sortSelect;
                this.presetsFilters.pageSize = pageSize;
                this.presetsFilters.displayPages = displayPages;
                this.presetsFilters.displayFormat = pageFormat;

                this.initialProductRequest(this.filterProps);
            });

            eventBus.$on('product-updated', (id, type) => {
                if (type === 'compare') {
                    const idInArray = this.compareIds.indexOf(id);
                    if( idInArray !== -1 ) {
                        this.compareIds.splice(idInArray, 1);
                    } else {
                        this.compareIds.push(id);
                    }
                } else if (type === 'favourite') {
                    const idInArray = this.favouriteIds.indexOf(id);
                    if( idInArray !== -1 ) {
                        this.favouriteIds.splice(idInArray, 1);
                    } else {
                        this.favouriteIds.push(id);
                    }
                }
            });

            this.currentPage = parseInt(this.$route.query.page || '1');
            this.initialProductRequest();
        },

        components: {
            ProductsList,
            ProductPresets,
            BlockInfo,
            ProductView, ProductsGrid, ProductFilter: Filter, InfiniteLoading}
    }
</script>

<style scoped>
    .bottom-bar__main-scope {
        width: 70vw;
        margin: 0 auto;
    }
    .view-adaptive {
        width: 70vw;
        overflow-y: hidden;
        overflow-x: hidden;
        position: fixed;
        left: 15%;
        top: 10%;
        bottom: 10%;
        z-index: 10;
    }
</style>
