<template>
  <div class="body">
    <h2>区域内商铺的销售量与销售额排名</h2>
   <div>
     <template>
       <div class="row">
         <form @submit.prevent="search">
           <span>
             <input v-model="areaId" class="balloon" id="areaId" type="text"/><label for="areaId">区域ID</label>
           </span>
           <span>
             <input v-model="start" class="balloon" id="start" type="date"/><label for="start">开始时间</label>
           </span>
           <span>
             <input v-model="end" class="balloon" id="end" type="date"/><label for="end">结束时间</label>
           </span>
           <span>
             <input v-model="limit" class="balloon" id="limit" type="text"/><label for="limit">限制</label>
           </span>
           <span>
             <button id="btn" class="button">点击查询</button>
           </span>
         </form>
       </div>
     </template>
   </div>
    <div class="shop_count_rank">
    <template v-if="shopPriceInfo" class="shop_price">
      <table>
        <tr>
          <th width="100px">排名</th>
          <th width="100px">商铺Logo</th>
          <th>商铺id</th>
          <th width="180px">商铺名称</th>
          <th>商铺类型</th>
          <th>销售额(人民币元)</th>
        </tr>
        <tr v-for="(shopInfo, index) in shopPriceInfo">
          <td>{{index+1}}</td>
          <td><img v-bind:src="shopInfo.dtoObject.shopLogo" width="100px" height="50px"></td>
          <td>{{shopInfo.dtoObject.shopId}}</td>
          <td>{{shopInfo.dtoObject.shopName}}</td>
          <td>{{shopInfo.dtoObject.shopType}}</td>
          <td>{{shopInfo.number.toFixed(2)}}</td>
        </tr>
      </table>
    </template>
    <div id="price_chart" class="price_table"></div>
    </div>
    <div class="shop_price_rank">
    <template v-if="shopCountInfo" class="shop_count">
      <table>
        <tr>
          <th width="100px">排名</th>
          <th width="100px">商铺Logo</th>
          <th>商铺id</th>
          <th width="180px">商铺名称</th>
          <th>商铺类型</th>
          <th>销售量(单)</th>
        </tr>
        <tr v-for="(shopInfo, index) in shopCountInfo">
          <td>{{index+1}}</td>
          <td><img v-bind:src="shopInfo.dtoObject.shopLogo" width="100px" height="50px"></td>
          <td>{{shopInfo.dtoObject.shopId}}</td>
          <td>{{shopInfo.dtoObject.shopName}}</td>
          <td>{{shopInfo.dtoObject.shopType}}</td>
          <td>{{shopInfo.number}}</td>
        </tr>
      </table>
    </template>
    <div id="count_chart" class="count_table"></div>
    </div>
    </div>
</template>
<script type="text/javascript">
import axios from 'axios'
import echarts from 'echarts'
import {btnAnimation} from '../../static/js/buttonJS'

export default {
name: 'AreaShopRank',
data () {
  return {
    areaId: 1,
    start: '2018-08-01',
    end: '2018-10-01',
    limit: 10,
    shopCountInfo: null,
    shopPriceInfo: null,
    submit: true
  }
},
methods: {
  search: function () {
    btnAnimation()
    axios.get('/api/area/shop/rank', {
      params: {
        areaId: this.areaId,
        start: this.start + " 00:00:00",
        end: this.end + " 23:59:59",
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
    const count = response.data.orderCount.map(function (shop) {
      return shop.number;
    });
    const countShopName = response.data.orderCount.map(function (shopRank) {
      return shopRank.dtoObject.shopName
    });
    this.shopCountInfo = response.data.orderCount.map(function (shopRank) {
      return shopRank
    });
    let number = response.data.orderCount.length <= 10 ? 40 : 0;
    let countchart = echarts.init(document.getElementById('count_chart'));
    countchart.setOption({
      title: {
        text: '区域内商铺销售量前' + response.data.orderCount.length + '名',
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
          color:'#aaaaaa',
        },
      },
      grid: {//设置图表位置
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        color:'#aaaaaa',
        splitLine : {//去掉网格线
          show : false
        },
        axisLine : {
          lineStyle : {
            color : '#aaaaaa'
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
          barWidth : number,//柱子宽度
          itemStyle : {
            normal : {
              color: '#cd5c5c',//柱状的颜色
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
      return shop.number.toFixed(2);
    });
    const priceShopName = response.data.orderPrice.map(function (shopRank) {
      return shopRank.dtoObject.shopName
    });
    let pricechart = echarts.init(document.getElementById('price_chart'));
    pricechart.setOption({
      title: {
        text: '区域内商铺销售额前' + response.data.orderCount.length + '名',
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
          color:'#aaaaaa',
        },
      },
      grid: {//设置图表位置
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        color:'#aaaaaa',
        splitLine : {//去掉网格线
          show : false
        },
        axisLine : {
          lineStyle : {
            color : '#aaaaaa',
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
          barWidth : number,//柱子宽度
          itemStyle : {
            normal : {
              color:'#5f9ea0' +
              '',//柱状的颜色
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
<style scoped>
  @import "../../static/css/buttonAndInput.css";
  .body{
    height: 2000px;
    z-index: 1;
  }
  #count_chart{
    text-align: center;
    width: 700px;
    height: 600px;
    margin-top: 50px;
    margin-left: -15px;
  }
  #price_chart{
    text-align: center;
    width: 700px;
    height: 600px;
    margin-top: 50px;
    margin-left: -15px;
    z-index: -99;
  }
  .shop_count_rank{
    width: 700px;
    height: 800px;
    margin-top: 50px;
    margin-left: 12%;
  }
  .shop_price_rank{
    position: absolute;
    width: 700px;
    height: 800px;
    margin-top: 50px;
    float: left;
    margin-left: 55%;
    margin-top: -800px;
  }
  table th{
    font-family: verdana,arial,sans-serif;
    border-collapse: collapse;
    border-width: 1px;
    border-style: solid;
    border-color: #aaaaaa;
  }
  table td{
    font-family: verdana,arial,sans-serif;
    border-color: #aaaaaa;
    border-collapse: collapse;
    border-width: 1px;
    border-style: solid;
  }
  .price_table{
    margin-left: -100px;
  }
  .count_table{
    margin-left: -80px;
    border-width: 1px;
  }
</style>
