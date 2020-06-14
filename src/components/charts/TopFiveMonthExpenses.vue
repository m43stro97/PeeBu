<template>
    <bar-chart :chart-data="data"></bar-chart>
</template>

<script>
import BarChart from "./bar-chart";

export default {
  components: {
    BarChart
  },
  props: ['topFiveMonthExpenses', 'monthName'],
  data() {
      return {
          data: null,
      }
  },
  methods: {
    fillData() {
      this.data = {
        labels: [1,2,3,4,5],
        datasets: [
          {
            label: "Top Five Expenses of " + this.monthName,
            backgroundColor: "#000000",
            data: this.topFiveMonthExpenses
          },
        ]
      };
    }
  },
  mounted() {
      this.fillData();
  }
};
</script>