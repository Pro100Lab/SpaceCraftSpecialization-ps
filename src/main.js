import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueJivosite from '@bchteam/vue-jivosite'

Vue.config.productionTip = false
Vue.use(VueJivosite, {widgetId: 'uurkUYdXSB'});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

