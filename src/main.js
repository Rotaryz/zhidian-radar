// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.components.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
// import fastclick from 'fastclick'
import store from './store'
import echarts from 'echarts'
import './utils/env-clear'
import './utils/compatible' // 兼容部分ios手机input失焦后页面上移问题
import 'components/_globals'
import 'utils/audio-plugin'

Vue.prototype.$echarts = echarts

// fastclick.attach(document.body)

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
