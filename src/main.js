import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import ZoomOnHover from "vue-zoom-on-hover";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import YmapPlugin from 'vue-yandex-maps'
import {jasettings} from "./utils/settings";

gsap.registerPlugin(ScrollTrigger);
Vue.config.productionTip = false

Vue.use(ZoomOnHover);
Vue.use(YmapPlugin, jasettings);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

