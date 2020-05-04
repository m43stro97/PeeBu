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
export default {
  name: 'LandingPage',

 

  data: () => ({
    balance: '1000'
  }),
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
