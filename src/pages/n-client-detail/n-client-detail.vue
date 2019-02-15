<template>
  <transition name="slide">
    <div class="client-detail">
      <div class="container">
        <scroll ref="scroll"
                :data="list"
                :probeType="probeType"
                bcColor="#FFF"
                :listenScroll="listenScroll"
                @scroll="scroll"
                :pullUpLoad="pullUpLoadObj"
                :showNoMore="false"
                @pullingUp="onPullingUp">
          <div class="client-top" ref="eleven">
            <div class="cliten-bg"></div>
            <div class="msg">
              <detail-msg :clientData="clientData"></detail-msg>
            </div>
          </div>
          <!--tab栏-->
          <div class="select-tab select-client">
            <div class="tab" :class="{'active': menuIdx === index}" v-for="(item, index) in tabList" v-bind:key="index" @click="switchTab(index)">{{item}}
            </div>
            <div class="line" :style="'transform:translate3d('+ (100 * menuIdx) + '%, 0, 0)'">
              <div class="chilen-line"></div>
            </div>
          </div>
          <!--来访记录-->
          <div class="visitor-box" v-if="menuIdx * 1 === 0">
            <section class="exception-box" v-if="actionList.length * 1 === 0">
              <exception errType="nodata"></exception>
            </section>
            <section v-if="actionList.length * 1 !== 0">
              <msg-box :actionList="actionList"></msg-box>
            </section>
          </div>
          <!--AI分析-->
          <div class="ai-box" v-if="menuIdx * 1 === 1">
            <div class="tag">
              <h3 class="title">
                <span class="left">用户标签</span>
                <p class="right" v-if="labelList.length<3" @click="toClientTag"><span class="icon"></span><span class="text">添加标签</span></p>
              </h3>
              <ul class="tag-list">
                <li class="tags" v-for="(item, index) in labelList" :key="index" @click="toClientTag">{{item.name}}</li>
                <li class="line" v-if="(index%4 === 0) && (index > 0)" v-for="(item, index) in labelList" :key="'t'+index" :style="{top: index/4*58+'px'}"></li>
              </ul>
            </div>
            <div class="pie-box">
              <div id="myLine"></div>
              <div class="title-box">
                <div class="title">近15天活跃度</div>
                <ai-charts ref="c1" :CHARTS_TYPE="CHARTS_TYPE.VITALITY"></ai-charts>
              </div>
            </div>
            <div class="pie-box">
              <div id="myPie"></div>
              <div class="title-box">
                <div class="title">兴趣的商品占比</div>
                <ai-charts ref="c2" :CHARTS_TYPE="CHARTS_TYPE.SHOP"></ai-charts>
              </div>

            </div>
            <div class="pie-box" v-if="false">
              <div id="myBar"></div>
              <div class="title-box">
                <div class="title">客户与我的互动</div>
                <div class="sub-title">(每天0点更新)</div>
              </div>
            </div>
          </div>

          <!--营销记录-->
          <section class="exception-box" v-if="menuIdx * 1 === 2 && flowList.length * 1 === 0">
            <exception errType="nodata"></exception>
          </section>
          <section v-if="menuIdx * 1 === 2 && flowList.length * 1 !== 0">
            <market-record :flowList="flowList"></market-record>
          </section>
        </scroll>
      </div>
      <div class="select-tab" v-if="showTab">
        <div class="tab" :class="{'active': menuIdx === index}" v-for="(item, index) in tabList" v-bind:key="index" @click="switchTab(index)">{{item}}</div>
        <div class="line" :style="'transform:translate3d('+ (100 * menuIdx) + '%, 0, 0)'">
          <div class="chilen-line"></div>
        </div>
      </div>
      <div class="bottom-box">
        <div class="box-btn" @click="phoneCall">
          <img src="./icon-addwechat@2x.png" alt="" class="btn-img">
          <div class="text">添加微信</div>
        </div>
        <div class="box-btn message-btn" @click="jumpMessage">
          <img src="./icon-sendnews@2x.png" alt="" class="btn-img">
          <div class="text">发消息</div>
        </div>
      </div>
      <router-view @refresh="refresh"></router-view>
      <toast ref="toast"></toast>
      <modal ref="modal"></modal>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {ClientDetail, Client, Echart} from 'api'
  import {ERR_OK} from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import storage from 'storage-controller'
  import Scroll from 'components/scroll/scroll'
  import Exception from 'components/exception/exception'
  import DetailMsg from './detail-msg/detail-msg'
  import MsgBox from './msg-box/msg-box'
  import MarketRecord from './market-record/market-record'
  import Modal from './modal/modal'
  import AiCharts from 'components/_ai-charts/_ai-charts'
  import {CHARTS_TYPE} from 'utils/constants-charts'

  import {mapActions, mapGetters} from 'vuex'
  const PIEHINT = [{text: '个人', icon: 'one'}, {text: '商品', icon: 'two'}, {text: '拼团', icon: 'thr'}, {text: '砍价', icon: 'four'}]
  export default {
    name: 'client-detail',
    data() {
      return {
        listenScroll: true,
        probeType: 3,
        tabList: ['来访记录', 'AI分析', '营销记录'],
        showMode: true,
        menuIdx: 0,
        dataEcharts: false,
        clientData: {
          image_url: '',
          name: ''
        },
        flow: {
          progress: '',
          create_follow_record: true
        },
        flowPage: 1,
        flowList: [],
        noMore: false,
        id: '',
        flowId: '',
        actionPage: 1,
        actionList: [],
        noActionMore: false,
        mobile: '',
        list: [],
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: ' ',
        pullUpLoadNoMoreTxt: ' ',
        page: 1,
        twoList: [],
        tabhighgt: 216,
        highgt: 216,
        pageUrl: '',
        labelList: [],
        pieData: [
          {value: 1, name: '对我感兴趣'},
          {value: 1, name: '对产品感兴趣'},
          {value: 1, name: '对公司感兴趣'}
        ],
        pieHint: PIEHINT,
        showTab: false,
        CHARTS_TYPE
      }
    },
    created() {
      this.id = this.$route.query.id
      this.pageUrl = this.$route.path
      this.getClientId(this.id)
      this.getCusomerTagList()
      this.getActionLineData()
      this.getPieData()
      // this.getBarData()
    },
    mounted() {
      this.highgt = this.$refs.eleven.offsetHeight
      this.tabhighgt = this.$refs.eleven.offsetHeight
    },
    beforeDestroy() {
      this.$emit('refresh')
    },
    methods: {
      ...mapActions([
        'setCurrent'
      ]),
      refresh() {
        setTimeout(() => {
          this.flowPage = 1
          this.noMore = false
          this.getClientId(this.id)
          this.getCusomerTagList()
        }, 300)
      },
      getCusomerTagList() {
        Client.getCusomerTagList(this.id).then(res => {
          if (res.error === ERR_OK) {
            let arr = res.data.labels.slice(0, 3)
            this.labelList = arr
          }
        })
      },
      toClientTag() {
        let path = `${this.pageUrl}/client-tag?customerId=${this.id}`
        this.$router.push(path)
      },
      chatMsg(item) {
        let currentMsg = {
          nickName: item.nickName,
          avatar: item.avatar,
          account: item
        }
        this.setCurrent(currentMsg)
        let url = '/chat?id=' + item.sessionId
        this.$router.push(url)
      },
      scroll(pos) {
        let hightPx = pos.y * -1
        if (hightPx >= this.highgt) {
          this.showTab = true
        } else {
          this.showTab = false
        }
      },
      switchTab(index) {
        this.$refs.scroll.scrollTo(0, 0)
        this.scroll(0)
        this.menuIdx = index
        if (index * 1 === 1) {
          this.$nextTick(() => {
            this.$refs.c1.action()
            this.$refs.c2.action()
          })
        } else if (index * 1 === 0) {
          this.list = this.flowList
        }
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 20)
      },
      getClientId(id) {
        ClientDetail.getClientId(id).then((res) => {
          if (res.error === ERR_OK) {
            this.clientData = res.data
            this.id = res.data.id
            this.flowId = res.data.flow_id
            ClientDetail.getClientDetail(id).then(res => {
              if (res.error === ERR_OK) {
                if (res.data.flow.real_name.length !== 0) {
                  this.clientData.name = res.data.flow.real_name
                } else {
                  this.clientData.name = res.data.flow.nickname
                }
              } else {
                this.$refs.toast.show(res.message)
              }
            })
            this.mobile = res.data.mobile
            this.getNewFlowList(this.id, this.flowId)
            this.getNewActionList(this.id)
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      getNewFlowList(id, flowId) {
        this.flowPage = 1
        ClientDetail.getFlowList(id, flowId, this.flowPage).then((res) => {
          if (res.error === ERR_OK) {
            this.flowList = res.data
            this._isAflowList(res)
          }
        })
      },
      getMoreFlowList(id, flowId) {
        if (this.noMore) return
        ClientDetail.getFlowList(id, flowId, this.flowPage).then((res) => {
          if (res.error === ERR_OK) {
            this.flowList.push(...res.data)
            this._isAflowList(res)
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      _isAflowList(res) {
        this.flowPage++
        if (this.flowList.length >= res.meta.total * 1) {
          this.noMore = true
        }
      },
      getNewActionList(id) {
        this.actionPage = 1
        ClientDetail.getActionList(id).then((res) => {
          if (res.error === ERR_OK) {
            this.actionList = res.data
          } else {
            this.noActionMore = true
            this.$refs.toast.show(res.message)
          }
        })
      },
      getMoreActionList(id) {
        if (this.noActionMore) {
          this.$refs.scroll.forceUpdate()
          return
        }
        this.actionPage++
        const number = this.actionList.length
        ClientDetail.getActionList(id, number).then((res) => {
          if (res.error === ERR_OK) {
            if (res.data.length * 1 === 0) {
              this.actionPage--
              this.noActionMore = true
            } else {
              this.actionList.push(...res.data)
            }
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      phoneCall() {
        this.$refs.modal.showModal()
      },
      toAddFlow() {
        let path = `${this.pageUrl}/addflow?id=${this.id}&flowId=${this.flowId}`
        this.$router.push(path)
      },
      jumpData() {
        let path = `${this.pageUrl}/detail-data?id=${this.id}&flowId=${this.flowId}`
        this.$router.push(path)
      },
      jumpMessage() {
        let currentMsg = {
          nickName: this.clientData.name,
          avatar: this.clientData.image_url,
          account: this.clientData.im_account
        }
        this.setCurrent(currentMsg)
        let url = '/chat/' + this.clientData.im_account
        this.$router.push(url)
      },
      onPullingUp() {
        if (this.menuIdx * 1 === 2) {
          this.getMoreFlowList(this.id, this.flowId)
        }
        if (this.menuIdx * 1 === 0) {
          this.getMoreActionList(this.id)
        }
        if (this.menuIdx * 1 === 1) {
          this.$refs.scroll.forceUpdate()
        }
        if (this.menuIdx * 1 === 2 && this.noMore) {
          this.$refs.scroll.forceUpdate()
        }
        if (this.menuIdx * 1 === 0 && this.noActionMore) {
          this.$refs.scroll.forceUpdate()
        }
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      },
      getPieData() {
        Echart.getPie(this.id).then(res => {
          if (res.error === ERR_OK) {
            this.pieData = res.data
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      getActionLineData() {
        Echart.getActionLine(this.id).then(res => {
          if (res.error === ERR_OK) {
            this.ationLine = res.data
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      getBarData() {
        Echart.getBar(this.id).then(res => {
          if (res.error === ERR_OK) {
            this.barData = res.data
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      }
    },
    components: {
      Toast,
      Exception,
      Scroll,
      DetailMsg,
      MsgBox,
      MarketRecord,
      Modal,
      AiCharts
    },
    computed: {
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      },
      userInfo() {
        return storage.get('info')
      },
      ...mapGetters(['ios']),
      slide() {
        return this.ios ? '' : 'slide'
      }
    },
    watch: {
      pullUpLoadObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  div
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box

  .exception-box
    padding-top: 70px

  .client-detail
    fill-box()
    z-index: 50
    background: #FFF

  .container
    fill-box(absolute)
    bottom: 55px

  .client-top
    position: relative
    padding-bottom: 10px
    .cliten-bg
      height: 131px
      width: 100%
      icon-image("bg-khxq")
      background-size: cover
      box-sizing: border-box
      background-color: #FFF
    .msg
      margin: -92px 12px 0
      height: 150px
  .select-tab
    layout(row)
    height: 48px
    line-height: 47px
    border-bottom-1px(#E1E1E1)
    position: fixed
    width: 100%
    top: 0
    left: 0
    z-index: 11
    background: #FFF
    .tab
      flex: 1
      text-align: center
      font-size: $font-size-14
      color: $color-text
      font-family: $font-family-regular
      transition: all 0.3s
    .active
      font-size: $font-size-16
      font-family: $font-family-medium
    .line
      position: absolute
      width: 33.33%
      height: 4px
      bottom: 0
      transition: all .3s
      .chilen-line
        height: 4px
        width: 42px
        background: $color-linear-main
        border-radius: 2px
        margin: 0 auto

  .select-client
    position: relative

  .follow-box
    padding: 15px 15px 15px 35px
    position: relative
    overflow: hidden
    font-family: $font-family-regular
    .follow-list
      background: #fff
      padding: 15px 10px
      margin-bottom: 15px
      position: relative
      .time
        font-size: $font-size-medium
        color: $color-text-88
      .text
        margin-top: 10px
        font-size: $font-size-medium
        color: $color-text
        min-height: 10px
        word-break: break-all
      .icon-cri
        position: absolute
        border: 1px solid #ccc
        background: #fff
        width: 10px
        height: 10px
        left: -21px
        top: 0
        bottom: 0
        border-radius: 50%
        margin: auto 0
      .icon-log
        position: absolute
        width: 20px
        height: 50%
        left: -21px
        top: 0
        background: #f0f2f5
      .icon-img
        position: absolute
        width: 10px
        height: 14px
        left: -21px
        top: 0
        bottom: 0
        margin: auto 0
        background: #f0f2f5
        .icon-small-img
          height: 14px
          left: -21px
    .follow-list:last-child
      margin-bottom: 0
    .follow-line
      width: 1px
      position: absolute
      height: 100%
      background: #CCCCCC
      top: 15px
      left: 18px

  .ai-box
    padding: 15px
    .tag
      padding: 0 15px 8px
      border-radius: 6px
      border-1px(#E9F0FE, 12PX)
      box-shadow:  0 2px 16px 0 rgba(21,24,45,0.04)
      .title
        display: flex
        justify-content: space-between
        align-items: center
        height: 45px
        border-bottom-1px(#E1E1E1)
        font-family: $font-family-regular
        .left
          font-size: $font-size-16
          color: #0E1249
        .right
          display: flex
          align-items: center
        .icon
          width: 16px
          height: 16px
          icon-image(icon-addlabel)
          margin-right: 5px
        .text
          font-size: $font-size-14
          color: #333
          opacity: 0.6
      .tag-list
        display: flex
        flex-wrap: wrap
        position: relative
        .tags
          width: 70px
          height: 24px
          line-height: 24px
          border: 2px solid $color-main
          color: $color-main
          text-align: center
          font-size: $font-size-14
          font-family: $font-family-regular
          border-radius: 4px
          float: left
          margin: 15px 4px 15px 0
        .line
          width: 100%
          border-bottom-1px($color-line)
          position: absolute
          left: 0
          top: 0
    .pie-box
      margin: 15px 0
      background: $color-white
      border-radius: 6px
      border-1px(#E9F0FE, 12PX)
      box-shadow:  0 2px 16px 0 rgba(21,24,45,0.04)
      #myPie
        width: 100%
        height: 305px
        margin: 0 auto
        padding: 20px
      #myLine
        width: 100%
        height: 305px
        margin: 0 auto
        padding: 35px 10px 0
      #myAddLine
        width: 100%
        height: 305px
        margin: 0 auto
        padding: 35px 10px 0
      #myBar
        width: 100%
        height: 305px
        margin: 0 auto
        padding: 35px 10px 0
      #myChartfour
        width: 100%
        height: 305px
        margin: 0 auto
        padding: 35px 0 0
      .title-box
        width: 100%
        height: 45px
        line-height: 45px

        position: absolute
        font-size: $font-size-16
        color: #0E1249
        font-family: $font-family-regular
        left: 0
        top: 0
        .title
          margin: 0 15px
          border-bottom-1px(#E1E1E1)
        .sub-title
          margin-top: 5px
          font-size: $font-size-small
          color: $color-text-88
          font-family: $font-family-regular
      .bottom-des
        position: absolute
        bottom: 15px
        layout(row)
        width: 100%
        .tab
          layout(row)
          justify-content: center
          align-items: center
          width: 25%
          .icon
            background: #F9B43C
            width: 6px
            height: 6px
            border-radius: 50%
            margin-right: 3px
          .two
            background: #F9543C
          .thr
            background: #8E3C68
          .four
            background: #23799D
          .text
            font-size: $font-size-12
            font-family: $font-family-regular
            color: $color-text
      .pie-list
        layout(row)
        position: absolute
        width: 100%
        bottom: 15px
        left: 0
        .list
          flex: 1
          layout(row)
          align-items: center
          justify-content: center
          .icon
            background: #F9543C
            width: 7px
            height: 7px
            margin-right: 4px
            border-radius: 50%
          .two
            background: #23799D
          .thr
            background: #8E3C68
          .four
            background: #F9B43C
          .text
            line-height: 1
            font-size: $font-size-small
            color: #202020
            font-family: $font-family-regular
  .bottom-box
    layout(row)
    border-top-1px(#E1E1E1)
    position: absolute
    left: 0
    bottom: 0
    height: 55px
    width: 100%
    z-index: 11
    padding: 7.5px 12px
    box-sizing: border-box
    background: #FFF

    .box-btn
      layout(row)
      background: $color-linear-main
      flex: 1
      overflow: hidden
      justify-content: center
      align-items: center
      border-radius: 4px
      color: #FFF
      margin-right: 10px
      .btn-img
        width: 15px
        height: 17px
        display: block
        margin-right: 4px
      .text
        font-size: $font-size-14
        font-family: $font-family-regular
        color: #fff
    .message-btn
      margin-right: 0
      background: linear-gradient(131deg, #02E68B, #06D4AA)
      .btn-img
        width: 18px
        padding-top: 2px

  .add-jump
    position: fixed
    z-index: 11
    width: 63px
    height: 66px
    right: 5px
    bottom: 50px

</style>
