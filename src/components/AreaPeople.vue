<template>
  <div class="area_people_chart">
    <div id="chart" :style="{ width: '800px', height: '600px'}"></div>
    <div id="pieChart" :style="{ width: '800px', height: '500px'}"></div>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import echarts from 'echarts'

  export default {
    name: 'AreaPeople',
    data() {
      return {
        areaPeopleList: ''
      }
    },
    mounted() {
      this.nowAreaPeople()
    },
    methods: {
      nowAreaPeople() {
        this.areaPeople();
        setInterval(this.areaPeople, 1000);
      },
      areaPeople() {
        axios.get('/api/selectAreaPeopleNumber')
          .then((response) => {
            if (response.status !== 200 || !response.data) {
              window.alert('请求失败')
            }
            this.dataInvoker(response.data)
          })
      },
      dataInvoker(response) {
        if (!response.success || response.code !== 200) {
          window.alert(response.message)
          return
        }
        console.log(response)
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
    }
  }
</script>
