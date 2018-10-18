<template>
  <div class="shop-count">
    <template>
      <label>请输入ShopId: </label>
      <input v-model="shopId"
             placeholder="在这里单击输入..."/><br>
      <h4>请选择日期：
        <select v-model="year" name="sel1" id="sel1" :style="{width:'100px',height:'25px' }">
          <option value="year">年</option>
        </select>
        <select v-model="month" name="sel2" id="sel2" :style="{width:'100px',height:'25px' }">
          <option value="">月</option>
        </select>
      <template><button v-on:click="search()">查询</button></template></h4>
    </template>
    <h1>商户Id: {{ shopId }}</h1>
    <template v-if="finished">
      <div id="finished-list" v-if="finished">
        <div id="finished-order" :style="{ width: '400px', height: '300px',float: 'left'}"></div>
        <div id="finished-price" :style="{ width: '400px', height: '300px',float: 'right'}"></div>
      </div>
      <div id="canceledList" v-if="canceled">
        <div id="canceled-order" :style="{ width: '400px', height: '300px',float:'left'}" ></div>
        <div id="canceled-price" :style="{ width: '400px', height: '300px',float:'right'}" ></div>
      </div>
      <div id="byProductList">
      <div id="byProductType-order" :style="{ width: '400px', height: '300px',float:'left'}"></div>
      <div id="byProductType-price" :style="{ width: '400px', height: '300px',float:'right'}"></div>
    </div>
      <div id="byHour-list">
      <div id="byHour-order" :style="{ width: '400px', height: '300px',float:'left'}"></div>
      <div id="byHour-price" :style="{ width: '400px', height: '300px',float:'right'}"></div>
    </div>
      <div id="byMonth-ist">
        <div id="byMonth-order" :style="{ width: '400px', height: '300px',float:'left'}"></div>
        <div id="byMonth-price" :style="{ width: '400px', height: '300px',float:'right'}"></div>
      </div>
        <div id="byDay-list">
         <div id="byDay-order" :style="{ width: '400px', height: '300px',float:'left'}"></div>
         <div id="byDay-price" :style="{ width: '400px', height: '300px',float:'right'}"></div>
        </div>
    </template>
    <template v-else></template>
  </div>
</template>



