<template>
  <div class="my-service">
    <div class="tab-wrapper">
      <div class="line-wrap" :style="'transform: translate3d('+ selectTab * 100 +'%, 0, 0)'"></div>
      <div class="tab" v-for="(item,index) in tabList" :key="index" @click="changeTab(index)">{{item.txt}}({{item.num}})</div>
    </div>
    <div class="container">
      <div class="big-container" :style="'transform: translate(-' + selectTab*50 + '%,0)'">
        <div class="container-item">
          <scroll ref="scroll"
                  :data="dataArray"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingUp="onPullingUp"
                  :showNoMore="showNoMore"
                  v-if="selectTab === 0">
            <div class="list-container">
              <div class="list-item" v-for="(item, index) in dataArray" :key="index">
                <service-item :tabIdx="selectTab"
                              :item="item"
                              :showEdit="item.showEdit"
                              @showEdit="showEditor"
                              @itemDown="itemDown"
                              page="myService">
                </service-item>
              </div>
            </div>
            <div class="null-data"  v-if="loaded && dataArray.length === 0">
              <exception errType="noservice"></exception>
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
                <service-item :tabIdx="selectTab"
                              :item="item"
                              :showEdit="item.showEdit"
                              @showEdit="showEditor"
                              @itemUp="itemUp"
                              page="shelf">
                </service-item>
              </div>
            </div>
            <div class="null-data"  v-if="loaded && dataArray.length === 0">
              <exception errType="noservice"></exception>
            </div>
          </scroll>
        </div>
      </div>
    </div>
    <div class="loading" v-if="loading">
      <list-loading></list-loading>
    </div>
    <confirm-msg ref="confirm" @confirm="msgConfirm"></confirm-msg>
    <toast ref="toast"></toast>
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
  import ListLoading from 'components/list-loading/list-loading'

  const LIMIT = 15
  const TABS = [
    {txt: '已上架', num: 0},
    {txt: '已下架', num: 0}
  ]
  export default {
    name: 'MyService',
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
        popShow: true,
        loaded: false,
        loading: false,
        pageType: 'myService',
        tabLoad: true,
        downItem: ''
      }
    },
    created () {
      this.getServiceList()
    },
    methods: {
      changeTab(index) {
        this.selectTab = index
        this._defaultData()
        // this._defaultArray()
        this.getServiceList()
      },
      _defaultData() {
        this.page = 1
        this.showNoMore = false
        this.dataArray = []
      },
      _defaultArray() {
        this.dataArray = this.dataArray.map((item) => {
          item.showEdit = false
          return item
        })
      },
      getServiceList(page = 1) { // 获取上下架列表
        if (page === 1) {
          this.loaded = false
          this.loading = true
        }
        Service.getServiceList({page, status: Math.abs(this.selectTab - 1)})
          .then((res) => {
            this.loaded = true
            this.loading = false
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.tabList[0].num = res.online_count
            this.tabList[1].num = res.offline_count
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
        this.getServiceList(this.page)
      },
      showEditor(item) { // 点击右边小按钮
        this.dataArray = this.dataArray.map((data) => {
          if (+item.id === +data.id) {
            data.showEdit = !data.showEdit
          } else {
            data.showEdit = false
          }
          return data
        })
      },
      itemUp(item) { // 点击上架按钮
        Service.serviceHandle(item.id, 1) // 上架服务
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.$refs.toast.show('上架成功')
            this.tabList[0].num++
            this.tabList[1].num--
            this.dataArray = this.dataArray.filter((data) => {
              return +item.id !== +data.id
            })
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          })
      },
      itemDown(item) { // 点击下架按钮
        this.dataArray = this.dataArray.map((data) => {
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
              return
            }
            this.$refs.toast.show('下架成功')
            this.dataArray = this.dataArray.filter((data) => {
              return +this.downItem.id !== +data.id
            })
            this.tabList[0].num--
            this.tabList[1].num++
            if (this.dataArray.length === 0) { // 无数据时，上拉不现实文字
              this.pullUpLoad = false
            }
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          })
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
      ConfirmMsg,
      ServiceItem,
      Toast,
      ListLoading
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
      width: 100%
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
      top: 0
      bottom: 45px
      display: flex
      justify-content: center
      align-items: center
</style>
