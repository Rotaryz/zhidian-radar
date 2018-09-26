<template>
  <transition :name="slide">
    <div class="chat">
      <div class="chat-container" ref="chat">
        <scroll ref="scroll"
                :data="nowChat"
                :pullDownRefresh="pullDownRefreshObj"
                @pullingDown="onPullingDown">
          <div class="chat-list" ref="list">
            <div class="list-line"></div>
            <div class="chat-item" v-for="(item, index) in nowChat" :key="index">
              <div class="item-time" v-if="item.is_showtime">
                <span class="time-box">{{item.created_at ? item.created_at : item.msgTimeStamp | timeFormat}}</span>
              </div>
              <div class="chat-content" v-if="item.from_account_id !== imInfo.im_account">
                <div :style="{backgroundImage: 'url(' + currentMsg.avatar + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}" class="avatar"></div>
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
                      <div :style="{backgroundImage: 'url(' + item.avatar + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}" class="shop-icon"></div>
                      <div class="shop-name">{{item.shop_name}}的小店</div>
                    </div>
                    <div class="goods-title">
                      <img src="../../../static/img/pic-spell@2x.png" class="title-icon" v-if="item.type * 1 == 4">
                      <img src="../../../static/img/icon-bargain@2x.png" class="title-icon" v-if="item.type * 1 == 5">
                      <span>原价{{item.original_price}}元的{{item.title}}，{{item.type * 1 == 4 ? '团购价' : '现价'}}只要{{item.goods_price}}元！</span>
                    </div>
                    <div :style="{backgroundImage: 'url(' + item.url + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}" class="goods-img"></div>
                  </div>
                  <div class="new-goods-down border-top-1px">
                    <img src="../../../static/img/pic-logo_zb@2x.png" class="down-icon" @load="refushBox">
                    <span>赞播微店</span>
                  </div>
                </div>
                <div>
                  <img class="chat-msg-img other" :src="item.url" v-if="item.type * 1 == 20" @load="refushBox" @click.stop="showPic(item)">
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
                      <div :style="{backgroundImage: 'url(' + item.avatar + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}" class="shop-icon"></div>
                      <div class="shop-name">{{item.shop_name}}的小店</div>
                    </div>
                    <div class="goods-title">
                      <img src="../../../static/img/pic-spell@2x.png" class="title-icon" v-if="item.type * 1 == 4">
                      <img src="../../../static/img/icon-bargain@2x.png" class="title-icon" v-if="item.type * 1 == 5">
                      <span>原价{{item.original_price}}元的{{item.title}}，{{item.type * 1 == 4 ? '团购价' : '现价'}}只要{{item.goods_price}}元！</span>
                    </div>
                    <div :style="{backgroundImage: 'url(' + item.url + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}" class="goods-img"></div>
                  </div>
                  <div class="new-goods-down border-top-1px">
                    <img src="../../../static/img/pic-logo_zb@2x.png" class="down-icon" @load="refushBox">
                    <span>赞播微店</span>
                  </div>
                </div>
                <div>
                  <img class="chat-msg-img mine" :src="item.url" v-if="item.type * 1 == 20" @load="refushBox" @click.stop="showPic(item)">
                </div>
                <div class="chat-msg-qrCode mine" v-if="item.type * 1 === 6">
                  <div class="qrCode-content">
                    <p class="qrCode-title">欢迎光临我的小店</p>
                    <div class="qrCode-text-content">
                      <div class="qrCode-txt">点击本条消息加微信，随时找我聊天</div>
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
                <div class="avatar" :style="{backgroundImage: 'url(' + userInfo.avatar + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}"></div>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <div class="chat-input border-top-1px">
        <div class="chat-input-box">
          <div class="face-box" @click.stop="showEmoji">
            <img src="../../../static/img/icon-emoji@2x.png" class="face-icon">
          </div>
          <div class="input-container" ref="textBox">
            <textarea class="textarea" type="text" ref="inputTxt" v-model="inputMsg" rows="1"></textarea>
          </div>
          <div class="addimg-box" v-if="!inputMsg" @click.stop="showMoreList">
            <img src="../../../static/img/icon-add_im@2x.png" class="addimg-icon">
          </div>
          <div class="submit-btn" @click="sendMsg" v-if="inputMsg">发送</div>
        </div>
        <div class="more-box">
          <div class="emoji-list" v-if="emojiShow">
            <div class="emoji-item" v-for="(item, index) in emojiList" :key="index" @click.stop="chioceEmoji(item)">
              <img :src="item.url" class="emoji-icon">
            </div>
          </div>
          <div class="addimg-list" v-if="mortListShow">
            <div class="addimg-item" v-for="(item, index) in moreLists" :key="index" @click="nextWork(item)">
              <div class="img-box">
                <div class="item-icon" :class="item.icon"></div>
              </div>
              <p class="item-txt">{{item.txt}}</p>
              <input type="file" class="image-file" @change="_fileImage($event)" accept="image/*" v-if="item.type == 1">
            </div>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div class="cover-full" v-if="coverFullShow">
          <div class="cover-container">
            <div class="cover-top">
              <span v-if="coverShowType === 'person'" class="top-txt">暂未上传个人微信二维码，无法发送</span>
              <span v-if="coverShowType === 'group'" class="top-txt">暂未上传群二维码，无法发送</span>
            </div>
            <div class="cover-down border-top-1px" @click="toMineCode">现在上传</div>
          </div>
        </div>
      </transition>
      <toast ref="toast"></toast>
      <router-view @refushBox="refushBox" @getQrCode="getQrCodeStatus"/>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import Toast from 'components/toast/toast'
  import {ease} from 'common/js/ease'
  import {mapActions, mapGetters} from 'vuex'
  import webimHandler from 'common/js/webim_handler'
  import storage from 'storage-controller'
  import {Im, UpLoad, Global} from 'api'
  import {ERR_OK, TIMELAG} from 'common/js/config'
  import utils from 'common/js/utils'
  import {emotionsFaceArr} from 'common/js/constants'
  import wx from 'weixin-js-sdk'

  const MORELIST = [
    {txt: '图片', icon: 'im-image', type: 1},
    {txt: '个人微信', icon: 'im-weixin', type: 4},
    {txt: '微信群码', icon: 'im-group', type: 5},
    {txt: '常用语', icon: 'im-useful', type: 6},
    {txt: '发送商品', icon: 'im-goods', type: 2},
    {txt: '发送活动', icon: 'im-activity', type: 3}
  ]
  export default {
    name: 'Chat',
    created() {
      this.id = this.$route.params.id
      let data = {
        'end_date': this.endDate,
        limit: 40,
        customer_im_account: this.id,
        employee_im_account: this.imInfo.im_account
      }
      Im.getMsgList(data).then((res) => {
        if (res.error === ERR_OK) {
          let list = res.data.reverse()
          this.setNowChat(list)
          let timer = setTimeout(() => {
            let startY
            if (this.listDom.clientHeight < this.chatDom.clientHeight) {
              startY = 20
            } else {
              startY = this.chatDom.clientHeight - this.listDom.clientHeight - 20
            }
            this.$refs.scroll.scrollTo(0, startY, 10, ease[this.scrollToEasing])
            clearTimeout(timer)
          }, 20)
        }
      })
      let url = location.href
      Global.jssdkConfig({weixin: 'ai_radar', url, current_type: 'weishang'}).then((res) => {
        if (res.error === ERR_OK) {
          res = res.data
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appid, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.noncestr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名，见附录1
            jsApiList: ['previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        }
      })
      this.getQrCodeStatus()
    },
    mounted() {
      this.textareaDom = this.$refs.inputTxt
      this.textBoxDom = this.$refs.textBox
      this.chatDom = this.$refs.chat
      this.listDom = this.$refs.list
      document.title = this.currentMsg.nickName
      webimHandler.getC2CMsgList(this.currentMsg.account) // 消息已读处理
      this.setUnreadCount(this.currentMsg.account) // vuex
    },
    beforeDestroy() {
      this.setCurrent({})
      this.setNowChat([])
    },
    methods: {
      ...mapActions([
        'setUnreadCount',
        'setCurrent',
        'addListMsg',
        'setNowChat'
      ]),
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
      textHeight() {
        let timer = setTimeout(() => {
          this.textareaDom.style.height = 'auto'
          this.textareaDom.style.height = this.textareaDom.scrollHeight + 'px'
          this.textBoxDom.scrollTop = this.textareaDom.scrollHeight
          clearTimeout(timer)
        }, 20)
      },
      refushBox() {
        let timer = setTimeout(() => {
          let startY
          if (this.listDom.clientHeight < this.chatDom.clientHeight) {
            startY = 20
          } else {
            startY = this.chatDom.clientHeight - this.listDom.clientHeight - 20
          }
          this.$refs.scroll.refresh()
          this.$refs.scroll.scrollTo(0, startY, 10, ease[this.scrollToEasing])
          clearTimeout(timer)
        }, 20)
      },
      onPullingDown() {
        let heightBegin = this.listDom.clientHeight
        let data = {
          'end_date': this.endDate,
          limit: 40,
          customer_im_account: this.id,
          employee_im_account: this.imInfo.im_account
        }
        Im.getMsgList(data).then((res) => {
          if (res.error === ERR_OK) {
            if (res.data.length) {
              let resData = res.data.reverse()
              let list = [...resData, ...this.nowChat]
              this.setNowChat(list)
              this.$refs.scroll.forceUpdate()
              let timer = setTimeout(() => {
                let heightEnd = this.listDom.clientHeight
                this.$refs.scroll.scrollTo(0, heightBegin - heightEnd, 10, ease[this.scrollToEasing])
                clearTimeout(timer)
              }, 30)
            } else {
              this.noMore = true
              this.page--
            }
            this.$refs.scroll.forceUpdate()
          }
        })
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      },
      sendMsg() {
        let value = this.inputMsg.trim()
        if (!value) {
          this.$refs.toast.show('发送消息不能为空')
          return
        }
        let timeStamp = parseInt(Date.parse(new Date()) / 1000)
        let msg = {
          from_account_id: this.imInfo.im_account,
          avatar: this.userInfo.avatar,
          content: value,
          time: timeStamp,
          msgTimeStamp: timeStamp,
          nickName: this.userInfo.nickName,
          sessionId: this.userInfo.account,
          unreadMsgCount: 0,
          type: 1
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
          text: value,
          time: timeStamp,
          msgTimeStamp: timeStamp,
          fromAccount: this.id,
          sessionId: this.id,
          unreadMsgCount: 0,
          avatar: this.currentMsg.avatar,
          nickName: this.currentMsg.nickName
        }
        this.addListMsg({msg: addMsg, type: 'mineAdd'})
        this.inputMsg = ''
        this.emojiShow = false
        this.$refs.scroll.forceUpdate()
        if (this.listDom.clientHeight > this.chatDom.clientHeight) {
          let timer = setTimeout(() => {
            let startY = this.chatDom.clientHeight - this.listDom.clientHeight - 20
            this.$refs.scroll.scrollTo(0, startY, 300, ease[this.scrollToEasing])
            clearTimeout(timer)
          }, 20)
        }
        webimHandler.onSendMsg(value, this.id).then(res => {
        }, () => {
          this.$refs.toast.show('网络异常, 请稍后重试')
        })
      },
      nextWork(item) {
        let type = item.type * 1
        let url
        switch (type) {
          case 1:
            break
          case 2:
            url = this.$route.fullPath + '/select-goods?type=1'
            this.mortListShow = false
            this.$router.push({path: url})
            break
          case 3:
            url = this.$route.fullPath + '/select-goods?type=2'
            this.mortListShow = false
            this.$router.push({path: url})
            break
          case 4:
            if (!this.codeStatus.have_personal_qrcode) {
              this.coverFullShow = true
              this.coverShowType = 'person'
            } else {
              let data = {}
              let desc = {log_type: 6}
              let ext = '20005'
              data = JSON.stringify(data)
              desc = JSON.stringify(desc)
              let opt = {
                data,
                desc,
                ext
              }
              let timeStamp = parseInt(Date.parse(new Date()) / 1000)
              let msg = {
                from_account_id: this.imInfo.im_account,
                avatar: this.userInfo.avatar,
                content: '',
                time: timeStamp,
                msgTimeStamp: timeStamp,
                nickName: this.userInfo.nickName,
                sessionId: this.userInfo.account,
                unreadMsgCount: 0,
                type: 6
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
                text: '[其他消息]',
                time: timeStamp,
                msgTimeStamp: timeStamp,
                fromAccount: this.id,
                sessionId: this.id,
                unreadMsgCount: 0,
                avatar: this.currentMsg.avatar,
                nickName: this.currentMsg.nickName
              }
              this.addListMsg({msg: addMsg, type: 'mineAdd'})
              this.mortListShow = false
              this.$refs.scroll.forceUpdate()
              if (this.listDom.clientHeight > this.chatDom.clientHeight) {
                let timer = setTimeout(() => {
                  let startY = this.chatDom.clientHeight - this.listDom.clientHeight - 20
                  this.$refs.scroll.scrollTo(0, startY, 300, ease[this.scrollToEasing])
                  clearTimeout(timer)
                }, 20)
              }
              webimHandler.onSendCustomMsg(opt, this.id).then(res => {
              }, () => {
                this.$refs.toast.show('发送失败，请重新发送')
              })
            }
            break
          case 5:
            if (!this.codeStatus.have_wxgroup_qrcode) {
              this.coverFullShow = true
              this.coverShowType = 'group'
            } else {
              let data = {}
              let desc = {log_type: 7}
              let ext = '20005'
              data = JSON.stringify(data)
              desc = JSON.stringify(desc)
              let opt = {
                data,
                desc,
                ext
              }
              let timeStamp = parseInt(Date.parse(new Date()) / 1000)
              let msg = {
                from_account_id: this.imInfo.im_account,
                avatar: this.userInfo.avatar,
                content: '',
                time: timeStamp,
                msgTimeStamp: timeStamp,
                nickName: this.userInfo.nickName,
                sessionId: this.userInfo.account,
                unreadMsgCount: 0,
                type: 7
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
                text: '[其他消息]',
                time: timeStamp,
                msgTimeStamp: timeStamp,
                fromAccount: this.id,
                sessionId: this.id,
                unreadMsgCount: 0,
                avatar: this.currentMsg.avatar,
                nickName: this.currentMsg.nickName
              }
              this.addListMsg({msg: addMsg, type: 'mineAdd'})
              this.mortListShow = false
              this.$refs.scroll.forceUpdate()
              if (this.listDom.clientHeight > this.chatDom.clientHeight) {
                let timer = setTimeout(() => {
                  let startY = this.chatDom.clientHeight - this.listDom.clientHeight - 20
                  this.$refs.scroll.scrollTo(0, startY, 300, ease[this.scrollToEasing])
                  clearTimeout(timer)
                }, 20)
              }
              webimHandler.onSendCustomMsg(opt, this.id).then(res => {
              }, () => {
                this.$refs.toast.show('发送失败，请重新发送')
              })
            }
            break
          case 6:
            url = this.$route.fullPath + '/useful-word'
            this.mortListShow = false
            this.$router.push({path: url})
            break
        }
      },
      toMineCode() {
        let url
        switch (this.coverShowType) {
          case 'person':
            url = this.$route.fullPath + '/person-code'
            break
          case 'group':
            url = this.$route.fullPath + '/group-code'
            break
        }
        this.coverFullShow = false
        this.$router.push({path: url})
      },
      chioceEmoji(item) {
        this.inputMsg = this.inputMsg + item.txt
      },
      showEmoji() {
        this.emojiShow = !this.emojiShow
        this.mortListShow = false
      },
      showMoreList() {
        this.mortListShow = !this.mortListShow
        this.emojiShow = false
      },
      _fileImage(e) {
        let file = e.target.files[0]
        let params = new FormData()
        params.append('file', file, file.name)
        UpLoad.upLoadImage(params).then((res) => {
          if (res.error === ERR_OK) {
            let data = {
              image_id: res.data.id,
              url: res.data.url
            }
            let desc = {log_type: 20}
            let ext = '20005'
            data = JSON.stringify(data)
            desc = JSON.stringify(desc)
            let opt = {
              data,
              desc,
              ext
            }
            let timeStamp = parseInt(Date.parse(new Date()) / 1000)
            let msg = {
              from_account_id: this.imInfo.im_account,
              avatar: this.userInfo.avatar,
              content: '',
              time: timeStamp,
              url: res.data.url,
              msgTimeStamp: timeStamp,
              nickName: this.userInfo.nickName,
              sessionId: this.userInfo.account,
              unreadMsgCount: 0,
              type: 20
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
              text: '[图片信息]',
              time: timeStamp,
              msgTimeStamp: timeStamp,
              fromAccount: this.id,
              sessionId: this.id,
              unreadMsgCount: 0,
              avatar: this.currentMsg.avatar,
              nickName: this.currentMsg.nickName
            }
            this.addListMsg({msg: addMsg, type: 'mineAdd'})
            this.mortListShow = false
            webimHandler.onSendCustomMsg(opt, this.id).then(res => {
            }, () => {
              this.$refs.toast.show('图片发送失败，请重新发送')
            })
          } else {
            this.$refs.toast.show('图片发送失败，请重新发送')
          }
        })
      }
    },
    data() {
      return {
        textareaDom: '',
        heightBoxDom: '',
        txtHeight: '36px',
        inputMsg: '',
        list: [],
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        startY: '',
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
        id: '',
        page: 1,
        noMore: false,
        moreLists: MORELIST,
        emojiList: emotionsFaceArr,
        emojiShow: false,
        mortListShow: false,
        codeStatus: {},
        coverFullShow: false,
        coverShowType: ''
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
      inputMsg() {
        this.textHeight()
      },
      pullDownRefreshObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      }
    },
    computed: {
      ...mapGetters([
        'currentMsg',
        'imInfo',
        'nowChat',
        'ios'
      ]),
      pullDownRefreshObj: function () {
        return this.pullDownRefresh && !this.noMore ? {
          threshold: parseInt(this.pullDownRefreshThreshold),
          stop: parseInt(this.pullDownRefreshStop),
          txt: ' '
        } : false
      },
      userInfo() {
        return storage.get('info')
      },
      slide() {
        return this.ios ? '' : 'slide'
      },
      endDate() {
        if (this.nowChat.length) {
          if (!this.nowChat[0].created_at && !this.nowChat[0].msgTimeStamp) {
            return this.nowChat[1] ? this.nowChat[1].created_at ? this.nowChat[1].created_at : this.nowChat[1].msgTimeStamp : ''
          } else {
            return this.nowChat[0].created_at ? this.nowChat[0].created_at : this.nowChat[0].msgTimeStamp
          }
        } else {
          return ''
        }
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
      bottom: 50px
      left: 0
      right: 0
      width: 100%
      overflow: hidden
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
            border-radius: 2px
          .chat-msg-box
            flex: 1
            overflow: hidden
            display: flex
            .chat-msg-content-max-box
              flex: 1
              overflow: hidden
              display: flex
            .chat-msg-content
              padding: 13px 15px
              border-radius: 8px
              line-height: 19px
              font-size: $font-size-medium
              font-family: $font-family-regular
              word-wrap: break-word
              word-break: break-all
              vertical-align: middle
            .chat-msg-content.other
              background: $color-white
              border: 0.5px solid #D6DCE0
            .chat-msg-content.mine
              background: $color-green
          .other.chat-msg-box
            margin-right: 50px
            .arrow-box
              width: 10px
              height: 45px
              position: relative
              .gray-arrow
                width:0
                height:0
                border-width: 5px 6px 5px 0
                border-style: solid
                border-color: transparent #D6DCE0 transparent transparent/*透明 灰 透明 透明 */
                position: absolute
                right: 0
                top: 17.5px
                .white-arrow
                  width:0
                  height:0
                  border-width: 5px 6px 5px 0
                  border-style: solid
                  border-color: transparent #FFF transparent transparent/*透明 灰 透明 透明 */
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
                width:0
                height:0
                border-width: 5px 0 5px 6px
                border-style: solid
                border-color: transparent transparent transparent $color-green/*透明 灰 透明 透明 */
                position: absolute
                left: 0
                top: 17.5px
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
            border: 0.5px solid rgba(0,0,0,0.10)
            border-radius: 4px
            background: $color-white
            overflow: hidden
            font-size: 0
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
                  border: 0.5px solid rgba(0,0,0,0.10)
                  border-radius: 50%
                  margin-right: 6px
                .shop-name
                  flex: 1
                  overflow: hidden
                  white-space: nowrap
                  text-overflow: ellipsis
                  font-family: $font-family-regular
                  font-size: $font-size-12
                  color: #828AA2
                  letter-spacing: 0.26px
              .goods-title
                line-height: 21px
                font-family: $font-family-regular
                font-size: $font-size-14
                color: #374B63
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
            border: 0.5px solid rgba(0,0,0,0.10)
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
              border: 0.5px solid rgba(0,0,0,0.10)
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

    .chat-input
      width: 100%
      box-sizing: border-box
      min-height: 38px
      background: $color-background-f9
      position: absolute
      left: 0
      right: 0
      bottom: 0
      z-index: 10
      .chat-input-box
        display: flex
        align-items: flex-end
        min-height: 38px
        padding: 6px 0
        .face-box
          width: 53px
          display: flex
          align-items: center
          .face-icon
            margin-left: 10px
            width: 28px
            height: 28px
            padding: 5px
        .addimg-box
          width: 53px
          display: flex
          align-items: center
          .addimg-icon
            margin-left: 5px
            width: 28px
            height: 28px
            padding: 5px
        .submit-btn
          width: 43px
          height: 36px
          margin: 0 5px
          border: 1px solid rgba(0,0,0,0.10)
          border-radius: 2px
          background: $color-white
          text-align: center
          line-height: 36px
          font-size: $font-size-medium
          font-family: $font-family-regular
          box-sizing: border-box
        .input-container
          flex: 1
          overflow-x: hidden
          min-height: 28px
          border: 1px solid rgba(0,0,0,0.10)
          background: $color-white
          max-height: 100px
          overflow-y: auto
          padding: 8px 10px 0
          .textarea
            width: 100%
            height: auto
            padding: 0
            margin: 0
            resize: none
            border: 0 none
            outline: none
            overflow-y: visible
            display: block
            font-size: $font-size-medium
      .more-box
        width: 100%
        .emoji-list
          display: flex
          flex-wrap: wrap
          padding: 6.666666vw 8vw 0
          .emoji-item
            width: 6.666666vw
            height: 6.666666vw
            margin-bottom: 6.666666vw
            &:not(:nth-child(7n))
              margin-right: 6.2vw
            .emoji-icon
              width: 6.666666vw
              height: 6.666666vw
        .addimg-list
          padding: 25px 0 0 8vw
          display: flex
          flex-wrap: wrap
          .addimg-item
            width: 16vw
            display: flex
            flex-direction: column
            justify-content: space-between
            font-size: 0
            margin-right: 6.6666vw
            margin-bottom: 15px
            position: relative
            .img-box
              width: 16vw
              height: 16vw
              border-1px(#ccc, 12px)
              display: flex
              justify-content: center
              align-items: center
              .item-icon
                width: 33px
                height: 33px
              .im-image
                icon-image('./icon-picture')
              .im-weixin
                icon-image('./icon-wechat')
              .im-group
                icon-image('./icon-groupcode')
              .im-useful
                icon-image('./icon-Comlanguage')
              .im-goods
                icon-image('./icon-sendgoods')
              .im-activity
                icon-image('./icon-activity')
            .item-txt
              margin-top: 5px
              font-size: $font-size-12
              font-family: $font-family-regular
              color: #828AA2
              text-align: center
            .image-file
              position: absolute
              left: 0
              top: 0
              opacity: 0
              width: 100%
              height: 100%
              z-index: 10

    .cover-full
      fill-box()
      z-index: 100
      layout()
      align-items: center
      background: rgba(32,32,46,0.8)
      .cover-container
        width: 300px
        height: 160px
        background: $color-white
        border: 1px solid rgba(32,32,46,0.10)
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
