<template>
  <transition name="slide">
    <div class="add-box">
      <div class="data-bottom">
        <div class="textarea-number">{{editorMsg.length}}<span>/200</span></div>
        <div class="text">
          <textarea class="data-area" v-model="editorMsg" @touchmove.stop maxlength="200" name="" id="" cols="30" rows="10"
                  placeholder="请输入话术内容，最多200字"></textarea>
        </div>
      </div>
      <div class="bot-btn" @click="addWord">确定</div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { Im } from 'api'

  export default {
    name: 'add-word',
    data() {
      return {
        allowSend: true,
        editorShow: false,
        editorMsg: '',
        editorItem: {},
        wordList: [],
        wordId: ''
      }
    },
    created () {
      this.wordId = this.$route.query.id
      if (this.$route.query.id) document.title = '编辑话术'
      this.getMsgList()
    },
    methods: {
      getMsgList() {
        Im.getMyWordList().then(res => {
          if (res.error === this.$ERR_OK) {
            this.wordList = res.data
            res.data.map(item => {
              if (this.wordId && (+item.id === +this.wordId)) {
                this.editorItem = item
                this.editorMsg = item.message
              }
            })
          }
        })
      },
      addWord() {
        if (!this.allowSend) return
        this.allowSend = false
        if (!this.editorMsg) {
          this.$toast.show('请先输入内容')
          setTimeout(() => {
            this.allowSend = true
          }, 300)
          return
        }
        let data
        if (this.editorItem.id) {
          data = {
            message: this.editorMsg
          }
          Im.editWord(data, this.editorItem.id).then(res => {
            if (res.error === this.$ERR_OK) {
              this.wordList.map((item) => {
                if (item.id * 1 === this.editorItem.id) {
                  item.message = this.editorMsg
                }
                return item
              })
              this.$emit('refresh')
              this.$router.back()
              setTimeout(() => {
                this.allowSend = true
              }, 300)
            } else {
              this.$toast.show(res.message)
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
            if (res.error === this.$ERR_OK) {
              this.$emit('refresh')
              this.$router.back()
              setTimeout(() => {
                this.allowSend = true
              }, 300)
            } else {
              this.$toast.show(res.message)
              setTimeout(() => {
                this.allowSend = true
              }, 300)
            }
          })
        }
      },
      toBack() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  *
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box
  .add-box
    fill-box()
    z-index: 71
    background: #f0f5ff
  .data-bottom
    padding: 15px 12px 0
    position: relative
    z-index: 71
    .title
      font-size: $font-size-medium
      color: $color-text-88
      font-family: $font-family-regular
    .data-area
      width: 100%
      border: 0
      padding: 15px
      font-size: $font-size-14
      color: #333
      font-family: $font-family-regular
      height: 185px
      outline:none
      resize: none
      border-radius: 4px
      position: relative
      z-index: 2
      background: none
      &::-webkit-input-placeholder{
        color: #979797
      }
    .text
      padding-bottom: 25px
      border-1px(#E1E1E1, 4px)
    .text:after
      background: #FFF
      z-index: 1
    .textarea-number
      position: absolute
      bottom: 15px
      right: 25px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: #333
      z-index: 2
      span
        color: #AFAFAF

  .bot-btn
    margin: 20px 12px
    height: 40px
    line-height: 40px
    text-align: center
    border-radius: 6px
    font-size: $font-size-14
    font-family: $font-family-medium
    color: $color-white
    background: $color-linear-main

</style>
