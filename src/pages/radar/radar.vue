<template>
  <div>
    <div class="radar">
      <div class="tab-container">
        <ul class="tab-wrapper border-bottom-1px">
          <li class="tab-item" :class="tabIndex===index?'active':''"
              v-for="(item,index) in tabList"
              :key="index"
              @click="changeTab(index)">
            {{item}}
          </li>
          <div class="line" :style="'transform:translate3d('+ (100 * tabIndex) + '%, 0, 0)'">
            <div class="chilen-line"></div>
          </div>
        </ul>
      </div>
      <span class="msg-box" :class="customCount ? '' : 'show'" @click.stop="clearNum" v-if="tabIndex === 0" >
        <img src="./icon-news_up@3x.png" class="msg-arrow">
        <span class="msg-hint">{{customCount}}条信息</span>
      </span>
      <div class="container" :class="tabIndex * 1 === 0 ? 'tabactive' : ''">
        <scroll ref="scroll"
                :data="list"
                bcColor="#f1f2f5"
                :pullUpLoad="pullUpLoadObj"
                :showNoMore="showNoMore"
                @pullingUp="onPullingUp"
                :pullDownRefresh="pullDownRefreshObj"
                @pullingDown="onPullingDown">
          <div class="msgs-list" v-if="list.length !== 0">
            <div class="msgs-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
              <div class="item-time" v-if="item.is_showtime">{{item.created_at | timeFormat}}</div>
              <div class="msg-item-content">
                <img :src="item.image_url" class="msgs-left">
                <div class="msgs-right">
                  <div class="msgs-container">
                    <p class="msgs-p" v-show="item.event_no * 1 === 10000">{{item.nickname}}<span class="green">查看</span>了<span class="green">你的名片</span>第{{item.count_sum}}次，成交在望</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10001">{{item.nickname}}给你<span class="green">点了</span><span class="green">赞</span>，看来认可你</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10002">{{item.nickname}}<span class="green">取消</span>给你点的<span class="green">赞</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10003">{{item.nickname}}<span class="green">复制</span>了你的<span class="green">邮箱</span>，请留意邮件</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10004">{{item.nickname}}<span class="green">浏览</span>了你的<span class="green">地址</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10005">{{item.nickname}}<span class="green">转发</span>了你的<span class="green">名片</span>，你的人脉圈正在裂变</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10006">{{item.nickname}}<span class="green">保存</span>了你的<span class="green">名片海报</span>，看来TA对你感兴趣</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10007">{{item.nickname}}<span class="green">拨打</span>了你的<span class="green">手机</span>，请记录跟进内容</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10008">{{item.nickname}}<span class="green">保存</span>了你的<span class="green">电话</span>，可以考虑主动沟通</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 10010">{{item.nickname}}<span class="green">复制</span>了你的<span class="green">微信</span>，可以考虑主动沟通</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20001">{{item.nickname}}正在<span class="green">查看</span>你的<span class="green">产品</span>第{{item.count_sum}}次，请把握商机</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20002">{{item.nickname}}正在<span class="green">查看</span><span class="green">{{item.title | titleCut}}</span>，可能对该产品感兴趣</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20003">{{item.nickname}}正在对<span class="green">{{item.title | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 20004">{{item.nickname}}<span class="green">转发</span>了<span class="green">{{item.title | titleCut}}</span>，可能在咨询他人建议</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 30001">{{item.nickname}}正在<span class="green">查看</span>你发布的<span class="green">动态</span>第{{item.count_sum}}次</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 30002">{{item.nickname}}给你发布的动态<span class="green">点了</span><span class="green">赞</span></p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 40001">{{item.nickname}}正在<span class="green">查看</span>你公司的<span class="green">官网</span>第{{item.count_sum}}次</p>
                    <p class="msgs-p" v-show="item.event_no * 1 === 50001">{{item.nickname}}正在向你<span class="green">咨询</span>，请做好准备应答</p>
                  </div>
                  <img src="./icon-pressed@2x.png" class="msgs-rt">
                </div>
              </div>
            </div>
          </div>
          <div class="null-data"  v-if="loaded && list.length === 0">
            <exception errType="nodata"></exception>
          </div>
          <div class="loading" v-if="loading">
            <div class="load-bg">
              <img src="./loading.gif" class="gif">
            </div>
          </div>
        </scroll>
      </div>
      <div class="action-box" :class="tabIndex * 1 === 1 ? 'tabactive' : ''">
        <div class="action-scroll">
          <scroll
            ref="scrollAction"
            bcColor="#f1f2f5">
            <ul class="action-tab">
              <li class="tab-item"  :class="actionIndex===index?'active':''"
                  v-for="(item,index) in actionList"
                  :key="index"
                  @click="actionTab(index)">{{item}}</li>
            </ul>
            <div class="action-all">
              <div class="action-list-con" v-for="(item, index) in actionListData" v-bind:key="index">
                <div class="item-list" v-for="(data, itemindex) in item" v-bind:key="itemindex">
                  <div class="item-left" :class="data.icon">
                  </div>
                  <div class="item-right">
                    <div class="text">{{data.name}}</div>
                    <div class="right-box">
                      <div class="number">{{data.count_sum}}次</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </scroll>
        </div>
      </div>
      <div class="people-box" :class="tabIndex * 1 === 2 ? 'tabactive' : ''">
        <div class="action-scroll">
          <scroll  ref="scrollPeople"
                   :data="peopleDataList"
                   bcColor="#f1f2f5"
                   :pullUpLoad="pullUpPeoleLoadObj"
                   :showNoMore="false"
                   @pullingUp="onPeoplePullingUp">
            <ul class="action-tab">
              <li class="tab-item"  :class="tabPeopleIndex===index?'active':''"
                  v-for="(item,index) in actionList"
                  :key="index"
                  @click="peopleTab(index)">{{item}}</li>
            </ul>
            <div class="people-all">
              <div class="msgs-list msgs-people" v-if="peopleDataList.length !== 0">
                <div class="msgs-item" v-for="(item, index) in peopleDataList" :key="index" @click="toDetail(item)">
                  <div class="item-time" v-if="item.is_showtime">{{item.created_at | timeFormat}}</div>
                  <div class="msg-item-content">
                    <img :src="item.image_url" class="msgs-left">
                    <div class="msgs-right">
                      <div class="msgs-container">
                        <p class="msgs-p">{{item.nickname}}跟你互动了<span class="green">{{item.count_sum}}</span>次</p>
                      </div>
                      <img src="./icon-pressed@2x.png" class="msgs-rt">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section class="exception-box" v-if="peopleDataList.length === 0">
              <exception errType="nodata"></exception>
            </section>
            <div class="loading" v-if="loading">
              <div class="load-bg">
                <img src="./loading.gif" class="gif">
              </div>
            </div>
          </scroll>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import {mapActions, mapGetters} from 'vuex'
  import {Im} from 'api'
  import {ERR_OK} from 'common/js/config'
  import storage from 'storage-controller'
  import {ease} from 'common/js/ease'
  import utils from 'common/js/utils'
  import Exception from 'components/exception/exception'

  const WORKLIST = [
    [
      {
        icon: 'ckmp',
        name: '查看名片',
        event_no: '10000',
        count_sum: 0
      },
      {
        icon: 'dzmp',
        name: '点赞名片',
        event_no: '10001',
        count_sum: 0
      },
      {
        icon: 'zfmp',
        name: '转发名片',
        event_no: '10005',
        count_sum: 0
      },
      {
        icon: 'bddh',
        name: '拨打电话',
        event_no: '10007',
        count_sum: 0
      },
      {
        icon: 'fzyx',
        name: '复制邮箱',
        event_no: '10003',
        count_sum: 0
      },
      {
        icon: 'ckdz',
        name: '查看地址',
        event_no: '10004',
        count_sum: 0
      },
      {
        icon: 'bcdh',
        name: '保存电话',
        event_no: '10008',
        count_sum: 0
      }
    ],
    [
      {
        icon: 'ckcp',
        name: '查看产品',
        event_no: '20001',
        count_sum: 0
      },
      {
        icon: 'ckxq',
        name: '查看详情',
        event_no: '20002',
        count_sum: 0
      },
      {
        icon: 'zxcp',
        name: '咨询产品',
        event_no: '20003',
        count_sum: 0
      },
      {
        icon: 'zfcp',
        name: '转发产品',
        event_no: '20004',
        count_sum: 0
      }
    ],
    [
      {
        icon: 'ckdt',
        name: '查看动态',
        event_no: '30001',
        count_sum: 0
      },
      {
        icon: 'dzdt',
        name: '点赞动态',
        event_no: '30002',
        count_sum: 0
      }
    ],
    [
      {
        icon: 'ckgw',
        name: '查看官网',
        event_no: '40001',
        count_sum: 0
      }
    ]
  ]
  export default {
    name: 'Radar',
    created() {
      if (!this.imIng) {
        this.$emit('login')
      }
      this.setCustomCount('clear')
      this.getRadarList()
      this.getAllData()
    },
    data() {
      return {
        list: [],
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        showNoMore: false,
        pullUpPeopleLoadThreshold: 0,
        pullUpPeopleLoadMoreTxt: '加载更多',
        pullUpPeopleLoadNoMoreTxt: '没有更多了',
        pullUpPeopleLoad: true,
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
        showPeopleNoMore: false,
        tabList: ['时间', '行为', '人'],
        tabPeopleIndex: 0,
        tabIndex: 0,
        actionList: ['全部', '今天', '7天', '30天'],
        actionIndex: 0,
        peopleDataList: [],
        firstGet: true,
        peopleMore: false,
        actionListData: WORKLIST,
        page: 0,
        tabTime: ['', 'today', 'week', 'month'],
        tabContent: ['scroll', 'scrollAction', 'scrollPeople'],
        loading: false,
        loaded: false
      }
    },
    methods: {
      ...mapActions([
        'setCustomCount',
        'setImIng',
        'setImInfo'
      ]),
      changeTab(index) {
        if (index * 1 === this.tabIndex * 1) {
          this.$refs[this.tabContent[index]].scrollTo(0, 0)
          return
        }
        this.tabIndex = index
        if (index * 1 === 2 && this.firstGet) {
          this.getPeopleList()
        }
      },
      getRadarList() {
        this.loading = true
        this.loaded = false
        Im.getRadarList(0, 30, this.userInfo.id).then((res) => {
          this.loading = false
          this.loaded = true
          if (res.error === ERR_OK) {
            this.list = res.data
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      peopleTab(index) {
        this.$refs.scrollPeople.scrollTo(0, 0)
        this.tabPeopleIndex = index
        this.getPeopleList(this.tabTime[index * 1])
      },
      actionTab(index) {
        this.$refs.scrollAction.scrollTo(0, 0)
        this.actionIndex = index
        this.getAllData(this.tabTime[index * 1])
      },
      toDetail(item) {
        let url = '/radar/client-detail'
        this.$router.push({path: url, query: {id: item.customer_id, pageUrl: url}})
      },
      clearNum() {
        Im.getRadarList(0, 30, this.userInfo.id).then((res) => {
          if (res.error === ERR_OK) {
            this.list = res.data
            this.setCustomCount('clear')
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
              this.$refs.scroll.scrollTo(0, 0, 300, ease[this.scrollToEasing])
            }, 20)
          }
        })
      },
      onPullingUp() {
        if (this.showNoMore) {
          this.$refs.scroll.forceUpdate()
          return
        }
        const num = this.list.length * 1 + this.customCount * 1
        Im.getRadarList(num, 30, this.userInfo.id).then((res) => {
          if (res.error === ERR_OK) {
            let list = res.data
            if (!list.length) {
              this.showNoMore = true
            } else {
              this.list = [...this.list, ...list]
            }
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      onPullingDown() {
        this.clearNum()
      },
      onPeoplePullingUp() {
        this.getMorePeopleList(this.tabTime[this.tabPeopleIndex * 1])
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      },
      rebuildPeopleScroll() {
        this.$nextTick(() => {
          this.$refs.scrollPeople.destroy()
          this.$refs.scrollPeople.initScroll()
        })
      },
      getAllData(time) {
        Im.getActionList(0, 30, this.userInfo.id, 2, time).then((res) => {
          if (res.error === ERR_OK) {
            let dataActionList = WORKLIST
            dataActionList.forEach((item) => {
              item.forEach((item1) => {
                let resArr = res.data.filter((item2) => {
                  return item1.event_no * 1 === item2.event_no * 1
                })
                if (resArr.length) {
                  item1.count_sum = resArr[0].count_sum
                } else {
                  item1.count_sum = 0
                }
              })
            })
          }
        })
      },
      getPeopleList(time) {
        this.loading = true
        this.loaded = false
        Im.getActionList(0, 30, this.userInfo.id, 3, time).then((res) => {
          this.loading = false
          this.loaded = true
          if (res.error === ERR_OK) {
            this.peopleDataList = res.data
            this.firstGet = false
            this.page = 0
            this.peopleMore = false
            if (res.data.length < 30) {
              this.peopleMore = true
            }
            setTimeout(() => {
              this.$refs.scrollPeople.forceUpdate()
            }, 20)
          }
        })
      },
      getMorePeopleList(time) {
        if (this.peopleMore) {
          this.$refs.scrollPeople.forceUpdate()
          return
        }
        this.page++
        const num = this.page * 30
        Im.getActionList(num, 30, this.userInfo.id, 3, time).then((res) => {
          if (res.error === ERR_OK) {
            let list = res.data
            if (res.data.length < 30) {
              this.peopleMore = true
            }
            this.peopleDataList = [...this.peopleDataList, ...list]
            setTimeout(() => {
              this.$refs.scrollPeople.forceUpdate()
            }, 20)
          }
        })
      }
    },
    filters: {
      titleCut(val) {
        if (val && val.length > 8) {
          return val.slice(0, 8) + '···'
        } else {
          return val
        }
      },
      timeFormat(val) {
        if (val) {
          let res = utils.radarTimeFormat(val)
          return res.time
        }
        return ''
      }
    },
    computed: {
      ...mapGetters([
        'customCount',
        'imIng'
      ]),
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      },
      pullUpPeoleLoadObj: function () {
        return this.pullUpPeopleLoad ? {
          threshold: parseInt(this.pullUpPeopleLoadThreshold),
          txt: {more: this.pullUpPeopleLoadMoreTxt, noMore: this.pullUpPeopleLoadNoMoreTxt}
        } : false
      },
      pullDownRefreshObj: function () {
        return this.pullDownRefresh && !this.noMore ? {
          threshold: parseInt(this.pullDownRefreshThreshold),
          stop: parseInt(this.pullDownRefreshStop),
          txt: '没有更多了'
        } : false
      },
      pullDownPeopleRefreshObj: function () {
        return this.pullDownRefresh && !this.noMore ? {
          threshold: parseInt(this.pullDownRefreshThreshold),
          stop: parseInt(this.pullDownRefreshStop),
          txt: '没有更多了'
        } : false
      },
      userInfo() {
        return storage.get('info')
      }
    },
    watch: {
      pullUpLoadObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      },
      pullUpPeoleLoadObj: {
        handler() {
          this.rebuildPeopleScroll()
        },
        deep: true
      },
      pullDownRefreshObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      },
      pullDownPeopleRefreshObj: {
        handler() {
          this.rebuildPeopleScroll()
        },
        deep: true
      }
    },
    components: {
      Scroll,
      Exception
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .exception-box
    padding-top: 70px
  .radar
    width: 100vw
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 45px
    font-family: $font-family-regular
    background: $color-background
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
    .tab-container
      height: 44.5px
      width: 100vw
      position: fixed
      left: 0
      top: 0
      z-index: 29
      background: $color-white
      .tab-wrapper
        position: relative
        height: 100%
        layout(row, block, nowrap)
        align-items: center
        justify-content: space-between
        .tab-item
          flex: 1
          height: 100%
          line-height: 44.5px
          font-size: $font-size-16
          color: $color-202020
          letter-spacing: 0.6px
          text-align: center
          transition: color 0.3s
          &.active
            color: $color-202020
      .tab-line-wrapper
        height: 100%
        width: 33.333%
        position: absolute
        top: 0
        left: 0
        layout()
        justify-content: flex-end
        align-items: center
        transition: all 0.3s
        .tab-line
          width: 30px
          height: 2.5px
          background: $color-20202E
    .container
      width: 100%
      overflow: hidden
      position: absolute
      top: 45px
      left: 0
      right: 0
      bottom: 0
    .action-all
      padding-bottom: 10px
      .action-list-con:last-child
        margin-bottom: 0
    .action-box
      width: 100%
      overflow: hidden
      position: absolute
      top: 45px
      left: 0
      right: 0
      bottom: 0
      .action-list-con
        background: $color-white-fff
        padding-left: 15px
        margin-bottom: 10px
        .item-list
          layout(row)
          align-items: center
          .item-left
            width: 18px
            height: 18px
            margin-right: 10px
            background-size: 18px 18px
            &.ckmp
              bg-image('./icon-checkcard')
            &.dzmp
              bg-image('./icon-zancard')
            &.zfmp
              bg-image('./icon-relaycard')
            &.bddh
              bg-image('./icon-call')
            &.fzyx
              bg-image('./icon-email')
            &.ckdz
              bg-image('./icon-address')
            &.bcdh
              bg-image('./icon-addphone')
            &.ckcp
              bg-image('./icon-viewproduct')
            &.ckxq
              bg-image('./icon-viewdetail')
            &.zxcp
              bg-image('./icon-consult')
            &.zfcp
              bg-image('./icon-relayproduct')
            &.ckdt
              bg-image('./icon-checktrends')
            &.dzdt
              bg-image('./icon-zan')
            &.pldt
              bg-image('./icon-comment')
            &.zfdt
              bg-image('./icon-icon-relaytrends')
            &.ckgw
              bg-image('./icon-website')
          .item-right
            layout(row)
            padding-right: 15px
            justify-content: space-between
            align-items: center
            height: 44.5px
            flex: 1
            border-bottom-1px(#e5e5e5)
            .text
              font-size: $font-size-14
              color: $color-20202E
              font-family: $font-family-regular
            .right-box
              layout(row)
              align-items: center
              .number
                font-family: $font-family-regular
                font-size: $font-size-14
                color: $color-56BA15
              .msgs-rt
                width: 7.5px
                height: 11.5px
        .item-list:last-child
          .item-right
            border-bottom-1px(rgba(255,255,255,0))
    .action-scroll
      width: 100%
      overflow: hidden
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
    .action-tab
      padding: 20px 0
      layout(row)
      justify-content: center
      align-items: center
      .tab-item
        width: 60px
        height: 30px
        text-align: center
        line-height: 30px
        background: $color-white-fff
        color: $color-20202E
        font-size: $font-size-14
        border-1px(#e5e5e5)
      .active
        background: $color-20202E
        color: $color-white-fff
        border-1px(rgba(255,2555,255,0))
    .people-box
      width: 100%
      overflow: hidden
      position: absolute
      top: 45px
      left: 0
      right: 0
      bottom: 0
    .msg-box
      min-width: 95px
      height: 30px
      background: $color-white
      border-radius: 15px 0 0 15px
      line-height: 30px
      font-size: 0
      position: fixed
      top: 55px
      right: 0
      z-index: 9
      transition: all .3s
      .msg-arrow
        width: 7px
        height: 8px
        padding-bottom: 1px
        margin-left: 12px
      .msg-hint
        font-size: $font-size-medium
        color: $color-text-56
        margin: 0 10px
    .show.msg-box
      right: -100%
    .msgs-list
      padding: 10px 15px 10px
      box-sizing: border-box
      .msgs-item
        margin-top: 18px
        .item-time
          font-size: $font-size-18
          color: #20202E
          padding: 10px 0 15px
          font-family: $font-family-medium
        .msg-item-content
          width: 100%
          height: 70px
          background: $color-white
          border: 0.5px solid rgba(32,32,46,0.10)
          box-shadow: 0 4px 12px 0 rgba(43,43,145,0.04)
          border-radius: 5px
          display: flex
          justify-content: space-between
          align-items: center
        .msgs-left
          margin: 0 10px 0 15px
          width: 40px
          height: 40px
          border-radius: 50%
          border: 0.5px solid rgba(32,32,46,0.10)
        .msgs-right
          flex: 1
          overflow: hidden
          margin-right: 13.5px
          height: 100%
          display: flex
          justify-content: space-between
          align-items: center
          .msgs-container
            flex: 1
            overflow: hidden
            height: 100%
            display: flex
            align-items: center
            .msgs-p
              line-height: 18px
              font-size: $font-size-medium
              font-family: $font-family-medium
              .green
                color: $color-text-56
          .msgs-rt
            width: 7.5px
            height: 11.5px
            margin-left: 33px
    .null-data
      padding-top: 120px
    .msgs-people
      padding-top: 0
      .msgs-item
        margin: 0 0 18px
  .line
    position: absolute
    width: 33.33%
    height: 3px
    bottom: 0
    transition: all .3s
    .chilen-line
      height: 3px
      width: 30px
      background: #20202e
      margin: 0 auto
  .tabactive
    z-index: 11
</style>
