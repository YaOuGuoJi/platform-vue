<template>
  <div class="user_report">
    <template>
      <p>请输入用户ID</p>
      <input v-model="userId" value="100000000" placeholder="100000000"/>
      <p>请输入要查询的年份</p>
      <input v-model="year" value="2018" placeholder="2018"/>
      <p>请输入月份（或者不输入）</p>
      <input v-model="month" placeholder="例如9">
      <button v-on:click="search()">点击查询</button>
    </template>
    <template v-if="userReportData">
      <div>
        <h1>{{userReportData.userInfo.userName}}的用户报告</h1>
      </div>
      <div class="survey">
        <p>
          {{year}}年{{month === null ? month : month + '月'}}您在亚欧国际小镇消费了{{userReportData.totalPrice}}元，超过了{{userReportData.beyondPercent}}%的人，
          排名第{{rank}}
        </p>
      </div>
      <div v-if="userReportData.firstOrder">
        <p>
        第一次在亚欧国际小镇下单：{{userReportData.firstOrder.day}}您在{{userReportData.firstOrder.shopName}}购买了{{userReportData.firstOrder.productList}},
        花费{{userReportData.firstOrder.orderPrice}}元
        </p>
      </div>
      <div class="max_price_order">
        <p>
          {{year}}年{{month === null ? month : month + '月'}}消费最高订单：{{userReportData.maxPriceOrder.day}}您在{{userReportData.maxPriceOrder.shopName}}购买了{{userReportData.maxPriceOrder.productList}},
          花费{{userReportData.maxPriceOrder.orderPrice}}
        </p>
      </div>
    </template>
    <div>
      <div id="month-times" :style="{ width: '800px', height: '700px'}">
      </div>
      <div id="month-price" :style="{ width: '800px', height: '700px'}">
      </div>
      <div id="day-times" :style="{ width: '800px', height: '700px'}">
      </div>
      <div id="day-price" :style="{ width: '800px', height: '700px'}">
      </div>
    </div>
    <div id="pay-type">
      <div id="pay-price" align="left" :style="{ width: '800px', height: '700px'}">
      </div>
      <div id="pay-times" align="right" :style="{ width: '800px', height: '700px'}">
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import axios from 'axios'
import echarts from 'echarts'
export default {
  name: 'UserReport',
  data () {
    return {
      userInfo: null,
      userReportData: null,
      userId: null,
      year: null,
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
      switchModel: 1
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
      if (!response.success || response.code !== 200) {
        window.alert(response.message)
        return
      }
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
      if (this.monthReport) {
        this.drawMonthReport(this.monthReport)
        this.drawMonthReport(this.monthReport)
      } else {
        this.drawDayReport(this.dayReport)
        this.drawDayReport(this.dayReport)
      }
      this.drawPayPrice(this.payType)
      this.drawPayTimes(this.payType)
    },
    drawMonthReport: function (userReport) {
      let divId, titleText, legendData;
      let payPriceOrTimes = [];
      if (this.switchModel === 1) {
        divId = 'month-times'
        legendData = '支付次数'
        titleText = '年度' + legendData + '统计'
      } else if (this.switchModel === 2) {
        divId = 'month-price'
        legendData = '支付总额'
        titleText = '年度' + legendData + '统计'
      }
      let names = [];
      for (let key in userReport) {
        names.push(key + '月')
        if (this.switchModel === 1) {
          payPriceOrTimes.push(userReport[key].payTimes)
        } else if (this.switchModel === 2) {
          payPriceOrTimes.push(userReport[key].payPrice)
        }
      }
      this.switchModel = 2
      let chart = echarts.init(document.getElementById(divId))
      chart.setOption({
        title: {
          text: titleText
        },
        tooltip: {},
        legend: {
          data:legendData
        },
        xAxis: {
          data: names
        },
        yAxis: {},
        series: [{
          name: legendData,
          type: 'bar',
          data: payPriceOrTimes
        }]
      })
    },
    drawDayReport: function (userReport) {
      let divId, titleText, legendData;
      let payPriceOrTimes = [];
      if (this.switchModel === 1) {
        divId = 'day-times'
        legendData = '支付次数'
        titleText = '月度' + legendData + '统计'
      } else if (this.switchModel === 2) {
        divId = 'day-price'
        legendData = '支付总额'
        titleText = '月度' + legendData + '统计'
      }
      let names = [];
      for (let key in userReport) {
        names.push(key + '日')
        if (this.switchModel === 1) {
          payPriceOrTimes.push(userReport[key].payTimes)
        } else if (this.switchModel === 2) {
          payPriceOrTimes.push(userReport[key].payPrice)
        }
      }
      this.switchModel = 2
      let chart = echarts.init(document.getElementById(divId))
      chart.setOption({
        title: {
          text: titleText
        },
        tooltip: {},
        legend: {
          data:legendData
        },
        xAxis: {
          data: names
        },
        yAxis: {},
        series: [{
          name: legendData,
          type: 'bar',
          data: payPriceOrTimes
        }]
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

<style scoped>
  #pay-price {
    float: left;
  }
  #pay-times {
    float: left;
  }
  #month-times {
    float: left;
  }
  #month-price {
    float: left;
  }
  #day-times {
    float: left;
  }
  #day-price {
    float: left;
  }
</style>
