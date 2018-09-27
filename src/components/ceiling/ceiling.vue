<template>
  <div class="ceiling" :class="newMsgIn ? 'show' : ''"
       @touchstart.prevent="touchStart"
       @touchmove.prevent="touchMove"
       @touchend="touchEnd">
    <img :src="newMsg.avatar" class="ceiling-left">
    <div class="ceiling-right">
      <div class="content">
        <p class="msgs-p" v-show="newMsg.type === 'custom'">{{newMsg.content}}</p>
        <p class="txt-p" v-show="newMsg.type === 'chat'" v-html="newMsg.html"></p>
      </div>
      <div class="time">刚刚</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapActions, mapGetters} from 'vuex'
  import {Im} from 'api'
  import webimHandler from 'common/js/webim_handler'
  import {ERR_OK} from '../../common/js/config'
  import storage from 'storage-controller'
  import Utils from 'common/js/utils'

  const COMPONENT_NAME = 'Ceiling'
  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        glideShow: false,
        newMsgIn: false,
        timer: ''
      }
    },
    created() {
      this.touch = {}
      this.login()
    },
    methods: {
      ...mapActions([
        'saveList',
        'setNewMsg',
        'setCustomCount',
        'addListCount',
        'addListMsg',
        'setImInfo',
        'addNowChat',
        'setImIng'
      ]),
      async login() {
        let token = storage.get('token')
        if (!token) {
          return
        }
        this.userInfo = storage.get('info')
        Im.getImInfo(this.userInfo.im_account).then((res) => {
          if (res.error === ERR_OK) {
            let imInfo = res.data
            this.setImInfo(imInfo)
            // console.log(imInfo)
            this.sdkLogin(imInfo).then(() => {
              this.setImIng(true)
            })
          }
        }, (err) => {
          console.log(err)
        })
      },
      // IM登录
      async sdkLogin(imInfo) {
        let loginInfo = {
          'sdkAppID': imInfo.im_sdk_appid, // 用户所属应用id,必填
          'appIDAt3rd': imInfo.im_sdk_appid, // 用户所属应用id，必填
          'accountType': imInfo.im_sdk_acounttype, // 用户所属应用帐号类型，必填
          'identifier': imInfo.im_account, // 当前用户ID,必须是否字符串类型，选填
          'identifierNick': this.userInfo.name, // 当前用户昵称，选填
          'userSig': imInfo.sig // 当前用户身份凭证，必须是字符串类型，选填
        }

        // 监听事件
        let listeners = {
          'onConnNotify': (resp) => {
            webimHandler.onConnNotify(resp)
          }, // 选填
          'onMsgNotify': async (msg) => {
            this.newMsgIn = false
            clearTimeout(this.timer)
            this.newMsgIn = true
            this.timer = setTimeout(() => {
              this.newMsgIn = false
            }, 5000)
            let res = await webimHandler.onMsgNotify(msg)
            if (res.type === 'custom') {
              this.setCustomCount('add')
              if (Number(res.ext) === 20005 && res.fromAccount === this.currentMsg.account) {
                let goods = JSON.parse(res.data)
                let goodsRes = Object.assign({}, res, goods)
                this.addNowChat(goodsRes)
              }
              if (Number(res.ext) === 20005) {
                this.addListCount(res)
                this.addListMsg({msg: res, type: ''})
              }
            } else {
              this.addListCount(res)
              this.addListMsg({msg: res, type: ''})
              if (res.fromAccount === this.currentMsg.account) {
                this.addNowChat(res)
              }
            }
            let content = webimHandler.transitionMsg(res)
            let html = ''
            if (res.type === 'chat') {
              html = Utils.msgFaceToHtml(content)
            }
            this.setNewMsg({avatar: res.avatar, content, html, type: res.type})
          }, // 监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
          'onGroupSystemNotifys': (msg) => {
          } // 监听（多终端同步）群系统消息事件，必填
        }

        let options = {
          'isAccessFormalEnv': true, // 是否访问正式环境，默认访问正式，选填
          'isLogOn': false// 是否开启控制台打印日志,默认开启，选填
        }

        let avatar = this.userInfo.avatar
        await webimHandler.sdkLogin(loginInfo, listeners, options, avatar)
        let userInfo = storage.get('info')
        let reqData = {
          merchant_id: userInfo.merchant_id,
          employee_id: userInfo.id,
          page: 1,
          limit: 50
        }
        Im.getContactList(reqData).then((res) => {
          if (res.error === ERR_OK) {
            let data = res.data
            webimHandler.initUnread(data).then((resp) => {
              let msgList = resp.map((item) => {
                item.time = Utils.formatDate(item.msgTimeStamp).date
                item.html = Utils.msgFaceToHtml(item.lastMsg)
                return item
              })
              this.saveList(msgList)
            })
          }
        })
        /** let res = await webimHandler.getRecentContact(50)
        let msgList = await webimHandler.initUnread(res)
        let noMsgList = msgList.filter((item) => {
          return item.lastMsg === '[其他]'
        })
        let requireArr = noMsgList.map((item) => {
          return item.sessionId
        })
        if (requireArr.length) {
          let reqdata = {
            customer_ims: requireArr,
            employee_id: this.userInfo.id
          }
          Im.getLastMsgObj(reqdata).then((res) => {
            if (res.error === ERR_OK) {
              let resObj = res.data
              msgList = msgList.map((item) => {
                let account = item.sessionId
                if (resObj[account]) {
                  item.lastMsg = resObj[account].content
                  item.time = resObj[account]['created_at']
                }
                return item
              })
              msgList = msgList.map((item) => {
                if (item.lastMsg === '[其他]') {
                  item.lastMsg = ''
                }
                item.time = Utils.formatDate(item.msgTimeStamp).date
                return item
              })
              this.saveList(msgList)
            }
          }, (err) => {
            console.log(err)
          })
        } else {
          msgList = msgList.map((item) => {
            item.time = Utils.formatDate(item.msgTimeStamp).date
            return item
          })
          this.saveList(msgList)
        } **/
      },
      touchStart(e) {
        this.touch.initiated = true
        // 用来判断是否是一次移动
        this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      touchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaY = touch.pageY - this.touch.startY
        if (deltaY > 0) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
        this.touch.hide = true
      },
      touchEnd() {
        if (!this.touch.moved) {
          return
        }
        if (this.touch.hide) {
          this.touch.hide = false
          this.newMsgIn = false
        }
      }
    },
    computed: {
      ...mapGetters([
        'newMsg',
        'currentMsg'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .ceiling
    height: 60px
    position: fixed
    left: 0
    right: 0
    top: -70px
    z-index: 999
    background: $color-white
    border: 0.5px solid rgba(32, 32, 46, 0.10)
    box-shadow: 0 2px 6px 0 rgba(43, 43, 145, 0.07)
    border-radius: 1px 1px 4px 4px
    display: flex
    align-items: center
    padding: 0 15px
    transition: all .5s
    .ceiling-left
      width: 40px
      height: 40px
      border: 0.5px solid rgba(32, 32, 46, 0.10)
      margin-right: 10px
    .ceiling-right
      flex: 1
      overflow: hidden
      display: flex
      align-items: center
      .time
        font-size: $font-size-small
        color: $color-text-88
        font-family: $font-family-regular
        margin-left: 30px
      .content
        flex: 1
        overflow: hidden
        .msgs-p
          line-height: 18px
          font-family: $font-family-regular
          font-size: $font-size-medium
          .green
            color: $color-text-56
        .txt-p
          width: 100%
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          font-size: $font-size-medium
          font-family: $font-family-regular

  .show.ceiling
    top: 0

</style>
