<template>
  <div class="area_people_chart">
    <div>
      <shop-index></shop-index>
    </div>
    <div id="chart" :style="{ width: '800px', height: '600px'}"></div>
    <div id="pieChart" :style="{ width: '800px', height: '500px'}"></div>
  </div>
</template>
<style scoped>
  .area_people_chart {
    text-align: center;
    margin: 0 auto;
  }

  #chart {
    display: block;
    margin: 0 auto;
  }

  #pieChart {
    display: block;
    margin: 0 auto;
  }
</style>
<script type="text/javascript">
  import {service} from "../../js/api";
  import echarts from 'echarts'
  import ShopIndex from "../../components/ShopIndex";

  export default {
    name: 'AreaPeople',
    components: {ShopIndex},
    data() {
      return {
        areaPeopleList: '',
        interval: 0
      }
    },
    created() {
      this.areaPeople();
      this.interval = setInterval(this.areaPeople, 3 * 1000)
    },
    methods: {
      areaPeople() {
        service('get', '/selectAreaPeopleNumber', {}).then(response => {
          if (response === undefined) {
            return
          }
          if (response.code !== 200) {
            alert(response.message)
          }
          this.dataInvoker(response)
        })
      },
      dataInvoker(response) {
        if (!response.success || response.code !== 200) {
          window.alert(response.message)
          return
        }
        let seriesData = []
        response.data.forEach(function (item) {
          let outObj = {}
          outObj.name = item.dtoObject.aname
          outObj.value = item.number
          seriesData.push(outObj)
        })
        let chart = echarts.init(document.getElementById('chart'))
        chart.setOption({
          title: {text: '区域人数实时统计'},
          tooltip: {},
          xAxis: {
            data: seriesData.map(function (area) {
              return area.name
            })
          },
          yAxis: {},
          series: [{
            name: '区域人数',
            type: 'bar',
            data: seriesData.map(function (area) {
              return area.value
            })
          }]
        })
        let pieChart = echarts.init(document.getElementById('pieChart'))
        pieChart.setOption({
          title: {text: '占比分析'},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: seriesData.map(function (area) {
              return area.name
            }),
          },
          series: [
            {
              name: '区域人数',
              type: 'pie',
              radius: '80%',
              data: seriesData
            }
          ]
        })
      }
    },
    beforeDestroy() {
      clearInterval(this.interval)
    }
  }
</script>
