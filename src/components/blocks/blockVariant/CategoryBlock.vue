<template>
    <CategoryGrid :categories="categoryInfo" :grid-cols="4"></CategoryGrid>
</template>

<script>
    import CategoryGrid from "../../category/CategoryGrid";
    import axios from "axios";
    import {getURL} from "../../../utils/settings";
    export default {
        name: "CategoryBlock",
        components: {CategoryGrid},
        props: {
            content: {}
        },
        data: () => {
            return {
                categoryInfo: []
            }
        },
        mounted() {
            console.log('category content: ', this.content);
            const categoryId = this.content.Description;
            if(categoryId) {
                axios.post(getURL(`category/${categoryId}`),
                    {
                        offset: 0,
                    }, {withCredentials: true})
                    .then(async response => {
                        this.categoryInfo = response.data.categories;
                    });
            }
        }
    }
</script>

<style scoped>

</style>
