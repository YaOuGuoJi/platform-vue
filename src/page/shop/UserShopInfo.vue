<template>
  <div>
    <div>
      <shop-index></shop-index>
    </div>
    <template>
      <div class="row">
        <span>
          <input v-model="start" class="balloon" type="date" id="start"/><label for="start">开始时间</label>
        </span>
        <span>
          <input v-model="end" class="balloon" type="date" id="end"/><label for="end">结束时间</label>
        </span>
        <span>
          <button id="btn" class="button" v-on:click="search()">点击查询</button>
        </span>
      </div>
    </template>
    <div v-show="test" id="foot">
      <p align="left">共有{{number}}位顾客在该店消费过，具体信息如下：
      </p>
      <table border="0px">
        <tr>
          <td>
            <p align="left">男性顾客:{{numberOfMale}}位,女性顾客:{{numberOfFemale}}位</p>
            <div>
              <div id="male"></div>
              <div id="female"></div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <br/><br/>
            <div>
              <div id="price"></div>
              <div id="frequency"></div>
            </div>
          </td>
        </tr>
      </table>
    </div>

  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import echarts from 'echarts'
  import {btnAnimation} from "../../../static/js/buttonJS";
  import ShopIndex from "../../components/ShopIndex";
  import {service} from "../../js/api";


  export default {
    name: 'userShopInfo',
    components: {ShopIndex},
    data() {
      return {
        start: '2018-01-01',
        end: '2019-01-01',
        test: null,
        number: 0,
        numberOfMale: 0,
        numberOfFemale: 0
      }
    },
    mounted() {
      this.isLogin();
    },
    methods: {
      search: function () {
        btnAnimation()
        service('get', '/shop/consumer/analysis', {
          start: this.start + " 00:00:00",
          end: this.end + " 23:59:59"
        }).then(response => {
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
        this.test = response.data.price.averagePrice

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
            subtextStyle: {color: '#696969'},
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

        let price = echarts.init(document.getElementById("price"))
        price.setOption({
          title: {
            text: '顾客消费额',
            subtext: '总消费额为' + response.data.price.totalPrice.toFixed(2) + '，平均消费额为' + response.data.price.averagePrice.toFixed(2),
            subtextStyle: {color: '#696969'},
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

        var maleMap = response.data.sexAndAge.male;
        var maleName = []
        var maleNameAndValue = []
        let maleNum = 0
        for (var key in maleMap) {
          maleName.push(key + '岁')
          maleNameAndValue.push({value: maleMap[key], name: key + '岁'})
          maleNum = maleNum + maleMap[key]
        }
        this.numberOfMale = maleNum
        let male = echarts.init(document.getElementById("male"))
        male.setOption({
          title: {
            text: '男性顾客年龄分布',
            subtext: '共' + this.numberOfMale + '位',
            subtextStyle: {color: '#696969'},
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
        let femaleNum = 0
        for (var key in femaleMap) {
          femaleName.push(key + '岁')
          femaleNameAndValue.push({value: femaleMap[key], name: key + '岁'})
          femaleNum = femaleNum + femaleMap[key]
        }
        this.numberOfFemale = femaleNum
        this.number = femaleNum + maleNum
        let female = echarts.init(document.getElementById("female"))
        female.setOption({
          title: {
            text: '女性顾客年龄分布',
            subtext: '共' + this.numberOfFemale + '位',
            subtextStyle: {color: '#696969'},
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

      },
      isLogin() {
        axios.get('/api/shop/isLogin').then((response => {
          if (response.data.code !== 200 || !response.data.data) {
            this.$router.push('/shop/login')
          }
        }))
      },
    }
  }
</script>
<style scoped>
  @import "../../../static/css/buttonAndInput.css";

  #foot {
    margin-left: 25%;
  }

  #price {
    float: left;
    width: 550px;
    height: 320px;
  }

  #frequency {
    float: left;
    width: 550px;
    height: 320px;
  }

  #male {
    float: left;
    width: 550px;
    height: 300px;
  }

  #female {
    float: left;
    width: 550px;
    height: 300px;
  }

</style>
