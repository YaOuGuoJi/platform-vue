<template>
  <div id="all">
    <template>
      <label>请输入用户ID</label>
      <input v-model="userId" placeholder="例如100000000"/>
      <label>请输入要查询的年份</label>
      <input v-model="year" placeholder="例如2018"/>
      <label>请输入月份（或者不输入）</label>
      <input v-model="month" placeholder="例如9">
      <button v-on:click="search()">点击查询</button>
    </template>
    <template v-if="userReportData">
      <div>
        <h1>{{userReportData.userInfo.userName}}的用户报告</h1>
      </div>
      <div class="survey">
        <p id="summary">
          {{year}}年{{showMonth == null ? showMonth : showMonth + '月'}}您在亚欧国际小镇共下单{{userReportData.orderNumber}}次,共消费{{userReportData.totalPrice}}元，超过了{{userReportData.beyondPercent}}%的人，
          排名第{{rank}}
        </p>
      </div>
      <div v-if="userReportData.firstOrder">
        <p id="firstOrder">
        {{userReportData.firstOrder.day}}是您本年度第一次在亚欧国际小镇下单，在{{userReportData.firstOrder.shopName}}购买了{{userReportData.firstOrder.productList}},花费{{userReportData.firstOrder.orderPrice}}元
        </p>
      </div>
      <div class="max_price_order">
        <p id="maxPrice">
          {{year}}年{{showMonth === null ? showMonth : showMonth + '月'}}消费最高订单：{{userReportData.maxPriceOrder.day}}您在{{userReportData.maxPriceOrder.shopName}}购买了{{userReportData.maxPriceOrder.productList}},
          花费{{userReportData.maxPriceOrder.orderPrice}}元
        </p>
      </div>
    </template>
    <div id="month-times-and-price" v-show="monthReport" :style="{ width: '1100px', height: '600px'}"></div>
    <div id="day-times-and-price" v-show="dayReport" :style="{ width: '1100px', height: '600px'}"></div>
    <div id="pay-type">
      <div id="pay-price" align="left" :style="{ width: '600px', height: '500px'}">
      </div>
      <div id="pay-times" align="right" :style="{ width: '600px', height: '500px'}">
      </div>
    </div>
  </div>
</template>

<style scoped>

  #all {
    width: 1500px;
  }
  #month-times-and-price {
    margin: 0 auto;
    text-align: center;
  }
  #day-times-and-price {
    text-align: center;
    margin: 0 auto;
  }
  #summary {
    font-size: xx-large;
  }
  #firstOrder {
    font-size: xx-large;
    text-indent: 50px;
  }
  #maxPrice {
    font-size: xx-large;
  }
  #pay-type {
    margin-left: 170px;
  }
  #pay-price {
    float: left;
  }
  #pay-times {
    float: left;
  }
</style>

