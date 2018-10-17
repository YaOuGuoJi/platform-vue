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
      <h1>商户Id: {{ shopId }}</h1>
    </template>
      <div id="finished-list" >
        <div id="finished" :style="{ width: '300px', height: '300px',float: 'left'}"></div>
        <div id="finished1" :style="{ width: '300px', height: '300px',float: 'right'}"></div>
      </div>
      <h1></h1>
      <div>
        <div id="canceled" :style="{ width: '300px', height: '300px',float:'left'}" ></div>
        <div id="canceled1" :style="{ width: '300px', height: '300px',float:'right'}" ></div>
      </div>
    <h1></h1>
    <div>
      <div id="byProductType" :style="{ width: '300px', height: '300px',float:'left'}"></div>
      <div id="byProductType1" :style="{ width: '300px', height: '300px',float:'right'}"></div>
    </div>
    <div>
      <div id="byHour-order" :style="{ width: '300px', height: '400px',float:'left'}"></div>
      <div id="byHour-price" :style="{ width: '300px', height: '400px',float:'right'}"></div>
    </div>
    <div id="byDay" :style="{ width: '800px', height: '700px'}"></div>
    <div id="byMonth" :style="{ width: '800px', height: '700px'}"></div>
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
        console.log(document.getElementById('canceled'))

        const timeRegion = this.month ? this.year + '年' + this.month + '月' : this.year + '年';
        //成交订单
        let finishedData = []
        for (let order in this.finished) {
          finishedData.push({name: order, value: this.finished[order].number,})
        }
        //成交金额
        let finishedData1 = []
        for (let order1 in this.finished) {
          finishedData1.push({name: order1, value: this.finished[order1].price,})
        }
        //取消订单
        let canceledData = []
        for(let order in this.canceled) {
          canceledData.push({name:order, value: this.canceled[order].number})
        }
        //取消金额
        let canceledData1 = []
        for(let order1 in this.canceled) {
          canceledData1.push({name:order1, value: this.canceled[order1].price})
        }
        //消费类别
        let byProductTypeData = []
        for(let type in this.byProductType) {
          byProductTypeData.push({name:type, value: this.byProductType[type].number})
        }
        //消费类别
        let byProductTypeData1 = []
        for(let type1 in this.byProductType) {
          byProductTypeData1.push({name:type1, value: this.byProductType[type1].price})
        }
        //小时订单
        let byHourDatas = []
        for(let order in this.byHour){
          byHourDatas.push({name:order, value: this.byHour[order].number})
        }
        //小时金额
        let byHourDatas1 = []
        for(let order in this.byHour){
          byHourDatas1.push({name:order, value: this.byHour[order].price})
        }

        //成交订单
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
              data: finishedData
            }
          ]
        })
        //已成交金额
        let finishedChart1 = echarts.init(document.getElementById('finished1'))
        finishedChart1.setOption({
          title: {
            text: '已成交金额',
            subtext: timeRegion,
            left: 'center'
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: finishedData1.map(function (data) {return data.name})
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series : [
            {
              name: '金额',
              type: 'pie',
              radius: '55%',
              data: finishedData1
            }
          ]
        })
        //未成交订单
        let canceledChart = echarts.init(document.getElementById('canceled'))
        canceledChart.setOption({
          title: {
            text: '取消订单量统计',
            subtext: timeRegion,
            left: 'center'
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: canceledData.map(function (data) {return data.name})
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
              data: canceledData
            }
          ]
        })
        //未成交金额
        let canceledChart1 = echarts.init(document.getElementById('canceled1'))
        canceledChart1.setOption({
          title: {
            text: '取消订单金额统计',
            subtext: timeRegion,
            left: 'center'
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: canceledData1.map(function (data) {return data.name})
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series : [
            {
              name: '金额',
              type: 'pie',
              radius: '55%',
              data: canceledData1
            }
          ]
        })
        //按销售类别分类
        let chart = echarts.init(document.getElementById('byProductType'))
        chart.setOption({
          title: {text: '消费类别统计',
            subtext: timeRegion,
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            bottom: 10,
            left: 'center',
            data:byProductTypeData.map(function (data) {return data.name})
          },
          series : [
            {
              name: '订单数量',
              type: 'pie',
              radius: '55%',
              data: byProductTypeData
            }
          ]
        })
        //按销售类别分类
        let chart1 = echarts.init(document.getElementById('byProductType1'))
        chart1.setOption({
          title: {text: '消费类别统计',
            subtext: timeRegion,
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            bottom: 10,
            left: 'center',
            data:byProductTypeData1.map(function (data) {return data.name})
          },
          series : [
            {
              name: '销售额',
              type: 'pie',
              radius: '55%',
              data: byProductTypeData1
            }
          ]
        })

        let byHourOrder = echarts.init(document.getElementById('byHour-order'))
        byHourOrder.setOption({
          title: {text: '单位小时下单量'},
          tooltip: {},
          legend: {
            data:['订单数量']
          },
          xAxis: {
            data: byHourDatas.map(function (data) {return data.name})
          },
          yAxis: {

          },
          series: [{
            name: '订单数量',
            type: 'bar',
            data: byHourDatas
          }]
        })
        let byHourPrice = echarts.init(document.getElementById('byHour-price'))
        byHourPrice.setOption({
          title: {text: '单位小时销售额'},
          tooltip: {},
          legend: {
            data:['销售额']
          },
          xAxis: {
            data: byHourDatas1.map(function (data) {return data.name})
          },
          yAxis: {

          },
          series: [{
            name: '销售额',
            type: 'bar',
            data: byHourDatas1
          }]
        })
      },
    }

  }
</script>

<style scoped>

</style>

