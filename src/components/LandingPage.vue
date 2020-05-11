<template>
  <v-container grid-list-md text-xs-center>
    <!-- <h2 class="balance">
      Balance:
      <span class="a" v-if="balance > 0">
        <label class="up">{{ balance }}€</label>
      </span>
      <span class="a" v-if="balance < 0">
        <label class="low">{{ balance }}€</label>
      </span>
    </h2>-->
    <v-data-table :headers="headers" :items="transactions" class="elevation-1 centered table">
        <template #item.amount="{item}">
          <div class="up" v-if="item.type === 'debit'">{{ item.amount }}</div>
          <div class="low" v-else>{{ item.amount }}</div>
        </template>
        <template #item.createdAt="{item}">
          <span>{{ item.createdAt.toDate().toLocaleDateString() + " " + item.createdAt.toDate().toLocaleTimeString() }}</span>
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
        { text: "Amount", value: "amount" },
        { text: "Entity", value: "entity" },
        { text: "Source", value: "source" },
        { text: "Type", value: "type" },
        { text: "Date", value: "createdAt" }
      ],
      balance: "1000",
      transactions: [],
      paypalTransactions: [],
      item: { name: "Filter", url: "/filterPage" }
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
            source: this.transactions[i].source
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
          });
          console.log(this.transactions[0].createdAt.toDate());
        });
    },
    //* Get All Paypal Transactions
    getAllPaypalTransactions() {
      db.collection("transactions")
        .where("source", "==", "paypal")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(transanction => {
            this.paypalTransactions.push(transanction.data());
          });
        });
    },
    getTransactionsByDay() {
      db.collection("transactions")
        .where("source", "==", "paypal")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(transanction => {
            this.paypalTransactions.push(transanction.data());
          });
        });
    }
  },
  mounted() {
    this.getAllTransactions();
    this.getAllPaypalTransactions();
    this.getTransactionsByDay();
    //this.getTransactionsFromAPI(); //Usar este método quando for necessário colocar os dados na Base de Dados
  }
};
</script>

<style scoped>
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

.table {
  width: 900px;
  /* height: 600px; */
}

.icon {
  align-content: center;
}

.a {
  text-align: end;
}

.up {
  color: green;
}

.low {
  color: red;
}

.dot {
  height: 50px;
  width: 50px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.border {
  border-style: solid;
  border-color: black;
}

.balance {
  text-align: end;
}

.data {
  align-items: baseline;
}

.filter-div {
  width: 900px;
  height: 40px;
  position: absolute;
  top: 9%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  background: #1e88e5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter {
  font-size: 30px;
  color: white;
}
</style>
