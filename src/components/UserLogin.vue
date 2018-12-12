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
    <button id="button_style" disabled="true" @click="login()">Login</button>
  </div>
</template>

<script>
  import axios from 'axios'
  import {service} from "../js/api";

  export default {
    data() {
      return {
        phoneNum: '',
        code: ''
      }
    },
    methods: {
      verifyCode: function () {
        axios.get('/api/user/verifyCode', {
          params: {
            phoneNum: this.phoneNum
          }
        }).then(response => {
          if (response.data.code !== 200 || !response.data.data) {
            alert('获取验证码失败！请稍后再试')
          }
        })
      },
      login: function () {
        service('post', '/user/login', {
          phoneNum: this.phoneNum,
          code: this.code
        }).then(response => {
          if (response.code !== 200) {
            alert('登录失败，请稍后再试')
          } else {
            this.$router.push('/')
          }
        })
      }
      ,
      isInput() {
        let input = document.getElementById('codes');
        if (input.value !== '') {
          document.getElementById('button_style').disabled = false;
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

  .user {
    padding-left: 3%;
    background-color: #cccccc;
    width: 20%;
    height: 20%;
    border: none;
  }

  .icon-phone {
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

  .icon-code {
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
