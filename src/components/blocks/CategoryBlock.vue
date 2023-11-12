<template>
    <CategoryGrid :categories="categoryInfo" :grid-cols="4"></CategoryGrid>
</template>

<script>
    import CategoryGrid from "../category/CategoryGrid";
    import axios from "axios";
    import {getURL} from "../../utils/settings";
    export default {
        name: "CategoryBlock",
        components: {CategoryGrid},
        props: ['categoryId'],
        data: () => {
            return {
                categoryInfo: []
            }
        },
        mounted() {
            if(this.categoryId) {
                axios.post(getURL(`category/${this.categoryId}`),
                    {
                        offset: 0,
                    }, {withCredentials: true})
                    .then(async response => {
                        const category_info = response.data;
                        this.categoryInfo = category_info.categories;
                    });
            }
        }
    }
</script>

<style scoped>

</style>
