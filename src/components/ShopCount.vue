<template>
  <div class="shop-count">
    <template>
      <label>请输入ShopId: </label>
      <input v-model="shopId"
             placeholder="在这里单击输入..."/><br>
      <h4>请选择日期：
        <select v-model="year" name="sel1" id="sel1" :style="{width:'100px',height:'25px' }">
          <option value="year">年份</option>
        </select>
        <select v-model="month" name="sel2" id="sel2" :style="{width:'100px',height:'25px' }">
          <option value="">月份</option>
        </select>
        <template>
          <button v-on:click="search()">查询</button>
        </template>
      </h4>
    </template>
    <h1>商户Id: {{ shopId }}</h1>
      <div>
      <div id="finished-list" v-show="finished">
        <div id="finished-order" :style="{ width: '400px', height: '300px',float: 'left',marginLeft:'50px'}"></div>
        <div id="finished-price" :style="{ width: '400px', height: '300px',float: 'right',marginRight: '50px'}"></div>
      </div>
      <div id="canceledList" v-show="canceled">
        <div id="canceled-order" :style="{ width: '400px', height: '300px',float:'left',marginLeft:'50px'}" ></div>
        <div id="canceled-price" :style="{ width: '400px', height: '300px',float:'right',marginRight: '50px'}" ></div>
      </div>
      </div>
      <div id="byProductList" v-show="byProductType">
      <div id="byProductType-order" :style="{ width: '500px', height: '300px',float:'left'}"></div>
      <div id="byProductType-price" :style="{ width: '500px', height: '300px',float:'right'}"></div>
    </div>

      <div>
        <div id="byHour-list" v-show="byHour">
          <div id="byHour-order" :style="{ width: '1000px', height: '300px',float:'right'}"></div>
        </div>
        <div id="byHour-list2" v-show="byHour">
          <div id="byHour-price" :style="{ width: '1000px', height: '300px',float:'right'}"></div>
        </div>
        <div id="byMonth-ist" v-show="byMonth">
          <div id="byMonth-order" :style="{ width: '1000px', height: '300px',float:'left'}"></div>
        </div>
        <div id="byMonth-ist1" v-show="byMonth">
          <div id="byMonth-price" :style="{ width: '1000px', height: '300px',float:'right'}"></div>
        </div>
        <div id="byDay-list" v-show="byDay">
          <div id="byDay-order" :style="{ width: '1000px', height: '300px',float:'left'}"></div>
        </div>
        <div id="byDay-list1" v-show="byDay">
          <div id="byDay-price" :style="{ width: '1000px', height: '300px',float:'right'}"></div>
        </div>
      </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import echarts from 'echarts'

  export default {
    name: 'ShopCount',
    data () {
      return {
        shopId: 100001,
        year: null,
        month: null,
        finished: null,
        canceled: null,
        byProductType: null,
        byHour: null,
        byMonth: null,
        byDay: null,
        orderDataList: []
      }
    },
    /* created: function() {
       this.search();
     },*/
    mounted: function () {
      // 生命周期函数， 有好几个 执行的顺序都不一样，可以根据场景 选择不同的生命周期函数 这块一般是初始化数据的地方
      //生成2000年-2100年
      for (let i = 2000; i <= 2100; i++) {
        let option = document.createElement('option')
        option.setAttribute('value', i)
        option.innerHTML = i
        sel1.appendChild(option)
      }
      //生成1月-12月

      for (let i = 1; i <= 12; i++) {
        let option = document.createElement('option')
        option.setAttribute('value', i)
        option.innerHTML = i
        sel2.appendChild(option)
      }
    },
    methods: {
      search: function () {
        axios.get('/api/shop/count', {
          params: {
            shopId: this.shopId,
            year: this.year,
            month: this.month ? this.month : '',
          }
        }).then(response => {
          if (response.status !== 200 || !response.data) {
            window.alert('请求失败')
          }
          this.dataInvoker(response.data)
        })
      },
      dataInvoker: function (response) {
        if (!response.success || response.code !== 200) {
          window.alert(response.message)
          return
        }
        this.canceled = response.data.canceled
        this.finished = response.data.finished
        this.byProductType = response.data.byProductType
        this.byHour = response.data.byHour
        this.byMonth = response.data.byMonth
        this.byDay = response.data.byDay
        const timeRegion = this.month ? this.year + '年' + this.month + '月' : this.year + '年'
        let pieList = [this.finished, this.canceled, this.byProductType]
        let pieTitleList = ['已成交订单量统计', '已成交金额', '取消订单量统计', '取消订单金额统计', '消费类别订单量', '消费类别销售额']
        let pieSeriesName = ['订单数', '金额']
        let pieDivList = ['finished-order', 'finished-price', 'canceled-order', 'canceled-price', 'byProductType-order', 'byProductType-price']
        let barList = [this.byHour, this.byMonth, this.byDay]
        let barTitleList = ['单位小时下单量', '单位小时销售额', '月份订单数', '月份销售额', '日订单数', '日销售额']
        let barSeriesName = ['订单数', '销售额']
        let barDivList = ['byHour-order', 'byHour-price', 'byMonth-order', 'byMonth-price', 'byDay-order', 'byDay-price']
        let barMap = {
          0: '点',
          1: '月',
          2: '号'
        }
        let numberTimes = null
        let priceTimes = null
        for (let i = 0; i < pieTitleList.length; i++) {
          if (i % 2 == 0) {
            if (numberTimes == null) {
              numberTimes = 0
            } else {
              numberTimes++
            }
            for (let key in pieList[numberTimes]) {
              this.orderDataList.push({name: key, value: pieList[numberTimes][key].number})
            }
            this.drawPie(pieTitleList[i], this.orderDataList, pieSeriesName[0], pieDivList[i], timeRegion)
            this.orderDataList = []
          } else {
            if (priceTimes == null) {
              priceTimes = 0
            } else {
              priceTimes++
            }
            for (let key in pieList[priceTimes]) {
              this.orderDataList.push({name: key, value: pieList[priceTimes][key].price})
            }
            this.drawPie(pieTitleList[i], this.orderDataList, pieSeriesName[1], pieDivList[i], timeRegion)
            this.orderDataList = []
          }
        }
        numberTimes = null
        priceTimes = null
        for (let k = 0; k < barTitleList.length; k++) {
          if (k % 2 == 0) {
            if (numberTimes == null) {
              numberTimes = 0
            } else {
              numberTimes++
            }
            for (let key in barList[numberTimes]) {
              this.orderDataList.push({name: key + barMap[numberTimes], value: barList[numberTimes][key].number})
            }
            this.drawBar(barTitleList[k], barSeriesName[0], this.orderDataList, barDivList[k], timeRegion)
            this.orderDataList = []
          } else {
            if (priceTimes == null) {
              priceTimes = 0
            } else {
              priceTimes++
            }
            for (let key in barList[priceTimes]) {
              this.orderDataList.push({name: key + barMap[priceTimes], value: barList[priceTimes][key].price})
            }
            this.drawBar(barTitleList[k], barSeriesName[1], this.orderDataList, barDivList[k], timeRegion)
            this.orderDataList = []
          }
        }
      },
      drawPie: function (title, legendAndSeriesData, seriesName, divId, timeRegion) {
        let chart = echarts.init(document.getElementById(divId))
        chart.setOption({
          title: {
            text: title,
            subtext: timeRegion,
            left: 'center'
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            y: 40,
            align: 'left',
            bottom: 10,
            data: legendAndSeriesData.map(function (data) {
              return data.name
            })
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: seriesName,
              type: 'pie',
              radius: '55%',
              data: legendAndSeriesData
            }
          ]
        })
      },
      drawBar: function (title, legendDataAndSeriesName, xAxisDataAndSeriesData, divId, timeRegion) {
        let chart = echarts.init(document.getElementById(divId))
        chart.setOption({
          title: {
            text: title,
            subtext: timeRegion,
            left: 'center'
          },
          tooltip: {},
          legend: {
            orient: 'vertical',
            align: 'left',
            y: 60,
            bottom: 10,
            left: 'right',
            data: legendDataAndSeriesName,
            show: false,
          },
          xAxis: {
            data: xAxisDataAndSeriesData.map(function (data) {
              return data.name
            })
          },
          yAxis: {},
          series: [{
            color: divId.indexOf('price') === -1 ? '#ff547e' : '#748fff',
            name: legendDataAndSeriesName,
            type: 'bar',
            data: xAxisDataAndSeriesData
          }]
        })
      }
    }
  }
</script>
<style scoped>
</style>

