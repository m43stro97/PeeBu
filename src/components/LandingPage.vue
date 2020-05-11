<template>
  <h2 class="balance">Balance:
    <span class="a" v-if="balance > 0">
      <label class="up">{{balance}}€</label>
    </span>
    <span class="a" v-if="balance < 0">
      <label class="low">{{balance}}€</label>
    </span>
  </h2>
</template>
<script>
//import axios from "axios";
import db from "../services/firebase";
//import * as firebase from "firebase/app";

export default {
  name: "LandingPage",

  data: () => ({
    transactions: [],
    balance: '1000'
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

<style scoped>

  
  .balance{
    text-align: end;
  }

  .up{
    color: green;
  }

  .low{
    color: red;
  } 

</style>
