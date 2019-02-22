<template>
  <transition name="slide">
    <article class="data-all">
      <scroll bcColor="#f0f5ff">
        <div class="data-top">
          <div class="cliten-box">
            <div class="data-number-box">
              <div class="data-tab">
                <div class="bg" :style="{left: tabNumber * 25 + '%' }"></div>
                <div class="tab"   v-for="(item, index) in tabList" :key="index" :class="tabNumber === index ? 'active' : '' " @click="getAllTab(item, index)">{{item.text}}</div>
              </div>

              <div class="tip">
                <span class="item">营收</span>
                <span class="item">=</span>
                <span class="item">主力客户</span>
                <span class="item">×</span>
                <span class="item">活跃度</span>
                <span class="item">×</span>
                <span class="item">客单价</span>
              </div>
              <div class="data-list">
                <div class="list-item" v-for="(item, index) in dataArr" :key="index">
                  <div class="title">
                    <span class="icon" :class="item.icon"></span>
                    <span class="text">{{item.name}}</span>
                  </div>
                  <div class="num">{{allDatas[item.type] || 0}}</div>
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
            <router-link tag="div" to="" class="panel">
              <router-link tag="div" to="z-test" class="title">用户来源-KOL分享传播</router-link>
              <ai-charts ref="c3" :CHARTS_TYPE="CHARTS_TYPE.USER_TOP6"></ai-charts>
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
            </router-link>
          </div>
          <div v-show="charTab === 1">
            <article class="panel">
              <h1 class="title ">活跃度</h1>
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
        personList: [
          {
            name: '李明',
            person: 30,
            value: 20
          },
          {
            name: '李明',
            person: 30,
            value: 20
          },
          {
            name: '李明',
            person: 30,
            value: 20
          }
        ]
      }
    },
    created() {
      this.id = this.$route.query.id
      this.shopId = this.$storage.get('info').shop_id
      this.getAllDataObj('all')
    },
    mounted() {
      this.$nextTick(() => {
        this.groupRetio()
        this.PENSRetio()
        this.$refs.c3.action()
      })
    },
    methods: {
      // 用户分组占比
      groupRetio() {
        let data = {
          shop_id: this.shopId,
          time: this.tabList[this.tabNumber].value
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
          time: this.tabList[this.tabNumber].value
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
        NEchart.actionRetio({customer_id: this.id})
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
          time: this.tabList[this.tabNumber].value
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
            this.$refs.c3.action()
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
        if (this.charTab === 0) {
          this.groupRetio()
          this.PENSRetio()
          this.$refs.c3.action()
        } else if (this.charTab === 1) {
          this.orderRetio()
        }
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
      padding: 20px 15px 0
      width: 100%
      z-index: 2
      .data-number-box
        padding-top: 15px
        position: relative
        background: #fff
        box-shadow: 0 2px 16px 0 rgba(21,24,45,0.04)
        border-radius: 6px
        background: $color-white
        display: block
        border-1px(#D9F0FE, 12px)
        .data-tab
          position: relative
          z-index: 11
          layout(row)
          margin: 0 auto
          width: 80vw
          border-radius: $font-size-18
          background: #DDD6FF
          .bg
            width: 25%
            height: 8vw
            border-radius: 8vw
            background: $color-linear-main
            transition: all 0.3s
            position: absolute
            left: 0
            top: 0
          .tab
            height: 8vw
            font-size: $font-size-14
            color: #20202E
            font-family: $font-family-regular
            line-height: 8vw
            width: 25%
            text-align: center
            transition: all 0.3s
            position: relative
          .tab:last-child
            border-right: 0
          .active
            color: #fff
        .tip
          font-family: $font-family-regular
          background: #F7F7F7
          text-align: center
          height: 40px
          line-height: 40px
          color: #0E1249
          font-size: $font-size-16
          margin-top: 15px
          .item
            padding: 0 0.7vw
        .data-list
          padding: 17px 20px
          overflow: hidden
          .list-item
            width: 50%
            border-top-1px(#E1E1E1)
            border-right-1px(#E1E1E1)
            float: left
            padding: 14px 0 10px
            &:before
              border-top: 0
            &:nth-child(n+3):before
              border-top: 1px solid #E1E1E1
            &:nth-child(2n)
              padding-left: 20px
              &:after
                border-right: 0
            .title
              display: flex
              align-items: center
              .icon
                width: 15px
                height: 15px
                margin-right: 6px
              .money
                icon-image(icon-sum)
              .business
                icon-image(icon-main)
              .active
                icon-image(icon-liveness)
              .price
                icon-image(icon-passenger)
              .text
                font-size: 13px
                color: #0E1249
                opacity: 0.6
            .num
              margin-top: 8px
              padding-left: 20px
              font-size: $font-size-20
              font-family: $font-family-bold

    .chart-tab
      border-bottom-1px(#E1E1E1)
    .custom-tab
      height: 45px
      margin: 5px 15px 0
      layout(row, block, nowrap)
      align-items: center
      justify-content: space-between
      font-family: $font-family-medium
      font-size: $font-size-16
      color: #0E1249
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
</style>
