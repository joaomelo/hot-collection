import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import App from './app.vue';

Vue.config.productionTip = false;
Vue.use(Vuetify);

const vueApp = new Vue({
  vuetify: new Vuetify(),
  render: h => h(App)
});

vueApp.$mount('#app');
