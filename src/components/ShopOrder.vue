<template>
  <div>
    <div><h2>商户订单列表</h2></div>
    <template>
      <div class="row">
        <span>
          <input v-model="shopId" class="balloon" id="shopId" type="text" placeholder="请输入商户id"/><label for="shopId">商户ID</label>
        </span>
        <span>
          <input v-model="start" class="balloon" id="start" type="date" placeholder="请输入开始时间"/><label for="start">开始时间</label>
        </span>
        <span>
          <input v-model="end" class="balloon" id="end" type="date" placeholder="请输入结束时间"/><label for="end">结束时间</label>
        </span>
        <span>
          <button id="btn" class="button" v-on:click="pageNum=1, search()">点击查询</button>
        </span>
      </div>

    </template>
    <h2></h2>
    <template v-if="shopInfo">
      <div id="shop-info">
        <table border="1">
          <tr>
            <th>商户Id</th>
            <th width="80px">商户名称</th>
            <th width="120px">分店名称</th>
            <th>商户Logo</th>
            <th>商户类型</th>
            <th>地址</th>
            <th>人均价格</th>
            <th>店主姓名</th>
            <th>联系电话</th>
          </tr>
          <tr>
            <td bgcolor="#add8e6">{{ shopInfo.shopId }}</td>
            <td>{{ shopInfo.shopName }}</td>
            <td>{{ shopInfo.branchName }}</td>
            <td><img v-bind:src="shopInfo.shopLogo" width="100px" height="60px"></td>
            <td>{{ shopInfo.shopType }}</td>
            <td>{{ shopInfo.address }}</td>
            <td>¥{{ shopInfo.avgPrice }}</td>
            <td>{{ shopInfo.shopOwner }}</td>
            <td>{{ shopInfo.phoneNo }}</td>
          </tr>
        </table>
      </div>
      <div class="order-list">
        <h3>订单列表</h3>
        <table id="alternatecolor" class="altrowstable">
          <tr>
            <th>序列</th>
            <th>下单时间</th>
            <th>总价</th>
            <th>用户Id</th>
            <th>商品列表</th>
            <th>商品类型</th>
            <th>支付方式</th>
            <th>订单状态</th>
          </tr>
          <tr v-for="(order,index) in pageInfo.list" :key="order.orderId" :class="{on:index%2===0,off:index%2!==0}">
            <td>{{ index+1 }}</td>
            <td>{{ buildDate(order.addTime) }}</td>
            <td>¥{{ order.price.toFixed(2) }}</td>
            <td>{{ order.userId }}</td>
            <td>{{ order.productList }}</td>
            <td>{{ order.productType }}</td>
            <td>{{ order.payType }}</td>
            <td>{{ order.orderStatus }}</td>
          </tr>
        </table>
        <div class="page-bar">
          <ul>
            <li v-if="pageInfo.isFirstPage"><a class="banclick">上一页</a></li>
            <li v-else><a v-on:click="pageNum--, search()">上一页</a></li>
            <li v-for="index in pageInfo.pages" v-bind:class="{ 'active': pageNum === index}" :key="index"><a
              v-on:click="pageNum = index, search()">{{ index }}</a></li>
            <li v-if="pageInfo.isLastPage"><a class="banclick">下一页</a></li>
            <li v-else><a v-on:click="pageNum++, search()">下一页</a></li>
            <li><a>共<i>{{ pageInfo.pages }}</i>页</a></li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import {btnAnimation} from '../../static/js/buttonJS'

  export default {
    name: 'ShopOrder',
    data () {
      return {
        shopId: 100009,
        start: '2018-01-01',
        end: '2019-01-01',
        pageNum: 1,
        pageSize: 30,
        shopInfo: null,
        pageInfo: null
      }
    },
    methods: {
      search: function () {
        btnAnimation()
        axios.get('/api/order/shop/page', {
          params: {
            shopId: this.shopId,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            start: this.start + ' 00:00:00',
            end: this.end + ' 00:00:00'
          }
        }).then(response => {
          if (response.status !== 200 || !response.data) {
            window.alert('请求失败!')
          }
          this.dataInvoker(response.data)
        })
      },
      dataInvoker: function (response) {
        if (!response.success || response.code !== 200) {
          window.alert(response.data)
          return
        }
        console.log(response)
        if (!response.data.pageInfo) {
          window.alert('该商户在指定时间内无订单！')
          return
        }
        this.shopInfo = response.data.shopInfo
        this.pageInfo = response.data.pageInfo
      },
      buildDate: function (str) {
        let date = new Date(str),
          year = date.getFullYear(),
          // 月份从0开始，需要+1
          month = date.getMonth() + 1,
          day = date.getDate(),
          hour = date.getHours(),
          min = date.getMinutes()
        return year + '-' +
          (month < 10 ? '0' + month : month) + '-' +
          (day < 10 ? '0' + day : day) + ' ' +
          (hour < 10 ? '0' + hour : hour) + ':' +
          (min < 10 ? '0' + min : min)
      }
    }
  }
</script>

<style scoped>
  @import "../../static/css/buttonAndInput.css";
  .order-list {
    width: 800px;
    height: 400px;
    display: table-cell;
    vertical-align: middle;
  }

  body {
    text-align: center;
  }

  table {
    margin-left: auto;
    margin-right: auto;
  }
  .altrowstable{
    margin-left: 30%;
  }

  .page-bar {
    text-align: center;
    overflow: hidden;
  }

  .page-bar ul {
    display: table;
    margin: 40px auto;
  }

  .page-bar li {
    display: table-cell;
  }

  .page-bar a {
    border: 1px solid #ddd;
    text-decoration: none;
    position: relative;
    float: left;
    padding: 6px 12px;
    margin-left: -1px;
    line-height: 1.42857143;
    color: #337ab7;
    cursor: pointer
  }

  .page-bar a:hover {
    background-color: #eee;
  }

  .page-bar a.banclick {
    cursor: not-allowed;
  }

  .page-bar .active a {
    color: #fff;
    cursor: default;
    background-color: #337ab7;
    border-color: #337ab7;
  }

  .page-bar i {
    font-style: normal;
    color: #d44950;
    margin: 0px 4px;
    font-size: 12px;
  }

  table.altrowstable {
    font-family: verdana,arial,sans-serif;
    font-size:11px;
    color:#333333;
    border-width: 1px;
    border-color: #a9c6c9;
    border-collapse: collapse;
    width: 1200px;
  }

  table.altrowstable th {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #a9c6c9;
    width: 300px;
    margin-left: 800px;
  }

  table.altrowstable td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #a9c6c9;
  }

  .on {
    background-color:#d4e3e5;
    border: 1px solid blue;
  }

  .off {
    background-color:#c3dde0;
    border: 1px solid black;
  }
</style>
