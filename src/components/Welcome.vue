<template>
  <div>
    <div v-show="numberOfCar" id="car">
      <label><span class="no1">{{nowDate}}</span></label><br/>
      <label><span class="no2">{{nowTime}}</span></label><br/>
      <label><span class="no1">剩余车位:<span id="numberOfPark">{{numberOfPark}}</span>,已用车位:<span id="numberOfCar">{{numberOfCar}}</span></span></label>
    </div>
    <div class="welcome">
      <h1 id="w1">{{ welcome }}</h1>
      <h2 id="w2">{{ msg }}</h2>
    </div>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'

  export default {
    name: 'Welcome',
    data() {
      return {
        welcome: 'Welcome to our vue!',
        msg: '欢迎来到亚欧国际小镇',
        numberOfCar: null,
        nowDate: null,
        nowTime: null,
        numberOfPark: null,
        interval1: null,
        interval2: null
      }
    },
    created() {
      this.getFirst();
      this.interval2 = setInterval(this.getFirst, 5000);
      this.getTime();
      this.interval1 = setInterval(this.getTime, 500);
    },
    methods: {
      getFirst() {
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
      }
    },
    beforeDestroy() {
      clearInterval(this.interval1);
      clearInterval(this.interval2);
    }
  }


</script>

height: 300px;
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #car {
    width: 25%;
    height: 10%;
    float: right;
  }

  #numberOfCar {
    color: #ff1d2b;
  }

  #numberOfPark {
    color: #ff3533;
  }

  #w1 {
    padding-left: 30%;
  }

  #w2 {
    padding-left: 30%;
  }

  .no1 {
    font-size: 110%;
  }

  .no2 {
    font-size: 300%;
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
