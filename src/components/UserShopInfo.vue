<template>
  <div>
    <h2>用户消费信息</h2>
    <div id="frequency"></div>
    <div id="price"></div>
    <div id="male"></div>
    <div id="female"></div>
    <!--<div id="test"></div>-->
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import echarts from 'echarts'

  export default {
    name: 'userShopInfo',
    data() {
      return {}
    },
    mounted() {
      axios.get('/api/shop/consumer/analysis', {
        params: {
          shopId: 100001,
          start: '2016-09-01 00:00:00',
          end: '2018-12-31 00:00:00'
        }
      }).then((response) => {
        if (response.status !== 200 || !response.data) {
          window.alert('请求失败')
        }
        this.dataInvoker(response.data)
      })
    },
    methods: {
      dataInvoker(response) {
        if (!response.success || response.code !== 200) {
          window.alert(response.message)
          return
        }
        console.log(response)
        let price = echarts.init(document.getElementById("price"))
        price.setOption({
          title: {
            text: '顾客消费额',
            subtext: '总消费额为' + response.data.price.totalPrice + '，平均消费额为' + response.data.price.averagePrice,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['小于平均消费额', '平均消费额附近', '大于平均消费额']
          },
          series: [
            {
              name: '人数',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: response.data.price.distributed.lessAverage, name: '小于平均消费额'},
                {value: response.data.price.distributed.nearAverage, name: '平均消费额附近'},
                {value: response.data.price.distributed.overAverage, name: '大于平均消费额'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
        var frequencySplit = [];
        var frequencyMessage = [];
        var frequencyMap = response.data.frequency.distributed;
        for (var key in frequencyMap) {
          frequencySplit.push(key + '次')
          frequencyMessage.push({value: frequencyMap[key], name: key + '次'})
        }
        let frequency = echarts.init(document.getElementById("frequency"))
        frequency.setOption({
          title: {
            text: '顾客消费次数',
            subtext: '总消费次数为' + response.data.frequency.totalFrequency + '，平均消费额为' + response.data.frequency.averageFrequency,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: frequencySplit
          },
          series: [
            {
              name: '人数',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: frequencyMessage,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });

        var maleMap = response.data.sexAndAge.male;
        var maleName = []
        var maleNameAndValue = []

        for (var key in maleMap) {
          maleName.push(key + '岁')
          maleNameAndValue.push({value: maleMap[key], name: key + '岁'})
        }
        let male = echarts.init(document.getElementById("male"))
        male.setOption({
          title: {
            text: '男性顾客年龄分布',
            subtext: '模拟',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: maleName,
          },
          series: [
            {
              name: '人数',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: maleNameAndValue,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
        var femaleMap = response.data.sexAndAge.female;
        var femaleName = []
        var femaleNameAndValue = []
        for (var key in femaleMap) {
          femaleName.push(key + '岁')
          femaleNameAndValue.push({value: femaleMap[key], name: key + '岁'})
        }
        let female = echarts.init(document.getElementById("female"))
        female.setOption({
          title: {
            text: '女性顾客年龄分布',
            subtext: '模拟',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: femaleName,
          },
          series: [
            {
              name: '人数',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: femaleNameAndValue,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      }
    }

  }
</script>
<style scoped>
  #price {
    width: 550px;
    height: 350px;
  }

  #frequency {
    width: 550px;
    height: 350px;
  }

  #male {
    width: 550px;
    height: 350px;
  }

  #female {
    width: 550px;
    height: 350px;
  }
</style>
