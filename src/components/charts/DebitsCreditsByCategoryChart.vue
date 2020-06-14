<template>
    <bar-chart :chart-data="data"></bar-chart>
</template>

<script>
import BarChart from "./bar-chart";

export default {
  components: {
    BarChart
  },
  props: ['categories', 'creditsByCategory', 'debitsByCategory'],
  data() {
      return {
          data: null,
      }
  },
  methods: {
    fillData() {
      this.data = {
        labels: this.categories,
        datasets: [
          {
            label: "Credits",
            backgroundColor: "#43A047",
            data: this.creditsByCategory
          },
          {
            label: "Debits",
            backgroundColor: "#E53935",
            data: this.debitsByCategory
          }
        ]
      };
    }
  },
  mounted() {
      this.fillData();
  }
};
</script>