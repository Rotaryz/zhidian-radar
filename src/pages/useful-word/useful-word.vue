<template>
  <transition :name="slide">
    <div class="useful-word">
      <scroll :data="wordList" :bcColor="'#ffffff'" ref="scroll">
        <div class="word-list">
          <div class="word-item border-bottom-1px" v-for="(item, index) in wordList" :key="index" @click="choice(item)">
            <div class="item-left">{{item.message}}</div>
            <div class="item-right">
              <div class="right-icon" :class="item.id == itemChecked.id ? 'icon-select' : 'icon-unSelect'"></div>
            </div>
          </div>
        </div>
      </scroll>
      <div class="word-bottom">
        <div class="bottom-left border-top-1px" @click="addWord">
          <div class="left-icon"></div>
        </div>
        <div class="bottom-right" @click="sendMsg">发送</div>
      </div>
      <toast ref="toast"></toast>
      <router-view @getMsg="getMsg"/>
    </div>
  </transition>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import Scroll from 'components/scroll/scroll'
  import { Im } from 'api'
  import {ERR_OK, TIMELAG} from '../../common/js/config'
  import webimHandler from 'common/js/webim_handler'
  import Toast from 'components/toast/toast'
  import storage from 'storage-controller'
  import utils from 'common/js/utils'

  export default {
    name: 'News',
    created() {
      if (this.newsGetType) {
        this.setNewsGetType(false)
        return
      }
      this.getMsg(true)
      console.log(this.$route.query.type)
    },
    data() {
      return {
        itemChecked: {},
        wordList: [],
        slide: 'slide'
      }
    },
    methods: {
      ...mapActions([
        'addListMsg',
        'setNowChat',
        'setGroupItem',
        'setNewsGetType',
        'setGroupMsgIng'
      ]),
      getMsg(loading = false) {
        Im.getMyWordList(loading).then(res => {
          if (res.error === ERR_OK) {
            this.wordList = res.data
            setTimeout(() => {
              this.$refs.scroll.refresh()
            }, 20)
          }
        })
      },
      choice(item) {
        this.itemChecked = item
      },
      sendMsg() {
        if (!this.itemChecked.id) {
          this.$refs.toast.show('请先选择您要发送的内容')
          return
        }
        if (this.$route.query.chatType === 'group') {
          if (this.groupMsgIng) {
            this.$refs.toast.show('群发消息发送中，请稍后再发')
            return
          }
          let value = this.itemChecked.message
          let msg = {
            time: parseInt(Date.now() / 1000),
            lastMsg: value
          }
          this.setGroupItem(msg)
          this.setNewsGetType(true)
          this.$router.go(-3)
          let groupIds = this.currentGroupMsg.map((item) => {
            return item.id
          })
          let reqData = {
            type: 1,
            content: value,
            group_ids: groupIds
          }
          Im.setGroupList(reqData).then((res) => {
          })
          let reqArr = this._splitArr(this.currentGroupMsg)
          this._splitSendGroupMsg(reqArr, 'chat', value)
        } else {
          this.userInfo = storage.get('info')
          let timeStamp = parseInt(Date.parse(new Date()) / 1000)
          let msg = {
            from_account_id: this.imInfo.im_account,
            avatar: this.userInfo.avatar,
            content: this.itemChecked.message,
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
            text: this.itemChecked.message,
            time: timeStamp,
            msgTimeStamp: timeStamp,
            fromAccount: this.currentMsg.account,
            sessionId: this.currentMsg.account,
            unreadMsgCount: 0,
            avatar: this.currentMsg.avatar,
            nickName: this.currentMsg.nickName
          }
          this.addListMsg({msg: addMsg, type: 'mineAdd'})
          this.$emit('refushBox')
          this.$router.back()
          webimHandler.onSendMsg(this.itemChecked.message, this.currentMsg.account).then(res => {
          }, () => {
            // this.$refs.toast.show('网络异常, 请稍后重试')
          })
        }
      },
      addWord() {
        let url = this.$route.path + '/add-word'
        this.$router.push({path: url})
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
            if (type === 'custom') {
              webimHandler.onSendCustomMsg(content, item1.account).then(res => {
                let timeStamp = parseInt(Date.now() / 1000)
                let addMsg = {
                  text: '[图片信息]',
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
      }
    },
    computed: {
      ...mapGetters([
        'currentMsg',
        'imInfo',
        'nowChat',
        'ios',
        'groupMsgIng',
        'currentGroupMsg'
      ])
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
  .useful-word
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 20
    background: $color-white
    .word-list
      background: $color-white
      padding-left: 15px
      padding-bottom: 50px
      .word-item
        padding: 16px 0
        display: flex
        align-items: center
        .item-left
          flex: 1
          overflow: hidden
          line-height: 21px
          white-space: normal
          word-break: break-all
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-000
        .item-right
          height: 100%
          padding: 0 15px 0 44px
          display: flex
          align-items: center
          .right-icon
            width: 20px
            height: 20px
          .icon-select.right-icon
            icon-image('./icon-select')
          .icon-unSelect.right-icon
            icon-image('./icon-uncheck')

    .word-bottom
      width: 100%
      height: 44px
      display: flex
      position: fixed
      left: 0
      right: 0
      bottom: 0
      z-index: 25
      .bottom-left
        width: 70px
        height: 100%
        display: flex
        align-items: center
        justify-content: center
        background: $color-background
        .left-icon
          width: 21px
          height: 21px
          icon-image('./btn-install')
      .bottom-right
        flex: 1
        overflow: hidden
        line-height: 44px
        text-align: center
        background: $color-20202E
        color: $color-white
        font-family: $font-family-medium
        font-size: $font-size-16
        letter-spacing: 0.3px
</style>
