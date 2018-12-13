import Vue from 'vue'
import Router from 'vue-router'
import Login from "../page/Login";
import UserLogin from '../page/user/UserLogin'
import ShopLogin from '../page/shop/ShopLogin'
import ShopIndex from "../components/ShopIndex";
import UserIndex from "../components/UserIndex";
import UserReport from "../page/user/UserReport"
import UserOrder from "../page/user/UserOrder"
import AreaShopRank from "../page/shop/AreaShopRank"
import ShopCount from "../page/shop/ShopCount"
import ShopOrder from "../page/shop/ShopOrder"
import UserShopInfo from "../page/shop/UserShopInfo"

import UserAreaPeople from "../page/user/AreaPeople"
import UserWelcome from "../page/user/Welcome"
import ShopAreaPeople from "../page/shop/AreaPeople"
import ShopWelcome from "../page/shop/Welcome"


Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/user/login',
      name: 'UserLogin',
      component: UserLogin
    },
    {
      path: '/user/report',
      name: 'UserReport',
      component: UserReport
    },
    {
      path: '/user/order',
      name: 'UserOrder',
      component: UserOrder
    },
    {
      path: '/user/welcome',
      name: 'UserWelcome',
      component: UserWelcome
    },
    {
      path: '/user/area/people',
      name: 'UserAreaPeople',
      component: UserAreaPeople
    },
    {
      path: '/shop/login',
      name: 'ShopLogin',
      component: ShopLogin
    },
    {
      path: '/area/shopRank',
      name: 'AreaShopRank',
      component: AreaShopRank
    },
    {
      path: '/shop/count',
      name: 'ShopCount',
      component: ShopCount
    },
    {
      path: '/user/shopInfo',
      name: 'UserShopInfo',
      component: UserShopInfo
    },
    {
      path: '/shop/order',
      name: 'ShopOrder',
      component: ShopOrder
    },
    {
      path: '/shop/welcome',
      name: 'ShopWelcome',
      component: ShopWelcome
    },
    {
      path: '/shop/area/people',
      name: 'ShopAreaPeople',
      component: ShopAreaPeople
    },
    {
      path: '/shop/index',
      name: 'ShopIndex',
      component: ShopIndex
    },
    {
      path: '/user/index',
      name: 'UserIndex',
      component: UserIndex
    }
  ]
})
