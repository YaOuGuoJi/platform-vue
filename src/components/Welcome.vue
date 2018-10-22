<template>
  <div>
    <div v-show="numberOfCar" id="car">
      <label><font size="4">{{nowDate}}</font></label><br/>
      <label><font size="7">{{nowTime}}</font></label><br/>
      <label><font size="4">剩余车位:<font id="numberOfPark">{{numberOfPark}}</font>,已用车位:<font id="numberOfCar">{{numberOfCar}}</font></font></label>
    </div>
    <div class="welcome">
      <h1 id="w1">{{ welcome }}</h1>
      <h2>{{ msg }}</h2>
      <img src="../assets/logo.png">
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import echarts from 'echarts'

  export default {
    name: 'Welcome',
    data() {
      return {
        welcome: 'Welcome to our vue!',
        msg: '欢迎来到亚欧国际小镇',
        numberOfCar: null,
        nowDate: null,
        nowTime: null,
        numberOfPark: null
      }
    },
    mounted() {
      this.nowTimes(),
        this.nowPark()
    },
    methods: {
      getResponse() {
        axios.get('/api/park/record/number')
          .then((response) => {
            if (response.status !== 200 || !response.data) {
              window.alert('请求失败')
            }
            this.dataInvoker(response.data)
          })
      },
      dataInvoker(response) {
        if (!response.success || response.code !== 200) {
          window.alert(response.message)
          return
        }
        let numberOfCars = response.data
        this.numberOfCar = numberOfCars
        let numberOfParking = 321
        let numberOfParks = numberOfParking - numberOfCars
        this.numberOfPark = numberOfParks
      },
      getTime() {
        let dateObj = new Date();

        let year = dateObj.getFullYear();//年
        let month = dateObj.getMonth() + 1;//月  (注意：月份+1)
        let date = dateObj.getDate();//日
        let day = dateObj.getDay();
        let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        let week = weeks[day];//根据day值，获取星期数组中的星期数。
        let hours = dateObj.getHours();//小时
        let minutes = dateObj.getMinutes();//分钟
        let seconds = dateObj.getSeconds();//秒
        if (month < 10) {
          month = "0" + month;
        }
        if (date < 10) {
          date = "0" + date;
        }
        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        this.nowDate = year + "年" + month + "月" + date + "日" + " " + week;
        this.nowTime = hours + ":" + minutes
      },
      nowTimes() {
        this.getTime();
        setInterval(this.nowTimes, 500);
      },
      nowPark() {
        this.getResponse();
        setInterval(this.nowPark, 5000)
      }
    }

  }
</script>

height: 300px;
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #car {
    width: 200px;
    height: 50px;
    float: right;
  }

  #numberOfCar {
    color: #ff1d2b;
  }

  #numberOfPark {
    color: #ff3533;
  }

  #w1 {
    padding-left: 200px;
  }

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
