<template>
  <v-card elevation="0" class="mx-auto" color="transparent">
      <v-card-title>
          Панель состояния
      </v-card-title>
      <v-row>
          <v-col cols="4">
              <StatisitcCard v-bind="{
                title: 'Заказов',
                icon: 'mdi-cart-variant',
                amount: '592',
                action: 'Подробнее...',
                link: '/'
}"/>

          </v-col>
          <v-col cols="4">
              <StatisitcCard v-bind="{
                title: 'Продаж',
                icon: 'mdi-credit-card-outline',
                amount: '71M',
                action: 'Подробнее...',
                link: '/'
}"/>
          </v-col>
          <v-col cols="4">
              <StatisitcCard v-bind="{
                title: 'Клиентов',
                icon: 'mdi-account',
                amount: '3K',
                action: 'Подробнее...',
                link: '/'
}"/>
          </v-col>
      </v-row>
      <v-card elevation="0">
          <v-card-title>
              Графики продаж
          </v-card-title>
    <v-row v-for="i of Array(2)" :key="i">
        <v-col cols="4" v-for="j of Array( 3)" :key="`cols-${j}`">
            <Chart/>
        </v-col>
    </v-row>
      </v-card>
      <v-row>
          <v-col cols="6">
              <ActionsHistory/>
          </v-col>
          <v-col cols="6">
                <OrdersHistory/>
          </v-col>
      </v-row>
  </v-card>
</template>

<script>

  import Chart from "../components/Chart";
  import ActionsHistory from "../components/ActionsHistory";
  import OrdersHistory from "../components/OrdersHistory";
  import StatisitcCard from "../components/StatisitcCard";
  export default {
    name: 'Home',

    components: {
        StatisitcCard,
        OrdersHistory,
        ActionsHistory,
      Chart
    },
  }
</script>
