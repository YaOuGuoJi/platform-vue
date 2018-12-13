<template>
  <div id="background" class="all">
    <div class="login-frame">
    </div>
    <div class="text">
      <span class="text-content">亚欧国际小镇</span><br/>
      <span class="text-content-sub">大数据中心</span>
    </div>
    <div class="shop-login" @click="goShopLogin">
      <img src="../assets/shopLoginType.jpg">
    </div>
    <div class="user-login" @click="goUserLogin">
      <img src="../assets/userLoginType.jpg">
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      goShopLogin: function () {
        this.$router.push('/shop/login')
      },
      goUserLogin: function () {
        this.$router.push('/user/login')
      }
    }
  }
</script>

<style scoped>
  .all {
    width: 100%;
    height: 938px;
    background: url("../assets/loginBackground.jpg") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
  }

  .login-frame {
    background: url("../assets/inputBackground.png");
    position: absolute;
    width: 25%;
    height: 40%;
    top: 30%;
    left: 37.5%;
    box-shadow: 10px 10px 5px #a5a5a5;
  }

  .text {
    position: absolute;
    left: 46%;
    top: 38%;
  }

  .text-content {
    font-family: "Microsoft Sans Serif";
    font-size: x-large;
    color: white;
    letter-spacing: 3px;
    width: 100%;
    height: 100%;
  }

  .text-content-sub {
    font-family: "Microsoft Sans Serif";
    font-size: larger;
    color: white;
    letter-spacing: 3px;
    width: 100%;
    height: 100%;
  }

  .shop-login {
    position: absolute;
    left: 45%;
    top: 55%;
    width: 10.5%;
    height: 3%;
  }

  .shop-login img {
    width: 100%;
    height: 100%;
  }

  .user-login {
    position: absolute;
    left: 45%;
    top: 48%;
    width: 10.5%;
    height: 3%;
  }

  .user-login img {
    width: 100%;
    height: 100%;
  }
</style>
