<template>
  <div>
    <h2>小镇即时数据展示</h2>
    <div id="total-count">
      <div id="myChart" style="height: 400px;width: 1200px"></div>
      <div id="people" style="height: 400px; width: 1200px"></div>
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
        intervalPeople: 0,
        nowDate: null,
        nowTime: null,
        option: null,
        peopleOption: null,
      }
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
      clearInterval(this.intervalPeople)
    }
  }
</script>
<style scoped>
</style>
