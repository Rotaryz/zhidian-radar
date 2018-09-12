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
      border-radius: 2px
      layout()
      .msg
        flex: 1
        layout()
        justify-content: center
        align-items: center
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-20202E
        letter-spacing: 0.8px
      .btn-group
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
