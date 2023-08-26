<template>
  <v-card elevation="0" class="mx-auto" color="transparent">
      <v-card-title>
          Панель состояния
      </v-card-title>
      <v-row>
          <v-col cols="4">
              <StatisitcCard v-bind="{
                title: 'Бронирований',
                icon: 'mdi-book-account-outline',
                amount: orders,
                action: 'Подробнее...',
                link: '/orders'
}"/>

          </v-col>
          <v-col cols="4">
              <StatisitcCard v-bind="{
                title: 'Оплачено',
                icon: 'mdi-credit-card-outline',
                amount: sells,
                action: 'Подробнее...',
                link: '/orders'
}"/>
          </v-col>
          <v-col cols="4">
              <StatisitcCard v-bind="{
                title: 'Уникальных клиентов',
                icon: 'mdi-account',
                amount: clients,
                action: 'Подробнее...',
                link: '/orders'
}"/>
          </v-col>
      </v-row>
      <v-row>
          <v-col cols="4">
              <OrdersHistory icon="mdi-calendar-account" name="Активность в админке" :headers="[
                  {
                      text: 'Дата',
                      sortable: false,
                      value: 'Datetime'
                  },
                  {
                      text: 'Действие',
                      value: 'Action',
                      sortable: false
                  },
                  {
                      text: 'Имя пользователя',
                      value: 'Name',
                      sortable: false
                  }
              ]" :history="journal"/>
          </v-col>
          <v-col cols="4">
              <OrdersHistory icon="mdi-book-account-outline" name="Последние брони" is-orders="true" :headers="[
                  {
                      text: 'Номер заказа',
                      key: 'Order',
                      sortable: false,
                      value: '@Order'
                  },
                  {
                      text: 'Сумма',
                      value: 'Amount',
                      sortable: false
                  },
                  {
                      text: 'Дата',
                      value: 'Date',
                      sortable: false
                  },
                  {
                      text: 'Номер телефона',
                      value: 'Phone',
                      sortable: false
                  }
              ]"
              :history="lastOrders"/>
          </v-col>
          <v-col cols="4">
              <OrdersHistory icon="mdi-cellphone" name="Ожидают звонка" is-orders="true" :headers="[
                  {
                      text: 'Номер заказа',
                      value: '@Order',
                      sortable: false
                  },
                  {
                      text: 'Дата',
                      value: 'Date',
                      sortable: false
                  },
                  {
                      text: 'Номер телефона',
                      value: 'Phone',
                      sortable: false
                  }
              ]"
                             :history="waitCalls"/>
          </v-col>
      </v-row>
  </v-card>
</template>

<script>

  import OrdersHistory from "../components/OrdersHistory";
  import StatisitcCard from "../components/StatisitcCard";

  import axios from 'axios';

  import {getURL} from "../settings";
  export default {
    name: 'Home',
      data: () => {
        return {
            orders: 0,
            sells: 0,
            clients: 0,
            journal: [],
            lastOrders: [],
            waitCalls: []
        }
      },
    mounted() {
        axios.get(getURL('admin/stat')).then(resp => {
            let data = resp.data;
            this.orders = data['Orders'];
            this.sells = data['Sells'];
            this.clients = data['Clients'];
            this.journal = data['Journal'];
            this.lastOrders = data['LastOrders'];
            this.waitCalls = data['CallWaits'];

            console.log(this.journal)
        })
    },
      components: {
        StatisitcCard,
        OrdersHistory
    },
  }
</script>
