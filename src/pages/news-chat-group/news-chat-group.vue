<template>
  <transition :name="slide">
    <div class="chat">
      <section class="chat-container" @click.stop="hideInput">
        <div class="group-wrapper">群发组：<span v-for="(item1, index1) in currentGroupMsg" :key="index1">{{index1 == (currentGroupMsg.length - 1) ? item1.name + '(' + item1.customers.length + ')' : item1.name + '(' + item1.customers.length + ')，'}}</span></div>
      </section>
      <section class="chat-input border-top-1px">
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
            <label class="addimg-item" :for="item.type == 1?'choose-pic':''" v-for="(item, index) in moreLists" :key="index" @click="nextWork(item)">
              <img :src="item.icon" class="item-icon">
              <p class="item-txt">{{item.txt}}</p>
              <input type="file" id="choose-pic" class="image-file" @change="_fileImage($event)" accept="image/*" v-if="item.type == 1">
            </label>
          </div>
        </div>
      </section>
      <toast ref="toast"></toast>
    </div>
  </transition>
</template>

<script>
  import Toast from 'components/toast/toast'
  import { mapActions, mapGetters } from 'vuex'
  import webimHandler from 'common/js/webim_handler'
  import storage from 'storage-controller'
  import { Im, UpLoad } from 'api'
  import { ERR_OK } from 'common/js/config'
  import utils from 'common/js/utils'
  import { emotionsFaceArr } from 'common/js/constants'

  const MORELIST = [
    {txt: '图片', icon: '../../../static/img/icon-pic-_im@2x.png', type: 1}
    // {txt: '发送商品', icon: '../../../static/img/icon-goods_im@2x.png', type: 2},
    // {txt: '发送活动', icon: '../../../static/img/icon-send_im@2x.png', type: 3}
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
        allowSelectPic: true
      }
    },
    created() {
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
        'setGroupMsgIng'
      ]),
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
      },
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
        let file = e.target.files[0]
        let params = new FormData()
        params.append('file', file, file.name)
        this.hideInput()
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
            let msg = {
              time: parseInt(Date.now() / 1000),
              lastMsg: '[图片信息]'
            }
            this.setGroupItem(msg)
            this.setNewsGetType(true)
            let groupIds = this.currentGroupMsg.map((item) => {
              return item.id
            })
            let reqData = {
              type: 20,
              url: res.data.url,
              group_ids: groupIds
            }
            this.$router.go(-2)
            Im.setGroupList(reqData).then((res) => {
            })
            this.mortListShow = false
            let reqArr = this._splitArr(this.currentGroupMsg)
            this._splitSendGroupMsg(reqArr, 'custom', opt)
            /** this.currentGroupMsg.map((item) => {
              item.customers.map((item1) => {
                webimHandler.onSendCustomMsg(opt, item1.account).then(res => {
                  let timeStamp = parseInt(Date.now() / 1000)
                  let addMsg = {
                    text: '[图片信息]',
                    time: timeStamp,
                    msgTimeStamp: timeStamp,
                    fromAccount: item1.account,
                    sessionId: item1.account,
                    unreadMsgCount: 0,
                    avatar: item1.avatar,
                    nickName: item1.nickName
                  }
                  this.addListMsg({msg: addMsg, type: 'mineAdd'})
                }, () => {
                  // this.$refs.toast.show('网络异常, 请稍后重试')
                })
              })
            }) **/
          } else {
            this.$refs.toast.show('图片发送失败，请重新发送')
          }
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
        this.inputMsg = ''
        this.hideInput()
        let msg = {
          time: parseInt(Date.now() / 1000),
          lastMsg: value
        }
        this.setGroupItem(msg)
        this.setNewsGetType(true)
        this.inputMsg = ''
        this.hideInput()
        this.$router.go(-2)
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
        /** this.currentGroupMsg.map((item) => {
          item.customers.map((item1) => {
            webimHandler.onSendMsg(value, item1.account).then(res => {
              let timeStamp = parseInt(Date.now() / 1000)
              let addMsg = {
                text: value,
                time: timeStamp,
                msgTimeStamp: timeStamp,
                fromAccount: item1.account,
                sessionId: item1.account,
                unreadMsgCount: 0,
                avatar: item1.avatar,
                nickName: item1.nickName
              }
              this.addListMsg({msg: addMsg, type: 'mineAdd'})
            }, () => {
              // this.$refs.toast.show('网络异常, 请稍后重试')
            })
          })
        }) **/
      }
    },
    components: {
      Toast
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
        'ios',
        'imInfo',
        'groupMsgIng'
      ]),
      userInfo() {
        return storage.get('info')
      },
      slide() {
        return this.ios ? '' : 'slide'
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
      background: $color-background-f9
      padding: 6px 0
      position: absolute
      left: 0
      right: 0
      bottom: 0
      z-index: 10
      .chat-input-box
        display: flex
        align-items: flex-end
        min-height: 38px
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
          border: 1px solid rgba(0, 0, 0, 0.10)
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
          height: 140px
          padding: 25px 0 0 30px
          display: flex
          .addimg-item
            width: 48px
            height: 70px
            display: flex
            flex-direction: column
            justify-content: space-between
            font-size: 0
            margin-right: 44px
            position: relative
            .item-icon
              width: 48px
              height: 48px
            .item-txt
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

</style>
