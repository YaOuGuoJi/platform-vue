<template>
  <div class="user-order">
    <template v-if="userInfo">
      <div class="user-info">
        <h1>用户信息</h1>
        <h5 class="user-id">用户Id: {{ userInfo.userId }}</h5>
        <h5 class="user-name">用户名: {{ userInfo.userName }}</h5>
        <h5 class="user-sex">性别: {{ userInfo.sex === 1 ? '男' : '女'}}</h5>
        <h5 class="user-phone">电话号码: {{ userInfo.phone}}</h5>
        <h5 class="user-email">邮箱: {{ userInfo.email }}</h5>
      </div>
      <div class="order-record">
        <template v-if="orderPageInfo.list">
          <h3 class="order-list">消费记录（{{ start }}——{{ end }}）</h3>
          <table>
            <tr>
              <th>商户Id</th>
              <th>商品列表</th>
              <th>商品类型</th>
              <th>总价格</th>
              <th>支付方式</th>
              <th>订单状态</th>
            </tr>
            <tr v-for="order in orderPageInfo.list" :key="order.orderId">
              <td>{{ order.shopId }}</td>
              <td>{{ order.productList }}</td>
              <td>{{ order.productType }}</td>
              <td>{{ order.price }}</td>
              <td>{{ order.payType }}</td>
              <td>{{ order.orderStatus }}</td>
            </tr>
          </table>
          <div class="page-bar">
            <ul>
              <li v-if="orderPageInfo.isFirstPage"><a class="banclick">上一页</a></li>
              <li v-else><a v-on:click="pageNum--, search()">上一页</a></li>
              <li v-for="index in orderPageInfo.pages"  v-bind:class="{ 'active': pageNum === index}" :key="index"><a v-on:click="pageNum = index, search()">{{ index }}</a></li>

              <li v-if="orderPageInfo.isLastPage"><a class="banclick">下一页</a> </li>
              <li v-else><a v-on:click="pageNum++, search()">下一页</a> </li>
              <li><a>共<i>{{ orderPageInfo.pages }}</i>页</a></li>

            </ul>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <p>请输入UserId: </p>
      <input v-model="userId" placeholder="在这里单击输入..."/>
      <button v-on:click="search()">点我查询</button>
    </template>
  </div>
</template>

<script type="text/javascript">
import axios from 'axios'
export default {
  name: 'UserOrder',
  data () {
    return {
      userId: null,
      userInfo: null,
      orderPageInfo: null,
      pageNum: 1,
      pageSize: 10,
      start: '2018-01-01 00:00:00',
      end: '2019-01-01 00:00:00'
    }
  },
  methods: {
    search: function () {
      axios.get('/api/order/user/page', {
        params: {
          userId: this.userId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          start: this.start,
          end: this.end
        }
      }).then(response => {
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
      console.log(response)
      this.userInfo = response.data.userInfo
      this.orderPageInfo = response.data.orderPageInfo
    }
  }
}
</script>

<style>
  body {
    text-align: center;
  }
  table {
    margin-left: auto;
    margin-right: auto;
  }

  .page-bar li:first-child>a {
    margin-left: 0px
  }
  .page-bar {
    margin: 0 auto;
    width: 300px;
    height: 100px;
  }
  .page-bar a{
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
  .page-bar a:hover{
    background-color: #eee;
  }
  .page-bar a.banclick{
    cursor:not-allowed;
  }
  .page-bar .active a{
    color: #fff;
    cursor: default;
    background-color: #337ab7;
    border-color: #337ab7;
  }
  .page-bar i{
    font-style:normal;
    color: #d44950;
    margin: 0px 4px;
    font-size: 12px;
  }
</style>
