<template>
  <div class="area_people_chart">
    <div id="chart" :style="{ width: '800px', height: '600px'}"></div>
    <div id="pieChart" :style="{ width: '600px', height: '500px'}"></div>
  </div>
</template>

<script type="text/javascript">
import axios from 'axios'
import echarts from 'echarts'
export default {
  name: 'AreaPeople',
  data () {
    return {
      areaPeopleList: ''
    }
  },
  mounted () {
    axios.get('/api/selectAreaPeopleNumber')
      .then((response) => {
        if (response.status !== 200 || !response.data) {
          window.alert('请求失败')
        }
        this.dataInvoker(response.data)
      })
  },
  methods: {
    dataInvoker (response) {
      if (!response.success || response.code !== 200) {
        window.alert(response.message)
        return
      }
      console.log(response)
      const names = response.data.map(function (area) {
        return area.dtoObject.aname
      })
      const peoples = response.data.map(function (area) {
        return area.number
      })
      let chart = echarts.init(document.getElementById('chart'))
      chart.setOption({
        title: {text: '区域人数实时统计'},
        tooltip: {},
        xAxis: {
          data: names
        },
        yAxis: {},
        series: [{
          name: '区域人数',
          type: 'bar',
          data: peoples
        }]
      })
      let pieChart = echarts.init(document.getElementById('pieChart'))
      let seriesData = [];
      response.data.forEach(function(item) {
        let outObj = {};
        outObj.name = item.dtoObject.aname;
        outObj.value = item.number;
        seriesData.push(outObj);
      });
      pieChart.setOption({
        title: {text: '区域人数分布饼图'},
        series : [
          {
            name: '区域人数',
            type: 'pie',
            radius: '80%',
            roseType: 'angle',
            data: seriesData
          }
        ]
      })
    }
  }
}
</script>
