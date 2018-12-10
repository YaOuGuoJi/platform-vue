<template>
  <div class="body_div">
    <div id="phone_input">
      <i class="icon-phone"></i>
      <input type="text" class="user" v-model="phoneNo"/>
    </div>
    <div id="code_input">
      <i class="icon-code"></i>
      <input type="text" class="user" id="codes" v-model="code" @blur="isInput()"/>
      <i id="input_button"><button id="button_i" @click="verifyCode()">点击获取验证码</button></i>
    </div>
    <button id="button_style" disabled="true" @click="login()">Log In</button>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data(){
      return{
        phoneNo: '',
        code: ''
      }
    },
    methods: {
      verifyCode(){
        console.log("loading.......");
        axios.get('/api/shop/verifyCode', {
          params: {
            phoneNo: this.phoneNo
          }
        }).then(response => {
          console.log(this.phoneNo);
          if (response.status !== 200 || !response.data) {
            window.alert('获取验证码失败!')
          }
        })
      },
      login() {
        axios.get('/api/shop/login', {
          params: {
            code: this.code,
            phoneNo: this.phoneNo
          }
        }).then(response => {
          if (response.status !== 200 || !response.data) {
            window.alert('登录失败!');
            return
          }
          window.location.href="/Welcome"
        })
      },
      isInput(){
        let input = document.getElementById('codes');
        if (input.value !== ''){
          document.getElementById('button_style').disabled = false;
        }
      }
    }
  }
</script>
<style>
  .body_div {
    width: 100%;
    height: 800px;
    background: url("../assets/login.jpg") no-repeat;
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
    /*height: 32px;*/
    height: 100%;
  }
</style>
