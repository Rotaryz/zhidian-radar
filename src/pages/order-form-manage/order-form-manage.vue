<template>
  <div class="order-form">
    <section class="search-box">
      <div class="input-box" :class="{'short-box' : input}">
        <img class="icon" src="./icon-search@3x.png" alt=""/>
        <input class="txt" type="text" placeholder="手机号/订单号/店员名称" v-model="searchTxt" @focus="inputFocus" @blur="inputBlur" @change="inputChange">
        <div class="clear" v-if="searchTxt.length > 0" @click="clearSearch"></div>
      </div>
      <div class="btn" :class="{'show-btn' : input}" @click="searchBtn">{{searchTxt.length > 0 ? '搜索' : '取消'}}</div>
    </section>
    <div class="tab-wrapper">
      <div class="line-wrap" :style="'transform: translate3d('+ selectTab * 100 +'%, 0, 0)'"></div>
      <div class="tab" v-for="(item,index) in tabList" :key="index" @click="changeTab(index)">{{item.txt}}</div>
    </div>
    <div class="container">
      <div class="big-container" :style="'transform: translate(-' + selectTab*25 + '%,0)'">
        <div class="container-item">
          <scroll ref="scroll"
                  :data="dataArray"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingUp="onPullingUp"
                  :showNoMore="showNoMore"
                  v-if="selectTab === 0">
            <div class="list-container">
              <div class="list-item" v-for="(item, index) in dataArray" :key="index">
                <div class="title">
                  <span class="left">{{item.title}}</span>
                  <span class="right">{{item.status_str}}</span>
                </div>
                <div class="order-num">下单号码: {{item.customer_mobile}}</div>
                <div class="bottom">
                  <div class="form-num">订单编号: {{item.order_sn}}</div>
                  <div class="go-detail" @click="toOrderDetail(item.id)">查看详情</div>
                </div>
              </div>
            </div>
            <div class="null-data"  v-if="loaded && dataArray.length === 0">
              <exception errType="orderfrom"></exception>
            </div>
          </scroll>
        </div>
        <div class="container-item">
          <scroll ref="scroll"
                  :data="dataArray"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingUp="onPullingUp"
                  :showNoMore="showNoMore"
                  v-if="selectTab === 1">
            <div class="list-container">
              <div class="list-item" v-for="(item, index) in dataArray" :key="index">
                <div class="title">
                  <span class="left">{{item.title}}</span>
                  <span class="right">{{item.status_str}}</span>
                </div>
                <div class="order-num">下单号码: {{item.customer_mobile}}</div>
                <div class="bottom">
                  <div class="form-num">订单编号: {{item.order_sn}}</div>
                  <div class="go-detail" @click="toOrderDetail(item.id)">查看详情</div>
                </div>
              </div>
            </div>
            <div class="null-data"  v-if="loaded && dataArray.length === 0">
              <exception errType="orderfrom"></exception>
            </div>
          </scroll>
        </div>
        <div class="container-item">
          <scroll ref="scroll"
                  :data="dataArray"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingUp="onPullingUp"
                  :showNoMore="showNoMore"
                  v-if="selectTab === 2">
            <div class="list-container">
              <div class="list-item" v-for="(item, index) in dataArray" :key="index">
                <div class="title">
                  <span class="left">{{item.title}}</span>
                  <span class="right">{{item.status_str}}</span>
                </div>
                <div class="order-num">下单号码: {{item.customer_mobile}}</div>
                <div class="bottom">
                  <div class="form-num">订单编号: {{item.order_sn}}</div>
                  <div class="go-detail" @click="toOrderDetail(item.id)">查看详情</div>
                </div>
              </div>
            </div>
            <div class="null-data"  v-if="loaded && dataArray.length === 0">
              <exception errType="orderfrom"></exception>
            </div>
          </scroll>
        </div>
        <div class="container-item">
          <scroll ref="scroll"
                  :data="dataArray"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingUp="onPullingUp"
                  :showNoMore="showNoMore"
                  v-if="selectTab === 3">
            <div class="list-container">
              <div class="list-item" v-for="(item, index) in dataArray" :key="index">
                <div class="title">
                  <span class="left">{{item.title}}</span>
                  <span class="right">{{item.status_str}}</span>
                </div>
                <div class="order-num">下单号码: {{item.customer_mobile}}</div>
                <div class="bottom">
                  <div class="form-num">订单编号: {{item.order_sn}}</div>
                  <div class="go-detail" @click="toOrderDetail(item.id)">查看详情</div>
                </div>
              </div>
            </div>
            <div class="null-data"  v-if="loaded && dataArray.length === 0">
              <exception errType="orderfrom"></exception>
            </div>
          </scroll>
        </div>
      </div>
    </div>
    <div class="loading" v-if="loading">
      <list-loading></list-loading>
    </div>
    <toast ref="toast"></toast>
    <router-view></router-view>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import Exception from 'components/exception/exception'
  import { OrderForm } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import {ease} from 'common/js/ease'
  import ListLoading from 'components/list-loading/list-loading'

  const LIMIT = 15
  const TABS = [
    {txt: '全部'},
    {txt: '交易中'},
    {txt: '交易完成'},
    {txt: '交易关闭'}
  ]
  export default {
    name: 'OrderFormManage',
    data () {
      return {
        tabList: TABS,
        dataArray: [],
        selectTab: 0,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        showNoMore: false,
        page: 1,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        loaded: false,
        loading: false,
        input: false,
        searchTxt: ''
      }
    },
    created () {
      this.orderFormList()
    },
    methods: {
      inputFocus() {
        this.input = true
      },
      inputBlur() {
        this.input = false
      },
      inputChange() {
        console.log(this.searchTxt)
      },
      changeTab(index) {
        this.selectTab = index
        this._defaultData()
        this.orderFormList()
      },
      clearSearch() {
        this.searchTxt = ''
        this.orderFormList()
      },
      searchBtn() {
        if (this.searchTxt.length) {
          this.selectTab = 0
          this._defaultData()
          this.orderFormList()
        }
      },
      _defaultData() {
        this.page = 1
        this.showNoMore = false
        this.dataArray = []
      },
      orderFormList(page = 1) { // 我的订单
        if (page === 1) {
          this.loaded = false
          this.loading = true
        }
        let data = {
          page,
          keyword: this.searchTxt,
          trading_status: this.selectTab === 0 ? 'all' : this.selectTab - 1
        }
        OrderForm.orderFormList(data)
          .then((res) => {
            this.loaded = true
            this.loading = false
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.dataArray = this.dataArray.concat(res.data)
            if (this.dataArray.length === 0) { // 无数据时，上拉不现实文字
              this.pullUpLoad = false
            } else {
              this.pullUpLoad = true
            }
            if (res.data.length < LIMIT) {
              this.showNoMore = true
            }
            setTimeout(() => {
              if (page === 1) {
                this.$refs.scroll.forceUpdate()
                this.$refs.scroll.scrollTo(0, 0, 0, ease[this.scrollToEasing])
              } else {
                this.$refs.scroll.forceUpdate()
              }
            }, 20)
          })
      },
      onPullingUp() {
        if (this.showNoMore) {
          this.$refs.scroll.forceUpdate()
          return
        }
        this.page++
        this.orderFormList(this.page)
      },
      toOrderDetail(id) {
        this.$router.push({path: '/mine/order-form-manage/order-detail', query: {id}})
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      }
    },
    computed: {
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      }
    },
    watch: {
      pullUpLoadObj: {
        handler() {
          if (!this.pullUpLoad) return // 防止下拉报错
          this.rebuildScroll()
        },
        deep: true
      }
    },
    components: {
      Scroll,
      Exception,
      Toast,
      ListLoading
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .order-form
    position: fixed
    background: $color-background
    z-index: 10
    left: 0
    right: 0
    bottom: 0
    top: 0
    font-family: $font-family-regular
    .search-box
      background-color: $color-white-fff
      padding: 9.5px 15px 4px
      display: flex
      flex-wrap: nowrap
      .input-box
        height: 36px
        background-color: $color-F0F2F5
        layout(row, block, nowrap)
        align-items: center
        border-radius: 2px
        padding-left: 15px
        width: 100%
        transition: all 0.4s
        padding-right: 10px
        justify-content: space-between
        .icon
          width: 15px
          height: 15px
          margin-right: 5px
        .txt
          font-family: $font-family-regular
          font-size: $font-size-14
          height: 36px
          flex: 1
          background: $color-F0F2F5
          line-height: 36px
          outline: none
          color: $color-20202E
          &::-webkit-input-placeholder
            color: $color-9B9B9B
        .clear
          width: 15px
          height: 15px
          bg-image('./delete')
          background-size: cover
          background-position: center
      .short-box
        width: 85%
        margin-right: 15px
      .btn
        width: 0
        text-align: center
        height: 36px
        line-height: 36px
        color: $color-20202E
        font-size: 14px
        overflow: hidden
        transition: all 0.4s
        box-sizing: border-box
      .show-btn
        width: 15%
    .tab-wrapper
      height: 44.5px
      background: $color-white-fff
      layout(row, block, nowrap)
      position: relative
      .tab
        flex: 1
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-20202E
        letter-spacing: 0.6px
        text-align: center;
        line-height: 44.5px
      .line-wrap
        position: absolute
        left: 0
        bottom: 0
        right: 0
        width: 25%
        layout()
        align-items: center
        transition: all 0.3s
        &:after
          content: ''
          width: 30px
          height: 3px
          background: $color-20202E
    .container
      overflow: hidden
      position: absolute
      top: 94px
      left: 0
      right: 0
      bottom: 0
      .big-container
        width: 400vw
        height: 100%
        display: flex
        transition: all 0.3s
        .container-item
          width: 100vw
          height: 100%
          box-sizing: border-box
          .null-data
            padding-top: 150px
        .list-container
          padding: 15px 15px
          .list-item
            margin-bottom: 15px
            box-shadow: 0 4px 12px 0 rgba(43,43,145,0.08)
            padding: 20px 15px 12px
            background: $color-white
            border-radius: 2px
            .title
              font-size: 16px
              color: $color-20202E
              display: flex
              justify-content: space-between
              align-items: center
              .left
                width: 80%
                overflow: hidden
                white-space: nowrap
                text-overflow: ellipsis
              .right
                font-size: 14px
                color: $color-9B9B9B
            .order-num
              font-size: 14px
              color: $color-9B9B9B
              padding: 12px 0 18px
              overflow: hidden
              white-space: nowrap
              text-overflow: ellipsis
            .bottom
              padding-top: 12px
              display: flex
              justify-content: space-between
              align-items: center
              border-top-1px($color-F3F3F3)
              .form-num
                font-size: 14px
                color: $color-9B9B9B
                overflow: hidden
                white-space: nowrap
                text-overflow: ellipsis
              .go-detail
                font-size: 12px
                color: $color-56BA15
                border-1px($color-56BA15, 0)
                text-align: center
                width: 65px
                height: 26px
                line-height: 26px
    .loading
      position: fixed
      width: 100%
      top: 45px
      bottom: 45px
      display: flex
      justify-content: center
      align-items: center
</style>
