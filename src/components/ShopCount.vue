<template>
  <div class="shop-count">
    <template v-if="shopId === null">
      <p>请输入UserId: </p>
      <input v-model="shopId"
             placeholder="在这里单击输入..."/><br>
      <input v-model="year"
             placeholder="请输入年份"/><br>
      <input v-model="month"
             placeholder="请输入月份"/><br>
      <button v-on:click="search()">点我查询</button>
    </template>
    <template v-else>
      <h2>商户Id: {{ shopId }}</h2>
    </template>
    <div id="finished" :style="{ width: '800px', height: '700px'}"></div>
    <div id="canceled" :style="{ width: '800px', height: '700px'}"></div>
    <div id="byProductType" :style="{ width: '800px', height: '700px'}"></div>
    <div id="byDay" :style="{ width: '800px', height: '700px'}"></div>
    <div id="byMonth" :style="{ width: '800px', height: '700px'}"></div>
    <div id="byHour" :style="{ width: '800px', height: '700px'}"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import echarts from 'echarts'
  export default {
    name: "ShopCount",
    data () {
      return {
        shopId: '100001',
        year: '2018',
        month: '9',
        finished: null,
        canceled: null,
        byProductType: null,
        byHour: null,
        byMonth: null,
        byDay: null
      }
    },
    created: function() {
      this.search();
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
        console.log(response)
        this.canceled = response.data.canceled
        this.finished = response.data.finished
        this.byProductType = response.data.byProductType
        this.byHour = response.data.byHour
        this.byMonth = response.data.byMonth
        this.byDay = response.data.byDay
        console.log(document.getElementById('finished'))

        const timeRegion = this.month ? this.year + '年' + this.month + '月' : this.year + '年';
        let finishedData = []
        for (let order in this.finished) {
          finishedData.push({name: order, value: this.finished[order].number})
        }
        let finishedChart = echarts.init(document.getElementById('finished'))
        finishedChart.setOption({
          title: {
            text: '已成交订单量统计',
            subtext: timeRegion,
            left: 'center'
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: finishedData.map(function (data) {return data.name})
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series : [
            {
              name: '订单量',
              type: 'pie',
              radius: '55%',
              roseType: 'angle',
              data: finishedData
            }
          ]
        })
      },
    }

  }
</script>

<style scoped>

</style>

