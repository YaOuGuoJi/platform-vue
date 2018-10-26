<template>
  <div>
    <h2>{{ nowDate }}</h2>
    <h3>{{nowTime}}</h3>
    <div id="total-count">
      <div id="people"></div>
      <div id="priceAndOrder"></div>
    </div>
  </div>

</template>

<script>
  import axios from 'axios'
  import echarts from 'echarts'
  export default {
    name: 'ActualData',
    data() {
      return {
        price :null,
        order :null,
        people :null,
        nowDate: null,
        nowTime: null,
        getHours: null,
        peopleData: [],
        timeData : [],
        priceData: [],
        orderData: [],
      }
    },
    created() {
      this.interval1 = setInterval(this.getTime, 1000);
      this.getPeople ;
      this.intervalPeople = setInterval(this.getPeople,5000);
      this.getPriceAndFrequency;
      this.intervalPrice = setInterval(this.getPriceAndFrequency,5000)
    },
    methods: {
      //获取人数
      getPeople(){
        axios.get('/api/total/people').then(response => {
          if (response.status !== 200 || !response.data) {
            window.alert('请求失败')
          }
          this.dataInvoker(response.data)
          console.log(response.data)
        })
      },
      //获取订单和价格
      getPriceAndFrequency(){
        axios.get('/api/total/priceAndFrequency',{param:{
          time :this.nowTime
          }})
          .then((response) => {
            if (response.status !== 200 || !response.data) {
              window.alert('请求失败')
            }
            this.dataInvoker(response.data)
            console.log(response.data)
          })
      },
      dataInvoker(response) {
        if (!response.success || response.code !== 200) {
          window.alert(response.message)
          return
        }
        this.people.push(response.data.totalPeople)
        this.price.push( response.data.price)
        this.order.push (response.data.frequency)


        if(this.getHours === '00'){
          this.peopleData = []
          this.timeData = []
          this.priceData = []
          this.orderData = []
        }
        this.peopleData.push(this.people)
        this.timeData.push(this.nowTime)
        this.priceData.push(this.price)
        this.orderData.push(this.order)
       let peopleNumber = echarts.init(document.getElementById('people'))
        peopleNumber.setOption ({
          xAxis: {
            title: {
              text: '小镇实时人数',
              left: 'center'
            },
            type: 'category',
            boundaryGap: false,
            naem: '时间',
            data: this.timeData
          },
          yAxis: {
            type: 'value',
            name: '人数',
          },
          series: [{
            data: this.peopleData,
            type: 'line',
            areaStyle: {}
          }]
        });
        let priceAndOrder = echarts.document.getElementById('priceAndOrder')
        priceAndOrder.setOption = ({
          title: {
            text: '实时成交订单和金额',
            //subtext: timeRegion,
            left: 'center'
          },
          tooltip: {},
          xAxis: [{
            data:''
          }],
          legend:{
            left: 'right',
            data:['订单数','成交额']
          },
          yAxis: [
            {
              type: 'value',
              name: '订单数',
            },
            {
              type: 'value',
              name: '成交额',
              nameLocation:'end',
            }
          ],
          series: [{
            color: '#ff547e',
            name: '订单数',
            type: 'line',
            data: this.orderData,
          },{
            color:'#748fff',
            name: '订单数',
            type: 'line',
            data: this.priceData,
            yAxisIndex:1
          }]

        })






      },
      getTime() {
        let dateObj = new Date();
        let year = dateObj.getFullYear();//年
        let month = dateObj.getMonth() + 1;//月  (注意：月份+1)
        let date = dateObj.getDate();//日
        let day = dateObj.getDay();
        let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        let week = weeks[day];//根据day值，获取星期数组中的星期数。
        let hours = dateObj.getHours();//小时
        let minutes = dateObj.getMinutes();//分钟
        let seconds = dateObj.getSeconds();//秒
        if (month < 10) {
          month = "0" + month;
        }
        if (date < 10) {
          date = "0" + date;
        }
        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        this.nowDate = year + "年" + month + "月" + date + "日" + " " + week;
        this.nowTime = hours + ":" + minutes + ":" +seconds
        this.getHours = hours
      }
    },
    beforeDestroy() {
      clearInterval(this.interval1);
      clearInterval(this.intervalPeople);
      clearInterval(this.intervalPrice);

    }
  }
</script>

<style scoped>

</style>
