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
    <div style="width: 70%; margin-left: 20%">
      <h2>小镇即时数据展示</h2>
      <div id="total-count">
        <div id="myChart" style="height: 400px;width: 1200px"></div>
        <div id="people" style="height: 400px; width: 1200px"></div>
      </div>
    </div>
  </div>

</template>

<script type="text/javascript">
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
        numberOfPark: null,
        interval2: null,
        interval1: 0,
        intervalPeople: 0,
        option: null,
        peopleOption: null,
      }
    },
    created() {
      this.getFirst();
      this.interval2 = setInterval(this.getFirst, 5000);
      this.getTime();
      this.interval1 = setInterval(this.getTime, 500);
    },
    mounted () {
      this.draw()
      this.drawPeople()
      this.interval1 = setInterval(this.getTime, 1000)
    },
    methods: {
      drawPeople: function () {
        let peopleDiv = echarts.init(document.getElementById('people'))
        this.peopleOption = {
          title: {
            text: '实时人数统计',
            //subtext: timeRegion,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#283b56'
              }
            }
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            name: '时间',
            boundaryGap: false,
            data: (function () {
              let res = []
              let len = 30
              while (len--) {
                res.push(0)
              }
              return res
            })()
          },
          yAxis: {
            name: '人数(千)',
            type: 'value'
          },
          series: [{
            name:'人数',
            data: (function () {
              let res = []
              let len = 30
              while (len--) {
                res.push(0)
              }
              return res
            })(),
            type: 'line',
            areaStyle: {}
          }]
        }
        peopleDiv.setOption(this.peopleOption)
        this.intervalPeople = setInterval(() => {
          this.updatePeople(peopleDiv)
        }, 5000)
      },
      draw: function () {
        let myChart = echarts.init(document.getElementById('myChart'))
        this.option = {
          title: {
            text: '成交额与订单数',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#283b56'
              }
            }
          },
          legend: {
            left: 'left',
            data: ['成交额', '订单数']
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          dataZoom: {
            show: false,
            start: 0,
            end: 100
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: true,
              data: (function () {
                let res = []
                let len = 30
                while (len--) {
                  res.push(0)
                }
                return res
              })(),
            },
            {
              type: 'category',
              boundaryGap: true,
            }
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              name: '订单数',
              min: 0,
              boundaryGap: [0.2, 0.2]
            },
            {
              type: 'value',
              scale: true,
              name: '成交额(w)',
              min: 0,
              boundaryGap: [0.2, 0.2]
            }
          ],
          series: [
            {
              name: '成交额',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: (function () {
                let res = []
                let len = 30
                while (len--) {
                  res.push(0)
                }
                return res
              })()
            },
            {
              name: '订单数',
              type: 'line',
              data: (function () {
                let res = []
                let len = 30
                while (len--) {
                  res.push(0)
                }
                return res
              })()
            }
          ]
        }
        myChart.setOption(this.option)
        this.interval1 = setInterval(() => {
          this.updateOrder(myChart)
        }, 5000)
      },
      //获取实时人数
      updatePeople: function (chart) {
        axios.get('/api/total/people')
          .then((response) => {
            if (response.status !== 200 || !response.data) {
              window.alert('请求失败')
            }
            let peopleData = response.data.data
            let peopleArray = this.peopleOption.series[0].data
            let xDataArray = this.peopleOption.xAxis.data
            peopleArray.shift()
            peopleArray.push((peopleData.totalPeople) / 1000)
            xDataArray.shift()
            xDataArray.push(this.nowTime)
            chart.setOption(this.peopleOption)
          })
      },
      //获取订单和价格
      updateOrder: function (chart) {
        axios.get('/api/total/priceAndFrequency')
          .then((response) => {
            if (response.status !== 200 || !response.data) {
              window.alert('请求失败')
            }
            let priceAndFrequency = response.data.data
            let myDate = new Date()
            let xTime = myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds()
            let priceArray = this.option.series[0].data
            let frequencyArray = this.option.series[1].data
            let xDataArray = this.option.xAxis[0].data
            priceArray.shift()
            priceArray.push((priceAndFrequency.price) / 10000)
            frequencyArray.shift()
            frequencyArray.push(priceAndFrequency.frequency)
            xDataArray.shift()
            xDataArray.push(xTime)
            chart.setOption(this.option)
          })
      },
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
      clearInterval(this.intervalPeople)

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