<script type="text/javascript">
import axios from 'axios'
import echarts from 'echarts'
export default {
  name: 'UserReport',
  data () {
    return {
      userInfo: null,
      userReportData: null,
      userId: 100000000,
      year: 2018,
      month: null,
      orderNumber: null,
      payType: null,
      totalPrice: null,
      monthReport: null,
      dayReport: null,
      rank: null,
      firstOrder: null,
      maxPriceOrder: null,
      beyondPercent: null,
      payPriceOrTimes: [],
      showMonth: null
    }
  },
  methods: {
    search: function () {
      axios.get('/api/order/user/report', {
        params: {
          userId: this.userId,
          year: this.year,
          month: this.month
        }
      }).then(response => {
        if (response.status !== 200 || !response.data) {
          window.alert('请求失败')
        }
        this.dataInvoker(response.data)
      })
    },
    dataInvoker: function (response) {
      if (!response.success && response.code == 404) {
        window.alert('未发现用户订单记录，无法生成用户报告')
        return
      }
      if (!response.success || response.code !== 200) {
        window.alert(response.message)
        return
      }
      this.showMonth = this.month
      this.userInfo = response.userInfo
      this.userReportData = response.data
      this.orderNumber = response.data.orderNumber
      this.payType = response.data.payType
      this.totalPrice = response.data.totalPrice
      this.monthReport = response.data.monthReport
      this.dayReport = response.data.dayReport
      this.rank = response.data.rank
      this.firstOrder = response.data.firstOrder
      this.maxPriceOrder = response.data.maxPriceOrder
      this.beyondPercent = response.data.beyondPercent
      if (this.monthReport != null) {
        this.drawMonthReport(this.monthReport)
      }
      if (this.dayReport != null) {
        this.drawDayReport(this.dayReport)
      }
      this.drawPayPrice(this.payType)
      this.drawPayTimes(this.payType)
    },
    drawMonthReport: function (userReport) {
      let names = [], payPrice = [], payTimes = [];
      for (let key in userReport) {
        names.push(key + '月')
          payTimes.push(userReport[key].payTimes)
          payPrice.push(userReport[key].payPrice)
      }
      let chart = echarts.init(document.getElementById('month-times-and-price'))
      chart.setOption({
        title: {
          text: '年度消费报告'
        },
        tooltip: {},
        legend: {
          data:['支付总额', '支付次数']
        },
        grid:{
          top: "50px",
          left: "30px",
          right: "30px",
          bottom: "50px"
        },
        xAxis: {
          data: names
        },
        yAxis: [
          {
            name: '支付总额',
            type: 'value'
          },
          {
            name: '支付次数',
            type: 'value',
            nameLocation: 'end'
          }
        ],
        series: [
          {
            name: '支付总额',
            type: 'bar',
            data: payPrice
          },
          {
            name: '支付次数',
            type: 'bar',
            data: payTimes,
            yAxisIndex: 1
          }
        ]
      })
    },
    drawDayReport: function (userReport) {
      let names = [], payPrice = [], payTimes = [];
      for (let key in userReport) {
        names.push(key + '日')
        payTimes.push(userReport[key].payTimes)
        payPrice.push(userReport[key].payPrice)
      }
      let chart = echarts.init(document.getElementById('day-times-and-price'))
      chart.setOption({
        title: {
          text: '月度消费报告'
        },
        tooltip: {},
        legend: {
          data:['支付总额', '支付次数']
        },
        xAxis: {
          data: names
        },
        yAxis: [
          {
            name: '支付总额',
            type: 'value'
          },
          {
            name: '支付次数',
            type: 'value',
            nameLocation: 'end'
          }
        ],
        series: [
          {
            name: '支付总额',
            type: 'bar',
            data: payPrice
          },
          {
            name: '支付次数',
            type: 'bar',
            data: payTimes,
            yAxisIndex: 1
          }
        ]
      })
    },
    drawPayPrice: function (payType) {
      let names = [];
      let payPriceList = [];
      for (let key in payType) {
        names.push(key)
        payPriceList.push({value:payType[key].payPrice, name:key})
      }
      let chart = echarts.init(document.getElementById("pay-price"))
      chart.setOption({
        title : {
          text: '支付总额统计',
          x : 'center'
        },
        tooltip : {

        },
        legend : {
          orient : 'vertical',
          left : 'left',
          data : names
        },
        series : [
          {
            name : '支付总额',
            type : 'pie',
            radius : '60%',
            data : payPriceList
          }
        ]
      })
    },
    drawPayTimes : function (payType) {
      let names = [];
      let payTimesList = [];
      for (let key in payType) {
        names.push(key)
        payTimesList.push({value: payType[key].payTimes, name: key})
      }
      let chart = echarts.init(document.getElementById("pay-times"))
      chart.setOption({
        title : {
          text : '支付次数统计',
          x : 'center'
        },
        tooltip : {
        },
        legend : {
          orient: 'vertical',
          left: 'left',
          data: names
        },
        series: {
          name: '支付次数',
          type: 'pie',
          radius: '60%',
          data: payTimesList
        }
      })
    }
  }
}
</script>

