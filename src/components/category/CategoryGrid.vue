<template>
    <v-container class="elevation-0" color="transparent">
        <div v-if="categories.length > 0">
            <v-row v-for="row of this.categoriesRows" :key="`row-${row.idx}`" class="d-flex flex-row float-left">
                <v-col v-for="category of row.col" :key="`col-${category.id}`" >
                    <CategoryCard v-bind="{
                        id: category.id,
                        title: category.title,
                         description: category.description,
                         image: category.image,
                         }"/>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
    import CategoryCard from "./CategoryCard";
    export default {
        name: "CategoryGrid",
        components: {CategoryCard},
        props: ['categories', 'gridCols'],
        data: () => {
            return {
                categoriesRows: []
            }
        },
        mounted() {
            if (this.categories && this.categories.length > 0) {
                this.categoriesRows = this.getCategoriesRows();
            } else {
                const unwatch = this.$watch('products', () => {
                    if (!this.products) return;
                    this.categoriesRows = this.getCategoriesRows();

                    unwatch();
                })
            }
        },
        methods: {
            getCategoriesRows: function () {
                let offset = 0;
                let categoryCol = [];
                let categoryRows = [];
                this.categories.forEach((value, index) => {
                    categoryCol.push(value);
                    if(categoryCol.length === this.gridCols || index === this.categories.length - 1) {
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
