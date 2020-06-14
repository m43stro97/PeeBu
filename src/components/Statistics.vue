<template>
  <div class="container">
    <v-toolbar flat color="white">
      <v-toolbar-title>Statistics</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-col cols="2">
        <v-row class="pa-6">
          <v-menu
            v-model="menuInitialDate"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field v-model="initialDate" label="From" readonly v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="initialDate" @input="menuInitialDate = false"></v-date-picker>
          </v-menu>
        </v-row>
      </v-col>

      <v-col cols="2">
        <v-row class="pa-6">
          <v-menu
            v-model="menuFinalDate"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field v-model="finalDate" label="To" readonly v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="finalDate" @input="menuFinalDate = false"></v-date-picker>
          </v-menu>
        </v-row>
      </v-col>
      <v-btn color="primary" tile v-on:click="filter">Show/Reload Charts</v-btn>
    </v-toolbar>

    <debits-credits-by-category
      v-if="loaded"
      :categories="categories"
      :creditsByCategory="creditsByCategory"
      :debitsByCategory="debitsByCategory"
    />

    <top-five-month-expenses
      v-if="loaded && initialDate"
      :topFiveMonthExpenses="topFiveMonthExpenses"
      :monthName="monthName"
    />
  </div>
</template>

<script>
import db from "../services/firebase";

export default {
  data() {
    return {
      categories: [],
      transactions: [],
      creditsByCategory: [],
      debitsByCategory: [],
      menuInitialDate: "",
      initialDate: "",
      menuFinalDate: "",
      finalDate: "",
      loaded: false,
      topFiveMonthExpenses: [],
      monthNames: ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"],
      monthName: ""
    };
  },
  methods: {
    async getAllTransactions() {
      await db
        .collection("transactions")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(transaction => {
            let dateValue = transaction.data().createdAt.toDate();
            if (this.initialDate && this.finalDate) {
              if (dateValue >= new Date(this.initialDate) && dateValue <= new Date(this.finalDate)) {
                this.transactions.push(transaction.data());
              }
            } else {
              this.transactions.push(transaction.data());
            }
          });
        });

      //* Get categories of transactions (not repetitive)
      const allCategories = this.transactions.map(
        transaction => transaction.category
      );

      this.categories = allCategories.filter(function(i, y) {
        return allCategories.indexOf(i) === y;
      });

      this.getTransactionsByCategory();

      //* Get Top Five Month Expenses
      console.log(this.initialDate);
      if(this.initialDate != "") {
        let month = new Date(this.initialDate).getMonth();
        let year =  new Date(this.initialDate).getFullYear();
        this.topFiveMonthExpenses = this.getTopFiveMonthExpenses(month+1, year);
        this.monthName = this.monthNames[month];
      }
    },

    //* Get array with debits/credits by category
    getTransactionsByCategory() {
      this.creditsByCategory = [];
      this.debitsByCategory = [];

      let debit = 0;
      let credit = 0;

      for (let i = 0; i < this.categories.length; i++) {
        debit = 0;
        credit = 0;

        for (let y = 0; y < this.transactions.length; y++) {
          if (this.categories[i] == this.transactions[y].category) {
            if (this.transactions[y].type == "credit") {
              credit += this.transactions[y].amount;
            } else {
              debit += this.transactions[y].amount;
            }
          }
        }

        this.creditsByCategory.push(credit);
        this.debitsByCategory.push(debit);
      }
    },

    //* Get top 5 expenses of a given month/year
    getTopFiveMonthExpenses(month, year) {
      let transactionMonth = new Date();
      let transactionYear = new Date();
      let transactionsOfMonth = [];

      for (let i = 0; i < this.transactions.length; i++) {
        transactionMonth =
          this.transactions[i].createdAt.toDate().getMonth() + 1;
        transactionYear = this.transactions[i].createdAt.toDate().getFullYear();

        if (transactionMonth == month && transactionYear == year) {
          transactionsOfMonth.push(this.transactions[i].amount);
        }
      }

      return transactionsOfMonth.sort((a, b) => b - a).slice(0, 5);
    },
    async filter() {
      this.loaded = false;
      this.transactions = [];
      await this.getAllTransactions();
      this.loaded = true;
      //TODO: RELOAD THE CHAR DATA
    }
  },
  mounted() {}
};
</script>