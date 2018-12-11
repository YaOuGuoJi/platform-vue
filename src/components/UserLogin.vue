<template>
  <div class="body_div">
    <div id="phone_input">
      <i class="icon-phone"></i>
      <input type="text" class="user" v-model="phoneNum"/>
    </div>
    <div id="code_input">
      <i class="icon-code"></i>
      <input type="text" class="user" id="codes" v-model="code" @blur="isInput()"/>
      <i id="input_button">
        <button id="button_i" @click="verifyCode()">点击获取验证码</button>
      </i>
    </div>
    <button id="button_style" disabled="true" @click="login()">Log In</button>
  </div>
</template>

<script>
  import axios from 'axios'
  import $ from 'jquery'
  export default {
    data() {
      return{
        phoneNum: '',
        code: ''
      }
    },
    methods: {
      verifyCode: function () {
        axios.get('/api/user/verifyCode',{
          params: {
            phoneNum: this.phoneNum
          }
        }).then(response =>{
          if (response.data.code !== 200 || !response.data.data) {
            alert('获取验证码失败！请稍后再试')
          }
        })
      },
      login: function () {
        axios.post('/api/user/login', {
          params: {
            phoneNum: this.phoneNum,
            code: this.code
          }
        }).then(response => {
          if (response.code !== 200 || !response.data) {
            alert(response.message)
            this.$router.push({path: '/user/login'})
          } else {
            this.$router.push({path: '/'})
          }
        })
      },
      isInput(){
        let input = $("#codes")
        if (input.value !== ''){
          $("#button_style").disabled = false;
        }
      }
    }


  }
</script>

<style scoped>

  .body_div {
    width: 100%;
    height: 800px;
    background: url("../assets/userLogin.jpg") no-repeat;
    background-size: cover;
    margin-top: -5%;
  }
  #phone_input {
    padding-top: 27%;
    padding-left: 5%;
    width: 90%;
    height: 20%;
  }
  .user{
    padding-left: 3%;
    background-color: #cccccc;
    width: 20%;
    height: 20%;
    border: none;
  }
  .icon-phone{
    position: absolute;
    left: 0;
    background: url("../assets/phone.png") no-repeat;
    background-size: cover;
    width: 20px;
    height: 20px;
    margin-left: 41%;
    margin-top: 0.3%;
  }

  #code_input {
    margin-top: -4.5%;
    padding-left: 5%;
    width: 90%;
    height: 20%;
  }

  .icon-code{
    position: absolute;
    left: 0;
    background: url("../assets/code.png") no-repeat;
    background-size: cover;
    width: 20px;
    height: 20px;
    margin-left: 41%;
    margin-top: 0.3%;
  }

  #button_style {
    width: 20%;
    height: 4%;
    background-color: crimson;
    /*opacity:0.5;*/
    border: none;
    color: #efefef;
  }

  #input_button {
    position: absolute;
    left: 0;
    width: 6.5%;
    height: 4%;
    margin-left: 54.35%;
    border: 1px;
  }

  #button_i {
    border: none;
    height: 100%;
  }

</style>
