import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// App's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAFdaXfk4neMblum6xMq9sL3o33XN4MDho",
  authDomain: "peebu-b1d74.firebaseapp.com",
  databaseURL: "https://peebu-b1d74.firebaseio.com",
  projectId: "peebu-b1d74",
  storageBucket: "peebu-b1d74.appspot.com",
  messagingSenderId: "293436232690",
  appId: "1:293436232690:web:85a93cdaa662141280d16b",
  measurementId: "G-9MDGS3X3JX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
