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
      <template><button v-on:click="search()">查询</button></template></h4>
    </template>
    <h1>商户Id: {{ shopId }}</h1>
    <template v-show="finished">
      <div id="finished-list" v-show="finished">
        <div id="finished-order" :style="{ width: '400px', height: '300px',float: 'left'}"></div>
        <div id="finished-price" :style="{ width: '400px', height: '300px',float: 'right'}"></div>
      </div>
      <div id="canceledList" v-show="canceled">
        <div id="canceled-order" :style="{ width: '400px', height: '300px',float:'left'}" ></div>
        <div id="canceled-price" :style="{ width: '400px', height: '300px',float:'right'}" ></div>
      </div>
      <div id="byProductList" v-show="byProductType">
      <div id="byProductType-order" :style="{ width: '400px', height: '300px',float:'left'}"></div>
      <div id="byProductType-price" :style="{ width: '400px', height: '300px',float:'right'}"></div>
    </div>
      <div id="byHour-list" v-show="byHour">
      <div id="byHour-order" :style="{ width: '400px', height: '300px',float:'left'}"></div>
      <div id="byHour-price" :style="{ width: '400px', height: '300px',float:'right'}"></div>
    </div>
      <div id="byMonth-ist" v-show="byMonth">
        <div id="byMonth-order" :style="{ width: '400px', height: '300px',float:'left'}"></div>
        <div id="byMonth-price" :style="{ width: '400px', height: '300px',float:'right'}"></div>
      </div>
        <div id="byDay-list" v-show="byDay">
         <div id="byDay-order" :style="{ width: '400px', height: '300px',float:'left'}"></div>
         <div id="byDay-price" :style="{ width: '400px', height: '300px',float:'right'}"></div>
        </div>
    </template>
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
   /* created: function() {
      this.search();
    },*/
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
        let finishedOrder = []
        for (let order in this.finished) {
          finishedOrder.push({name: order, value: this.finished[order].number,})
        }
        //成交金额
        let finishedPrice = []
        for (let order1 in this.finished) {
          finishedPrice.push({name: order1, value: this.finished[order1].price,})
        }
        //取消订单
        let canceledOrder = []
        for(let order in this.canceled) {
          canceledOrder.push({name:order, value: this.canceled[order].number})
        }
        //取消金额
        let canceledPrice = []
        for(let order1 in this.canceled) {
          canceledPrice.push({name:order1, value: this.canceled[order1].price})
        }
        //消费类别
        let byProductTypeOrder = []
        for(let type in this.byProductType) {
          byProductTypeOrder.push({name:type, value: this.byProductType[type].number})
        }
        //消费类别
        let byProductTypePrice = []
        for(let type1 in this.byProductType) {
          byProductTypePrice.push({name:type1, value: this.byProductType[type1].price})
        }
        //小时订单
        let byHourOrder = []
        for(let order in this.byHour){
          byHourOrder.push({name:order + '点' , value: this.byHour[order].number})
        }
        //小时金额
        let byHourPrice = []
        for(let order in this.byHour){
          byHourPrice.push({name:order + '点', value: this.byHour[order].price})
        }
        //月份订单数
        let byMonthOrder = []
        for(let order in this.byMonth){
          byMonthOrder.push({name:order + '月', value: this.byMonth[order].number})
        }
        //月份销售额
        let byMonthPrice = []
        for(let order in this.byMonth){
          byMonthPrice.push({name:order + '月', value: this.byMonth[order].price})
        }
        //日成交订单数
        let byDayOrder = []
        for(let order in this.byDay){
          byDayOrder.push({name:order + '号', value: this.byDay[order].number})
        }
        //日销售额
        let byDayPrice = []
        for(let order in this.byDay){
          byDayPrice.push({name:order + '号', value: this.byDay[order].price})
        }

        //成交订单
        let finishedOrderDiv = echarts.init(document.getElementById('finished-order'))
        finishedOrderDiv.setOption({
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
            data: finishedOrder.map(function (data) {return data.name})
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
              data: finishedOrder
            }
          ]
        })
        //已成交金额
        let finishedPriceDiv = echarts.init(document.getElementById('finished-price'))
        finishedPriceDiv.setOption({
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
            data: finishedPrice.map(function (data) {return data.name})
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
              data: finishedPrice
            }
          ]
        })
        //未成交订单
        let canceledOrderDiv = echarts.init(document.getElementById('canceled-order'))
        canceledOrderDiv.setOption({
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
            data: canceledOrder.map(function (data) {return data.name})
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
              data: canceledOrder
            }
          ]
        })
        //未成交金额
        let canceledPriceDiv = echarts.init(document.getElementById('canceled-price'))
        canceledPriceDiv.setOption({
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
            data: canceledPrice.map(function (data) {return data.name})
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
              data: canceledPrice
            }
          ]
        })
        //按销售类别分类
        let byProductOrderDiv = echarts.init(document.getElementById('byProductType-order'))
        byProductOrderDiv.setOption({
          title: {text: '消费类别订单量',
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
            data:byProductTypeOrder.map(function (data) {return data.name})
          },
          series : [
            {
              name: '订单数量',
              type: 'pie',
              radius: '55%',
              data: byProductTypeOrder
            }
          ]
        })
        //按销售类别分类
        let byProductPriceDiv = echarts.init(document.getElementById('byProductType-price'))
        byProductPriceDiv.setOption({
          title: {text: '消费类别销售额',
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
            data:byProductTypePrice.map(function (data) {return data.name})
          },
          series : [
            {
              name: '销售额',
              type: 'pie',
              radius: '55%',
              data: byProductTypePrice
            }
          ]
        })

        let byHourOrderDiv = echarts.init(document.getElementById('byHour-order'))
        byHourOrderDiv.setOption({
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
            data: byHourOrder.map(function (data) {return data.name})
          },
          yAxis: {

          },
          series: [{
            color: '#4000FF',
            name: '订单数量',
            type: 'bar',
            data: byHourOrder
          }]
        })
        let byHourPriceDiv = echarts.init(document.getElementById('byHour-price'))
        byHourPriceDiv.setOption({
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
            data: byHourPrice.map(function (data) {return data.name})
          },
          yAxis: {

          },
          series: [{
            name: '销售额',
            type: 'bar',
            data: byHourPrice
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
            color: '#4000FF',
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
        //日销售额
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
        //日订单
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
            color: '#4000FF',
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

