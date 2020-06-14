<template>
  <v-data-table
    :headers="headers"
    :items="transactions"
    item-key="id"
    sort-by="createdAt"
    :sort-desc="true"
    :search="entitySourceFilter"
    class="elevation-1 pa-6 table"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Home</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn class="ma-2" tile outlined :color="getBalanceColor(balance)">
          <v-icon left>mdi-cash-usd-outline</v-icon>
          Balance: {{ Math.round(balance * 100) / 100 }} €
        </v-btn>
      </v-toolbar>
      <!-- Edit Classification Dialog -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Classification of Transaction {{transaction.id}}</span>
          </v-card-title>

          <v-list dense>
            <v-list-item-group v-model="categorySelected" color="primary">
              <v-list-item v-for="(category, i) in categories" :key="i">
                <v-list-item-icon>
                  <v-icon v-text="category.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="category.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Filters -->
      <v-container fluid>
        <v-row>
          <v-col cols="4">
            <v-row class="pa-6">
              <!-- Filter for entity/source-->
              <v-text-field v-model="entitySourceFilter" type="text" label="Entity/Source Filter"></v-text-field>
            </v-row>
          </v-col>

          <v-col cols="2">
            <v-row class="pa-6">
              <!-- Filter for type -->
              <v-select :items="typeList" v-model="typeFilter" label="Type Filter"></v-select>
            </v-row>
          </v-col>

          <v-col cols="1">
            <v-row class="pa-6">
              <!-- Signal to filter by amount -->
              <v-select :items="signalList" v-model="signalAmountFilter" label="Signal"></v-select>
            </v-row>
          </v-col>

          <v-col cols="1">
            <v-row class="pa-6">
              <!-- Filter for amount-->
              <v-text-field v-model="amoutFilter" type="text" label="Amount"></v-text-field>
            </v-row>
          </v-col>

          <!-- Filter for date -->
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
        </v-row>

        <!-- Filter for Category -->
        <v-row>
          <v-combobox v-model="categoryFilterSelect" :items="categories" label="Category">
            <template slot="item" slot-scope="data">
              <v-icon>{{ data.item.icon }}</v-icon>
              <span class="cb-item">{{ data.item.text }}</span>
            </template>
          </v-combobox>
        </v-row>
      </v-container>
    </template>

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

    <template #item.actions="{item}">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
    </template>
  </v-data-table>
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
        { text: "Type", value: "type", filter: this.typeFilterMethod },
        { text: "Amount", value: "amount", filter: this.amountFilterMethod },
        { text: "Date", value: "createdAt", filter: this.dateFilterMethod },
        {
          text: "Category",
          value: "category",
          filter: this.categoryFilterMethod
        },
        { text: "Actions", value: "actions", sortable: false }
      ],
      balance: 0,
      transactions: [],
      transaction: {
        id: "",
        category: ""
      },
      categorySelected: "",
      editedIndex: -1,

      //* Filter Variables
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
      ],
      categoryFilterSelect: "",
      typeList: [
        { text: "All" },
        { text: "Debit" },
        { text: "Credit" },
        { text: "Invoice" }
      ],
      signalList: [{ text: "=" }, { text: ">" }, { text: "<" }],
      entitySourceFilter: "",
      typeFilter: "",
      signalAmountFilter: "",
      amoutFilter: "",
      menuInitialDate: "",
      initialDate: "",
      menuFinalDate: "",
      finalDate: "",
      dialog: false
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
          querySnapshot.forEach(transaction => {
            this.transactions.push(transaction.data());

            if(transaction.data().type == 'credit') {
              this.balance += transaction.data().amount;
            } else {
              this.balance -= transaction.data().amount;
            }
          });
        });
    },

    getTypeColor(type) {
      if (type == "debit") return "red";
      if (type == "invoice") return "orange";
      else return "green";
    },

    getBalanceColor(balance) {
      if (balance < 0) return "red darken-4";
      else return "green darken-1"
    },

    editItem(item) {
      this.editedIndex = this.transactions.indexOf(item);
      this.transaction = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.categorySelected = "";
    },

    save() {
      if (this.categories[this.categorySelected]) {
        this.transaction.category = this.categories[this.categorySelected].text;
        Object.assign(this.transactions[this.editedIndex], this.transaction);

        //* Save in Firestore
        this.saveCategoryFirestore(this.categories[this.categorySelected]);
      }
      this.close();
    },

    saveCategoryFirestore(category) {
      db.collection("transactions")
        .where("id", "==", this.transaction.id)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            db.collection("transactions")
              .doc(doc.id)
              .update({ category: category.text });
          });
        });
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
    },

    //* Filter for Type
    typeFilterMethod(value) {
      if (!this.typeFilter) {
        return true;
      }

      if (this.typeFilter == "All") {
        return value;
      }

      return value.toLowerCase().includes(this.typeFilter.toLowerCase());
    },

    //* Filter for Amount
    amountFilterMethod(value) {
      if (!this.amoutFilter || !this.signalAmountFilter) {
        return true;
      }

      if (this.signalAmountFilter == "=") {
        return value == this.amoutFilter;
      }

      if (this.signalAmountFilter == ">") {
        return value >= this.amoutFilter;
      }

      if (this.signalAmountFilter == "<") {
        return value <= this.amoutFilter;
      }
    },

    //* Filter for Date
    dateFilterMethod(value) {
      if (!this.initialDate || !this.finalDate) {
        return true;
      }

      return (
        value.toDate() >= new Date(this.initialDate) &&
        value.toDate() <= new Date(this.finalDate)
      );
    },

    //* Filter for Category
    categoryFilterMethod(value) {
      if (!this.categoryFilterSelect) {
        return true;
      }

      return value
        .toLowerCase()
        .includes(this.categoryFilterSelect.text.toLowerCase());
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
