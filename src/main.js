import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import ElementUI from 'element-ui';
import { ElementTiptapPlugin } from 'element-tiptap';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-tiptap/lib/index.css';

import VueKinesis from 'vue-kinesis'

Vue.use(VueKinesis);
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(ElementTiptapPlugin, {
  lang: "ru", // see i18n
  spellcheck: true, // can be overwritten by editor prop
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

