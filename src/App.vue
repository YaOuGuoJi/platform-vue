<template>
  <div id="app">
    <div class="top-bar">
      <nav>
        <ul>
          <li>
            <router-link to="/" tag="a" exact>Home</router-link>
          </li>
          <li>
            <router-link to="/area/people" tag="a">区域人数</router-link>
          </li>
          <li>
            <router-link to="/area/shopRank" tag="a">分区商铺排名</router-link>
          </li>
          <li>
            <router-link to="/shop/count" tag="a">商户订单统计</router-link>
          </li>
          <li>
            <router-link to="/user/shopInfo" tag="a">商户顾客分析</router-link>
          </li>
          <li>
            <router-link to="/shop/order" tag="a">商户订单列表</router-link>
          </li>
          <li>
            <router-link to="/user/report" tag="a">用户报告</router-link>
          </li>
          <li>
            <router-link to="/user/order" tag="a">用户订单</router-link>
          </li>
        </ul>
      </nav>
    </div>
    <div class="router-div">
      <router-view/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  html, body * {
    box-sizing: border-box;
    font-family: 'Titillium Web', sans-serif;
    -webkit-font-smoothing: antialiased;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
  }

  body {
    background: -webkit-linear-gradient(rgba(246, 247, 249, 0.8), rgba(246, 247, 249, 0.8)), url(https://upload.wikimedia.org/wikipedia/commons/8/8c/K2,_Mount_Godwin_Austen,_Chogori,_Savage_Mountain.jpg) no-repeat center center fixed;
    background-size: cover;
  }

  .top-bar {
    display: block;
  }

  .router-div {
    display: block;
  }

  nav {
    width: 100%;
    height: 48px;
    background: -webkit-linear-gradient(rgba(35, 43, 85, 0.35), rgba(35, 43, 85, 0.55));
    background: #f9fdff;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 0px;
    z-index: 999;
  }

  nav {
    text-align: center;
  }

  nav ul {
    margin: 0;
    list-style: none;
    position: fixed;
    right: 0;
  }

  nav ul li {
    float: left;
    height: 48px;
    line-height: 48px;
    transition: background 0.3s ease;
  }

  nav ul li:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  nav ul li:hover > a {
    color: #fff;
  }

  nav ul li a {
    display: block;
    padding: 0 40px;
    color: #474747;
    text-decoration: none;
    font-size: 16px;
  }

</style>
