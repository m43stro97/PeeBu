<template>
  <v-app>
    <h1>Home</h1>
  </v-app>
</template>
<script>
//import axios from "axios";
import db from "../services/firebase";
//import * as firebase from "firebase/app";

export default {
  name: "LandingPage",

  data: () => ({
    transactions: []
  }),
  methods: {
    getAllTransactions() {
      db.collection("transactions")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(transanction => {
            this.transactions.push(transanction.data());
          });
        });
    }
  }
};
</script>
