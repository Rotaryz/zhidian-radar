<template>
  <transition name="slide">
    <div class="new-group-msg">
      <scroll :data="list"
              :bcColor="'#f1f2f5'"
              ref="scroll"
              :pullUpLoad="pullUpLoadObj"
              :showNoMore="showNoMore"
              @pullingUp="onPullingUp">
        <div class="news-list">
          <div class="news-item" v-for="(item, index) in list" :key="index">
            <div class="item-time">
              <span class="time-box">{{item.created_at ? item.created_at : item.msgTimeStamp | timeFormat}}</span>
            </div>
            <div class="item-content">
              <div class="item-title">群发组：<span v-for="(item1, index1) in item.groups" :key="index1">{{index1 == (item.groups.length - 1) ? item1.name + '(' + item1.customers.length + ')' : item1.name + '(' + item1.customers.length + ')，'}}</span></div>
              <div class="item-top">
                <div class="item-text" v-html="item.html" v-if="item.type == 1"></div>
                <div class="item-text item-text3" v-if="item.type == 3">
                  <!--[商品信息]-->
                  <div class="goods_img-box">
                    <img :src="item.url" class="goods_img">
                  </div>
                  <p class="goods_title">{{item.title}}</p>
                </div>
                <div class="item-text item-text3" v-if="item.type == 4">
                  <!--[团购活动信息]-->
                  <div class="goods_img-box">
                    <img :src="item.url" class="goods_img">
                  </div>
                  <p class="goods_title"><span class="tip">{{~~item.groupon_users}}人团</span>{{item.title}}</p>
                </div>
                <div class="item-text item-text3" v-if="item.type == 5">
                  <!--[砍价活动信息]-->
                  <div class="goods_img-box">
                    <img :src="item.url" class="goods_img">
                  </div>
                  <p class="goods_title"><span class="tip">仅剩{{~~item.stock}}件</span>{{item.title}}</p>
                </div>
                <div class="item-text item-text6" v-if="item.type == 6">
                  <!--[个人微信二维码]-->
                  <img src="./pic-code@3x.png" alt="" class="item-code-img">
                  <div class="content">
                    <div class="content-title">欢迎加入我的微信福利群</div>
                    <div class="content-text">点击本条消息加微信群，不定时抢购福利</div>
                  </div>
                </div>
                <div class="item-text item-text6" v-if="item.type == 7">
                  <!--[微信福利群]-->
                  <img :src="item.url" alt="" class="item-code-img">
                  <div class="content">
                    <div class="content-title">欢迎加入我的微信福利群</div>
                    <div class="content-text">点击本条消息加微信群，不定时抢购 福利</div>
                  </div>
                </div>
                <!--图片-->
                <img class="item-img" @load="refushBox" v-if="item.type == 20" :src="item.url"/>
                <div class="chat-msg-coupon" v-if="item.type * 1 === 30">
                  <div class="coupon-content">
                    <img src="./pic-coupon_bg@2x.png" class="coupon-bc">
                    <div class="coupon-container">
                      <div class="coupon-left">
                        <div class="left-money">
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
              </div>
              <div class="item-down">
                <div class="item-down-btn" @click="toChat(item)">再发一条</div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
      <div class="bottom-box border-top-1px">
        <div class="new-btn" @click="newGroup">新建群发</div>
      </div>
      <toast ref="toast"></toast>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import Toast from 'components/toast/toast'
  import {mapActions, mapGetters} from 'vuex'
  import Scroll from 'components/scroll/scroll'
  import { Im } from 'api'
  import {ERR_OK} from '../../common/js/config'
  import utils from 'common/js/utils'
  export default {
    name: 'NewGroupMsg',
    created() {
      Im.getGroupMsgList({page: 1, limit: 30}).then(res => {
        if (res.error === ERR_OK) {
          this.list = res.data.map((item) => {
            if (item.type * 1 === 1) {
              item.html = utils.msgFaceToHtml(item.content)
            }
            return item
          })
          setTimeout(() => {
            this.$refs.scroll.forceUpdate()
          }, 20)
        }
      })
    },
    mounted() {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    data() {
      return {
        list: [],
        page: 1,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
        showNoMore: false
      }
    },
    methods: {
      ...mapActions([
        'setCurrent',
        'setGroupItem',
        'setCurrentGroupMsg'
      ]),
      chatMsg(item) {
        let currentMsg = {
          nickName: item.nickName,
          avatar: item.avatar,
          account: item.sessionId
        }
        this.setCurrent(currentMsg)
        let url = '/chat?id=' + item.sessionId
        this.$router.push(url)
      },
      toChat(item) {
        if (this.groupMsgIng) {
          this.$refs.toast.show('群发消息发送中，请稍后再发')
          return
        }
        this.setCurrentGroupMsg(item.groups)
        let pageUrl = this.$route.path
        let path = `${pageUrl}/news-chat-group`
        this.$router.push(path)
      },
      onPullingUp() {
        if (this.showNoMore) {
          setTimeout(() => {
            this.$refs.scroll.forceUpdate()
          }, 20)
          return
        }
        this.page++
        Im.getGroupMsgList({page: this.page, limit: 30}).then(res => {
          if (res.error === ERR_OK) {
            if (!res.data.length) {
              this.showNoMore = true
              this.page--
            }
            let list = res.data.map((item) => {
              if (item.type * 1 === 1) {
                item.html = utils.msgFaceToHtml(item.content)
              }
              return item
            })
            this.list = [...this.list, ...list]
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      },
      refushBox() {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      },
      newGroup() {
        if (this.groupMsgIng) {
          this.$refs.toast.show('群发消息发送中，请稍后再发')
          return
        }
        let pageUrl = this.$route.path
        let path = `${pageUrl}/news-add-group`
        this.$router.push(path)
      }
    },
    computed: {
      ...mapGetters([
        'groupItem',
        'groupMsgIng'
      ]),
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      }
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
          this.rebuildScroll()
        },
        deep: true
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

  .new-group-msg
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 70
    background: $color-background
    .news-list
      padding: 0 15px 75px
      .news-item
        padding-top: 25px
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
        .item-content
          background: $color-white
          border: 1px solid rgba(32,32,46,0.10)
          box-shadow: 0 4px 12px 0 rgba(43,43,145,0.07)
          border-radius: 2px
          overflow: hidden
          .item-title
            padding: 11px 15px
            background: #f5f6f8
            white-space:normal
            word-break:break-all
            font-family: $font-family-regular
            font-size: $font-size-16
            color: $color-text
            line-height: 24px
          .item-top
            padding: 12px 15px 15px
            font-size: 0
            .item-text
              line-height: 21px
              font-family: $font-family-light
              font-size: $font-size-14
              color: $color-888888
            .item-text6
              display: flex
              .item-code-img
                 width: 65px
                 height: 65px
                .content
                  margin-left: 10px
                  flex: 1
                  .content-title
                    font-size: $font-size-16
                    color: $color-20202E
                    font-family: $font-family-regular
                    line-height: 1
                    margin-bottom: 11px
                  .content-text
                    font-size: $font-size-14
                    color: $color-888888
                    font-family: $font-family-regular
                    line-height: 19px
            .item-text3
              .goods_img-box
                width: 315px
                height: 220px
                overflow: hidden
                .goods_img
                  width: 100%
              .goods_title
                overflow: hidden
                display: -webkit-box
                -webkit-line-clamp: 2
                -webkit-box-orient: vertical
                word-break: break-all
                margin-top: 11px
                font-size: $font-size-16
                line-height: 24px
                font-family: $font-family-regular
                color: $color-20202E
                .tip
                  transform: translate3d(0, 0px, 0)
                  line-height: 1
                  font-size: 11px
                  margin-right: 9.5px
                  display: inline-block
                  color: #F94C5F
                  padding: 2.5px 5.5px
                  border-1px(#F94C5F, 3px)
            .item-img
              padding-top: 12px
              width: 100%
            .chat-msg-coupon
              width: 100%
              .coupon-content
                width: 100%
                height: 0
                padding-bottom: 28.87%
                background: $color-white
                overflow: hidden
                position: relative
                .coupon-bc
                  width: 100%
                  height: 100%
                  position: absolute
                  left: 0
                  bottom: 0
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
          .item-down
            padding: 0 15px
            display: flex
            padding-bottom: 15px
            justify-content: flex-end
            .item-down-btn
              width: 84px
              height: 26px
              line-height: 26px
              border-1px(#5929DC, 26px)
              text-align: center
              font-family: $font-family-regular
              font-size: $font-size-14
              color: #5929DC

  .bottom-box
    padding: 7.5px 15px
    position: fixed
    left: 0
    bottom: 0
    right: 0
    height: 55px
    z-index: 75
    box-sizing: border-box
    background: $color-white
  .new-btn
    background-image: linear-gradient(135deg, #953DE1 0%, #4541F9 100%)
    border-radius: 6px
    color: $color-white
    text-align: center
    line-height: 40px
    font-family: $font-family-medium
    font-size: $font-size-14

</style>
