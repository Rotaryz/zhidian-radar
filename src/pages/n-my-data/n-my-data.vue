<template>
  <transition name="slide">
    <article class="data-all">
      <scroll bcColor="#f0f5ff">
        <div class="data-top">
          <div class="cliten-box">
            <div class="data-number-box">
              <nav class="data-tab-wrapper">
                <div v-for="(item, index) in tabList" :key="index" class="tab" :class="tabNumber === index ? 'active' : '' " @click="getAllTab(item, index)">{{item.text}}</div>
              </nav>
              <div class="data-list">
                <div v-for="(item, index) in dataArr" :key="index" class="list-item" @click="showPop(index)">
                  <div class="num">{{allDatas[item.type] || 0}}</div>
                  <div class="title">{{item.name}}<span class="icon" v-if="index === 0"></span></div>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-tab">
            <ul class="custom-tab border-bottom-1px">
              <li v-for="(item, index) in groupList" :key="index" class="tab-item" :class="{'active': charTab === index}" @click="changeChart(item, index)">{{item.name}}</li>
              <li class="line-tab" :style="'transform: translate3d('+ charTab * 100 +'%, 0, 0)'"></li>
            </ul>
          </div>

          <div v-show="charTab === 0">
            <article class="panel">
              <h1 class="title">用户分组</h1>
              <ai-charts ref="c1" :CHARTS_TYPE="CHARTS_TYPE.USER"></ai-charts>
            </article>
            <article class="panel">
              <h1 class="title">PNES动力模型</h1>
              <ai-charts ref="c2" :CHARTS_TYPE="CHARTS_TYPE.PNES"></ai-charts>
            </article>
            <div class="panel">
              <div class="title">用户来源-KOL分享传播</div>
              <div v-if="false" class="no-data">暂无数据</div>
              <ai-charts v-if="true" ref="c3" :CHARTS_TYPE="CHARTS_TYPE.USER_TOP6"></ai-charts>
              <div class="list" v-if="personList.length > 0">
                <h3 class="list-title">
                  <span class="num">排序</span>
                  <span class="name">用户</span>
                  <span class="person">人数</span>
                  <span class="count">次数</span>
                </h3>
                <p class="item" v-for="(item, index) in personList" :key="index">
                  <span class="num">{{index}}</span>
                  <span class="name">{{item.name}}</span>
                  <span class="person">{{item.value}}</span>
                  <span class="count">{{item.value}}次</span>
                </p>
              </div>
            </div>
          </div>
          <div v-show="charTab === 1">
            <article class="panel">
              <h1 class="title ">活跃度-主力客户一周期内下单次数</h1>
              <ai-charts ref="c4" :CHARTS_TYPE="CHARTS_TYPE.VITALITY"></ai-charts>
            </article>
          </div>
          <div v-show="charTab === 2">
            <article class="panel">
              <h1 class="title ">客单价</h1>
              <ai-charts ref="c5" :CHARTS_TYPE="CHARTS_TYPE.VITALITY"></ai-charts>
            </article>
            <article class="panel">
              <h1 class="title">订单和金额</h1>
              <ai-charts ref="c6" :CHARTS_TYPE="CHARTS_TYPE.ORDER_AMOUNT"></ai-charts>
            </article>
          </div>
          <div style="height: 5px"></div>
        </div>
      </scroll>
      <transition name="fade">
        <div class="pop" v-if="pop">
          <div class="pop-main">
            <h3 class="title">营收 =（主力客户&活跃度&客单价）<span class="icon"></span></h3>
            <p class="text">主力客户、活跃度和客单价的增长转化等于店铺的营收</p>
            <div class="btn" @click="closePop">知道了</div>
          </div>
        </div>
      </transition>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {NEchart, Mine} from 'api'
  import AiCharts from 'components/_ai-charts/_ai-charts'
  import {CHARTS_TYPE} from 'utils/constants-charts'
  import {ERR_OK} from '../../common/js/config'
  import Scroll from 'components/scroll/scroll'
  import storage from 'storage-controller'

  const PIEHINT = [{text: '个人', icon: 'one'}, {text: '商品', icon: 'two'}, {text: '拼团', icon: 'thr'}, {text: '砍价', icon: 'four'}]
  const SUCCESSHINT = [{text: '0-50%', icon: ''}, {text: '51-80%', icon: 'two'}, {text: '81-99%', icon: 'thr'}, {text: '100%', icon: 'four'}]
  const DATA_ARR = [
    {name: '交易金额', icon: 'money', type: 'total'},
    {name: '主力客户', icon: 'business', type: 'order_count'},
    {name: '活跃度', icon: 'active', type: 'per_money'},
    {name: '客单价', icon: 'price', type: 'module_e_count'}
  ]
  const groupList = [{
    orderBy: 'join',
    name: '客户数据'
  }, {
    orderBy: 'activity_index',
    name: '活跃数据'
  }, {
    orderBy: '',
    name: '交易数据'
  }]
  export default {
    name: 'my-data',
    data() {
      return {
        dataArr: DATA_ARR,
        allDatas: {},
        tabList: [
          {
            text: '全部',
            value: 'all'
          },
          {
            text: '昨天',
            value: 'yesterday'
          },
          {
            text: '7天',
            value: 'week'
          },
          {
            text: '30天',
            value: 'month'
          }
        ],
        tabNumber: 0,
        pieHint: PIEHINT,
        successHint: SUCCESSHINT,
        groupList,
        charTab: 0,
        CHARTS_TYPE,
        shopId: '',
        personList: [],
        pop: false
      }
    },
    created() {
      this.id = this.$route.query.id
      this.shopId = this.$storage.get('info').shop_id
      this.getAllDataObj('all')
    },
    mounted() {
      this.groupRetio()
      this.PENSRetio()
      this.$refs.c3 && this.$refs.c3.action()
    },
    methods: {
      showPop(index) {
        if (index === 0) {
          this.pop = true
        }
      },
      closePop() {
        this.pop = false
      },
      // 用户分组占比
      groupRetio() {
        let data = {
          shop_id: this.shopId,
          time: 'week'
        }
        NEchart.groupRetio(data)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            let pieData = {
              seriesData: [
                {name: '潜在客户', value: res.data.p},
                {name: '新客户', value: res.data.n},
                {name: '主力客户', value: res.data.e},
                {name: '沉睡客户', value: res.data.s}
              ]
            }
            this.$refs.c1.action(pieData)
          })
      },
      // PNES动力模型
      PENSRetio() {
        let data = {
          shop_id: this.shopId,
          time: 'week'
        }
        NEchart.PENSRetio(data)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            let day = res.data.map(item => {
              return item.day
            })
            // 新增
            let growth = res.data.map(item => {
              return item.growth
            })
            // 转化
            let conversion = res.data.map(item => {
              return item.conversion
            })
            // 流失
            let churn = res.data.map(item => {
              return item.churn
            })
            // 唤醒
            let wakeup = res.data.map(item => {
              return item.wakeup
            })
            // let seriesData = [
            //   {data: [50, 70, 30, 80, 40]},
            //   {data: [10, 50, 40, 70, 20]},
            //   {data: [30, 60, 20, 60, 50]},
            //   {data: [60, 10, 100, 90, 60]}
            // ]
            let lineData = {
              xAxisData: day.length > 1 ? day : ['3/10', '3/15', '3/20', '3/25', '3/30'],
              seriesData: [
                {data: growth.length > 1 ? growth : [0, 0, 0, 0, 0]},
                {data: conversion.length > 1 ? conversion : [0, 0, 0, 0, 0]},
                {data: churn.length > 1 ? churn : [0, 0, 0, 0, 0]},
                {data: wakeup.length > 1 ? wakeup : [0, 0, 0, 0, 0]}
              ]
            }
            this.$refs.c2.action(lineData)
          })
      },
      // 活跃度
      actionRetio() {
        NEchart.actionRetio({customer_id: this.id, time: 'week'})
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            let lineData = {
              xAxisData: res.data.x,
              seriesData: [ {data: res.data.y} ]
            }
            this.$refs.c4.action(lineData)
          })
      },
      // 订单金额、客单价、一周活跃
      orderRetio() {
        let data = {
          shop_id: this.shopId,
          time: 'week'
        }
        NEchart.orderRetio(data)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            // 主力客户一周下单数
            let mainOrderCount = res.data.map(item => {
              return item.main_order_count
            })
            // 客单价
            let personMoney = res.data.map(item => {
              return item.per_money
            })
            // 订单金额
            let total = res.data.map(item => {
              return item.total
            })
            // 日期
            let day = res.data.map(item => {
              return item.day
            })

            if (this.charTab === 1) {
              let lineData = {
                xAxisData: day.length ? day : ['3/10', '3/15', '3/20', '3/25', '3/30'],
                seriesData: [ {data: mainOrderCount.length ? mainOrderCount : [0, 0, 0, 0, 0]} ]
              }
              this.$refs.c4.action(lineData)
            } else if (this.charTab === 2) {
              let lineData = {
                xAxisData: day.length ? day : ['3/10', '3/15', '3/20', '3/25', '3/30'],
                seriesData: [ {data: personMoney.length ? personMoney : [0, 0, 0, 0, 0]} ]
              }
              let lineData2 = {
                xAxisData: day.length ? day : ['3/10', '3/15', '3/20', '3/25', '3/30'],
                seriesData: [ {data: total.length ? total : [0, 0, 0, 0, 0]}, {data: res.data.y ? res.data.y : [0, 0, 0, 0, 0]} ]
              }
              this.$refs.c5.action(lineData)
              this.$refs.c6.action(lineData2)
            }
          })
      },
      // 图表tab切换
      changeChart(item, index) {
        if (this.charTab === index) return
        this.charTab = index
        if (index === 0) {
          this.$nextTick(() => {
            this.groupRetio()
            this.PENSRetio()
            this.$refs.c3 && this.$refs.c3.action()
          })
        } else if (index === 1) {
          this.$nextTick(() => {
            this.orderRetio()
          })
        } else if (index === 2) {
          this.$nextTick(() => {
            this.orderRetio()
          })
        }
      },
      getAllDataObj(time) {
        let data = {
          shop_id: this.shopId,
          time
        }
        Mine.getMineData(data).then(res => {
          if (res.error === ERR_OK) {
            this.allDatas = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      getAllTab(item, index) {
        this.getAllDataObj(item.value)
        this.tabNumber = index
      }
    },
    computed: {
      userInfo() {
        return storage.get('info')
      }
    },
    components: {
      Scroll,
      AiCharts
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  *
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box

  .data-all
    fill-box()
    z-index: 70

  .data-top
    position: relative
    .cliten-box
      position: relative
      padding: 15px 15px 0
      width: 100%
      z-index: 2
      .data-number-box
        padding-top: 15px
        position: relative
        background: #fff
        box-shadow: 0 2px 16px 0 rgba(21,24,45,0.06)
        border-radius: 6px
        background: $color-white
        display: block
        border-1px(#D9F0FE, 12px)
        .data-tab-wrapper
          position: relative
          z-index: 11
          layout(row)
          margin: 0 auto
          width: 64vw
          border-radius: 2px
          border: 1px solid rgba(32,32,46,0.1)
          .tab
            border-right: 1px solid rgba(32,32,46,0.1)
            height: 30px
            font-size: $font-size-14
            color: #333
            font-family: $font-family-regular
            line-height: 30px
            width: 25%
            text-align: center
            transition: all 0.3s
          .tab:last-child
            border-right: 0
          .active
            color: $color-main
        .data-list
          padding: 30px 20px 25px
          overflow: hidden
          .list-item
            width: 50%
            border-top-1px(#f3f3f6)
            border-right-1px(#f3f3f6)
            float: left
            text-align: center
            padding: 0 0 15px
            &:before
              border-top: 0
            &:nth-child(n+3):before
              border-top: 1px solid #f3f3f6
            &:nth-child(n+3)
              padding-top: 18px
            &:nth-child(2n):after
              border-right: 0
            .title
              font-size: 13px
              font-family: $font-family-regular
              color: #0E1249
              margin-top: 8px
              opacity: 0.6
              display: flex
              justify-content: center
              align-items: center
              .icon
                width: 12px
                height: 12px
                margin-left: 3px
                icon-image(icon-help)
            .num
              font-size: 25px
              font-family: "DINAlternate-Bold"

    .chart-tab
      border-bottom-1px(#E1E1E1)
    .custom-tab
      height: 45px
      margin: 5px 15px 0
      layout(row, block, nowrap)
      align-items: center
      justify-content: space-between
      font-family: $font-family-regular
      font-size: $font-size-16
      color: #333
      letter-spacing: 0.52px
      text-align: center
      line-height: 45px
      position: relative
      .tab-item
        flex: 1
        text-align: center
        opacity: 0.8
        transition: all 0.3s
      .active
        opacity: 1
        font-family: $font-family-medium
      .line-tab
        width: 33.333%
        height: 4px
        position: absolute
        left: 0
        bottom: 0
        display: flex
        justify-content: center
        transition: all 0.3s
        &:after
          content: ''
          height: 4px
          width: 42px
          border-radius: 4px
          background: $color-linear-main
    .panel
      margin: 12px
      background: #FFFFFF
      box-shadow: 0 0 10px 0 rgba(141,151,158,0.30)
      border-radius: 4px
      overflow :hidden
      .title
        font-family: PingFangSC-Regular
        font-size: 16px
        color: #0E1249
        line-height: 16px
        padding: 13.5px 0
        margin: 0 15px
      .no-data
        height: 223px
        line-height: 223px
        text-align: center
        font-size: $font-size-14
        color: #333
        font-family: $font-family-regular
      .list
        margin: 0 15px
        .list-title,.item
          height: 40px
          line-height: 40px
          color: #333
          display: flex
          font-size: $font-size-14
          font-family: $font-family-regular
          text-align: left
          background: #FFF
          border-bottom-1px(#f4f5f7)
          .num
            width: 60px
            text-indent: 15px
          .name
            flex: 1
            overflow: hidden
            text-indent: 30px
            text-overflow: ellipsis
            white-space: nowrap
          .person
            width: 60px
            text-indent: 15px
          .count
            width: 60px
            text-indent: 15px
        .list-title
          opacity: 0.6
  .pop
    position: fixed
    background: rgba(0,0,0,0.7)
    right: 0
    top: 0
    bottom: 0
    left: 0
    z-index: 20
    .pop-main
      border-radius: 6px
      width: 80vw
      padding: 0 20px
      box-sizing: border-box
      position: absolute
      all-center()
      background: #FFF
      .title
        color: #333
        font-size: 16px
        margin-top: 45px
        font-family: $font-family-medium
        text-align: center
        line-height: 1.2
        .icon
          width: 9px
          height: 15px
          margin-bottom: -3px
          icon-image(icon-upup)
      .text
        font-family: $font-family-regular
        font-size: 14px
        color: #666
        text-align: center
        line-height: 1.2
        margin-top: 15px
        padding: 0 20px
      .btn
        width: 110px
        height: 34px
        line-height: 34px
        font-size: 14px
        font-family: "PingFangSC-Regular"
        color: $color-main
        border-1px($color-main, 100px)
        text-align: center
        margin: 30px auto 20px
</style>
