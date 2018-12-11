'use strict';

import app from '../main.js'
import axios from 'axios'
import qs from 'qs'

export function service(method, url, params = {}) {
  return axios({
    url: '/api' + url,
    method: method,
    data: 'post' === method ? qs.stringify(params) : {},
    params: 'get' === method ? params : {}
  }).then(response => {
      console.log(response);
      if (response === null || response.status !== 200) {
        window.alert('请求失败！');
        console.log('请求失败');
        return null;
      }
      if (response.data.code === 401) {
        app.$router.replace('/login');
        return {
          code: 200,
          message: '没有登录',
          data: {}
        }
      }
      return response.data;
    },
    error => {
      console.log(error);
    });
}
