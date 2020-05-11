import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import VueRouter from 'vue-router';
import Statistics from './components/Statistics.vue';
import LandingPage from './components/LandingPage.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: '/statistics', component: Statistics },
  { path: '/', component: LandingPage }
];

const router = new VueRouter({
  routes
});

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
