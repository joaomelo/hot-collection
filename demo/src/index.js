import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import App from './app.vue';

import { router } from './router';

Vue.config.productionTip = false;
Vue.use(Vuetify);

const vueApp = new Vue({
  vuetify: new Vuetify(),
  router,
  render: h => h(App)
});

vueApp.$mount('#app');
