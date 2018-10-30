<template>
  <div>
    <h2>{{ nowDate }}</h2>
    <h3>{{nowTime}}</h3>
    <h3>小镇即时数据展示</h3>
    <div id="total-count">
      <div id="myChart" style="height: 400px;width: 800px"></div>
      <div id="people" style="height: 300px; width: 600px"></div>
      <div id="priceAndOrder" style="height: 300px;width: 600px"></div>
    </div>
  </div>

</template>

<script>
  import axios from 'axios'
  import echarts from 'echarts'

  export default {
    name: 'ActualData',
    data () {
      return {
        interval1: 0,

        nowDate: null,
        nowTime: null,
        option: null,
        peopleOption:null,
      }
    },
    mounted () {
      this.draw()
      this.drawPeople()
      this.interval1 = setInterval(this.getTime, 1000)
    },
    methods: {
      drawPeople:function(){
        let peopleDiv = echarts.init(document.getElementById('people'))
        this.peopleOption = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            type: 'line',
            areaStyle: {}
          }]
        }
        peopleDiv.setOption(this.drawPeople)
        this.interval1 = setInterval(() => {
          this.updatePeople(peopleDiv)
        }, 2000)
      },
      draw: function () {
        let myChart = echarts.init(document.getElementById('myChart'))
        this.option = {
          title: {
            text: '成交额与订单数',
           // left: 'center'
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
                let now = new Date()
                let res = []
                let len = 10
                while (len--) {
                  res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''))
                  now = new Date(now - 2000)
                }
                return res
              })()
            },
            {
              type: 'category',
              boundaryGap: true,
              data: (function () {
                let res = []
                let len = 10
                while (len--) {
                  res.push(10 - len - 1)
                }
                return res
              })()
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
              name: '成交额',
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
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            {
              name: '订单数',
              type: 'line',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
          ]
        }
        myChart.setOption(this.option)
        this.interval1 = setInterval(() => {
          this.updateOrder(myChart)
        }, 2100)
      },
      //获取实时人数
      updatePeople: function (chart) {
        axios.get('/api/total/people')
          .then((response) => {
            if (response.status !== 200 || !response.data) {
              window.alert('请求失败')
            }
            let peopleData = response.data.data
            console.log(peopleData)
            let axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
            let peopleArray = this.option.series[0].data
            let xDataArray = this.option.xAxis[0].data
            peopleArray.shift()
            peopleArray.push(peopleData.people)
            xDataArray.shift()
            xDataArray.push(axisData)
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
            console.log(priceAndFrequency)
            let axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
            let priceArray = this.option.series[0].data
            let frequencyArray = this.option.series[1].data
            let xDataArray = this.option.xAxis[0].data
            priceArray.shift()
            priceArray.push(priceAndFrequency.price)
            frequencyArray.shift()
            frequencyArray.push(priceAndFrequency.frequency)
            xDataArray.shift()
            xDataArray.push(axisData)
            chart.setOption(this.option)
          })
      },

      getTime () {
        let dateObj = new Date()
        let year = dateObj.getFullYear()//年
        let month = dateObj.getMonth() + 1//月  (注意：月份+1)
        let date = dateObj.getDate()//日
        let day = dateObj.getDay()
        let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        let week = weeks[day]//根据day值，获取星期数组中的星期数。
        let hours = dateObj.getHours()//小时
        let minutes = dateObj.getMinutes()//分钟
        let seconds = dateObj.getSeconds()//秒
        if (month < 10) {
          month = '0' + month
        }
        if (date < 10) {
          date = '0' + date
        }
        if (hours < 10) {
          hours = '0' + hours
        }
        if (minutes < 10) {
          minutes = '0' + minutes
        }
        if (seconds < 10) {
          seconds = '0' + seconds
        }
        this.nowDate = year + '年' + month + '月' + date + '日' + ' ' + week
        this.nowTime = hours + ':' + minutes + ':' + seconds
      }

    },
    beforeDestroy () {
      clearInterval(this.interval1)
    }
  }
</script>

<style scoped>

</style>
