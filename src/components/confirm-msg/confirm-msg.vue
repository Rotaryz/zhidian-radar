<template>
  <transition name="fade">
    <article class="confirm-msg" v-if="isShow">
      <div class="mask"></div>
      <section class="content">
        <div class="msg">{{msg}}</div>
        <div class="btn-group">
          <div class="btn cancel" @click="cancel">取消</div>
          <div class="btn confirm" @click="confirm">确定</div>
        </div>
      </section>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        msg: '确定删除吗？',
        isShow: false
      }
    },
    methods: {
      cancel() {
        this.isShow = false
        this.$emit('cancel')
      },
      confirm() {
        this.isShow = false
        this.$emit('confirm')
      },
      close() {
        this.isShow = false
        this.$emit('close')
      },
      show(data) {
        if (data) {
          this.msg = data.msg || ''
        }
        this.isShow = true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .confirm-msg
    fill-box()
    z-index: 100
    layout()
    align-items: center
    .mask
      fill-box()
      background-color: $color-20202E
      opacity: 0.8
    .content
      position: relative
      margin-top: 152px
      width: 300px
      height: 160px
      background-color: $color-white-fff
      border: 1px solid rgba(32, 32, 46, 0.10)
      border-radius: 6px
      layout()
      .msg
        flex: 1
        layout()
        justify-content: center
        align-items: center
        text-align: center
        color: #20202E
        font-size: $font-size-18
        font-family: $font-family-medium
        letter-spacing: 0.8px
        line-height: 24px
        padding: 0 30px
      .btn-group
        display: flex
        justify-content: space-between
        padding: 0 30px
        align-items: center
        margin-bottom: 20px
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
          &.confirm
            color: #FFF
            border: 0
            background: $color-linear-main

</style>
