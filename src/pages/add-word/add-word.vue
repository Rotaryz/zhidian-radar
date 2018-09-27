<template>
  <transition :name="slide">
    <div class="add-word">
      <scroll :data="wordList" :bcColor="'#ffffff'" ref="scroll">
        <div class="word-list">
          <div class="word-item border-bottom-1px" v-for="(item, index) in wordList" :key="index">
            <div class="item-left">
              <span>{{item.message}}</span>
            </div>
            <div class="item-right">
              <div class="icon-box editor-box" @click="editItem(item)">
                <div class="right-icon-editor right-icon"></div>
              </div>
              <div class="icon-box delete-box" @click="deleteItem(item)">
                <div class="right-icon-delete right-icon"></div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
      <transition name="fade">
        <div class="editor-container" v-if="editorShow">
          <div class="editor-content">
            <div class="editor-title">添加常用语</div>
            <div class="editor-input-box">
              <textarea class="textarea" placeholder="请输入常用语" placeholder-class="holder-class" @touchmove.stop v-model="editorMsg" maxlength="100"></textarea>
              <div class="count-box"><span class="black-txt">{{editorMsg.length}}</span><span class="gray-txt">/100</span></div>
            </div>
            <div class="editor-down">
              <div class="btn cancel" @click="ediCancel">取消</div>
              <div class="btn confirm" @click="ediConfirm">确定</div>
            </div>
          </div>
        </div>
      </transition>
      <div class="word-bottom" @click="addMsgAny">添加常用语</div>
      <confirm-msg ref="confirm" @confirm="submitDelete"></confirm-msg>
      <toast ref="toast"></toast>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Im } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import { mapGetters } from 'vuex'

  export default {
    name: 'News',
    created() {
      if (this.newsGetType) {
        this.setNewsGetType(false)
        return
      }
      this.getMsgList()
    },
    data() {
      return {
        itemChecked: {},
        wordList: [],
        deleteAny: {},
        editorShow: false,
        editorMsg: '',
        editorItem: {},
        slide: 'slide',
        allowSend: true,
        allowConfirm: true
      }
    },
    methods: {
      getMsgList() {
        Im.getMyWordList().then(res => {
          if (res.error === ERR_OK) {
            this.wordList = res.data
            setTimeout(() => {
              this.$refs.scroll.refresh()
            }, 20)
          }
        })
      },
      deleteItem(item) {
        this.deleteAny = item
        this.$refs.confirm.show()
      },
      submitDelete() {
        if (!this.allowConfirm) return
        this.allowConfirm = false
        let data = {
          id: this.deleteAny.id
        }
        Im.delWord(data).then(res => {
          if (res.error === ERR_OK) {
            this.wordList = this.wordList.filter((item) => {
              return item.id !== this.deleteAny.id
            })
            this.deleteAny = {}
            this.$emit('getMsg')
            setTimeout(() => {
              this.allowConfirm = true
            }, 300)
          } else {
            this.$refs.toast.show(res.message)
            setTimeout(() => {
              this.allowConfirm = true
            }, 300)
          }
        })
      },
      editItem(item) {
        this.editorMsg = item.message
        this.editorItem = item
        this.editorShow = true
      },
      ediCancel() {
        this.editorMsg = ''
        this.editorItem = {}
        this.editorShow = false
      },
      addMsgAny() {
        this.editorShow = true
      },
      ediConfirm() {
        if (!this.allowSend) return
        this.allowSend = false
        if (!this.editorMsg) {
          this.$refs.toast.show('请先输入内容')
          setTimeout(() => {
            this.allowSend = true
          }, 300)
          return
        }
        let data
        if (this.editorItem.id) {
          data = {
            id: this.editorItem.id,
            message: this.editorMsg
          }
          Im.editWord(data).then(res => {
            if (res.error === ERR_OK) {
              this.wordList.map((item) => {
                if (item.id * 1 === this.editorItem.id) {
                  item.message = this.editorMsg
                }
                return item
              })
              this.editorMsg = ''
              this.editorItem = {}
              this.editorShow = false
              this.getMsgList()
              this.$emit('getMsg')
              setTimeout(() => {
                this.allowSend = true
              }, 300)
            } else {
              this.$refs.toast.show(res.message)
              setTimeout(() => {
                this.allowSend = true
              }, 300)
            }
          })
        } else {
          data = {
            message: this.editorMsg
          }
          Im.addWordAny(data).then(res => {
            if (res.error === ERR_OK) {
              this.editorMsg = ''
              this.editorShow = false
              this.getMsgList()
              this.$emit('getMsg')
              setTimeout(() => {
                this.allowSend = true
              }, 300)
            } else {
              this.$refs.toast.show(res.message)
              setTimeout(() => {
                this.allowSend = true
              }, 300)
            }
          })
        }
      }
    },
    components: {
      Scroll,
      Toast,
      ConfirmMsg
    },
    computed: {
      ...mapGetters([
        'ios'
      ])
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .add-word
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 50
    background: $color-white
    .word-list
      background: $color-white
      padding-left: 15px
      padding-bottom: 50px
      .word-item
        padding: 16px 0
        display: flex
        aling-items: center
        .item-left
          flex: 1
          display: flex
          align-items: center
          overflow: hidden
          line-height: 21px
          white-space: normal
          word-break: break-all
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-000
        .item-right
          display: flex
          align-items: center
          padding-left: 40px
          .icon-box
            padding: 10px
            font-size: 0
          .delete-box
            margin-right: 5px
            margin-left: 10px
          .right-icon
            width: 20px
            height: 20px
          .right-icon-editor
            icon-image('./btn-edit')
          .right-icon-delete
            icon-image('./btn-delete')

    .word-bottom
      width: 100%
      height: 44px
      position: fixed
      left: 0
      right: 0
      bottom: 0
      z-index: 55
      line-height: 44px
      text-align: center
      background: $color-20202E
      color: $color-white
      font-family: $font-family-medium
      font-size: $font-size-16
      letter-spacing: 0.3px
    .editor-container
      fill-box()
      z-index: 100
      layout()
      align-items: center
      background: rgba(32, 32, 46, 0.8)
      .editor-content
        width: 300px
        height: 210px
        background: $color-white
        border: 1px solid rgba(32, 32, 46, 0.10)
        border-radius: 2px
        margin-top: 152px
        .editor-title
          line-height: 45px
          color: $color-20202E
          font-family: $font-family-medium
          font-size: $font-size-16
          letter-spacing: 0.8px
          text-align: center
        .editor-input-box
          height: 105px
          margin: 0 10px
          padding: 10px
          margin-bottom: 15px
          border: 1px solid #e5e5e5
          padding-bottom: 20px
          box-sizing: border-box
          position: relative
          .textarea
            height: 100%
            width: 100%
            border: 0
            resize: none
            outline: none
            font-size: $font-size-14
            font-family: $font-family-regular
            &::-webkit-input-placeholder
              font-size: $font-size-14
              font-family: $font-family-regular
              color: $color-ccc
          .count-box
            background: $color-white
            position: absolute
            right: 10px
            bottom: 5px
            font-size: $font-size-12
            font-family: $font-family-regular
            .black-txt
              color: $color-20202E
            .gray-txt
              color: $color-ccc
        .editor-down
          height: 45px
          layout(row)
          border-top: 0.5px solid rgba(32, 32, 46, 0.10)
          .btn
            box-sizing: border-box
            flex: 1
            height: 100%
            text-align: center
            line-height: 45px
            font-family: $font-family-regular
            font-size: $font-size-14
            color: $color-20202E
            letter-spacing: 0.6px
            &.confirm
              border-left: 0.5px solid rgba(32, 32, 46, 0.10)
              color: $color-56BA15
</style>
