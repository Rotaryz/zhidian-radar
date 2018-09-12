'use strict'

import axios from 'axios'
import { BASE_URL } from './config'
import storage from 'storage-controller'
import utils from './utils'

const TIME_OUT = 10000
const ERR_OK = 0
const ERR_NO = -404

const http = axios.create({
  timeout: TIME_OUT
})

http.defaults.baseURL = BASE_URL.api

http.interceptors.request.use(config => {
  // 请求数据前的拦截
  return config
}, error => {
  return Promise.reject(error)
})

http.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 422)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: ERR_NO,
    msg: '网络异常'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === ERR_NO) {
    console.warn(res.msg)
  }
  // 如果网络请求成功，而提交的数据，或者是后端的一些未知错误所导致的，可以根据实际情况进行捕获异常
  if (res.data && (res.data.code !== ERR_OK)) {
    const code = res.data.code
    utils._handleErrorType(code)
    throw requestException(res.data)
  }
  return res.data
}

function requestException (res) {
  const error = {}
  error.statusCode = res.status
  const serviceData = res.data
  if (serviceData) {
    error.code = serviceData.code
    error.error = serviceData.error
    error.message = serviceData.message
    error.serverData = serviceData
  }
  return error
}

export default {
  post (url, data) {
    return http({
      method: 'post',
      url,
      data, // post 请求时带的参数
      headers: {
        Authorization: storage.get('token')
      }
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      // alert(JSON.stringify(res))
      return checkCode(res)
    })
  },
  get (url, params) {
    return http({
      method: 'get',
      url,
      params, // get 请求时带的参数
      headers: {
        Authorization: storage.get('token')
      }
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  },
  put (url, data) {
    return http({
      method: 'put',
      url,
      data, // put 请求时带的参数
      headers: {
        Authorization: storage.get('token')
      }
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  },
  delete (url, data) {
    return http({
      method: 'delete',
      url,
      data, // put 请求时带的参数
      headers: {
        Authorization: storage.get('token')
      }
    }).then((response) => {
      return checkStatus(response)
    }).then((res) => {
      return checkCode(res)
    })
  }
}
