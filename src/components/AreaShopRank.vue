<template>
  <div>
   <div>
     <form>
       <input type="text" v-model="areaId" placeholder="请输入区域id"/>
       <input type="date" v-model="start" placeholder="请输入开始时间"/>
       <input type="date" v-model="end" placeholder="请输入结束时间"/>
       <input type="text" v-model="limit" placeholder="请输入限制"/>
       <button type="submit" v-on:click="search()">查询</button>
     </form>
   </div>
   <div id="chart">111</div>
 </div>
</template>
<script type="text/javascript">
import axios from 'axios'
export default {
  name: 'AreaShopRank',
  Date () {
    return {
      areaId: 1,
      start: '2018-09-01 00:00:00',
      end: '2018-10-01 00:00:00',
      limit: 10
    }
  },
  methods: {
    search: function () {
      axios.get('api/area/shop/rank', {
        params: {
          areaId: this.areaId,
          start: this.start,
          end: this.end,
          limit: this.limit
        }
      }).then(response => {
        if (response.status !== 200 || !response.data) {
          window.alert('请求失败!')
        }
        this.dataInvoker(response.data)
      })
    },
    dataInvoker: function (response) {
      if (!response.success || response.code !== 200){
        window.alert(response.date)
        return
      }
      const count = response.date.map(function (count) {
        return count.number
      })
      const shopName = response.date.map(function (shopName) {
        return shopName.dtoObject.shopName
      })
      const shopInfo = response.date.map(function (shopInfo) {
        return shopInfo.objectMapDto
      })
      let chart = echarts.init(document.getElementById('chart'))
      chart.setOption({
        title: '区域内前几名商铺排名',
        xAxis: {},
        yAxis: {type: 'category'},
        series: {
          type: 'bar',
          name: '商铺信息',
          data: shopInfo,
          x: count,
          y: shopName
        }
      })

    }
  }
}
</script>
<style>
  #chart{
    text-align: center;
    background-color: darkseagreen;
    width: 700px;
    height: 600px;
    margin-left: 600px;
  }
</style>
