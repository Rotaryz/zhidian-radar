<template>
  <transition name="slide">
    <div class="chat">
      <section class="chat-container" @click.stop="hideInput">
        <div class="group-wrapper">群发组：<span v-for="(item1, index1) in currentGroupMsg" :key="index1">{{index1 == (currentGroupMsg.length - 1) ? item1.name + '(' + item1.total + ')' : item1.name + '(' + item1.total + ')，'}}</span></div>
      </section>
      <!--<section class="chat-input border-top-1px">-->
      <!--<div class="chat-input-box">-->
      <!--<div class="face-box" @click.stop="showEmoji">-->
      <!--<img src="../../../static/img/icon-emoji@2x.png" class="face-icon">-->
      <!--</div>-->
      <!--<div class="input-container" ref="textBox">-->
      <!--<textarea class="textarea" type="text" ref="inputTxt" v-model="inputMsg" rows="1"></textarea>-->
      <!--</div>-->
      <!--<div class="addimg-box" v-if="!inputMsg" @click.stop="showMoreList">-->
      <!--<img src="../../../static/img/icon-add_im@2x.png" class="addimg-icon">-->
      <!--</div>-->
      <!--<div class="submit-btn" @click="sendMsg" v-if="inputMsg">发送</div>-->
      <!--</div>-->
      <!--<div class="more-box">-->
      <!--<div class="emoji-list" v-if="emojiShow">-->
      <!--<div class="emoji-item" v-for="(item, index) in emojiList" :key="index" @click.stop="chioceEmoji(item)">-->
      <!--<img :src="item.url" class="emoji-icon">-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="addimg-list" v-if="mortListShow">-->
      <!--<label class="addimg-item" :for="item.type == 1?'choose-pic':''" v-for="(item, index) in moreLists" :key="index" @click="nextWork(item)">-->
      <!--<img :src="item.icon" class="item-icon">-->
      <!--<p class="item-txt">{{item.txt}}</p>-->
      <!--<input type="file" id="choose-pic" class="image-file" @change="_fileImage($event)" accept="image/*" v-if="item.type == 1">-->
      <!--</label>-->
      <!--</div>-->
      <!--</div>-->
      <!--</section>-->
      <div class="chat-input border-top-1px">
        <div class="chat-input-box">
          <div class="face-box" @click.stop="showEmoji">
            <img src="./icon-face@2x.png" class="face-icon">
          </div>
          <div class="input-container" ref="textBox">
            <textarea class="textarea" type="text" ref="inputTxt" v-model="inputMsg" rows="1"></textarea>
          </div>
          <div class="addimg-box" v-if="!inputMsg" @click.stop="showMoreList">
            <img src="./icon-addnews@2x.png" class="addimg-icon">
          </div>
          <div class="submit-btn" @click="sendMsg" v-if="inputMsg">发送</div>
        </div>
        <transition name="slide-up">
          <div class="more-box border-top-1px" v-if="emojiShow || mortListShow">
            <div class="emoji-list" v-if="emojiShow">
              <div class="emoji-item" v-for="(item, index) in emojiList" :key="index" @click.stop="chioceEmoji(item)">
                <img :src="item.url" class="emoji-icon">
              </div>
            </div>
            <div class="addimg-list" v-if="mortListShow">
              <div class="addimg-item" v-for="(item, index) in moreLists" :key="index" @click="nextWork(item)" :style="item.type === -1 ? 'opacity: 0' : ''">
                <div class="img-box">
                  <div class="item-icon" :class="item.icon"></div>
                </div>
                <p class="item-txt">{{item.txt}}</p>
                <input type="file" class="image-file" @change="_fileImage($event)" accept="image/*" v-if="item.type == 1"></input>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!--<transition name="fade">-->
        <!--<div class="cover-full" v-if="coverFullShow">-->
          <!--<div class="cover-container">-->
            <!--<div class="cover-top">-->
              <!--<span v-if="coverShowType === 'person'" class="top-txt">暂未上传个人微信二维码，无法发送</span>-->
              <!--<span v-if="coverShowType === 'group'" class="top-txt">暂未上传群二维码，无法发送</span>-->
            <!--</div>-->
            <!--<div class="cover-down border-top-1px" @click="toMineCode">现在上传</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</transition>-->
      <toast ref="toast"></toast>
      <selector-view ref="selector" :hasFn="true" @submit="selectorDown"></selector-view>
      <router-view @getQrCode="getQrCodeStatus"/>
    </div>
  </transition>
