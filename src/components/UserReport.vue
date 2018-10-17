<template>
  <div class="user_report">
    <template v-if="userReportData">
      <div class="survey">
        <p>
          {{year}}年{{month === null ? month : month + '月'}}您在亚欧国际小镇消费了{{userReportData.totalPrice}}元，超过了{{userReportData.beyondPercent}}%的人，
          排名第{{rank}}
        </p>
      </div>
      <div v-if="userReportData.firstOrder">
        <p>
        第一次在亚欧国际小镇下单：{{userReportData.firstOrder.day}}您在{{userReportData.firstOrder.shopName}}购买了{{userReportData.firstOrder.productList}},
        花费{{userReportData.firstOrder.orderPrice}}
        </p>
      </div>
      <div class="max_price_order">
        <p>
          {{year}}年{{month === null ? month : month + '月'}}消费最高订单：{{userReportData.maxPriceOrder.day}}您在{{userReportData.maxPriceOrder.shopName}}购买了{{userReportData.maxPriceOrder.productList}},
          花费{{userReportData.maxPriceOrder.orderPrice}}
        </p>
      </div>
      <template v-if="monthReport">
        <div class="month_report">

        </div>
      </template>
    </template>
    <template v-else>
      <p>请输入用户ID</p>
      <input v-model="userId" placeholder="例如100000000"/>
      <p>请输入要查询的年份</p>
      <input v-model="year" placeholder="例如2018"/>
      <p>请输入月份（或者不输入）</p>
      <input v-model="month" placeholder="例如9">
      <button v-on:click="search()">点击查询</button>
    </template>
  </div>
</template>

<script type="text/javascript">
import axios from 'axios'
export default {
  name: 'UserReport',
  data () {
    return {
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
    }
  }
}
</script>

<style scoped>

</style>
