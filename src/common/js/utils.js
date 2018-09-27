import _this from '@/main'
import storage from 'storage-controller'
import {emotionsFace} from 'common/js/constants'

const LOSE_EFFICACY = 10000
const DISABLE = 11001 // 11001 AI雷达没有权限, 11002 BOSS雷达没有权限
const DELETE = 1 // TODO
const NET_404 = 404

export default class utils {
  static formatDate (time) {
    if (!time) {
      return {
        date: '',
        time: ''
      }
    }
    let resTime = new Date(time * 1000)
    let nowDate = this.formatDateTime(resTime)
    let nowTime = this.formatTime(resTime)
    let todayTime = new Date()
    let todayDate = this.formatDateTime(todayTime)
    let yesToday = todayTime.setDate(todayTime.getDate() - 1)
    let yesTodayDateTime = new Date(yesToday)
    let yesTodayDate = this.formatDateTime(yesTodayDateTime)
    nowDate = nowDate.replace(todayDate, '今天')
    nowDate = nowDate.replace(yesTodayDate, '昨天')
    nowTime = nowTime.replace(todayDate, '今天')
    nowTime = nowTime.replace(yesTodayDate, '昨天')
    return {
      date: nowDate,
      time: nowTime
    }
  }
  static radarTimeFormat(time) {
    if (!time) {
      return {
        date: '',
        time: ''
      }
    }
    let resTime = new Date(time * 1000)
    let nowDate = resTime.toLocaleDateString()
    let nowTime = this.formatTime(resTime)
    let todayTime = new Date()
    let todayDate = this.formatDateTime(todayTime)
    let yesToday = todayTime.setDate(todayTime.getDate() - 1)
    let yesTodayDateTime = new Date(yesToday)
    let yesTodayDate = this.formatDateTime(yesTodayDateTime)
    nowDate = nowDate.replace(todayDate, '')
    nowDate = nowDate.replace(yesTodayDate, '昨天').trim()
    nowTime = nowTime.replace(todayDate, '')
    nowTime = nowTime.replace(yesTodayDate, '昨天').trim()
    return {
      date: nowDate,
      time: nowTime
    }
  }

  static formatDateTime(time) {
    let date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].join('/')
  }

  static formatTime (time) {
    let date = new Date(time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()

    const t1 = [year, month, day].join('/')
    const t2 = [hour, minute].map(this.formatNumber).join(':')
    return `${t1} ${t2}`
  }

  static formatNumber (n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
  }

  // 错误码检查
  static _handleErrorType (code) {
    switch (code) {
      case NET_404: {
        _toErrorPage(`404`)
        break
      }
      case DELETE: { // todo
        _toErrorPage(`delcard`) // 名片被删除，请联系公司管理员
        break
      }
      case DISABLE: {
        _toErrorPage(`disablecard`) // 名片被禁用，请联系公司管理员
        break
      }
      case LOSE_EFFICACY: {
        _handleLoseEfficacy()
        break
      }
      default:
        break
    }
  }

  static breakArr (arr, num) {
    let res = []
    let max = Math.ceil(arr.length / num)
    for (let i = 0; i < max; i++) {
      let arrSlice = arr.slice(i * num, num + i * num)
      res.push(arrSlice)
      if (i === max - 1) return res
    }
  }

  // 获取设备信息
  static getPlatform () {
    const navigator = window.navigator
    const u = navigator.userAgent
    // const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // android终端或者uc浏览器
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    return isiOS ? 'ios' : 'android'
  }

  static shuffle (arr) {
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
      let j = getRandomInt(0, i)
      let t = _arr[i]
      _arr[i] = _arr[j]
      _arr[j] = t
    }
    return _arr
  }

  static debounce (func, delay) {
    let timer

    return function (...args) {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  // 讲文本中的表情转为img
  static msgFaceToHtml(msg) {
    if (!msg) return msg
    msg = this.labelEscape(msg)
    let expr = /\[[^[\]]{1,3}\]/mg
    let emotions = msg.match(expr)
    if (!emotions || emotions.length < 1) {
      return msg
    } else { // 有表情
      for (let i = 0; i < emotions.length; i++) {
        if (emotionsFace[emotions[i]]) {
          let html = `<img class="face-img" style="width: 18px;height: 18px;vertical-align: middle;" src="${emotionsFace[emotions[i]]}"/>`
          let str = emotions[i].replace(/(\[|])/g, '\\' + '$1')
          let reg = new RegExp(str, 'g')
          msg = msg.replace(reg, html)
        }
      }
      return msg
    }
  }

  // 标签转义
  static labelEscape(msg) {
    if (!msg) return msg
    let res = msg.replace(/</g, '&lt;')
    res = res.replace(/>/g, '&gt;')
    return res
  }
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function _toErrorPage (useType) {
  const path = `/page-error`
  _this.$router.replace({path, query: {useType}})
}

function _handleLoseEfficacy () {
  const currentRoute = _this.$route.path
  if (currentRoute !== '/') {
    storage.set('beforeLoginRoute', currentRoute)
  }
  storage.remove('token')
  _this.$router.replace('/oauth')
}
