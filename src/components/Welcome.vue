<template>
  <div>
    <div id="time" onload="this.getTime()">
      <p>{{nowTime}}</p>
    </div>
    <div v-show="numberOfCar" id="car">
    </div>
    <div id="welcome">
      <h1>{{ welcome }}</h1>
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
        nowTime:null,
      }
    },
    mounted() {
      this.nowTimes(),
        this.nowPark()
    },
    methods: {
      getResponse(){
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
        this.numberOfCar = response.data
        let numberOfPark = 321
        let name = '总车位:' + numberOfPark + ',剩车位:' + (numberOfPark - this.numberOfCar)
        let picture = echarts.init(document.getElementById('car'))
        picture.setOption(
          {
            title: {
              text: name,
              x: 'center',
              y: 'bottom'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
              {
                name: '数量',
                type: 'pie',
                radius: '60%',
                center: ['50%', '50%'],
                data: [
                  {value: this.numberOfCar, name: '已停车辆'},
                  {value: numberOfPark - this.numberOfCar, name: '剩余车位'}
                ]
              }
            ]
          })
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
        this.nowTime=year + "年" + month + "月" + date + "日" + hours + ":" + minutes + ":" + seconds+" "+ week;
      },
      nowTimes(){
        this.getTime();
        setInterval(this.nowTimes,1000);
      },
      nowPark(){
        this.getResponse();
        setInterval(this.nowPark,5000)
      }
    }

  }
</script>

height: 300px;
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #car {
    width: 250px;
    height: 250px;
    float: right;
  }

  #time {
    width: 250px;
    height: 250px;
    float: left;
  }

  #welcome {
    align-items: center;
    float: bottom;
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
