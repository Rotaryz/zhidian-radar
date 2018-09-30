<template>
  <div class="my-service">
    <div class="tab-wrapper">
      <div class="line-wrap" :style="'transform: translate3d('+ selectTab * 100 +'%, 0, 0)'"></div>
      <div class="tab" v-for="(item,index) in tabList" :key="index" @click="changeTab(index)">{{item.txt}}({{item.num}})</div>
    </div>
    <div class="container">
      <div class="big-container" :style="'transform: translate(-' + selectTab*50 + '%,0)'">
        <div class="container-item">
          <scroll ref="scroll0"
                  :data="dataArray0"
                  :pullUpLoad="pullUpLoadObj0"
                  @pullingUp="onPullingUp"
                  :showNoMore="showNoMore0">
            <div class="list-container">
              <div class="list-item" v-for="(item, index) in dataArray0" :key="index">
                <service-item :tabIdx="selectTab"
                              :item="item"
                              :showEdit="item.showEdit"
                              @showEdit="showEditor"
                              @itemDown="itemDown"
                              :page="pageType">
                </service-item>
              </div>
            </div>
            <div class="null-data"  v-if="loaded && dataArray0.length === 0">
              <exception errType="noservice"></exception>
            </div>
            <div class="loading" v-if="loading">
              <div class="load-bg">
                <img src="./loading.gif" class="gif">
              </div>
            </div>
          </scroll>
        </div>
        <div class="container-item">
          <scroll ref="scroll1"
                  :data="dataArray1"
                  :pullUpLoad="pullUpLoadObj1"
                  @pullingUp="onPullingUp"
                  :showNoMore="showNoMore1">
            <div class="list-container">
              <div class="list-item" v-for="(item, index) in dataArray1" :key="index">
                <service-item :tabIdx="selectTab"
                              :item="item"
                              :showEdit="item.showEdit"
                              @showEdit="showEditor"
                              @itemDown="itemDown"
                              :page="pageType">
                </service-item>
              </div>
            </div>
            <div class="null-data"  v-if="loaded && dataArray1.length === 0">
              <exception errType="noservice"></exception>
            </div>
            <div class="loading" v-if="loading">
              <div class="load-bg">
                <img src="./loading.gif" class="gif">
              </div>
            </div>
          </scroll>
        </div>
      </div>
    </div>
    <div class="footer-box">
      <div class="footer-btn" @click="toDetail">上架服务</div>
    </div>
    <confirm-msg ref="confirm" @confirm="msgConfirm"></confirm-msg>
    <toast ref="toast"></toast>
    <router-view @refresh="refresh"></router-view>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import Exception from 'components/exception/exception'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import ServiceItem from 'components/service-item/service-item'
  import { Service } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import {ease} from 'common/js/ease'

  const LIMIT = 10
  const TABS = [
    {txt: '待上线', num: 10},
    {txt: '出售中', num: 10}
  ]
  export default {
    name: 'MyService',
    data () {
      return {
        tabList: TABS,
        dataArray0: [],
        dataArray1: [],
        selectTab: 0,
        pullUpLoad0: true,
        pullUpLoadThreshold0: 0,
        showNoMore0: false,
        page0: 1,
        pullUpLoad1: true,
        pullUpLoadThreshold1: 0,
        showNoMore1: false,
        page1: 1,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        limit: LIMIT,
        popShow: true,
        loaded: false,
        loading: false,
        pageType: 'myService',
        tabLoad: true,
        status: 0,
        downItem: ''
      }
    },
    created () {
      this.getServiceList()
    },
    methods: {
      changeTab(index) {
        this.selectTab = index
        this.status = index
        this._defaultData()
        this._defaultArray()
        this.getServiceList()
      },
      _defaultData() {
        this[`page${this.selectTab}`] = 1
        this[`showNoMore${this.selectTab}`] = false
        this[`dataArray${this.selectTab}`] = []
      },
      _defaultArray() {
        for (let i = 0; i < 2; i++) {
          this['dataArray' + i] = this['dataArray' + i].map((item) => {
            item.showEdit = false
            return item
          })
        }
      },
      getServiceList(page = 1) { // 我的服务
        console.log('service')
        if (!this.loaded) {
          this.loading = true
        }
        Service.getServiceList({page, limit: LIMIT, status: this.status})
          .then((res) => {
            this.loaded = true
            this.loading = false
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.tabList[0].num = res.wait_online_count
            this.tabList[1].num = res.online_count
            this[`dataArray${this.selectTab}`] = this[`dataArray${this.selectTab}`].concat(res.data)
            if (res.data.length < LIMIT) {
              this[`showNoMore${this.selectTab}`] = true
            }
            setTimeout(() => {
              if (page === 1) {
                this.$refs[`scroll${this.selectTab}`].forceUpdate()
                this.$refs[`scroll${this.selectTab}`].scrollTo(0, 0, 0, ease[this.scrollToEasing])
              } else {
                this.$refs[`scroll${this.selectTab}`].forceUpdate()
              }
            }, 20)
          })
      },
      onPullingUp() {
        if (this[`showNoMore${this.selectTab}`]) {
          this.$refs[`scroll${this.selectTab}`].forceUpdate()
          return
        }
        this[`page${this.selectTab}`]++
        this.getServiceList(this[`page${this.selectTab}`])
      },
      refresh() {
        this._defaultData()
        this._defaultArray()
        this.getServiceList()
      },
      showEditor(item) { // 点击右边小按钮
        this['dataArray' + this.selectTab] = this['dataArray' + this.selectTab].map((data) => {
          if (+item.id === +data.id) {
            data.showEdit = !data.showEdit
          } else {
            data.showEdit = false
          }
          return data
        })
      },
      itemDown(item) { // 点击下架按钮
        this['dataArray' + this.selectTab] = this['dataArray' + this.selectTab].map((data) => {
          if (+item.id === +data.id) {
            data.showEdit = !data.showEdit
          } else {
            data.showEdit = false
          }
          return data
        })
        this.downItem = item
        Service.activity(this.downItem.goods_id)
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            if (res.data.length) {
              this.$refs.confirm.show({msg: '该服务已关联活动，下架会导致活动下架，确定吗？'})
            } else {
              this.$refs.confirm.show({msg: '确定下架该服务吗？'})
            }
          })
      },
      msgConfirm() {
        Service.serviceHandle(this.downItem.goods_id, 0) // 下架服务
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
            }
            this['dataArray' + this.selectTab] = this['dataArray' + this.selectTab].filter((data) => {
              return +this.downItem.id !== +data.id
            })
            this.tabList[this.selectTab].num--
            setTimeout(() => {
              this.$refs[`scroll${this.selectTab}`].forceUpdate()
            }, 20)
          })
      },
      toDetail() {
        this.$router.push('/mine/my-service/shelf-service')
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs[`scroll${this.selectTab}`].destroy()
          this.$refs[`scroll${this.selectTab}`].initScroll()
        })
      }
    },
    computed: {
      pullUpLoadObj0: function () {
        return this.pullUpLoad0 ? {
          threshold: parseInt(this.pullUpLoadThreshold0),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      },
      pullUpLoadObj1: function () {
        return this.pullUpLoad1 ? {
          threshold: parseInt(this.pullUpLoadThreshold1),
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
      ConfirmMsg,
      ServiceItem,
      Toast
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .my-service
    position: fixed
    background: $color-background
    z-index: 10
    left: 0
    right: 0
    bottom: 0
    top: 0
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
        width: 50%
        layout()
        align-items: center
        transition: all 0.3s
        &:after
          content: ''
          width: 50px
          height: 3px
          background: $color-20202E

    .container
      overflow: hidden
      position: absolute
      top: 45px
      left: 0
      right: 0
      bottom: 0
      .big-container
        width: 200vw
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
            padding: 0 15px
            .list-item
              padding-top: 15px
              box-shadow: 0 2px 6px 0 rgba(43,43,145,0.04)
    .footer-box
      position: fixed
      width: 100vw
      height: 44.5px
      z-index: 60
      bottom: 0
      left: 0
      background: $color-white
      box-sizing: border-box
      .footer-btn
        width: 100%
        height: 100%
        background: $color-20202E
        line-height: 44.5px
        text-align: center
        font-family: $font-family-regular
        color: $color-white
        font-size: $font-size-16
        letter-spacing: 0.8px
    .loading
      position: fixed
      width: 100%
      top: 45px
      bottom: 45px
      display: flex
      justify-content: center
      align-items: center
      .load-bg
        width: 60px
        height: 60px
        border-radius: 4px
        background: rgba(0,0,0,0.3)
        display: flex
        justify-content: center
        align-items: center
      .gif
        width: 30px
        height: 30px
</style>
