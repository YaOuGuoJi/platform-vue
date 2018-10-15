<template>
  <div id="app">
    <div class="left-div">
      <ul class="left-bar">
        <li><router-link to="/" tag="a">首页</router-link></li>
        <li><router-link to="/area/people" tag="a">区域人数</router-link></li>
        <li><router-link to="/user/order" tag="a">用户订单</router-link></li>
      </ul>
    </div>
    <div class="right-div">
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

.left-div {
  float: left;
  display: inline-block;
}

.right-div {
  display: inline-block;
  vertical-align: top;
}

a:link,a:visited {
  display:block;
  font-weight:bold;
  color:#FFFFFF;
  background-color:#bebebe;
  width:120px;
  text-align:center;
  padding:20px;
  text-decoration:none;
  text-transform:uppercase;
}
a:hover,a:active {
  background-color:#cc0000;
}

li {
  list-style: none
}
</style>
