import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import AreaPeople from '@/components/AreaPeople'
import UserOrder from '@/components/UserOrder'
import UserShopInfo from '@/components/UserShopInfo'
import ShopCount from '@/components/ShopCount'
import AreaShopRank from '@/components/AreaShopRank'
import UserReport from '@/components/UserReport'
import ShopOrder from '@/components/ShopOrder'
import ActualData from '@/components/ActualData'
import ShopLogin from '@/components/ShopLogin'
import UserLogin from "../components/UserLogin";
import Login from "../page/Login";

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
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
    },
    {
      path: '/user/shopInfo',
      name: 'UserShopInfo',
      component: UserShopInfo
    },
    {
      path: '/shop/count',
      name: 'ShopCount',
      component: ShopCount
    },
    {
      path: '/area/shopRank',
      name: 'AreaShopRank',
      component: AreaShopRank
    },
    {
      path: '/user/report',
      name: 'UserReport',
      component: UserReport
    },
    {
      path: '/shop/order',
      name: 'ShopOrder',
      component: ShopOrder
    },
    {
      path: '/actual/data',
      name: 'ActualData',
      component: ActualData,
    },
    {
      path: '/shop/login',
      name: 'ShopLogin',
      component: ShopLogin
    },
    {
      path: '/user/login',
      name: 'UserLogin',
      component: UserLogin
    }
  ]
})
