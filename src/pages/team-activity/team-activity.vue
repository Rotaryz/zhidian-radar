<template>
  <div class="team-activity">
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
                <div class="time-down">
                  <div class="time-box">
                    <p class="title">火爆拼团</p>
                    <p class="time">{{selectTab === 0 ? '距离本场开始' : '距离本场结束'}}:{{item.endTime ? item.endTime.day ? item.endTime.day + '天' : '' : ''}}{{item.endTime ? item.endTime.hour ? item.endTime.hour : '' : ''}}:{{item.endTime ? item.endTime.minute ? item.endTime.minute : '' : ''}}:{{item.endTime ? item.endTime.second ? item.endTime.second : '' : ''}}</p>
                  </div>
                </div>
                <activity-item :tabIdx="selectTab"
                              :item="item"
                              :showEdit="item.showEdit"
                              @showEdit="showEditor"
                              @itemUp="itemUp"
                              :page="pageType"
                >
                </activity-item>
              </div>
            </div>
            <div class="null-data"  v-if="loaded && dataArray0.length === 0">
              <exception errType="nodata"></exception>
            </div>
            <div class="loading" v-if="loading">
              <list-loading></list-loading>
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
                <div class="time-down">
                  <div class="time-box">
                    <p class="title">火爆拼团</p>
                    <p class="time">{{selectTab === 0 ? '距离本场开始' : '距离本场结束'}}:{{item.endTime ? item.endTime.day ? item.endTime.day + '天' : '' : ''}}{{item.endTime ? item.endTime.hour ? item.endTime.hour : '' : ''}}:{{item.endTime ? item.endTime.minute ? item.endTime.minute : '' : ''}}:{{item.endTime ? item.endTime.second ? item.endTime.second : '' : ''}}</p>
                  </div>
                </div>
                <activity-item :tabIdx="selectTab"
                              :item="item"
                              :showEdit="item.showEdit"
                              @showEdit="showEditor"
                              @itemUp="itemUp"
                              :page="pageType">
                </activity-item>
              </div>
            </div>
            <div class="null-data"  v-if="loaded && dataArray1.length === 0">
              <exception errType="nodata"></exception>
            </div>
            <div class="loading" v-if="loading">
              <list-loading></list-loading>
            </div>
          </scroll>
        </div>
      </div>
    </div>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import Exception from 'components/exception/exception'
  import ActivityItem from 'components/activity-item/activity-item'
  import { Activity } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import {ease} from 'common/js/ease'
  import ListLoading from 'components/list-loading/list-loading'

  const LIMIT = 15
  const TABS = [
    {txt: '未开始', num: 0},
    {txt: '进行中', num: 0}
  ]
  export default {
    name: 'ShelfService',
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
        popShow: true,
        loaded: false,
        loading: true,
        pageType: 'team',
        tabLoad: true,
        status: 0,
        timeArr: ['start_at_timestamp', 'end_at_timestamp'],
        timestamp: 'start_at_timestamp'
      }
    },
    created () {
      this.getActivityAll()
    },
    methods: {
      changeTab(index) {
        this.status = index
        this.selectTab = index
        this.timestamp = this.timeArr[index]
        this._defaultData()
        this._defaultArray()
        this.getActivityAll()
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
      getActivityAll(page = 1, loading = true) { // 活动库
        if (!this.loaded) {
          this.loading = true
        }
        Activity.getActivityAll({page, status: this.status})
          .then((res) => {
            this.loaded = true
            this.loading = false
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.$emit('refresh')
            this.tabList[0].num = res.wait_online_count
            this.tabList[1].num = res.online_count
            this._endTimePlay()
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
        this.getActivityAll(this[`page${this.selectTab}`])
      },
      delClick() {
        this.$refs.confirm.show('确定下架该活动')
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
      itemUp(item) { // 点击上架按钮
        Activity.activityHandle(item.id, 1) // 上架活动
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.$refs.toast.show('上架成功')
            this.$emit('refresh')
            this['dataArray' + this.selectTab] = this['dataArray' + this.selectTab].map((data) => {
              if (+item.id === +data.id) {
                data.showEdit = !data.showEdit
                data.status = 1
              } else {
                data.showEdit = false
              }
              return data
            })
            setTimeout(() => {
              this.$refs[`scroll${this.selectTab}`].forceUpdate()
            }, 20)
          })
      },
      _endTimePlay() {
        clearInterval(this.timer)
        this[`dataArray${this.selectTab}`] = this[`dataArray${this.selectTab}`].map((item) => {
          item.endTime = this._groupTimeCheckout(item[this.timestamp], item.current_timestamp)
          return item
        })
        this.timer = setInterval(() => {
          this[`dataArray${this.selectTab}`] = this[`dataArray${this.selectTab}`].map((item, index) => {
            item.current_timestamp++
            item.endTime = this._groupTimeCheckout(item[this.timestamp], item.current_timestamp)
            return item
          })
        }, 1000)
      },
      _groupTimeCheckout(time, nowTime) {
        let nowSecond = new Date(nowTime)
        let differ = new Date(time) - nowSecond
        let day = Math.floor(differ / (60 * 60 * 24))
        day = day >= 10 ? day : '0' + day
        let hour = Math.floor(differ / (60 * 60)) - (day * 24)
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (day * 24 * 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0) {
          times = {
            day,
            hour,
            minute,
            second
          }
        } else {
          times = {
            day: '00',
            hour: '00',
            minute: '00',
            second: '00'
          }
        }
        return times
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
      ActivityItem,
      Toast,
      ListLoading
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .team-activity
    position: fixed
    background: $color-background
    z-index: 60
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
      width: 100vw
      height: 100vh
      .big-container
        width: 200vw
        height: 100vh
        display: flex
        transition: all 0.3s
        .container-item
          width: 100vw
          height: 100vh
          box-sizing: border-box
          .null-data
            padding-top: 150px
          .list-container
            padding: 0 15px
            .list-item
              padding-top: 15px
              box-shadow: 0 2px 6px 0 rgba(43,43,145,0.04)
            .time-down
              height: 46px
              padding: 0 15px
              background: $color-white
            .time-box
              height: 100%
              display: flex
              align-items: center
              justify-content: space-between
              border-bottom-1px($color-F3F3F3)
            .title
              font-size: 16px
              color: $color-20202E
            .time
              font-size: 14px
              color: $color-20202E
    .loading
      position: fixed
      width: 100%
      top: 45px
      bottom: 45px
      display: flex
      justify-content: center
      align-items: center
</style>
