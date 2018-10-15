<template>
 <div>
   <form>
     <input type="text" v-model="areaId" placeholder="请输入区域id"/>
     <input type="date" v-model="start" placeholder="请输入开始时间"/>
     <input type="date" v-model="end" placeholder="请输入结束时间"/>
     <input type="text" v-model="limit" placeholder="请输入限制"/>
     <button type="submit" v-on:click="search()">查询</button>
   </form>
 </div>
</template>
<script type="text/javascript">
import axios from 'axios'
export default {
  name: 'AreaShopRank',
  Date () {
    return {
      areaId: null,
      start: null,
      end: null,
      limit: null
    }
  },
  methods: {
    search: function () {
      axios.get('api/camera/area/shop/rank', {
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
        window.alert(response.date)
        return
      }
    }
  }
}

</script>
