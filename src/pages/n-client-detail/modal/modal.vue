<template>
  <transition name="fade">
    <div class="bg" v-if="modalShow" @click="hideModal">
      <div class="content">
        <p class="num">13584260103</p>
        <div class="btns">
          <a class="left btn" v-clipboard:copy="13584260103" v-clipboard:success="onCopy" v-clipboard:error="onError">复制号码</a>
          <a class="right btn" href="tel:13584260103" @click="hideModal">拨打号码</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  Vue.use(VueClipboard)
  export default{
    name: 'detail-msg',
    data() {
      return {
        modalShow: false
      }
    },
    methods: {
      showModal() {
        this.modalShow = true
      },
      hideModal() {
        this.modalShow = false
      },
      onCopy(e) {
        let msg = `${e.text}\n已经复制至剪切板`
        this.$toast.show(msg)
      },
      onError(e) {
        console.error(e)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .bg
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    background: rgba(0,0,0,0.7)
    z-index: 20
    .content
      width: 300px
      height: 160px
      border-radius: 6px
      background: #FFF
      all-center()
    .num
      margin-top: 40px
      text-align: center
      font-size: $font-size-18
      font-family: $font-family-medium
    .btns
      display: flex
      justify-content: space-between
      padding: 0 30px
      align-items: center
      margin-top: 45px
      .btn
        width: 110px
        height: 34px
        line-height: 34px
        font-size: $font-size-14
        font-family: $font-family-regular
        border-radius: 40px
        text-align: center
        color: $color-main
        background: #FFF
        box-sizing: border-box
        border: 1px solid $color-main
        &:last-child
          color: #FFF
          border: 0
          background: $color-linear-main
</style>
