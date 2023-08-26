<template>
    <v-card dark color="transparent" class="elevation-0">
        <v-card-title>
            Бронь {{orderId}}
        </v-card-title>
        <v-card-subtitle>
            Имя: {{requisites.firstName}}<br/>
            Телефон: {{requisites.phone}}<br/>
            Цена: {{orderCache[orderId].Amount}}<br/>
            Дата Заселения: {{requisites.dateOpen}}<br/>
            Дата выселения: {{requisites.dateClose}}
        </v-card-subtitle>
    </v-card>
</template>

<script>
    export default {
        name: "OrderView",
        props: ['orderId', 'orderCache', 'placesCache'],
        data: () => {
            return {
                requisites: {}
            }
        },
        mounted() {
            this.requisites = JSON.parse(this.orderCache[this.orderId]['Requisites']);
        }
    }
</script>

<style scoped>

</style>
