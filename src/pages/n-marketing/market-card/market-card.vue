<template>
  <div class="market-card">
    <div class="wrapper">
      <article class="top-wrapper">
        <section class="left" @click="navHandle">
          <img class="logo" :src="CONFIG.icon" alt="">
          <p class="title">{{info.name}}</p>
          <img class="arrow-right" src="./icon_pressed@2x.png" alt="">
        </section>
        <section class="right">
          <article v-if="CONFIG.buttonType === 'switch'" class="switch-wrapper-card" :class="{active: isClosed}" @click="switchHandle">
            <div class="circle-1" :class="{active: isClosed}"></div>
          </article>
          <article v-if="CONFIG.buttonType === 'status'" class="status-wrapper" :style="{borderColor: STATUS_COLOR[info.exec_status]}">
            <span class="text" :style="{color: STATUS_COLOR[info.exec_status]}">{{info.exec_status_str}}</span>
          </article>
        </section>
      </article>
      <article class="bottom-wrapper">
        <section class="left item-text">
          <p class="number" :class="{active: isClosed}">{{info[CONFIG.leftKey] || 0}}</p>
          <p class="text">{{CONFIG.leftText}}</p>
        </section>
        <section class="middle item-text">
          <p class="number" :class="{active: isClosed}">{{info[CONFIG.middleKey] || 0}}</p>
          <p class="text">{{CONFIG.middleText}}</p>
        </section>
        <section class="right charts" v-if="CONFIG.rightText === 'charts'">
          <div class="charts-wrapper">
            <ai-charts ref="_charts" :CHARTS_TYPE="CHARTS_TYPE.SEM_LIST"></ai-charts>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import AiCharts from 'components/_ai-charts/_ai-charts'
  import {CHARTS_TYPE} from 'utils/constants-charts'
  import {CONFIG, CARD_TYPE} from './card-config'
  import * as API from 'api'
  import * as Helpers from '@/store/helpers'

  const COMPONENT_NAME = 'MARKET_CARD'
  const STATUS_COLOR = ['#CDCDCD', '#0DCDAE', '#F29D34', '#CDCDCD']

  export default {
    name: COMPONENT_NAME,
    components: {
      AiCharts
    },
    props: {
      info: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        isClosed: this.info.status,
        nowTime: 0,
        CHARTS_TYPE: CHARTS_TYPE,
        CARD_TYPE: CARD_TYPE,
        STATUS_COLOR: STATUS_COLOR,
        xAxisData: [],
        seriesData: [{
          data: []
        }]
      }
    },
    computed: {
      CONFIG() {
        let key = '' + this.info.type || CARD_TYPE.newCustomer
        return CONFIG[key]
      }
    },
    watch: {
      info() {
        this._initChatData()
      }
    },
    mounted() {
      this._initChatData()
    },
    methods: {
      ...Helpers.marketMethods,
      _initChatData() {
        let key = this.CONFIG.middleKey
        let {isClosed} = this
        if (this.info.market_type) {
          this.isClosed = isClosed = true
        }
        let report = this.info.report || []
        let s = []
        let x = []
        report.forEach((item) => {
          s.push(item[key])
          x.push(item.at)
        })
        this.seriesData[0].data = s
        this.xAxisData = x
        this._chartActions({xAxisData: this.xAxisData, seriesData: this.seriesData, isClosed})
      },
      async navHandle() {
        await this.requestMarketData(this.info)
        let url = this.$route.path + '/market-detail?id=' + this.info.id
        this.$router.push(url)
      },
      switchHandle() {
        if (Date.now() - this.nowTime < 300) return
        this.nowTime = Date.now()
        let {xAxisData, seriesData, isClosed} = this
        isClosed = !isClosed
        this._updateStatus(isClosed, () => {
          this._chartActions({xAxisData, seriesData, isClosed})
          this.isClosed = isClosed
        })
      },
      _chartActions(data) {
        this.$refs._charts && this.$refs._charts.action(data)
      },
      _updateStatus(status, success, fail) {
        let data = {
          id: this.info.id,
          status: status ? 1 : 0
        }
        API.Marketing.updateActiveStatus(data).then((res) => {
          success && success()
        }).catch(() => {
          fail && fail()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $font-family-light-roboto="Roboto-Light"
  $font-family-regular-din="DIN-Regular"
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .market-card
    position :relative
    width: 100%
    height :0
    padding-top :37.68115942028986%
    background: #FFFFFF;
    border: 1px solid #E9F0FE;
    box-shadow: 0 2px 8px 0 rgba(21,24,45,0.04);
    border-radius: 6px;
    .wrapper
      fill-box(absolute)
      layout(column,block,nowrap)
      padding :0 4vw
      .top-wrapper
        flex:1
        position: relative
        display :flex
        overflow :hidden
        &:after
          content: ""
          display: block
          position: absolute
          height: 1px
          left: 0
          bottom: 0
          width: 100%
          background-image: repeating-linear-gradient(90deg, #E1E1E1 0,#E1E1E1 4px, #fff 4px, #fff 6px)
          transform: scale(1, 1)
          @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2)
            width: 200%
            transform: scale(1, .5)
          @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
            width: 300%
            transform: scale(1, 1 / 3)
        .left
          display :flex
          align-items :center
          height :100%
          .logo
            width :5.333333333333334vw
            height :@width
          .title
            font-family: $font-family-regular
            font-size: 4.266666666666667vw
            color: #333333;
            line-height: @font-size
            margin :0 1.866666666666667vw 0 1.6vw
          .arrow-right
            width : 1.866666666666667vw
            height : 3.2vw
        .right
          flex: 1
          display :flex
          align-items :center
          justify-content :flex-end
          .status-wrapper
            border-radius: 8.266666666666666vw
            height :5.333333333333334vw
            line-height :@height
            border:1px solid #CDCDCD
            .text
              padding :0 2.2666666666666666vw
              font-family: $font-family-regular
              font-size: 3.4666666666666663vw
              color: #CDCDCD
              line-height: @font-size
          .switch-wrapper-card
            position :relative
            width :38px
            height :20px
            background-color: #fdfdfd
            border-radius: 31px
            border:1px solid #e3e3e3
            box-sizing :border-box
            transition :background-color 0.2s
            &.active
              background-color: #02D392
              border-color:#02D392
            .circle-1
              position :absolute
              col-center()
              left :0.5px
              width :16px
              height :@width
              background :#fff
              border-radius :100%
              transform : translate(0,-50%,0)
              transition :all 0.5s
              box-shadow: 0 0 4px 0 rgba(0,0,0,0.20), 0 4px 23px 0 rgba(0,0,0,0.08), -2px 4px 4px 0 rgba(0,0,0,0.10);
              &.active
                transform :translate3d(18.5px, -50%, 0)
      .bottom-wrapper
        flex:1.9545454545454546
        layout(row,block,nowrap)
        align-items :center
        .left
          margin-left :2.9vw
        .right
          flex:1
          display :flex
          align-items :center
          justify-content :flex-end
          .charts-wrapper
            width :26.666666666666668vw
            height :16.400000000000002vw
        .item-text
          width :26.93333333333333vw
          .number
            font-family: $font-family-bold
            font-size: 5.333333333333334vw
            color: #999
            line-height: 5.333333333333334vw
            margin-bottom :3.3333333333333335vw
            no-wrap()
            &.active
              color: #0E1249
          .text
            font-family: $font-family-regular
            font-size: 3.2vw
            color: #949494
            line-height: @font-size
</style>