<script>
  import axios from 'axios'
  import echarts from 'echarts'
  export default {
    name: "ShopCount",
    data () {
      return {
        shopId: 100001,
        year: 2018,
        month: 9,
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
    mounted: function() {
          // 生命周期函数， 有好几个 执行的顺序都不一样，可以根据场景 选择不同的生命周期函数 这块一般是初始化数据的地方
      //生成2000年-2100年
      for(let i = 2000; i<=2100;i++ ){
        let option = document.createElement('option');
        option.setAttribute('value',i);
        option.innerHTML = i;
        sel1.appendChild(option);
      }
      //生成1月-12月

      for(let i = 1; i <=12; i++) {
        let option = document.createElement('option');
        option.setAttribute('value', i);
        option.innerHTML = i;
        sel2.appendChild(option);
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
//生成2000年-2100年
        for(let i = 2000; i<=2100;i++ ){
          let option = document.createElement('option');
          option.setAttribute('value',i);
          option.innerHTML = i;
          sel1.appendChild(option);
        }
        //生成1月-12月
        for(let i = 1; i <=12; i++) {
          let option = document.createElement('option');
          option.setAttribute('value', i);
          option.innerHTML = i;
          sel2.appendChild(option);
        }
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
        //月份订单数
        let byMonthOrder = []
        for(let order in this.byMonth){
          byMonthOrder.push({name:order, value: this.byMonth[order].number})
        }
        //月份销售额
        let byMonthPrice = []
        for(let order in this.byMonth){
          byMonthPrice.push({name:order, value: this.byMonth[order].price})
        }
        //日成交订单数
        let byDayOrder = []
        for(let order in this.byDay){
          byDayOrder.push({name:order, value: this.byDay[order].number})
        }
        //日销售额
        let byDayPrice = []
        for(let order in this.byDay){
          byDayPrice.push({name:order, value: this.byDay[order].price})
        }

        //成交订单
        let finishedChart = echarts.init(document.getElementById('finished-order'))
        finishedChart.setOption({
          title: {
            text: '已成交订单量统计',
            subtext: timeRegion,
            left: 'center'
          },
          legend: {
            orient:'vertical',
            left: 'right',
            y:40,
            align:'left',
            bottom: 10,
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
        let finishedChart1 = echarts.init(document.getElementById('finished-price'))
        finishedChart1.setOption({
          title: {
            text: '已成交金额',
            subtext: timeRegion,
            left: 'center'
          },
          legend: {
            orient:'vertical',
            left: 'right',
            y:40,
            align:'left',
            bottom: 10,
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
        let canceledChart = echarts.init(document.getElementById('canceled-order'))
        canceledChart.setOption({
          title: {
            text: '取消订单量统计',
            subtext: timeRegion,
            left: 'center'
          },
          legend: {
            orient:'vertical',
            left: 'right',
            y:40,
            align:'left',
            bottom: 10,
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
        let canceledChart1 = echarts.init(document.getElementById('canceled-price'))
        canceledChart1.setOption({
          title: {
            text: '取消订单金额统计',
            subtext: timeRegion,
            left: 'center'
          },
          legend: {
            orient:'vertical',
            left: 'right',
            y:40,
            align:'left',
            bottom: 10,
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
        let chart = echarts.init(document.getElementById('byProductType-order'))
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
            orient:'vertical',
            left: 'right',
            y:40,
            align:'left',
            bottom: 10,
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
        let chart1 = echarts.init(document.getElementById('byProductType-price'))
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
            orient:'vertical',
            left: 'right',
            y:40,
            align:'left',
            bottom: 10,
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
          title: {text: '单位小时下单量',
            subtext: timeRegion,
            left: 'center'},
          tooltip: {},
          legend: {
            orient:'vertical',
            align:'left',
            y:60,
            bottom: 10,
            left: 'right',
            data:['订单数量'],
            show:false,
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
          title: {text: '单位小时销售额',
            subtext: timeRegion,
            left: 'center'},
          tooltip: {},
          legend: {
            orient:'vertical',
            align:'left',
            y:60,
            bottom: 10,
            left: 'right',
            data:['销售额'],
            show:false,
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
        //按月份查询
        let byMonthOrderDiv = echarts.init(document.getElementById('byMonth-order'))
        byMonthOrderDiv.setOption({
          title: {text: '月份订单数',
            subtext: timeRegion,
            left: 'center'},
          tooltip: {},
          legend: {
            orient:'vertical',
            align:'left',
            y:60,
            bottom: 10,
            left: 'right',
            data:['订单数量'],
            show:false,
          },
          xAxis: {
            data: byMonthOrder.map(function (data) {return data.name})
          },
          yAxis: {

          },
          series: [{
            name: '订单数',
            type: 'bar',
            data: byMonthOrder
          }]
        })
        let byMonthPriceDiv = echarts.init(document.getElementById('byMonth-price'))
        byMonthPriceDiv.setOption({
          title: {text: '月份销售额',
            subtext: timeRegion,
            left: 'center'},
          tooltip: {},
          legend: {
            orient:'vertical',
            align:'left',
            y:60,
            bottom: 10,
            left: 'right',
            data:['销售额'],
            show:false,
          },
          xAxis: {
            data: byMonthPrice.map(function (data) {return data.name})
          },
          yAxis: {

          },
          series: [{
            name: '销售额',
            type: 'bar',
            data: byMonthPrice
          }]
        })
        let byDayPriceDiv = echarts.init(document.getElementById('byDay-price'))
        byDayPriceDiv.setOption({
          title: {text: '日销售额',
            subtext: timeRegion,
            left: 'center'},
          tooltip: {},
          legend: {
            orient:'vertical',
            align:'left',
            y:60,
            bottom: 10,
            left: 'right',
            data:['销售额'],
            show:false,
          },
          xAxis: {
            data: byDayPrice.map(function (data) {return data.name})
          },
          yAxis: {

          },
          series: [{
            name: '销售额',
            type: 'bar',
            data: byDayPrice
          }]
        })
        let byDayOrderDiv = echarts.init(document.getElementById('byDay-order'))
        byDayOrderDiv.setOption({
          title: {text: '日订单数量',
            subtext: timeRegion,
            left: 'center'},
          tooltip: {},

          legend: {
            orient:'vertical',
            align:'left',
            y:60,
            bottom: 10,
            left: 'right',
            data:['订单数'],
            show:false,
          },
          xAxis: {
            data: byDayOrder.map(function (data) {return data.name})
          },
          yAxis: {

          },
          series: [{
           // color: 'yellow',
            name: '订单数',
            type: 'bar',
            data: byDayOrder

          }]
        })
      },
    }

  }
</script>

<style scoped>

</style>