</template>

<script>
  import Toast from 'components/toast/toast'
  import { mapActions, mapGetters } from 'vuex'
  import SelectorView from 'components/selector-view/selector-view'
  import storage from 'storage-controller'
  import { News } from 'api'
  import { ERR_OK } from 'common/js/config'
  import utils from 'common/js/utils'
  import { emotionsFaceArr } from 'common/js/constants'
  import * as COS from '@/utils/cos/cos'

  const TIMELAG = 300

  const MORELIST = [
    {txt: '图片', icon: 'im-image', type: 1},
    {txt: '个人微信', icon: 'im-weixin', type: 4},
    // {txt: '微信群码', icon: 'im-group', type: 5},
    {txt: '常用语', icon: 'im-useful', type: 6},
    {txt: '优惠券', icon: 'im-coupon', type: 30},
    {txt: '商品', icon: 'im-goods', type: 20},
    {txt: '服务', icon: 'im-server', type: 2},
    {txt: '活动', icon: 'im-activity', type: 3}
    // {txt: '', icon: '', type: -1}
  ]

  export default {
    name: 'Chat',
    data() {
      return {
        textareaDom: '',
        heightBoxDom: '',
        txtHeight: '36px',
        inputMsg: '',
        id: '',
        page: 1,
        noMore: false,
        moreLists: MORELIST,
        emojiList: emotionsFaceArr,
        emojiShow: false,
        mortListShow: false,
        codeStatus: {},
        coverFullShow: false,
        coverShowType: '',
        isSending: false,
        msgId: 0 // 是否再发一条，是则有id
      }
    },
    created() {
      // this.getQrCodeStatus()
      this.msgId = this.$route.query.id || 0
      if (this.currentGroupMsg.length < 1) {
        this.$router.replace('/new-group-msg')
      }
    },
    mounted() {
      this.textareaDom = this.$refs.inputTxt
      this.textBoxDom = this.$refs.textBox
    },
    methods: {
      ...mapActions([
        'setGroupItem',
        'addListMsg',
        'setNewsGetType',
        'setGroupMsgIng',
        'updateNewsPage',
        'saveList'
      ]),
      // toMineCode() {
      //   let url
      //   switch (this.coverShowType) {
      //     case 'person':
      //       url = this.$route.fullPath + '/person-code'
      //       break
      //     case 'group':
      //       url = this.$route.fullPath + '/group-code'
      //       break
      //   }
      //   this.coverFullShow = false
      //   this.$router.push({path: url})
      // },
      getQrCodeStatus() {
        // Im.getCodeStatus().then(res => {
        //   if (res.error === ERR_OK) {
        //     this.codeStatus = res.data
        //   }
        // })
      },
      exceptionHandle(flag) {
        if (flag) {
          this.$refs.toast.show('网络异常, 请稍后重试')
          this.$router.go(-1)
          return true
        }
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
        if (!arr.length) return
        this.setGroupMsgIng(true)
        arr.forEach(item => {
          this._sendGroupMsg(item, type, content)
        })
        this.setGroupMsgIng(false)
      },
      async _sendGroupMsg(arr, type, content) {
        let text
        switch (type) {
          case 'custom' :
            text = '[图片信息]'
            break
          case 'chat' :
            text = content
            break
          case 'goods' :
          case 'service' :
            text = '[商品信息]'
            break
          case 'activity' :
            text = '[活动信息]'
            break
          case 'coupon' :
            text = '[优惠券信息]'
            break
          case 'weixin' :
            text = '[个人微信二维码]'
            break
          default:
            break
        }
        let msg = {
          time: parseInt(Date.now() / 1000),
          lastMsg: text
        }
        this.setGroupItem(msg)
        arr.forEach(item1 => {
          let timeStamp = parseInt(Date.now() / 1000)
          let addMsg = {
            text,
            time: timeStamp,
            msgTimeStamp: timeStamp,
            fromAccount: item1.account || item1.im_account,
            sessionId: item1.account || item1.im_account,
            unreadMsgCount: 0,
            avatar: item1.avatar,
            nickName: item1.nickname
          }
          this.addListMsg({msg: addMsg, type: 'mineAdd'})
        })
      },
      // _splitSendGroupMsg(arr, type, content) {
      //   this.setGroupMsgIng(true)
      //   Promise.all(arr.map((item, index) => {
      //     return new Promise((resolve, reject) => {
      //       setTimeout(async () => {
      //         await this._sendGroupMsg(item, type, content)
      //         resolve()
      //       }, index * 1000)
      //     })
      //   })).then(res => {
      //     this.setGroupMsgIng(false)
      //   })
      // },
      // async _sendGroupMsg(arr, type, content) {
      //   await Promise.all(arr.map((item1) => {
      //     return new Promise((resolve, reject) => {
      //       if (type === 'custom') {
      //         webimHandler.onSendCustomMsg(content, item1.account).then(res => {
      //           let timeStamp = parseInt(Date.now() / 1000)
      //           let addMsg = {
      //             text: '[图片信息]',
      //             time: timeStamp,
      //             msgTimeStamp: timeStamp,
      //             fromAccount: item1.account,
      //             sessionId: item1.account,
      //             unreadMsgCount: 0,
      //             avatar: item1.avatar,
      //             nickName: item1.nickname
      //           }
      //           this.addListMsg({msg: addMsg, type: 'mineAdd'})
      //           resolve()
      //         }, () => {
      //           resolve()
      //           // this.$refs.toast.show('网络异常, 请稍后重试')
      //         })
      //       } else if (type === 'chat') {
      //         webimHandler.onSendMsg(content, item1.account).then(res => {
      //           let timeStamp = parseInt(Date.now() / 1000)
      //           let addMsg = {
      //             text: content,
      //             time: timeStamp,
      //             msgTimeStamp: timeStamp,
      //             fromAccount: item1.account,
      //             sessionId: item1.account,
      //             unreadMsgCount: 0,
      //             avatar: item1.avatar,
      //             nickName: item1.nickname
      //           }
      //           this.addListMsg({msg: addMsg, type: 'mineAdd'})
      //           resolve()
      //         }, () => {
      //           resolve()
      //           // this.$refs.toast.show('网络异常, 请稍后重试')
      //         })
      //       } else if (type === 'person-qr-code') {
      //         webimHandler.onSendCustomMsg(content, item1.account).then(res => {
      //           let timeStamp = parseInt(Date.now() / 1000)
      //           let addMsg = {
      //             text: '[个人微信二维码]',
      //             time: timeStamp,
      //             msgTimeStamp: timeStamp,
      //             fromAccount: item1.account,
      //             sessionId: item1.account,
      //             unreadMsgCount: 0,
      //             avatar: item1.avatar,
      //             nickName: item1.nickName
      //           }
      //           this.addListMsg({msg: addMsg, type: 'mineAdd'})
      //           resolve()
      //         }, () => {
      //           resolve()
      //           // this.$refs.toast.show('网络异常, 请稍后重试')
      //         })
      //       } else if (type === 'group-qr-code') {
      //         webimHandler.onSendCustomMsg(content, item1.account).then(res => {
      //           let timeStamp = parseInt(Date.now() / 1000)
      //           let addMsg = {
      //             text: '[群微信二维码]',
      //             time: timeStamp,
      //             msgTimeStamp: timeStamp,
      //             fromAccount: item1.account,
      //             sessionId: item1.account,
      //             unreadMsgCount: 0,
      //             avatar: item1.avatar,
      //             nickName: item1.nickName
      //           }
      //           this.addListMsg({msg: addMsg, type: 'mineAdd'})
      //           resolve()
      //         }, () => {
      //           resolve()
      //           // this.$refs.toast.show('网络异常, 请稍后重试')
      //         })
      //       }
      //     })
      //   }))
      //   return true
      // },
      hideInput() {
        this.mortListShow = false
        this.emojiShow = false
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
      textHeight() {
        let timer = setTimeout(() => {
          this.textareaDom.style.height = 'auto'
          this.textareaDom.style.height = this.textareaDom.scrollHeight + 'px'
          this.textBoxDom.scrollTop = this.textareaDom.scrollHeight
          clearTimeout(timer)
        }, 20)
      },
      _fileImage(e) {
        if (this.groupMsgIng) {
          this.$refs.toast.show('群发消息发送中，请稍后再发')
          return
        }
        let files = e.target.files
        this.hideInput()
        this.$refs.toast.showing('图片发送中...')
        COS.uploadFiles(0, [files[0]]).then((resp) => {
          let res = resp[0]
          if (res.error === ERR_OK) {
            let data = {
              image_id: res.data.id,
              url: res.data.url
            }
            let message = data
            let desc = {log_type: 20}
            let ext = '20005'
            data = JSON.stringify(data)
            desc = JSON.stringify(desc)
            let opt = {
              data,
              desc,
              ext
            }
            this.setNewsGetType(true)
            this._sendGroupMessage(20, message, () => {
              let reqArr = this._splitArr(this.currentGroupMsg)
              this._splitSendGroupMsg(reqArr, 'custom', opt)
              this.mortListShow = false
              this.$router.go(-2)
            })
          } else {
            this.$refs.toast.show('图片发送失败，请重新发送')
          }
        })
      },
      nextWork(item) {
        let type = item.type * 1
        switch (type) {
          case 1:
            break
          case 2:
            this.$refs.selector.showModel('service')
            break
          case 20:
            this.$refs.selector.showModel('goods')
            break
          case 3:
            this.$refs.selector.showModel('activity')
            break
          case 4:
            if (!this.userInfo.weixin_no) {
              this.coverFullShow = true
              this.coverShowType = 'person'
              this.$refs.toast && this.$refs.toast.show('无微信, 请在门店信息中添加')
            } else {
              this._sendGroupMessage(6, {}, () => {
                let reqArr = this._splitArr(this.currentGroupMsg)
                this._splitSendGroupMsg(reqArr, 'weixin', {})
                this.$router.replace('/news')
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
              console.log(opt)
              let timeStamp = parseInt(Date.now() / 1000)
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
            }
            break
          case 6:
            this.$refs.selector.showModel('words')
            break
          case 30:
            this.$refs.selector.showModel('coupon')
            break
        }
      },
      selectorDown(item, type) {
        let data, logType, descMsg, desc, ext, title, url, message, option
        switch (type) {
          case 'words':
            this._sendGroupMessage(1, {text: item.message}, () => {
              let reqArr = this._splitArr(this.currentGroupMsg)
              this._splitSendGroupMsg(reqArr, 'chat', item.message)
              this.inputMsg = ''
              this.hideInput()
              this.setNewsGetType(true)
              this.inputMsg = ''
              this.hideInput()
              this.$router.go(-2)
            })
            break
          case 'coupon':
            title = item.coupon_name
            message = {
              title,
              avatar: this.userInfo.avatar,
              coupon_id: item.id,
              end_at: item.end_at,
              coupon_type: item.coupon_type,
              coupon_num: item.denomination
            }
            logType = 30
            descMsg = {log_type: logType}
            data = JSON.stringify(message)
            desc = JSON.stringify(descMsg)
            ext = '20005'
            option = {
              data,
              desc,
              ext
            }
            this._sendGroupMessage(logType, message, () => {
              let reqArr = this._splitArr(this.currentGroupMsg)
              this._splitSendGroupMsg(reqArr, 'coupon', option)
              this.$router.replace('/news')
            })
            break
          case 'goods':
          case 'service':
            title = item.goods_title
            url = item.image_url
            message = {
              url,
              goods_id: item.recommend_goods_id,
              title,
              goods_price: item.platform_price,
              original_price: item.original_price,
              avatar: this.userInfo.avatar,
              shop_name: item.shop_name
            }
            logType = 3
            descMsg = {log_type: logType}
            data = JSON.stringify(message)
            desc = JSON.stringify(descMsg)
            ext = '20005'
            option = {
              data,
              desc,
              ext
            }
            this._sendGroupMessage(logType, message, () => {
              let reqArr = this._splitArr(this.currentGroupMsg)
              this._splitSendGroupMsg(reqArr, type, option)
              this.$router.replace('/news')
            })
            break
          case 'activity':
            title = item.goods_title
            url = item.image_url
            message = {
              url,
              goods_id: item.recommend_activity_id,
              title,
              goods_price: item.platform_price,
              original_price: item.original_price,
              avatar: this.userInfo.avatar,
              shop_name: item.shop_name
            }
            logType = +item.rule_id === 3 ? 5 : 4
            descMsg = {log_type: logType}
            data = JSON.stringify(message)
            desc = JSON.stringify(descMsg)
            ext = '20005'
            option = {
              data,
              desc,
              ext
            }
            this._sendGroupMessage(logType, message, () => {
              let reqArr = this._splitArr(this.currentGroupMsg)
              this._splitSendGroupMsg(reqArr, type, option)
              this.$router.replace('/news')
            })
        }
      },
      sendMsg() {
        if (this.groupMsgIng) {
          this.$refs.toast.show('群发消息发送中，请稍后再发')
          return
        }
        let value = this.inputMsg.trim()
        if (!value) {
          this.$refs.toast.show('发送消息不能为空')
          return
        }
        this._sendGroupMessage(1, {text: value}, () => {
          let reqArr = this._splitArr(this.currentGroupMsg)
          this._splitSendGroupMsg(reqArr, 'chat', value)
          this.inputMsg = ''
          this.hideInput()
          this.setNewsGetType(true)
          this.inputMsg = ''
          this.hideInput()
          this.$router.go(-2)
        })
        // let groupIds = this.currentGroupMsg.map((item) => {
        //   return item.id
        // })
        // let reqData = {
        //   type: 1,
        //   content: value,
        //   group_ids: groupIds
        // }
        // Im.setGroupList(reqData).then((res) => {
        // })
      },
      _sendGroupMessage(type, message, callback) {
        if (this.isSending) return
        this.isSending = true
        this.$refs.toast.showing('消息发送中...')
        let data = {}
        let groupIds = this.currentGroupMsg.map(item => {
          return item.id
        })
        let customers = []
        this.currentGroupMsg.forEach(item => {
          if (item.customers && item.customers.length) {
            item.customers.forEach(item1 => {
              customers.push(item1)
            })
          }
        })
        data = {
          group_ids: groupIds,
          type,
          message,
          message_id: this.msgId,
          customers
        }
        News.sendGroupMessage(data).then(res => {
          this.isSending = false
          if (ERR_OK !== res.error) {
            this.$refs.toast.show(res.message)
            return
          }
          callback && callback()
        })
      }
    },
    components: {
      Toast,
      SelectorView
    },
    watch: {
      inputMsg() {
        this.textHeight()
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
    computed: {
      ...mapGetters([
        'currentGroupMsg',
        'imInfo',
        'groupMsgIng'
      ]),
      userInfo() {
        return storage.get('info')
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
      .group-wrapper
        background: $color-white-fff
        word-break: break-all
        font-family: $font-family-light
        font-size: $font-size-14
        color: $color-20202E
        letter-spacing: 0.3px
        line-height: 1.6
        padding: 15px

    .chat-input
      width: 100%
      box-sizing: border-box
      min-height: 38px
      background: #f7f7f8
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
          border: 1px solid rgba(0, 0, 0, 0.10)
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
          border-radius: 4px
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
          padding: 15px 0 0 8vw
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
              background: $color-white
              border-radius: 16px
              display: flex
              justify-content: center
              align-items: center
              .item-icon
                width: 30px
                height: 30px
              .im-image
                icon-image('./icon-picture')
              .im-weixin
                icon-image('./icon-wechatadd')
              .im-coupon
                icon-image('./icon-coupon_add')
              .im-group
                icon-image('./icon-groupcode')
              .im-useful
                icon-image('./icon-Comlanguage')
              .im-goods
                icon-image('./icon-sendgoods')
              .im-activity
                icon-image('./icon-activity')
              .im-server
                icon-image('./icon-service')
            .item-txt
              margin-top: 7.5px
              font-size: $font-size-12
              font-family: $font-family-regular
              color: #999999
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
