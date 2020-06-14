import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import Statistics from './components/Statistics.vue';
import LandingPage from './components/LandingPage.vue';
import CreditsDebitsByCategory from './components/charts/DebitsCreditsByCategoryChart.vue';
import TopFiveMonthExpenses from './components/charts/TopFiveMonthExpenses.vue';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.component('debits-credits-by-category', CreditsDebitsByCategory);
Vue.component('top-five-month-expenses', TopFiveMonthExpenses);

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
