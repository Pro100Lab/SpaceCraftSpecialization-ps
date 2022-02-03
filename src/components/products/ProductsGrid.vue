<template>
    <v-container class="elevation-0" color="transparent">
        <v-row v-for="row in gridRows" :key="`row-${row}`">
            <v-col v-for="col in gridCols" :key="`col-${col}`">
                <v-card max-width="200">
                    <v-img
                            height="150"
                            contain
                            src="https://akita.su/userfls/shop/large/1716_nastennyy-konditsioner-asx07e1-.jpg">
                    </v-img>
                    <v-card-title>
                        Кондёр {{row*col}}
                    </v-card-title>
                    <div class="my-4 px-4 text-subtitle-1">
                        Цена {{row*col*1000}} рублей
                    </div>
                    <v-card-text>
                        Описание к кондёру {{row*col}}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "ProductsGrid",
        data: () => ({

        }),
        props: {
            gridRows: Number,
            gridCols: Number
        }
    }
</script>

<style scoped>

</style>
