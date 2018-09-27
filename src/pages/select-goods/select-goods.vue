<template>
  <transition :name="slide">
    <div class="select-box">
      <scroll ref="scroll"
              :data="goodsList"
              :bcColor="'#f1f2f5'"
              :pullUpLoad="pullUpLoadObj"
              @pullingUp="onPullingUp"
              :showNoMore="showNoMore">
        <div class="goods-list" v-if="type === 1">
          <div class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="selectItem(item)">
            <div class="goods-left">
              <div class="left-img" :style="{backgroundImage: 'url(' + item.image_url + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}"></div>
              <div class="goods-content">
                <p class="goods-title">{{item.title}}</p>
                <div>
                  <p class="goods-txt">现价: ¥{{item.goods_price}}</p>
                  <p class="goods-txt last">销量: {{item.sale_count}}</p>
                </div>
              </div>
            </div>
            <div class="goods-right">
              <img src="../../../static/img/icon-mall_select@2x.png" class="select-icon" v-if="item.id === selectGoods.id">
              <div class="no-select-icon" v-if="item.id !== selectGoods.id"></div>
            </div>
          </div>
        </div>
        <div class="goods-list" v-if="type === 2">
          <div class="activity-item" v-for="(item, index) in goodsList" :key="index" @click="selectItem(item)">
            <div class="activity-left">
              <div class="left-top border-bottom-1px">
                <p class="activity-type">{{item.goods_type * 1 === 3 ? '砍价活动' : '拼团优惠'}}</p>
                <p class="activity-time">距离本场结束：{{item.end_at}}</p>
              </div>
              <div class="left-down">
                <div class="left-img" :style="{backgroundImage: 'url(' + item.goods_image_url + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}"></div>
                <div class="left-down-content">
                  <div class="goods-title">{{item.activity_name}}</div>
                  <div>
                    <div class="goods-txt">{{item.goods_type * 1 === 3 ? '底 价' : '团购价' }}：¥{{item.goods_price}}</div>
                    <div class="goods-down">
                      <div class="goods-txt">销 量：{{item.sale_count}}</div>
                      <div class="goods-txt">库存：{{item.activity_stock}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="activity-right border-left-1px">
              <img src="../../../static/img/icon-mall_select@2x.png" class="select-icon" v-if="item.activity_id === selectGoods.activity_id">
              <div class="no-select-icon" v-if="item.activity_id !== selectGoods.activity_id"></div>
            </div>
          </div>
        </div>
      </scroll>
      <div class="submit-btn-box border-top-1px">
        <div class="submit-btn" :class="selectGoods ? '' : 'disabled'" @click="sendGoods">发送</div>
      </div>
      <toast ref="toast"></toast>
    </div>
  </transition>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { Im } from 'api'
  import Scroll from 'components/scroll/scroll'
  import { ERR_OK, TIMELAG } from 'common/js/config'
  import storage from 'storage-controller'
  import { ease } from 'common/js/ease'
  import webimHandler from 'common/js/webim_handler'
  import Toast from 'components/toast/toast'
  import utils from 'common/js/utils'

  export default {
    name: 'SelectGoods',
    created() {
      this.type = this.$route.query.type * 1
      document.title = this.type === 1 ? '选择商品' : '选择活动'
      let data = {
        is_self: 1,
        limit: 10,
        page: 1
      }
      if (this.type === 1) {
        Im.getGoodsList(data).then((res) => {
          if (res.error === ERR_OK) {
            this.goodsList = res.data
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
              this.$refs.scroll.scrollTo(0, 0, 300, ease[this.scrollToEasing])
            }, 20)
          }
        })
      } else if (this.type === 2) {
        Im.getActivityList(data).then((res) => {
          if (res.error === ERR_OK) {
            this.goodsList = res.data
            // this._timeRun()
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
              this.$refs.scroll.scrollTo(0, 0, 300, ease[this.scrollToEasing])
            }, 20)
          }
        })
      }
    },
    mounted() {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    data() {
      return {
        goodsList: [],
        slide: 'slide',
        timer: '',
        type: '',
        showNoMore: false,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
        selectGoods: '',
        userInfo: storage.get('info'),
        logType: 3
      }
    },
    methods: {
      ...mapActions([
        'setNowChat',
        'addListMsg',
        'setGroupItem',
        'setNewsGetType',
        'setGroupMsgIng'
      ]),
      selectItem(item) {
        this.selectGoods = item
      },
      sendGoods() {
        if (!this.selectGoods) {
          this.$refs.toast.show('请先选择商品')
          return
        }
        let data
        if (this.selectGoods.goods_type * 1 === 0) {
          data = {
            url: this.selectGoods.image_url,
            goods_id: this.selectGoods.id,
            title: this.selectGoods.title,
            goods_price: this.selectGoods.goods_price,
            original_price: this.selectGoods.original_price,
            avatar: this.userInfo.avatar,
            shop_name: this.selectGoods.shop_name
          }
        } else {
          data = {
            url: this.selectGoods.goods_image_url,
            goods_id: this.selectGoods.activity_id,
            title: this.selectGoods.activity_name,
            goods_price: this.selectGoods.goods_price,
            original_price: this.selectGoods.original_price,
            avatar: this.userInfo.avatar,
            shop_name: this.selectGoods.shop_name
          }
        }
        let msgUrl = data.url
        let msgTitle = data.title
        let logType = this.selectGoods.goods_type * 1 === 0 ? 3 : this.selectGoods.goods_type * 1 === 1 ? 4 : 5
        let descMsg = {log_type: logType}
        let groupData = data
        data = JSON.stringify(data)
        let desc = JSON.stringify(descMsg)
        let ext = '20005'
        let option = {
          data,
          desc,
          ext
        }
        this.logType = logType
        if (this.$route.query.chatType === 'group') {
          // 群发
          if (this.groupMsgIng) {
            this.$refs.toast.show('群发消息发送中，请稍后再发')
            return
          }
          let msg = {
            time: parseInt(Date.now() / 1000),
            lastMsg: logType === 3 ? '[商品信息]' : '[活动信息]'
          }
          this.setGroupItem(msg)
          this.setNewsGetType(true)
          this.$router.go(-3)
          let groupIds = this.currentGroupMsg.map((item) => {
            return item.id
          })
          let reqData = {
            type: logType,
            goods_id: groupData.goods_id,
            title: groupData.title,
            group_ids: groupIds
          }
          Im.setGroupList(reqData).then((res) => {
          })
          let reqArr = this._splitArr(this.currentGroupMsg)
          this._splitSendGroupMsg(reqArr, 'shop', option)
        } else {
          // 单发
          let timeStamp = parseInt(Date.parse(new Date()) / 1000)
          let msg = {
            from_account_id: this.imInfo.im_account,
            avatar: this.userInfo.avatar,
            content: '',
            url: msgUrl,
            title: msgTitle,
            goods_price: this.selectGoods.goods_price,
            original_price: this.selectGoods.original_price,
            shop_name: this.selectGoods.shop_name,
            time: timeStamp,
            msgTimeStamp: timeStamp,
            nickName: this.userInfo.nickName,
            sessionId: this.userInfo.account,
            unreadMsgCount: 0,
            type: logType
          }
          if (this.nowChat.length) {
            let lastItem = this.nowChat[this.nowChat.length - 1]
            let lastTime = lastItem.created_at ? lastItem.created_at : lastItem.msgTimeStamp
            msg.is_showtime = timeStamp - lastTime > TIMELAG
          } else {
            msg.is_showtime = true
          }
          let list = [...this.nowChat, msg]
          this.setNowChat(list)
          let addMsg = {
            text: this.logType === 3 ? '[商品信息]' : '[活动信息]',
            time: timeStamp,
            msgTimeStamp: timeStamp,
            fromAccount: this.currentMsg.account,
            sessionId: this.currentMsg.account,
            unreadMsgCount: 0,
            avatar: this.currentMsg.avatar,
            nickName: this.currentMsg.nickName
          }
          this.addListMsg({msg: addMsg, type: 'mineAdd'})
          this.$router.back()
          this.$emit('refushBox')
          webimHandler.onSendCustomMsg(option, this.currentMsg.account).then(res => {
          }, () => {
            this.$refs.toast.show('网络异常, 请稍后重试')
          })
        }
      },
      onPullingUp() {
        if (this.showNoMore) return
        let data = {
          is_self: 1,
          limit: 10,
          page: this.page++
        }
        Im.getRadarList(data).then((res) => {
          if (res.error === ERR_OK) {
            let list = res.data
            if (!list.length) {
              this.showNoMore = true
              this.page--
            } else {
              this.goodsList = [...this.goodsList, ...list]
            }
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
      _splitArr(arr) {
        let res = arr.map((item) => {
          return item.customers || []
        })
        let res1 = [].concat.apply([], res)
        let res2 = utils.breakArr(res1, 2)
        return res2
      },
      _splitSendGroupMsg(arr, type, content) {
        this.setGroupMsgIng(true)
        Promise.all(arr.map((item, index) => {
          return new Promise((resolve, reject) => {
            setTimeout(async () => {
              await this._sendGroupMsg(item, type, content)
              resolve()
            }, index * 1000)
          })
        })).then(res => {
          this.setGroupMsgIng(false)
        })
      },
      async _sendGroupMsg(arr, type, content) {
        await Promise.all(arr.map((item1) => {
          return new Promise((resolve, reject) => {
            if (type === 'shop') {
              webimHandler.onSendCustomMsg(content, item1.account).then(res => {
                let timeStamp = parseInt(Date.now() / 1000)
                let addMsg = {
                  text: this.logType === 3 ? '[商品信息]' : '[活动信息]',
                  time: timeStamp,
                  msgTimeStamp: timeStamp,
                  fromAccount: item1.account,
                  sessionId: item1.account,
                  unreadMsgCount: 0,
                  avatar: item1.avatar,
                  nickName: item1.nickname
                }
                this.addListMsg({msg: addMsg, type: 'mineAdd'})
                resolve()
              }, () => {
                resolve()
                // this.$refs.toast.show('网络异常, 请稍后重试')
              })
            } else if (type === 'chat') {
              webimHandler.onSendMsg(content, item1.account).then(res => {
                let timeStamp = parseInt(Date.now() / 1000)
                let addMsg = {
                  text: content,
                  time: timeStamp,
                  msgTimeStamp: timeStamp,
                  fromAccount: item1.account,
                  sessionId: item1.account,
                  unreadMsgCount: 0,
                  avatar: item1.avatar,
                  nickName: item1.nickname
                }
                this.addListMsg({msg: addMsg, type: 'mineAdd'})
                resolve()
              }, () => {
                resolve()
                // this.$refs.toast.show('网络异常, 请稍后重试')
              })
            }
          })
        }))
        return true
      },
      _timeRun() {
        clearInterval(this.timer)
        this.goodsList = this.goodsList.map((item) => {
          let endTime = this._timeCheckout(item.end_time)
          item.endTime = `${endTime.hour}:${endTime.minute}:${endTime.second}`
          return item
        })
        this.timer = setInterval(() => {
          this.goodsList = this.goodsList.map((item) => {
            let endTime = this._timeCheckout(item.end_time)
            item.endTime = `${endTime.hour}:${endTime.minute}:${endTime.second}`
            return item
          })
        }, 1000)
      },
      _timeCheckout(time) {
        let nowSecond = parseInt(Date.now() / 1000)
        let differ = time * 1 - nowSecond
        let hour = Math.floor(differ / (60 * 60))
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0) {
          times = {
            hour,
            minute,
            second
          }
        } else {
          times = {
            hour: '00',
            minute: '00',
            second: '00'
          }
        }
        return times
      }
    },
    components: {
      Scroll,
      Toast
    },
    computed: {
      ...mapGetters([
        'currentMsg',
        'nowChat',
        'imInfo',
        'groupMsgIng',
        'currentGroupMsg'
      ]),
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
          this.rebuildScroll()
        },
        deep: true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  @import '~common/stylus/base'
  .select-box
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 20
    background: $color-white
    .goods-list
      background: $color-background
      padding-top: 10px
      padding-bottom: 80px
      .goods-item
        background: $color-white
        height: 90px
        margin-bottom: 10px
        display: flex
        align-items: center
        .goods-left
          flex: 1
          overflow: hidden
          display: flex
          height: 90px
          align-items: center
          .left-img
            width: 70px
            height: 70px
            margin-left: 15px
            margin-right: 10px
          .goods-content
            flex: 1
            overflow: hidden
            height: 62px
            display: flex
            justify-content: space-between
            flex-direction: column
            .goods-title
              width: 100%
              overflow: hidden
              white-space: nowrap
              text-overflow: ellipsis
              font-size: $font-size-14
              letter-spacing: 0.6px
              font-family: $font-family-regular
            .goods-txt
              font-size: $font-size-12
              color: $color-828AA2
              font-family: $font-family-regular
            .goods-txt.last
              margin-top: 7px
        .goods-right
          width: 45px
          height: 90px
          display: flex
          align-items: center
          justify-content: flex-end
          padding-right: 15px
          .select-icon
            width: 20px
            height: 20px
          .no-select-icon
            width: 20px
            height: 20px
            border: 1px solid #828AA2
            border-radius: 50%
            box-sizing: border-box
      .activity-item
        background: $color-white
        height: 150px
        margin-bottom: 10px
        display: flex
        .activity-left
          flex: 1
          overflow: hidden
          padding-left: 15px
          .left-top
            height: 50px
            display: flex
            align-items: center
            justify-content: space-between
            .activity-type
              font-family: $font-family-medium
              font-size: 3.7vw
              color: #374B63
            .activity-time
              font-family: $font-family-regular
              font-size: 3.7vw
              color: #374B63
              margin-right: 10px
          .left-down
            height: 100px
            display: flex
            align-items: center
            .left-img
              width: 70px
              height: 70px
              margin-right: 10px
            .left-down-content
              flex: 1
              overflow: hidden
              height: 62px
              display: flex
              justify-content: space-between
              flex-direction: column
              .goods-title
                width: 100%
                overflow: hidden
                white-space: nowrap
                text-overflow: ellipsis
                font-size: $font-size-14
                letter-spacing: 0.6px
                font-family: $font-family-regular
              .goods-down
                margin-top: 7px
                display: flex
                justify-content: space-between
                padding-right: 20px
              .goods-txt
                font-size: $font-size-12
                color: $color-828AA2
                font-family: $font-family-regular
        .activity-right
          width: 74px
          height: 150px
          display: flex
          align-items: center
          justify-content: center
          .select-icon
            width: 20px
            height: 20px
          .no-select-icon
            width: 20px
            height: 20px
            border: 1px solid #828AA2
            border-radius: 50%
            box-sizing: border-box
    .submit-btn-box
      position: fixed
      z-index: 21
      left: 0
      right: 0
      bottom: 0
      height: 75px
      background: $color-white
      padding: 15px
      box-sizing: border-box
      .submit-btn
        width: 100%
        height: 100%
        background: #F94C5F
        box-shadow: 0 4px 16px 0 rgba(249, 76, 95, 0.30)
        border-radius: 22.5px
        text-align: center
        line-height: 45px
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-white
        letter-spacing: 0.6px
      .disabled.submit-btn
        background: $color-888888
        box-shadow: 0 4px 16px 0 rgba(136, 136, 136, 0.30)
</style>
