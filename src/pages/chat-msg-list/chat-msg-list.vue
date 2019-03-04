<template>
  <transition name="slide">
    <div class="chat">
      <div class="chat-container" ref="chat">
        <scroll ref="scroll"
                :data="list"
                :pullUpLoad="pullUpLoadObj"
                :showNoMore="noMore"
                @pullingUp="onPullingUp">
          <div class="chat-list" ref="list">
            <div class="list-line"></div>
            <div class="chat-item" v-for="(item, index) in list" :key="index">
              <div class="item-time" v-if="item.is_showtime">
                <span class="time-box">{{item.created_at ? item.created_at : item.msgTimeStamp | timeFormat}}</span>
              </div>
              <div class="chat-content" v-if="item.from_account_id !== imInfo.im_account">
                <!--<div :style="{backgroundImage: 'url(' + currentMsg.avatar + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}" class="avatar"></div>-->
                <div class="avatar" :class="{'android' : !isIos}" :style="{borderColor: modelType ? pnesColor[modelType] : '#e6e6e6'}">
                  <img class="avatar-img" :class="{'android' : !isIos}" :src="currentMsg.avatar" alt="">
                </div>
                <div class="chat-msg-box other" v-if="item.type * 1 === 1">
                  <div class="arrow-box">
                    <div class="gray-arrow">
                      <div class="white-arrow"></div>
                    </div>
                  </div>
                  <div class="chat-msg-content-max-box">
                    <div class="chat-msg-content other" v-html="item.html"></div>
                  </div>
                </div>
                <div class="chat-msg-goods" v-if="item.type * 1 == 2">
                  <img :src="item.url" class="goods-img" @load="refushBox">
                  <p class="goods-title">{{item.title}}</p>
                </div>
                <div class="chat-msg-new-goods other" v-if="item.type * 1 == 3 || item.type * 1 == 4 || item.type * 1 == 5">
                  <div class="new-goods-top">
                    <div class="shop-title">
                      <!--<div :style="{backgroundImage: 'url(' + userInfo.avatar || item.avatar + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}" class="shop-icon"></div>-->
                      <img class="shop-icon" :src="userInfo.avatar || item.avatar" alt="">
                      <div class="shop-name">{{userInfo.nickName || item.shop_name}}</div>
                    </div>
                    <div class="goods-title">
                      <img src="../../../static/img/pic-spell@2x.png" class="title-icon" v-if="item.type * 1 == 4">
                      <img src="../../../static/img/icon-bargain@2x.png" class="title-icon" v-if="item.type * 1 == 5">
                      <span>原价{{item.original_price}}元的{{item.title}}，{{item.type * 1 == 4 ? '团购价' : '现价'}}只要{{item.goods_price}}元！</span>
                    </div>
                    <!--<div :style="{backgroundImage: 'url(' + item.url + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}" class="goods-img"></div>-->
                    <img class="goods-img" :src="item.url" alt="">
                  </div>
                  <div class="new-goods-down border-top-1px">
                    <img src="../../../static/img/pic-logo_zb@2x.png" class="down-icon">
                    <span>赞播智店</span>
                  </div>
                </div>
                <div>
                  <img class="chat-msg-img other" :style="{height: (200 / item.width * item.height) + 'px'}" :src="item.url" v-if="item.type * 1 == 20" @click.stop="showPic(item)">
                </div>
              </div>
              <div class="chat-content mine" v-if="item.from_account_id === imInfo.im_account">
                <div class="chat-msg-box mine" v-if="item.type * 1 === 1">
                  <div class="chat-msg-content-max-box">
                    <div class="chat-msg-content mine" v-html="item.html"></div>
                  </div>
                  <div class="arrow-box">
                    <div class="green-arrow"></div>
                  </div>
                </div>
                <div class="chat-msg-new-goods mine" v-if="item.type * 1 == 3 || item.type * 1 == 4 || item.type * 1 == 5">
                  <div class="new-goods-top">
                    <div class="shop-title">
                      <!--<div :style="{backgroundImage: 'url(' + userInfo.avatar || item.avatar + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}" class="shop-icon"></div>-->
                      <img :src="userInfo.avatar || item.avatar" class="shop-icon">
                      <div class="shop-name">{{userInfo.nickName || item.shop_name}}</div>
                    </div>
                    <div class="goods-title">
                      <img src="../../../static/img/pic-spell@2x.png" class="title-icon" v-if="item.type * 1 == 4">
                      <img src="../../../static/img/icon-bargain@2x.png" class="title-icon" v-if="item.type * 1 == 5">
                      <span>原价{{item.original_price}}元的{{item.title}}，{{item.type * 1 == 4 ? '团购价' : '现价'}}只要{{item.goods_price}}元！</span>
                    </div>
                    <!--<div :style="{backgroundImage: 'url(' + item.url + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}" class="goods-img"></div>-->
                    <img class="goods-img" :src="item.url" alt="">
                  </div>
                  <div class="new-goods-down border-top-1px">
                    <img src="../../../static/img/pic-logo_zb@2x.png" class="down-icon">
                    <span>赞播智店</span>
                  </div>
                </div>
                <div>
                  <img class="chat-msg-img mine" :style="{height: (200 / item.width * item.height) + 'px'}" :src="item.url" v-if="item.type * 1 == 20" @click.stop="showPic(item)">
                </div>
                <div class="chat-msg-qrCode mine" v-if="item.type * 1 === 6">
                  <div class="qrCode-content">
                    <p class="qrCode-title">添加我的个人微信，更多优惠！</p>
                    <div class="qrCode-text-content">
                      <div class="qrCode-txt">点击本条消息，复制微信号添加，随时找我聊天。</div>
                      <img src="./pic-code@3x.png" class="qrCode-img">
                    </div>
                  </div>
                </div>
                <div class="chat-msg-qrCode mine" v-if="item.type * 1 === 7">
                  <div class="qrCode-content">
                    <p class="qrCode-title">欢迎加入我的微信福利群</p>
                    <div class="qrCode-text-content">
                      <div class="qrCode-txt">点击本条消息加入微信群，不定时抢购福利</div>
                      <img src="./pic-code@3x.png" class="qrCode-img">
                    </div>
                  </div>
                </div>
                <div class="chat-msg-coupon mine" v-if="item.type * 1 === 30">
                  <div class="coupon-content">
                    <img src="./pic-coupon_bg@2x.png" class="coupon-bc">
                    <div class="coupon-container">
                      <div class="coupon-left">
                        <div class="left-money" v-if="item.coupon_type == 3">
                          <span class="money-icon">¥</span>
                          <span class="money-txt">{{item.coupon_num}}</span>
                        </div>
                        <div class="left-money" v-if="item.coupon_type == 4">
                          <span class="money-txt">{{item.coupon_num}}</span>
                          <span class="discount-txt">折</span>
                        </div>
                      </div>
                      <div class="coupon-right">
                        <div class="coupon-title">{{item.title}}</div>
                        <div class="coupon-time">有效期至{{item.end_at}}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <!--<div class="avatar" :style="{backgroundImage: 'url(' + userInfo.avatar + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}"></div>-->
                <div class="avatar" :class="{'android' : !isIos}">
                  <img class="avatar-img" :class="{'android' : !isIos}" :src="userInfo.avatar" alt="">
                </div>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <toast ref="toast"></toast>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import Toast from 'components/toast/toast'
  import storage from 'storage-controller'
  import { mapGetters } from 'vuex'
  import { Im, Global } from 'api'
  import { ERR_OK } from 'common/js/config'
  import utils from 'common/js/utils'
  import wx from 'weixin-js-sdk'
  import {PNES_COLOR} from 'common/js/pnes'

  const LIMIT = 40
  export default {
    name: 'Chat',
    created() {
      this.id = this.$route.params.id
      this.modelType = this.$route.query.modelType
      let data = {
        page: this.page,
        limit: LIMIT,
        sort: 1,
        customer_im_account: this.id
        // employee_im_account: this.imInfo.im_account // todo
      }
      Im.getMsgList(data).then((res) => {
        if (res.error === ERR_OK) {
          this.list = res.data.map((item) => {
            item.html = utils.msgFaceToHtml(item.content)
            return item
          })
          setTimeout(() => {
            this.$refs.scroll && this.$refs.scroll.forceUpdate()
          }, 20)
        }
      })
      let url = window.location.href
      Global.jssdkConfig({url}).then((res) => {
        if (res.error === this.$ERR_OK) {
          res = res.data
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: '' + res.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: '' + res.timestamp, // 必填，生成签名的时间戳
            nonceStr: '' + res.nonceStr, // 必填，生成签名的随机串
            signature: '' + res.signature, // 必填，签名，见附录1
            jsApiList: ['previewImage', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        }
      })
      // this.getQrCodeStatus()
    },
    mounted() {
      document.title = this.currentMsg.nickName
      if (this.currentMsg.nickName === 'undefined') {
        let step = this.$route.path.match(/\//g).length
        this.$router.go(-step + 1)
      }
    },
    methods: {
      showPic(item) {
        wx.previewImage({urls: [item.url]})
      },
      getQrCodeStatus() {
        Im.getCodeStatus().then(res => {
          if (res.error === ERR_OK) {
            this.codeStatus = res.data
          }
        })
      },
      onPullingUp() {
        if (this.noMore) {
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          return
        }
        this.page++
        let data = {
          page: this.page,
          limit: LIMIT,
          sort: 1,
          customer_im_account: this.id
          // employee_im_account: this.imInfo.im_account // todo
        }
        Im.getMsgList(data).then((res) => {
          if (res.error === ERR_OK) {
            if (res.data.length) {
              let resData = res.data.map((item) => {
                item.html = utils.msgFaceToHtml(item.content)
                return item
              })
              this.list = [...this.list, ...resData]
              setTimeout(() => {
                this.$refs.scroll && this.$refs.scroll.forceUpdate()
              }, 20)
            } else {
              this.noMore = true
              this.page--
              setTimeout(() => {
                this.$refs.scroll && this.$refs.scroll.forceUpdate()
              }, 20)
            }
          }
        })
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll && this.$refs.scroll.destroy()
          this.$refs.scroll && this.$refs.scroll.initScroll()
        })
      }
    },
    data() {
      return {
        list: [],
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        startY: '',
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
        id: '',
        page: 1,
        noMore: false,
        codeStatus: {},
        coverFullShow: false,
        coverShowType: '',
        modelType: '', // pnes模型属性
        pnesColor: PNES_COLOR,
        isIos: storage.get('isIos')
      }
    },
    components: {
      Scroll,
      Toast
    },
    filters: {
      timeFormat(val) {
        if (val) {
          let res = utils.radarTimeFormat(val)
          return res.time
        }
        return ''
      }
    },
    watch: {
      pullUpLoadObj: {
        handler() {
          if (!this.pullUpLoad) return
          this.rebuildScroll()
        },
        deep: true
      }
    },
    computed: {
      ...mapGetters([
        'currentMsg',
        'imInfo'
      ]),
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      },
      userInfo() {
        let info = storage.get('info')
        let nickName = info.shop_name
        return {...info, nickName}
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  @import '~common/stylus/base'
  .chat
    width: 100vw
    height: 100vh
    position: fixed
    left: 0
    top: 0
    background: $color-background
    display: flex
    flex-direction: column
    justify-content: space-between
    z-index: 200
    .chat-container
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      width: 100%
      overflow: hidden
      .history-box
        display: flex
        justify-content: center
        margin-bottom: 15px
        height: 20px
        .history-content
          display: flex
          align-items: center
          background: #D6D6D9
          border-radius: 4px
          padding: 0 10px
          .history-txt
            font-size: $font-size-12
            font-family: $font-family-regular
            color: $color-white
            margin-right: 3px
          .arrow
            height: 8px
            width: 4.5px
            display: block
      .chat-list
        width: 100%
        padding-bottom: 40px
        .list-line
          height: 20px
      .chat-item
        width: 100%
        box-sizing: border-box
        padding: 0 15px
        margin-top: 15px
        .item-time
          padding-bottom: 15px
          text-align: center
          .time-box
            display: inline-block
            padding: 4px 8px
            background: #D6D6D9
            border-radius: 2px
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-white
            line-height: 14px
        .chat-content
          display: flex
          width: 100%
          .avatar
            width: 45px
            height: 45px
            border-radius: 50%
            border: 1.5px solid #e6e6e6
            box-sizing: border-box
            display: flex
            align-items: center
            justify-content: center
            &.android
              border: 2px solid #e6e6e6
            .avatar-img
              width: 39px
              height: 39px
              border-radius: 50%
              object-fit: cover
              border: 1.5px solid #fff
              &.android
                width: 37px
                height: 37px
                border: 2px solid #fff
          .chat-msg-box
            flex: 1
            overflow: hidden
            display: flex
            .chat-msg-content-max-box
              flex: 1
              overflow: hidden
              display: flex
            .chat-msg-content
              padding: 9px 15px
              line-height: 21px
              font-size: $font-size-16
              font-family: $font-family-regular
              word-wrap: break-word
              word-break: break-all
              vertical-align: middle
              border-radius: 8px
            .chat-msg-content.other
              background: $color-white
              border: 0.5px solid #DEDEDE
            .chat-msg-content.mine
              background: $color-green
          .other.chat-msg-box
            margin-right: 50px
            .arrow-box
              width: 10px
              height: 45px
              position: relative
              .gray-arrow
                width: 0
                height: 0
                border-width: 5px 6px 5px 0
                border-style: solid
                border-color: transparent #D6DCE0 transparent transparent /*透明 灰 透明 透明 */
                position: absolute
                right: 0
                top: 17.5px
                .white-arrow
                  width: 0
                  height: 0
                  border-width: 5px 6px 5px 0
                  border-style: solid
                  border-color: transparent #FFF transparent transparent /*透明 灰 透明 透明 */
                  position: absolute
                  left: 1px
                  top: -5px
          .mine.chat-msg-box
            margin-left: 50px
            .chat-msg-content-max-box
              justify-content: flex-end
            .arrow-box
              width: 10px
              height: 45px
              position: relative
              .green-arrow
                width: 0
                height: 0
                border-width: 5px 0 5px 6px
                border-style: solid
                border-color: transparent transparent transparent $color-green /*透明 灰 透明 透明 */
                position: absolute
                left: 0
                top: 17.5px
          .chat-msg-coupon
            margin-right: 10px
            .coupon-content
              width: 232px
              height: 67px
              padding: 9px
              border: 0.5px solid rgba(0, 0, 0, 0.10)
              border-radius: 4px
              background: $color-white
              overflow: hidden
              position: relative
              .coupon-bc
                width: 100%
                height: 100%
              .coupon-container
                position: absolute
                left: 9px
                top: 9px
                right: 9px
                bottom: 9px
                display: flex
                .coupon-left
                  width: 29%
                  display: flex
                  align-items: center
                  justify-content: center
                  overflow: hidden
                  .left-money
                    display: flex
                    align-items: flex-end
                    margin-bottom: 5px
                    .money-icon
                      font-family: $font-family-bold
                      font-size: $font-size-15
                      color: $color-white
                      margin-bottom: 4px
                      line-height: 15px
                    .money-txt
                      font-family: $font-family-bold
                      font-size: 30px
                      color: $color-white
                      margin: 0 1px
                      line-height: 30px
                    .discount-txt
                      font-family: $font-family-regular
                      font-size: $font-size-14
                      color: $color-white
                      margin-bottom: 4px
                      line-height: 14px
                .coupon-right
                  width: 71%
                  display: flex
                  flex-direction: column
                  justify-content: center
                  box-sizing: border-box
                  padding-left: 10px
                  .coupon-title
                    font-family: $font-family-medium
                    color: $color-white
                    opacity: 0.9px
                    font-size: $font-size-15
                    line-height: 15px
                    margin-bottom: 17px
                  .coupon-time
                    font-family: $font-family-regular
                    color: $color-white
                    opacity: 0.7
                    font-size: $font-size-11
          .chat-msg-img
            width: 200px
            height: auto
            border-radius: 4px
          .other.chat-msg-img
            margin-left: 10px
          .mine.chat-msg-img
            margin-right: 10px
          .chat-msg-new-goods
            width: 226px
            border: 0.5px solid rgba(0, 0, 0, 0.10)
            border-radius: 4px
            background: $color-white
            overflow: hidden
            font-size: 0
            .arrow-box
              width: 10px
              height: 45px
              position: relative
              .gray-arrow
                width: 0
                height: 0
                border-width: 5px 6px 5px 0
                border-style: solid
                border-color: transparent #D6DCE0 transparent transparent /*透明 灰 透明 透明 */
                position: absolute
                right: 0
                top: 17.5px
                .white-arrow
                  width: 0
                  height: 0
                  border-width: 5px 6px 5px 0
                  border-style: solid
                  border-color: transparent #FFF transparent transparent /*透明 灰 透明 透明 */
                  position: absolute
                  left: 1px
                  top: -5px
            .new-goods-top
              padding: 12.5px
              box-sizing: border-box
              .shop-title
                display: flex
                height: 20px
                align-items: center
                margin-bottom: 8px
                overflow: hidden
                white-space: nowrap
                text-overflow: ellipsis
                .shop-icon
                  width: 18px
                  height: 18px
                  border: 0.5px solid rgba(0, 0, 0, 0.10)
                  border-radius: 50%
                  margin-right: 6px
                  object-fit: cover
                .shop-name
                  flex: 1
                  overflow: hidden
                  white-space: nowrap
                  text-overflow: ellipsis
                  font-family: $font-family-regular
                  font-size: $font-size-12
                  color: $color-text-sub
                  letter-spacing: 0.26px
              .goods-title
                line-height: 21px
                font-family: $font-family-regular
                font-size: $font-size-16
                color: $color-text-main
                letter-spacing: 0.3px
                word-wrap: break-word
                word-break: break-all
                .title-icon
                  display: inline-block
                  width: 33.5px
                  height: 14px
                  margin-right: 6px
              .goods-img
                width: 200px
                height: 200px
                margin-top: 5px
                object-fit :cover
            .new-goods-down
              height: 25px
              display: flex
              align-items: center
              font-family: $font-family-regular
              font-size: $font-size-10
              color: #828AA2
              letter-spacing: 0.4px
              .down-icon
                width: 11.45px
                height: 11.75px
                margin-right: 4px
                margin-left: 12.5px
          .other.chat-msg-new-goods
            margin-left: 10px
          .mine.chat-msg-new-goods
            margin-right: 10px
          .chat-msg-goods
            width: 200px
            border: 0.5px solid rgba(0, 0, 0, 0.10)
            border-radius: 4px
            background: $color-white
            margin-left: 10px
            overflow: hidden
            font-size: 0
            .goods-img
              width: 100%
            .goods-title
              line-height: 30px
              font-size: $font-size-small
              font-family: $font-family-regular
              padding: 0 10px
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
          .chat-msg-qrCode
            margin-right: 10px
            .qrCode-content
              width: 230px
              padding: 10px 12px
              border: 0.5px solid rgba(0, 0, 0, 0.10)
              border-radius: 4px
              background: $color-white
              overflow: hidden
              .qrCode-title
                font-family: $font-family-regular
                font-size: $font-size-16
                color: $color-20202E
                margin: 0 0 6px
              .qrCode-text-content
                width: 100%
                display: flex
                font-size: 0
                .qrCode-txt
                  flex: 1
                  overflow: hidden
                  line-height: 18px
                  font-size: $font-size-12
                  color: $color-888888
                  font-family: $font-family-regular
                .qrCode-img
                  width: 45px
                  height: 45px
                  margin-left: 12px
        .chat-content.mine
          justify-content: flex-end

    .cover-full
      fill-box()
      z-index: 100
      layout()
      align-items: center
      background: rgba(32, 32, 46, 0.8)
      .cover-container
        width: 300px
        height: 160px
        background: $color-white
        border: 1px solid rgba(32, 32, 46, 0.10)
        border-radius: 2px
        all-center()
        .cover-top
          width: 100%
          height: 115px
          display: flex
          align-items: center
          justify-content: center
          .top-txt
            font-size: $font-size-16
            font-family: $font-family-regular
            color: $color-20202E
            letter-spacing: 0.8px
            line-height: 18px
        .cover-down
          width: 100%
          height: 45px
          line-height: 44px
          text-align: center
          font-family: $font-family-medium
          font-size: $font-size-14
          color: $color-56BA15
          letter-spacing: 0.6px
</style>
