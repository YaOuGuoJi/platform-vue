<template>
  <div class="user-order">
    <div class="input-form">
      UserId:<input v-model="userId" type="text"/>
      开始时间:<input v-model="start" type="date"/>
      结束时间:<input v-model="end" type="date"/>
      <button v-on:click="pageNum=1, search()">查询</button>
    </div>
    <h2></h2>
    <template v-if="userInfo">
      <div class="user-info">
        <table border="1">
          <tr>
            <th width="100px">用户Id</th>
            <th width="100px">用户名</th>
            <th width="50px">性别</th>
            <th width="120px">电话号码</th>
            <th width="200px">邮箱</th>
          </tr>
          <tr>
            <th>{{ userInfo.userId }}</th>
            <th>{{ userInfo.userName }}</th>
            <th>{{ userInfo.sex === 1 ? '男' : '女' }}</th>
            <th>{{ userInfo.phone }}</th>
            <th>{{ userInfo.email }}</th>
          </tr>
        </table>
      </div>
    </template>
    <template v-if="userInfo">
      <template v-if="orderPageInfo.list">
        <div class="order-record">
          <h3 class="order-list">消费记录</h3>
          <table border="1">
            <tr>
              <th width="150px">下单时间</th>
              <th width="60px">总价</th>
              <th width="80px">商户Id</th>
              <th width="200px">商品列表</th>
              <th width="80px">商品类型</th>
              <th width="80px">支付方式</th>
              <th width="80px">订单状态</th>
            </tr>
            <tr v-for="order in orderPageInfo.list" :key="order.orderId">
              <td>{{ buildDate(order.addTime) }}</td>
              <td>¥{{ order.price.toFixed(2) }}</td>
              <td>{{ order.shopId }}</td>
              <td>{{ order.productList }}</td>
              <td>{{ order.productType }}</td>
              <td>{{ order.payType }}</td>
              <td>{{ order.orderStatus }}</td>
            </tr>
          </table>
          <div class="page-bar">
            <ul>
              <li v-if="orderPageInfo.isFirstPage"><a class="banclick">上一页</a></li>
              <li v-else><a v-on:click="pageNum--, search()">上一页</a></li>
              <li v-for="index in orderPageInfo.pages" v-bind:class="{ 'active': pageNum === index}" :key="index"><a
                v-on:click="pageNum = index, search()">{{ index }}</a></li>
              <li v-if="orderPageInfo.isLastPage"><a class="banclick">下一页</a></li>
              <li v-else><a v-on:click="pageNum++, search()">下一页</a></li>
              <li><a>共<i>{{ orderPageInfo.pages }}</i>页</a></li>
            </ul>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'

  export default {
    name: 'UserOrder',
    data () {
      return {
        userId: '100000000',
        userInfo: null,
        orderPageInfo: null,
        pageNum: 1,
        pageSize: 20,
        start: '2018-01-01',
        end: '2019-01-01'
      }
    },
    methods: {
      search: function () {
        axios.get('/api/order/user/page', {
          params: {
            userId: this.userId,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            start: this.start + ' 00:00:00',
            end: this.end + ' 00:00:00'
          }
        }).then(response => {
          console.log(response)
          if (response.status !== 200 || !response.data) {
            window.alert('请求失败')
          }
          this.dataInvoker(response.data)
        })
      },
      dataInvoker: function (response) {
        if (!response.success || response.code !== 200) {
          window.alert(response.message)
          return
        }
        if (!response.data.orderPageInfo) {
          window.alert("该用户在指定时间内无订单！")
          return
        }
        console.log(response)
        this.userInfo = response.data.userInfo
        this.orderPageInfo = response.data.orderPageInfo
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

  .order-record {
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

  th {
    height: 50px;
  }

  td {
    height: 50px;
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
</style>
