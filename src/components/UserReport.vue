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
    <div id="user-report" :style="{ width: '800px', height: '700px'}">
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
      beyondPercent: null
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
        this.drawReport(this.monthReport)
      } else {
        this.drawReport(this.dayReport)
      }
      this.drawPayPrice(this.payType)
      this.drawPayTimes(this.payType)
    },
    drawReport: function (userReport) {
      let names = [];
      let payTimes = [];
      let payPrice = [];
      let title = "";
      if (this.month) {
        title = '月度'
      } else {
        title = '年度'
      }
      for (let key in userReport) {
        if (this.month) {
          names.push(key + '日')
        } else {
          names.push(key + '月')
        }
        payPrice.push(userReport[key].payPrice)
        payTimes.push(userReport[key].payTimes)
      }
      let chart = echarts.init(document.getElementById('user-report'))
      chart.setOption({
        title: {
          text: title + '消费统计'
        },
        tooltip: {},
        legend: {
          data:['支付次数','支付总额']
        },
        xAxis: {
          data: names
        },
        yAxis: {},
        series: [{
          name: '支付次数',
          type: 'bar',
          data: payTimes
        },{
          name: '支付总额',
          type: 'bar',
          data: payPrice
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
  #user-report {
    margin:0 auto;
  }
</style>
