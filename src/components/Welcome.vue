<template>
  <div class="welcome">
    <h1>{{ welcome }}</h1>
    <h2>{{ msg }}</h2>
    <img src="../assets/logo.png">
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      welcome: 'Welcome to our vue!',
      msg: '欢迎来到亚欧国际小镇'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  display: block;
}
</style>
