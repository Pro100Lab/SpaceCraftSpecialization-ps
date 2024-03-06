<template>
    <v-sheet v-if="categories.length > 0" color="transparent" class="mx-auto">
        <v-row justify="start">
            <v-col class="pt-0" v-for="category of categories" :key="`col-${category.id}`"
                   :cols="12 / innerGridCols"
                   >
                <CategoryCard v-bind="{
                    id: category.id,
                    title: category.title,
                     description: category.description,
                     image: category.image
                     }"
                    :style="{'width': '100%'}"
                />
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script>
    import CategoryCard from "./CategoryCard";
    export default {
        name: "CategoryGrid",
        components: {CategoryCard},
        props: ['categories', 'gridCols'],
        data: () => {
            return {
                categoriesRows: [],
                innerGridCols: 3,
                cardWidth: 350,
                windowWidth: 1281
            }
        },
        mounted() {
            this.calculateGridCols();
            window.addEventListener('resize', () => {
                this.calculateGridCols();
            });
        },
        methods: {
            buildCategories() {
                if (this.categories && this.categories.length > 0) {
                    this.categoriesRows = this.getCategoriesRows();
                } else {
                    const unwatch = this.$watch('products', () => {
                        if (!this.products) return;
                        this.categoriesRows = this.getCategoriesRows();

                        unwatch();
                    })
                }

                // if( this.gridCols )
                //     this.innerGridCols = this.gridCols;
            },
            calculateGridCols() {
                const windowWidth = window.innerWidth;
                console.log('window with: ', windowWidth);
                if( windowWidth > 1280 ) {
                    this.windowWidth = 0.7 * windowWidth + 24;
                    this.cardWidth = this.windowWidth * 0.33;
                }
                if( windowWidth <= 1280 ) {
                    this.windowWidth = 0.8 * windowWidth;
                    this.cardWidth = this.windowWidth * 0.24;
                }
                if( windowWidth <= 960 ) {
                    this.windowWidth = windowWidth;
                    this.cardWidth = this.windowWidth * 0.88;
                }

                let shouldBeCols = Math.floor(this.windowWidth/this.cardWidth);
                console.log('should be cols: ', shouldBeCols)
                if (this.changeGridCols(shouldBeCols)) {
                    this.categoriesRows = this.getCategoriesRows();
                }
            },
            changeGridCols(cols) {
                if( cols !== this.innerGridCols) {
                    this.innerGridCols = cols;
                    return true;
                }
                return false;
            },
            getCategoriesRows: function () {
                let categoryCol = [];
                let categoryRows = [];
                this.categories.forEach((value) => {
                    categoryCol.push(value);
                })
                categoryRows.push(categoryCol)
                return categoryRows;
            },
        }
    }
</script>

<style scoped>

</style>
