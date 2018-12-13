<template>
  <div id="background" class="all">
    <div class="login-frame">
    </div>
    <div class="text">
      <span class="text-content">亚欧国际小镇</span><br/>
      <span class="text-content-sub">用户登录</span>
    </div>
    <div class="account">
      <img src="../../assets/phone.png">
      <input class="input-account" v-model="phoneNum"/>
    </div>
    <div class="verify-code">
      <img src="../../assets/code.png">
      <input class="input-verify-code" v-model="code"/>
      <button class="get-verify-code" @click="getVerifyCode">
        <span class="verify-code-button">获取验证码</span>
      </button>
    </div>
    <div class="submit" @click="userLogin">
      <button class="login-button">
        <span class="login-span">Login</span>
      </button>
    </div>
  </div>
</template>

<script>
  import {service} from "../../js/api";

  export default {
    data() {
      return {
        phoneNum: '',
        code: ''
      }
    },
    methods: {
      getVerifyCode: function () {
        if (this.phoneNum === null || this.phoneNum === '') {
          return
        }
        service('get', '/user/verifyCode', {
          phoneNum: this.phoneNum
        }).then(response => {
          if (response.code !== 200) {
            alert('获取验证码失败，请稍后再试')
          }
        })
      },
      userLogin: function () {
        if (this.phoneNum === null || this.phoneNum === '' || this.code === null || this.code === '') {
          return
        }
        service('post', '/user/login', {
          phoneNum: this.phoneNum,
          code: this.code
        }).then(response => {
          if (response.code !== 200) {
            alert('登录失败，请稍后再试')
          } else {
            this.$router.push('/user/welcome')
          }
        })
      }
    }
  }
</script>

<style scoped>
  .all {
    width: 100%;
    height: 938px;
    background: url("../../assets/loginBackground.jpg") no-repeat;
    background-size: 100% 65%;
    margin: 0 auto;
  }

  #background {
    animation: backgroundSlideUp 2s;
    -moz-animation: backgroundSlideUp 2s;
    -webkit-animation: backgroundSlideUp 2s;
    -o-animation: backgroundSlideUp 2s;
  }

  @keyframes backgroundSlideUp {
    from {
      background-size: 100% 100%;
    }
    to {
      background-size: 100% 65%;
    }
  }

  @-moz-keyframes backgroundSlideUp {
    from {
      background-size: 100% 100%;
    }
    to {
      background-size: 100% 65%;
    }
  }

  @-webkit-keyframes backgroundSlideUp {
    from {
      background-size: 100% 100%;
    }
    to {
      background-size: 100% 65%;
    }
  }

  @-o-keyframes backgroundSlideUp {
    from {
      background-size: 100% 100%;
    }
    to {
      background-size: 100% 65%;
    }
  }

  .login-frame {
    background: url("../../assets/inputBackground.png");
    position: absolute;
    width: 25%;
    height: 40%;
    top: 30%;
    left: 37.5%;
    box-shadow: 10px 10px 10px #a5a5a5;
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

  .account {
    position: absolute;
    background-color: #9f9f9f;
    width: 15%;
    height: 4%;
    display: inline;
    top: 50%;
    left: 43%;
  }

  .account img {
    float: left;
    padding-left: 5px;
    padding-top: 3px;
    width: 10%;
    height: 80%;
  }

  .account input {
    float: left;
    width: 80%;
    height: 85%;
    background-color: transparent;
    border: none;
  }

  .verify-code {
    position: absolute;
    background-color: #9f9f9f;
    width: 15%;
    height: 4%;
    display: inline;
    top: 55%;
    left: 43%;
  }

  .verify-code img {
    float: left;
    padding-left: 5px;
    padding-top: 3px;
    width: 10%;
    height: 80%;
  }

  .verify-code input {
    float: left;
    width: 60%;
    height: 80%;
    background-color: transparent;
    border: none;
  }

  .get-verify-code {
    float: left;
    margin-top: 3px;
    margin-right: 1px;
    width: 27%;
    height: 80%;
  }

  .verify-code-button {
    width: 100%;
    height: 100%;
    font-size: smaller;
  }

  .submit {
    position: absolute;
    background-color: #ff2f36;
    width: 15%;
    height: 4%;
    top: 63%;
    left: 43%;
  }

  .login-button {
    background-color: transparent;
    border: none;
    width: 100%;
    height: 100%;
  }

  .login-span {
    font-family: "Microsoft Sans Serif";
    color: white;
    width: 100%;
    height: 100%;
    font-size: larger;
  }

</style>
