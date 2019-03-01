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
            <section class="exception-box" v-if="noRecord">
              <exception errType="nodata"></exception>
            </section>
            <section v-if="actionList.length !== 0">
              <msg-box :actionList="actionList"></msg-box>
            </section>
          </div>
          <!--AI分析-->
          <div class="ai-box" v-if="menuIdx * 1 === 1">
            <div class="tag" :class="{'no-border': !labelList.length}">
              <h3 class="title" :class="{'no-border': !labelList.length}">
                <span class="left">用户标签</span>
                <p class="right" @click="toClientTag"><img class="icon" src="./icon-addlabel@2x.png"><span class="text">添加标签</span></p>
              </h3>
              <ul class="tag-list">
                <li class="tags" v-for="(item, index) in labelList" :key="index" @click="toClientTag">{{item.name}}</li>
                <li class="line" v-if="(index%4 === 0) && (index > 0)" v-for="(item, index) in labelList" :key="'t'+index" :style="{top: index/4*58+'px'}"></li>
              </ul>
            </div>
            <div class="pie-box">
              <div class="title">近7天活跃度</div>
              <ai-charts ref="c1" :CHARTS_TYPE="CHARTS_TYPE.VITALITY"></ai-charts>
            </div>
            <div class="pie-box">
              <div class="title">兴趣占比</div>
              <ai-charts ref="c2" :CHARTS_TYPE="CHARTS_TYPE.SHOP"></ai-charts>
              <div class="list" v-if="goodsList.length > 0">
                <h3 class="list-title">
                  <span class="num">排序</span>
                  <span class="name">商品名称</span>
                  <span class="count">次数</span>
                </h3>
                <p class="item" v-for="(item, index) in goodsList" :key="index">
                  <span class="num">{{index+1}}</span>
                  <span class="name">{{item.name}}</span>
                  <span class="count">{{item.value}}次</span>
                </p>
              </div>
            </div>
          </div>

          <!--营销记录-->
          <section class="exception-box" v-if="menuIdx * 1 === 2 && flowList.length === 0">
            <exception errType="nodata"></exception>
          </section>
          <section v-if="menuIdx * 1 === 2 && flowList.length !== 0">
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
      <base-tip ref="baseTip" type="mobile"></base-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {ClientDetail, Client, NEchart} from 'api'
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
        pieHint: PIEHINT,
        showTab: false,
        noRecord: false,
        CHARTS_TYPE,
        goodsList: [
          {
            name: '护发素',
            value: 20
          },
          {
            name: '护发素',
            value: 20
          },
          {
            name: '护发素',
            value: 20
          },
          {
            name: '护发素',
            value: 20
          },
          {
            name: '护发素',
            value: 20
          }
        ]
      }
    },
    created() {
      this.id = this.$route.query.id
      this.pageUrl = this.$route.path
      this.getClientId(this.id)
      this.getCusomerTagList()
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
      getClientData() {
        let info = this.$storage.get('info')
        let data = {
          customer_id: this.id,
          shop_id: info.shop_id,
          merchant_id: info.merchant_id,
          employee_id: 0
        }
        ClientDetail.clientData(data)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.clientData = JSON.parse(JSON.stringify(Object.assign(this.clientData, res.data)))
          })
      },
      getCusomerTagList() {
        Client.getCusomerTagList(this.id).then(res => {
          if (res.error === ERR_OK) {
            this.labelList = res.data.labels
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
        if (index * 1 === 0) {
          this.list = this.flowList
        } else if (index * 1 === 1) {
          this.$nextTick(() => {
            this.actionCustomerRatio()
            this.classifyRatio()
            this.interestedRatio()
          })
        } else if (index * 1 === 2) {
          this.getMarketRecord()
        }
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 20)
      },
      // 活跃度
      actionCustomerRatio() {
        let data = {
          customer_id: this.id,
          shop_id: this.$storage.get('info').shop_id,
          time: 'week'
        }
        NEchart.actionCustomerRatio(data)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            let x = res.data.map(item => {
              let day = item.day.slice(5).split('-').join('/')
              return day
            })
            let y = res.data.map(item => {
              return item.active_values
            })
            let lineData = {
              xAxisData: x || [],
              seriesData: [ {data: y.length ? y : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]} ]
            }
            this.$refs.c1.action(lineData)
          })
      },
      // 兴趣占比
      interestedRatio() {
        let info = this.$storage.get('info')
        let data = {
          customer_id: this.id,
          shop_id: info.shop_id,
          merchant_id: info.merchant_id
        }
        NEchart.interestedRatio(data)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            let seriesData = res.data.map(item => {
              return {name: item.title, value: item.counts}
            })
            this.goodsList = seriesData
          })
      },
      // 兴趣商品分类
      classifyRatio() {
        let info = this.$storage.get('info')
        let data = {
          customer_id: this.id,
          shop_id: info.shop_id,
          merchant_id: info.merchant_id
        }
        NEchart.classifyRatio(data)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              let pieData = {
                seriesData: [
                  {name: '拼团', value: 0},
                  {name: '砍价', value: 0},
                  {name: '服务', value: 0},
                  {name: '商品', value: 0}
                ]
              }
              this.$refs.c2.action(pieData)
              this.$toast.show(res.message)
              return
            }
            let seriesData = [
              {name: '拼团', value: 0},
              {name: '砍价', value: 0},
              {name: '服务', value: 0},
              {name: '商品', value: 0}
            ]
            let newArr = []
            for (let item in res.data) {
              newArr.push(item)
            }
            seriesData.forEach((item, index) => {
              item.value = res.data[newArr[index]]
            })
            let pieData = {
              seriesData: seriesData.slice(0, 4) || [
                {name: '拼团', value: 0},
                {name: '砍价', value: 0},
                {name: '服务', value: 0},
                {name: '商品', value: 0}
              ]
            }
            this.$refs.c2.action(pieData)
          })
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
                this.getClientData()
              } else {
                this.$refs.toast.show(res.message)
              }
            })
            this.mobile = res.data.mobile
            this.getNewActionList(this.id)
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      // 营销记录
      getMarketRecord() {
        this.flowPage = 1
        let data = {
          page: this.flowPage,
          limit: 10,
          customer_id: this.id
        }
        ClientDetail.marketRecord(data)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.flowList = res.data
            this._isAflowList(res)
          })
      },
      getMoreFlowList() {
        if (this.noMore) return
        let data = {
          page: this.flowPage,
          limit: 10,
          customer_id: this.id
        }
        ClientDetail.getFlowList(data).then((res) => {
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
            this.noRecord = !res.data.length
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
        if (this.clientData.mobile) {
          this.$refs.modal.showModal(this.clientData.mobile)
        } else {
          this.$refs.baseTip.show()
        }
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
        let url = '/chat/' + this.clientData.im_account + '?modelType=' + this.clientData.pnes
        this.$router.push(url)
      },
      onPullingUp() {
        if (this.menuIdx * 1 === 2) {
          this.getMoreFlowList()
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
      font-size: $font-size-16
      color: #333
      font-family: $font-family-regular
      transition: all 0.3s
      opacity: 0.8
    .active
      opacity: 1
      font-family: $font-family-medium
    .line
      position: absolute
      width: 33.33%
      height: 4px
      bottom: 0
      transition: all .3s
      z-index: 1
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
      box-shadow: 0 2px 16px 0 rgba(21,24,45,0.04)
      border-1px(#D9F0FE, 6px)
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
          width: 18px
          height: 18px
          margin-right: 5px
          object-fit: cover
        .text
          font-size: $font-size-14
          color: #333
          opacity: 0.6
      .no-border:after
        border: 0
      .tag-list
        display: flex
        flex-wrap: wrap
        position: relative
        overflow: hidden
        .tags
          width: 60px
          height: 24px
          line-height: 24px
          padding: 0 5px
          border: 1.5px solid $color-main
          color: $color-main
          text-align: center
          font-size: $font-size-14
          font-family: $font-family-regular
          border-radius: 4px
          float: left
          margin: 15px 4px 15px 0
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .line
          width: 100%
          position: absolute
          left: 0
          top: 0
          right :0
          height :1px
          background-image: repeating-linear-gradient(90deg, #ebeef3 0,#ebeef3 4px, #fff 4px, #fff 6px)
          transform: scale(1, 1)
          @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2)
            width: 200%
            transform: scale(1, .5)
          @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
            width: 300%
            transform: scale(1, 1 / 3)

    .no-border
      padding-bottom: 0
    .pie-box
      margin: 12px 0
      background: #FFFFFF
      box-shadow: 0 2px 16px 0 rgba(21,24,45,0.04)
      border-1px(#D9F0FE, 6px)
      border-radius: 4px
      overflow :hidden
      .title
        font-family: PingFangSC-Regular
        font-size: 16px
        color: #0E1249
        line-height: 16px
        padding: 13.5px 0
        margin: 0 15px
        border-bottom-1px(#E1E1E1)
      .list
        margin: 15px 15px 0
        border-1px(#F1F3F6)
        .list-title,.item
          background: #F5F8FC
          height: 40px
          line-height: 40px
          color: #333
          display: flex
          font-size: $font-size-14
          font-family: $font-family-regular
          text-align: left
          .num
            width: 60px
            text-indent: 15px
          .name
            flex: 1
            overflow: hidden
            text-indent: 30px
            text-overflow: ellipsis
            white-space: nowrap
          .count
            width: 60px
            text-indent: 15px
        .item
          background: #FFF
          border-bottom-1px(#f4f5f7)
        .list-title
          opacity: 0.6
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
    .pie-box:last-child
      padding-bottom: 15px
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
        width: 18px
        height: 18px
        display: block
        margin-right: 4px
        object-fit: cover
      .text
        font-size: $font-size-14
        font-family: $font-family-regular
        color: #fff
    .message-btn
      margin-right: 0
      background: linear-gradient(131deg, #02E68B, #06D4AA)
      .btn-img
        width: 18px
        height: 18px
        object-fit: cover
        padding-top: 2px

  .add-jump
    position: fixed
    z-index: 11
    width: 63px
    height: 66px
    right: 5px
    bottom: 50px

</style>
