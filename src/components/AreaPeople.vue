<template>
  <div class="area_people_chart">
    <div id="chart" :style="{ width: '800px', height: '700px'}"></div>
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
        legend: {
          data:['区域人数']
        },
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
    }
  }
}
</script>
