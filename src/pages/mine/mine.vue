<template>
  <div class="mine">
    <Scroll bcColor="#f1f2f5">
      <div class="mine-top">
        <div class="top-box">
          <div class="top-box-left">
            <img v-if="mine.avatar&&mine.avatar.length" class="mine-header" :src="mine.avatar">
            <img v-else class="mine-header" src="./pic-default_people@2x.png">
            <p class="peo-name">
              {{mine.name}}<br />
              <span class="tag">角色:{{tag}}</span>
            </p>
          </div>
          <div class="top-box-right" @click="toShareCard">
            <span class="code"></span>
            <span class="icon"></span>
          </div>
        </div>
        <div class="mine-shadow">
          <router-link class="mian-box" to="mine/my-data">
            <h4 class="title">店员数据概览</h4>
            <div class="main">
              <div class="item-box">
                <div class="number">{{allDatas.customer_total || 0}}</div>
                <div class="text">客户总数</div>
              </div>
              <div class="item-box">
                <div class="number">{{allDatas.order_total || 0}}</div>
                <div class="text">订单总数</div>
              </div>
              <div class="item-box">
                <div class="number">{{allDatas.success_order_total || 0}}</div>
                <div class="text">成交总数</div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <ul class="content-list">
        <li class="content-item" v-for="(item, index) in contentList" :key="index" @click="_goPage(item.src)">
          <div class="list-wrap">
            <div class="span-left">
              <span class="icon-box" :class="item.icon"></span>
              <span class="text">{{item.title}}</span>
            </div>
            <span v-if="item.src" class="icon"></span>
            <span v-else class="total-price">{{allDatas.income}}</span>
          </div>
        </li>
      </ul>
    </Scroll>
    <toast ref="toast"></toast>
    <router-view @refresh="refresh" v-if="show"></router-view>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Mine } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import storage from 'storage-controller'
  import {mapGetters} from 'vuex'
  import Toast from 'components/toast/toast'

  const CONTENTLIST = [
    {title: '个人信息', src: 'mine/my-msg', icon: 'perinfor'},
    // {title: '我的服务', src: 'mine/my-service', icon: 'goods'},
    // {title: '我的活动', src: 'mine/my-activity', icon: 'activity'},
    {title: '我的订单', src: 'mine/order-form-manage', icon: 'myorder'},
    {title: '我的收入', src: '', icon: 'income'},
    {title: '我的报表', src: 'mine/my-data', icon: 'myform'}
  ]

  export default {
    name: 'Mine',
    data () {
      return {
        contentList: CONTENTLIST,
        mine: {},
        allDatas: {},
        show: true,
        count: 0
      }
    },
    created () {
      this.$emit('tabChange', '我的')
      this.getMine()
      this.getMineData()
    },
    methods: {
      toShareCard() {
        this.$router.push('/shareCard')
        if (this.ios) {
          setTimeout(() => {
            location.reload()
            location.reload()
          }, 200)
        }
      },
      _goPage (src) {
        if (!src) {
          return
        }
        this.$router.push(src)
      },
      refresh () {
        this.mine = storage.get('info')
      },
      getMine () {
        this.mine = storage.get('info')
      },
      getMineData(time) {
        Mine.getMineData(time).then(res => {
          if (res.error === ERR_OK) {
            this.allDatas = res.data
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'ios'
      ]),
      userInfo() {
        return storage.get('info')
      },
      slide() {
        return 'slide'
      },
      tag() {
        switch (this.mine.role_id) {
          case 0:
            return '未知'
          case 1:
            return '店长'
          case 2:
            return '普通店员'
          case 3:
            return '财务'
        }
      }
    },
    components: {
      Scroll,
      Toast
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  div
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box
  .mine
    position: fixed
    background: $color-background
    z-index: 10
    left: 0
    right: 0
    bottom: 50px
    top: 0
  .mine-top
    bg-image('pic-mybg')
    padding: 20px 15px
    height: 172px
    background-size: 100% 100%
    box-sizing: border-box
    position: relative
    margin-bottom: 56px
    .top-box
      layout(row)
      align-items: center
      justify-content: space-between
      .top-box-left
        layout(row)
        align-items: center
        .mine-header
          width: 60px
          height: 60px
          display: block
          border-radius: 50%
          margin-right: 10px
        .peo-name
          font-size: $font-size-16
          font-family: $font-family-medium
          color: $color-white
          width: 180px
          no-wrap()
          .tag
            background: rgba(255,255,255,0.2)
            text-align: center
            font-size: 12px
            display: inline-block
            padding: 4px 5px
            color: $color-white
            margin-top: 10px
            border-radius: 2px
      .top-box-right
        layout(row)
        align-items: center
        .icon
          icon-image('icon-pressed')
          width: 5px
          height: 10px
        .code
          icon-image('icon-shopcode')
          width: 20px
          height: 20px
          margin-right: 15px
    .mine-shadow
      position: absolute
      width: 100%
      padding: 0 15px
      left: 0
      bottom: -43px
      .mian-box
        box-shadow: 0 4px 12px 0 rgba(43,43,145,0.04)
        border-radius: 2px
        background: $color-white
        padding: 15px 15px
        display: block
        .title
          font-size: 14px
          margin-bottom: 20px
          color: $color-20202E
        .main
          layout(row)
          align-items: center
          .item-box
            width: 33.33%
            text-align: center
            position: relative
            &:after
              content: ''
              display: block
              position: absolute
              height: 25px
              right: 0
              top: 0
              margin: auto
              bottom: 0
              width:1px
              border-right: 0.5px solid #e5e5e5
              opacity: 0.5
            &:last-child:after
              width: 0
              border: 0
            .number
              color: $color-20202E
              font-family: 'DINCondensed-Bold'
              font-size: 40px
              margin-bottom: 5px
            .text
              color: $color-20202E
              font-family: $font-family-regular
              font-size: $font-size-12
  .ba-dark
    background-color: $color-text
    text-align: center
    color: $color-white
    width: 100vw
    font-size: $font-size-large
    font-family: $font-family-regular
    height: 105.5px

  .mine-card
    position: relative
    z-index: 100
    background-color: $color-white
    margin: -57px auto 0
    height: 50.67vw
    width: 92vw
    .mine-card-bg
      padding: 0 15px
      display: flex
      flex-direction: column
      box-sizing: border-box
      align-items: center
      background-size: cover
      bg-image('bg-customer_details')
      height: 100%
      width: 100%
      position: relative
      .peo-name
        margin-top: 15px
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text
      .mine-free
        margin-top: 10px
        width: 60px
        height: 20px
        line-height: 20px
        text-align: center
        background: rgba(86, 186, 21, 0.20)
        font-family: $font-family-regular
        font-size: $font-size-12
        color: $color-56
      .mine-header-box
        height: 60px
        width: 60px
        margin-top: -19px
        overflow: hidden
        background: $color-white
        border-1px($color-row-line, 0)
        .mine-header
          width: 100%
      .mine-btn
        border-top-1px($color-row-line)
        position: absolute
        bottom: 0
        left: 0
        width: 91%
        margin-left: 4.5%
        height: 45px
        display: flex
        .mine-btn-item
          flex: 1
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-20202E
          display: flex
          align-items: center
          justify-content: center
          &:first-child
            position: relative
            &:after
              content: ''
              height: 16px
              width: 1px
              background: $color-col-line
              right: 0
              transform: scaleX(0.5)
              col-center()
          .mine-btn-item-icon
            margin-right: 4.5px
            width: 14px

  .content-list
    width: 92vw
    margin: 0 auto
    box-sizing: border-box
    border-radius: 2px
    .content-item
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-text
      background-color: $color-white
      box-shadow: 0 4px 12px 0 rgba(43,43,145,0.02)
      &:first-child
        border-top-left-radius: 3px
        border-top-right-radius: 3px
      &:nth-of-type(5)
        border-bottom-left-radius: 3px
        border-bottom-right-radius: 3px
        .list-wrap:after
          border: 0
      &:last-child
        margin-top: 15px
        border-radius: 3px
        .list-wrap:after
          border: 0
      .list-wrap
        margin-left: 15px
        align-items: center
        display: flex
        padding-right: 15px
        height: 55px
        justify-content: space-between
        position: relative
        border-bottom-1px($color-row-line)
      .span-left
        layout(row)
        align-items: center
        .icon-box
          width: 18px
          height: 18px
          margin-right: 10px
          &.perinfor
            icon-image('icon-perinfor')
          &.goods
            icon-image('icon-goods')
          &.activity
            icon-image('icon-activity')
          &.myorder
            icon-image('icon-myorder')
          &.income
            icon-image('icon-income')
          &.myform
            icon-image('icon-myforms')
      &:last-child
        border-none()
      .icon
        icon-image('icon-pressed')
        width: 5px
        height: 10px
      .total-price
        color: $color-9B9B9B
        font-size: 14px
</style>
