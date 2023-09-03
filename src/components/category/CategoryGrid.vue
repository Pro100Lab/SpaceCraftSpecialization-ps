<template>
    <div v-if="categories.length > 0" class="d-flex flex-column justify-space-around">
        <v-row v-for="row of this.categoriesRows" :key="`row-${row.idx}`" class="d-flex flex-row float-left">
            <v-col v-for="category of row.col" :key="`col-${category.id}`"
                   :cols="row.col.length === innerGridCols ? Math.floor(12/innerGridCols) : Math.floor(12/row.col.length)"
                   >
<!--                :cols="row.col.length === innerGridCols ? Math.floor(12/innerGridCols) : Math.floor(12/row.col.length)"-->
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
    </div>
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
                innerGridCols: 6,
                cardWidth: 180,
                windowWidth: 1281
            }
        },
        mounted() {
            this.calculateGridCols();
            window.addEventListener('resize', () => {
                this.calculateGridCols();
            });

            if (this.categories && this.categories.length > 0) {
                this.categoriesRows = this.getCategoriesRows();
            } else {
                const unwatch = this.$watch('products', () => {
                    if (!this.products) return;
                    this.categoriesRows = this.getCategoriesRows();

                    unwatch();
                })
            }

            if( this.gridCols )
                this.innerGridCols = this.gridCols;
        },
        methods: {
            calculateGridCols() {
                const windowWidth = window.innerWidth;
                console.log('window with: ', windowWidth);
                if( windowWidth > 1280 ) {
                    this.windowWidth = 0.7 * windowWidth + 24;
                    this.cardWidth = this.windowWidth * 0.19;
                }
                if( windowWidth <= 1280 ) {
                    this.windowWidth = 0.8 * windowWidth;
                    this.cardWidth = this.windowWidth * 0.24;
                }
                if( windowWidth <= 960 ) {
                    this.windowWidth = 0.95 * windowWidth;
                    this.cardWidth = 0.95 * windowWidth
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
                let offset = 0;
                let categoryCol = [];
                let categoryRows = [];
                this.categories.forEach((value, index) => {
                    categoryCol.push(value);
                    if(categoryCol.length === this.innerGridCols || index === this.categories.length - 1) {
                        categoryRows.push({idx: offset++, col: categoryCol});
                        categoryCol = [];
                    }
                })
                return categoryRows;
            },
        }
    }
</script>

<style scoped>

</style>
