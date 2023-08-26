<template>
    <v-card elevation="0">
        <v-card-title>
            <v-icon>
                {{icon}}
            </v-icon>
            {{name}}
        </v-card-title>
        <v-data-table
                :headers="headers"
                :items="history"
                :items-per-page="5"
                :item-class="strongIfNotProceed"
                class="elevation-0"
                no-data-text="Пока пусто :)"
                :footer-props="{itemsPerPageText: 'Строк на странице'}"
        >
            <template v-slot:item.@Order="{item}">
                {{ item['@Order'] }}
                <v-tooltip top v-if="isOrders && !item.Status">
                    <template v-slot:activator="{on, attrs}">
                        <v-icon color="red" v-on="on" v-bind="attrs">
                            mdi-exclamation
                        </v-icon>
                    </template>
                    <strong >

                        Заказ не обработан
                    </strong>
                </v-tooltip>

            </template>
        </v-data-table>
    </v-card>
</template>

<script>
    export default {
        name: "OrdersHistory",
        props: ['name', 'headers', 'history', 'icon', 'isOrders'],
        data: () => {
            return {
            }
        },
        methods: {
            strongIfNotProceed(item) {
                if(this.isOrders && !item['Status']) {
                    return 'strong';
                }
                return 'common';
            }
        }
    }
</script>

<style scoped>
    .strong {
        background-color: red;
    }
</style>
