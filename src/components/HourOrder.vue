<template>
  <div>
    <div class="hour_order_chart">
      <div id="chart" :style="{ width: '800px', height: '700px'}"></div>
    </div>
    <template v-if="byHour===null">
      <p>请输入ShopId: </p>
      <input v-model="shopId"
             placeholder="在这里单击输入..."/><br>
      <input v-model="year"
             placeholder="请输入年份"/><br>
      <input v-model="month"
             placeholder="请输入月份"/><br>
      <button v-on:click="search()">点我查询</button>
    </template>
  </div>
</template>


<script>
  import axios from 'axios'
  import echarts from 'echarts'
    export default {
        name: "HoourOrder",
      data () {
        return {
          shopId: 100001,
          year: 2018,
          month: 9,
          canceled: null,
          finished: null,
          byProductType: null,
          byHour: null,
          byMonth: null,
          byYear: null,
        }
      },
     /* mounted () {
        axios.get('/api/shop/count',{
          params: {
            shopId: this.shopId,
            year: this.year,
            month: this.month,
          }
        })
          .then((response) => {
            if (response.status !== 200 || !response.data) {
              window.alert('请求失败')
            }
            this.dataInvoker(response.data)
            this.byHour = response.data.byHour
          })
      },*/
      methods: {
        search: function () {
          axios.get('/api/shop/count', {
            params: {
              shopId: this.shopId,
              year: this.year,
              month: this.month,
            }
          }).then(response => {
            if (response.status !== 200 || !response.data) {
              window.alert('请求失败')
            }
            this.dataInvoker(response.data)
          })
        },
        dataInvoker (response) {
          if (!response.success || response.code !== 200) {
            window.alert(response.message)
            return
          }
          console.log(response)
          this.canceled = response.data.canceled
          console.log(this.canceled)
          this.finished = response.data.finished
          this.byProductType = response.data.byProductType
          this.byHour = response.data.byHour
          this.byMonth = response.data.byMonth
          this.byYear = response.data.byYear
          const hour = response.data.byHour
          const numbers = response.data.byHour.number
          const amount = response.data.price
          let chart = echarts.init(document.getElementById('chart'))
          chart.setOption({
            title: {text: '小时下单数量及销售额'},
            tooltip: {},
            xAxis: {
              data: amount
            },
            yAxis: {},
            series: [{
              name: '订单数量',
              type: 'bar',
              data: numbers
            }]
          })
        }
      }
    }
</script>

<style scoped>

</style>
