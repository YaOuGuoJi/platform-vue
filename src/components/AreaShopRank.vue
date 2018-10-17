<template>
  <div>
    <h2>区域内商铺的销售量与销售额排名</h2>
   <div>
     <template>
       <div>
         <form @submit.prevent="submit">
           <label>区域id：</label>
           <input v-model="areaId" placeholder="请输入区域id"/>
           <label>开始时间：</label>
           <input v-model="start" placeholder="请输入开始时间"/>
           <label>结束时间：</label>
           <input v-model="end" placeholder="请输入结束时间"/>
           <label>限制：</label>
           <input v-model="limit" placeholder="请输入限制"/>
           <button v-on:click="search()">查询</button>
         </form>
       </div>
     </template>
   </div>
    <div class="shopCountRank">
    <template v-if="shopPriceInfo" class="shopPrice">
      <table border='1'>
        <tr>
          <th width="100px" bgcolor="#add8e6">排名</th>
          <th>商铺id</th>
          <th>商铺名称</th>
          <th>商铺类型</th>
          <th>商铺地址</th>
          <th>销售额</th>
        </tr>
        <tr v-for="(shopInfo, index) in shopPriceInfo">
          <td bgcolor="#add8e6">{{index+1}}</td>
          <td>{{shopInfo.dtoObject.shopId}}</td>
          <td>{{shopInfo.dtoObject.shopName}}</td>
          <td>{{shopInfo.dtoObject.shopType}}</td>
          <td>{{shopInfo.dtoObject.address}}</td>
          <td>{{shopInfo.number}}</td>
        </tr>
      </table>
    </template>
    <div id="pricechart"></div>
    </div>
    <div class="shopPriceRank">
    <template v-if="shopCountInfo" class="shopCount">
      <table border="1">
        <tr>
          <th width="100px" bgcolor="#add8e6">排名</th>
          <th>商铺id</th>
          <th>商铺名称</th>
          <th>商铺类型</th>
          <th>商铺地址</th>
          <th>销售量</th>
        </tr>
        <tr v-for="(shopInfo, index) in shopCountInfo">
          <td bgcolor="#add8e6">{{index+1}}</td>
          <td>{{shopInfo.dtoObject.shopId}}</td>
          <td>{{shopInfo.dtoObject.shopName}}</td>
          <td>{{shopInfo.dtoObject.shopType}}</td>
          <td>{{shopInfo.dtoObject.address}}</td>
          <td>{{shopInfo.number}}</td>
        </tr>
      </table>
    </template>
    <div id="countchart"></div>
    </div>
    </div>
</template>
<script type="text/javascript">
import axios from 'axios'
import echarts from 'echarts'
export default {
name: 'AreaShopRank',
data () {
  return {
    areaId: 1,
    start: '2018-09-01 00:00:00',
    end: '2018-10-01 00:00:00',
    limit: 10,
    shopCountInfo: null,
    shopPriceInfo: null,
    submit: true
  }
},
methods: {
  search: function () {
    axios.get('/api/area/shop/rank', {
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
      window.alert(response.data);
      return
    }
    console.log(response.data);
    const count = response.data.orderCount.map(function (shop) {
      return shop.number;
    });
    const countShopName = response.data.orderCount.map(function (shopRank) {
      return shopRank.dtoObject.shopName
    });
    this.shopCountInfo = response.data.orderCount.map(function (shopRank) {
      return shopRank
    });
    let countchart = echarts.init(document.getElementById('countchart'));
    countchart.setOption({
      title: {
        text: '区域内商铺销售量前几名排名',
        x: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        textStyle:{
          color:'#fff',
        },
      },
      grid: {//设置图表位置
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        color:'#fff',
        splitLine : {//去掉网格线
          show : false
        },
        axisLine : {
          lineStyle : {
            color : '#FFF'
          },
        },
      },
      yAxis: {

        type: 'category',//轴的类型分两种 1.category（类别）2.value(值)
        data: countShopName,
        axisLabel : {
          show : true,
          textStyle : {
            color : '#110022',
            align : 'right',
            fontSize: 15    /*文字大小*/
          }
        },
        axisLine : {
          lineStyle : {
            color : '#110022'//轴的颜色
          },
          onZero: false
        },
        axisTick : {
          lineStyle : {
            color : '#110022'//轴上点的颜色
          }
        },
        inverse: true
      },
      series: [
        {
          type: 'bar',
          data: count,
          label : {
            normal : {
              show : true,//显示数字
              position : 'right'
            }
          },

          barWidth : 40,//柱子宽度
          itemStyle : {
            normal : {
              color: '#F08080',//柱状的颜色
              label : {
                textStyle : {
                  fontSize : '15',//柱状上的显示的文字
                  color:'#110022'
                }
              }
            }
          },

        }

      ]
    });
    this.shopPriceInfo = response.data.orderPrice.map(function (shopRank) {
      return shopRank
    });
    const price = response.data.orderPrice.map(function (shop) {
      return shop.number;
    });
    const priceShopName = response.data.orderPrice.map(function (shopRank) {
      return shopRank.dtoObject.shopName
    });
    let pricechart = echarts.init(document.getElementById('pricechart'));
    pricechart.setOption({
      title: {
        text: '区域内商铺销售额前几名排名',
        x: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        textStyle:{
          color:'#fff',
        },
      },
      grid: {//设置图表位置
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        color:'#fff',
        splitLine : {//去掉网格线
          show : false
        },
        axisLine : {
          lineStyle : {
            color : '#FFF'
          },
        },
      },
      yAxis: {

        type: 'category',//轴的类型分两种 1.category（类别）2.value(值)
        data: priceShopName,
        axisLabel : {
          show : true,
          textStyle : {
            color : '#110022',
            align : 'right',
            fontSize: 15    /*文字大小*/
          }
        },
        axisLine : {
          lineStyle : {
            color : '#110022'//轴的颜色
          },
          onZero: false
        },
        axisTick : {
          lineStyle : {
            color : '#110022'//轴上点的颜色
          }
        },
        inverse: true
      },
      series: [
        {
          type: 'bar',
          data: price,
          label : {
            normal : {
              show : true,//显示数字
              position : 'right'
            }
          },

          barWidth : 40,//柱子宽度
          itemStyle : {
            normal : {
              color:'#9f9ff2',//柱状的颜色
              label : {
                textStyle : {
                  fontSize : '15',//柱状上的显示的文字
                  color:'#110022'
                }
              }
            }
          },

        }

      ]

    })
  }
}
}
</script>
<style>
  #countchart{
    text-align: center;
    width: 700px;
    height: 600px;
  }
  #pricechart{
    text-align: center;
    width: 700px;
    height: 600px;
  }
  .shopCountRank{
    width: 700px;
    height: 800px;
    margin-left: 0px;
    margin-top: 50px;
  }
  .shopPriceRank{
    width: 700px;
    height: 800px;
    margin-top: 50px;
    float: left;
    margin-left: 850px;
    margin-top: -800px;
  }
</style>
