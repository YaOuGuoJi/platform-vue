<template>
  <div class="shop-count">
    <template>
      <div class="row">
        <span>
          <input v-model="shopId" class="balloon" id="shopId" type="text"/><label for="shopId">用户ID</label>
        </span>
        <span>
          <label for="sel1">年份</label>
          <select v-model="year" class="balloon" name="sel1" id="sel1">
            <option value="year">年份</option>
          </select>
        </span>
        <span>
          <label for="sel2">月份</label>
          <select v-model="month" class="balloon" name="sel2" id="sel2">
            <option value="month">月份</option>
          </select>
        </span>
        <span>
          <button id="btn" class="button" v-on:click="search">点击查询</button>
        </span>
      </div>
    </template>
    <template>
      <div class="body" style="margin:0 auto;width: 75%; background-color: white">
        <table>
          <tr><td>
            <div id="finished-list" v-show="finished" style="width: 100%;">
              <h1>商户Id: {{ realShopId }}</h1>
              <div id="finished-order" :style="{ width: '400px', height: '300px',float: 'left',marginLeft:'50px',}"></div>
              <div id="finished-price" :style="{ width: '400px', height: '300px',float: 'right',marginRight: '50px'}"></div>
            </div>
          </td></tr>
          <tr><td><div id="canceledList" v-show="canceled" style="width: 100%;">
            <div id="canceled-order" :style="{ width: '400px', height: '300px',float:'left',marginLeft:'50px'}"></div>
            <div id="canceled-price" :style="{ width: '400px', height: '300px',float:'right',marginRight: '50px'}"></div>
          </div></td></tr>
          <tr><td><div id="byProductList" v-show="byProductType" style="width: 100%;">
            <div id="byProductType-order" :style="{ width: '500px', height: '300px',float:'left',marginLeft:''}"></div>
            <div id="byProductType-price" :style="{ width: '500px', height: '300px',float:'right',marginRight: ''}"></div>
          </div></td></tr>
          <tr><td><div id="byHour-list" v-show="byHour" style="width: 100%;">
            <div id="byHour-order" :style="{ width: '1100px', height: '300px',float:'left'}"></div>
          </div></td></tr>
          <tr><td> <div id="byMonth-ist" v-show="byMonth" style="width: 100%;">
            <div id="byMonth-order" :style="{ width: '1100px', height: '300px',float:'left'}"></div>
          </div></td></tr>
          <tr><td><div id="byDay-list" v-show="byDay" style="width: 100%; background: white">
            <div id="byDay-order" :style="{ width: '1100px', height: '300px',float:'left'}"></div>
          </div></td></tr>
        </table>
      </div>
    </template>
  </div>
</template>
<script type="text/javascript">
  import axios from 'axios'
  import echarts from 'echarts'
  import {btnAnimation} from '../../static/js/buttonJS'

  export default {
    name: 'ShopCount',
    data () {
      return {
        shopId: 100009,
        year: 2018,
        month: null,
        finished: null,
        canceled: null,
        byProductType: null,
        byHour: null,
        byMonth: null,
        byDay: null,
        orderDataList: [],
        priceDataList: [],
        realShopId: null
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
        btnAnimation()
        axios.get('/api/shop/count', {
          params: {
            shopId: this.shopId,
            year: this.year ? this.year : 0,
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
        this.realShopId = this.shopId
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
        let barTitleList = ['订单日内分布', '订单年内分布', '订单月内分布',]
        let barSeriesName = ['订单数', '销售额']
        let barDivList = ['byHour-order', 'byMonth-order', 'byDay-order']
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
          for (let key in barList[k]) {
            this.orderDataList.push({name: key + barMap[k], value: barList[k][key].number})
          }
          for (let key in barList[k]) {
            this.priceDataList.push({name: key + barMap[k], value: barList[k][key].price})
          }
          this.drawBar(barTitleList[k], barSeriesName[0], barSeriesName[1], this.orderDataList, this.priceDataList, barDivList[k], timeRegion)

          this.orderDataList = []
          this.priceDataList = []
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
      drawBar: function (title, SeriesNameOrder, SeriesNamePrice, xAxisDataAndSeriesData, priceDataList, divId, timeRegion) {
        let chart = echarts.init(document.getElementById(divId))
        chart.setOption({
          title: {
            text: title,
            subtext: timeRegion,
            left: 'center'
          },
          tooltip: {},
          xAxis: [{
            data: xAxisDataAndSeriesData.map(function (data) {
              return data.name
            })
          }],
          legend: {
            left: 'right',
            data: [SeriesNameOrder, SeriesNamePrice]
          },
          yAxis: [
            {
              type: 'value',
              name: SeriesNameOrder,
            },
            {
              type: 'value',
              name: SeriesNamePrice,
              nameLocation: 'end',
            }
          ],
          series: [{
            color: '#ff547e',
            name: SeriesNameOrder,
            type: 'bar',
            data: xAxisDataAndSeriesData
          }, {
            color: '#748fff',
            name: SeriesNamePrice,
            type: 'bar',
            data: priceDataList,
            yAxisIndex: 1
          }]
        })
      }
    }
  }
</script>
<style scoped>
  @import "../../static/css/buttonAndInput.css";
</style>

