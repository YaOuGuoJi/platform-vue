<template>
  <div class="all">
    <div class="shop-login">
      <img src="../assets/shopLoginType.jpg">
    </div>
    <div class="user-login">
      <img src="../assets/userLoginType.jpg">
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login"
  }
</script>

<style scoped>
  .all {
    width: 100%;
    height: 100%;
    background: url("../assets/selectLoginType.jpg") no-repeat;
    background-size: cover;
  }
  .shop-login {
    width: 200px;
    height: 20px;
  }
  .shop-login img{
    width: 200px;
    height: 20px;
  }
  .user-login {
    width: 200px;
    height: 20px;
  }
  .user-login img{
    width: 200px;
    height: 20px;
  }
</style>
