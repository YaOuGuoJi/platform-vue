import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import AreaPeople from '@/components/AreaPeople'
import UserOrder from '@/components/UserOrder'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/area/people',
      name: 'AreaPeople',
      component: AreaPeople
    },
    {
      path: '/user/order',
      name: 'UserOrder',
      component: UserOrder
    }
  ]
})
