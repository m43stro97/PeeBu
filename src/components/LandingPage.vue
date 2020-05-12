<template>
  <v-container grid-list-md text-xs-center>
    <v-data-table
      :headers="headers"
      :items="transactions"
      item-key="id"
      sort-by="createdAt"
      :sort-desc="true"
      class="elevation-1 centered table"
    >
      <template #item.amount="{item}">
        <v-chip :color="getTypeColor(item.type)" dark>{{ item.amount }} €</v-chip>
      </template>

      <template #item.createdAt="{item}">
        <span>{{ item.createdAt.toDate().toLocaleDateString() + " " + item.createdAt.toDate().toLocaleTimeString() }}</span>
      </template>

      <template #item.category="{item}">
        <v-icon>{{ getCategory(item.category).icon }}</v-icon>
        {{ getCategory(item.category).text }}
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import axios from "axios";
import db from "../services/firebase";
import * as firebase from "firebase/app";

export default {
  name: "LandingPage",

  data() {
    return {
      headers: [
        { text: "Id", value: "id" },
        { text: "Entity", value: "entity" },
        { text: "Source", value: "source" },
        { text: "Type", value: "type" },
        { text: "Amount", value: "amount" },
        { text: "Date", value: "createdAt" },
        { text: "Category", value: "category" }
      ],
      balance: 0,
      transactions: [],
      categories: [
        { text: "Not Classified", icon: "mdi-help" },
        { text: "Home", icon: "mdi-home" },
        { text: "Salary", icon: "mdi-currency-usd" },
        { text: "Food", icon: "mdi-silverware-fork-knife" },
        { text: "Car", icon: "mdi-car" },
        { text: "Travel", icon: "mdi-airplane" },
        { text: "Cafe", icon: "mdi-coffee" },
        { text: "Bar", icon: "mdi-glass-cocktail" },
        { text: "Sports", icon: "mdi-soccer" },
        { text: "Book", icon: "mdi-book-open" },
        { text: "Health", icon: "mdi-medical-bag" },
        { text: "Shopping", icon: "mdi-cart" },
        { text: "Animal", icon: "mdi-dog" },
        { text: "Arrangements", icon: "mdi-hammer-screwdriver" },
        { text: "School", icon: "mdi-school" }
      ]
    };
  },
  methods: {
    getTransactionsFromAPI() {
      axios
        .get("https://5e5d229a97d2ea00147971d0.mockapi.io/sq/transactions")
        .then(response => {
          this.transactions = response.data;

          this.addTransactionsToFirestore();
        });
    },
    addTransactionsToFirestore() {
      for (let i = 0; i < this.transactions.length; i++) {
        db.collection("transactions")
          .add({
            id: this.transactions[i].id,
            createdAt: firebase.firestore.Timestamp.fromDate(
              new Date(this.transactions[i].createdAt)
            ),
            entity: this.transactions[i].entity,
            amount: Number(this.transactions[i].amount),
            type: this.transactions[i].type,
            source: this.transactions[i].source,
            category: "Not Classified"
          })
          .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
      }
    },
    //* Get All Transactions
    getAllTransactions() {
      db.collection("transactions")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(transanction => {
            this.transactions.push(transanction.data());
            this.balance += transaction.data().amount;
          });
          console.log(this.transactions[0].createdAt.toDate());
        });
    },

    getTypeColor(type) {
      if (type == "credit") return "red";
      if (type == "invoice") return "orange";
      else return "green";
    },

    getCategory(value) {
      //let index = this.categories.indexOf(value);

      let index = -1;
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].text == value) {
          index = i;
        }
      }

      return this.categories[index];
    }
  },
  mounted() {
    this.getAllTransactions();
    //this.getTransactionsFromAPI(); //Usar este método quando for necessário colocar os dados na Base de Dados
  }
};
</script>

<style scoped>
.table {
  margin: 0% 7%;
}
</style>
