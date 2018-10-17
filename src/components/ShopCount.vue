<template>
  <div class="shop-count">

    <template v-if="canceled">

      <div class="canceled-info">
        <template v-if="canceled">
          <h3 class="order-list">流失订单统计（{{ year }}{{ month === "" ? "": "-"+month}}）</h3>
          <table>
            <tr>
              <th>下单途径</th>
              <th>总计金额</th>
              <th>订单数量</th>
            </tr>
            <tr v-for="order in canceled" :key="order.number">
              <td class="canceled-orderName">{{ }}</td>
              <td>{{ order.price }}</td>
              <td>{{ order.number }}</td>
            </tr>
          </table>
        </template>
        <template v-if="finished">
          <h3 class="order-list">成交订单统计（{{ year }}{{ month === "" ? "": "-"+month }}）</h3>
          <table>
            <tr>
              <th>下单途径</th>
              <th>总计金额</th>
              <th>订单数量</th>

            </tr>
            <tr v-for="order in finished" :key="order.number">
              <td class="finished-orderName"></td>
              <td>{{ order.price }}</td>
              <td>{{ order.number }}</td>
            </tr>
          </table>
        </template>
      </div>
    </template>
    <template v-else>
      <p>请输入UserId: </p>
      <input v-model="shopId"
             placeholder="在这里单击输入..."/><br>
      <input v-model="year"
             placeholder="请输入年份"/><br>
      <input v-model="month"
             placeholder="请输入月份"/><br>
      <button v-on:click="search()">点我查询</button>
    </template>
  </div>
</template>

<script>
  import axios from 'axios'
    export default {
        name: "ShopCount",
      data () {
        return {
          shopId: 100001,
          year: 2018,
          month: 9,
          canceled: null,
          finished: null,
          byProductType: null,
          byHour: null,
          byMonth: null,
          byYear: null,

        }
      },
      methods: {
        search: function () {
          axios.get('/api/shop/count', {
            params: {
              shopId: this.shopId,
              year: this.year,
              month: this.month,
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
          this.canceled = response.data.canceled
          console.log(this.canceled)
          this.finished = response.data.finished
          this.byProductType = response.data.byProductType
          this.byHour = response.data.byHour
          this.byMonth = response.data.byMonth
          this.byYear = response.data.byYear
         /* for (var a in this.finished){
            console.log(a)
            document.getElementsByClassName('finished-orderName').innerHTML(console.log(a))
          }*/
          window.onload =function() {
            for (var b in this.canceled){
              console.log(b)
              document.getElementsByClassName('canceled-orderName').innerHTML("123456");
            }
          }
          /*function makeName() {
            return function () {
              for (var b in this.canceled) {
                console.log(b)
                document.getElementsByClassName('canceled-orderName').innerHTML("123456");
              }
            };
          }*/
        }
      }

    }
</script>

<style scoped>

</style>

