<template>
  <div id="shopApp">
    <div class="top-bar">
      <nav>
        <ul>
          <li>
            <router-link to="/shop/welcome" tag="a" exact>Home</router-link>
          </li>
          <li>
            <router-link to="/shop/area/people" tag="a">区域人数</router-link>
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
            <a style="color: red" @click="logout">退出登录</a>
          </li>
        </ul>
      </nav>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import {service} from "../js/api";

  export default {
    name: "ShopIndex",
    methods: {
      logout() {
        service('post', '/shop/logout', {}).then(response => {
          if (response === undefined) {
            return
          }
          if (response.code !== 200) {
            alert(response.message);
          }
          this.$router.push("/")
        })
      }
    }
  }
</script>

<style scoped>
  #shopApp {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    position: relative;
  }

  body {
    margin: 0;
    padding: 0;
    background: linear-gradient(45deg, transparent 0%, transparent 57%, #ffffff 100%) no-repeat,
    linear-gradient(-45deg, #8f5611 0%, #9bd7ff 0.3%, #dbd55c 112%, transparent 11%) no-repeat,
    linear-gradient(-90deg, #a19b2e 100%, #a16226 65%, transparent 20%) no-repeat;
    background-size: cover;
  }


  body > div {
    width: 100%;
    height: 100%;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAG0lEQVQIW2NkYGCQBOLnQAwGjDAGNgGwSgwVAE+2AgXahLM7AAAAAElFTkSuQmCC) no-repeat;
    background-size: cover;
  }

  .top-bar {
    display: block;
  }

  nav {
    width: 100%;
    height: 48px;
    background: -webkit-linear-gradient(rgba(35, 43, 85, 0.35), rgba(35, 43, 85, 0.55));
    background: #f9fdff;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 2px 7px rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
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

  a:hover, a:active {
    background-color: #708296;
  }

  a.active {
    background-color: #2e768f;
  }
</style>
