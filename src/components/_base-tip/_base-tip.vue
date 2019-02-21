<template>
  <transition name="fade">
    <div class="bg" v-if="showTip">
      <div class="box">
        <p class="context" v-if="type === 'outline'">网络异常用户生命周期无法诊断<br />请检查手机网络</p>
        <p class="context" v-if="type === 'fail'">用户生命周期智能诊断失败<br />请重新诊断</p>
        <p class="context" v-if="type === 'overtime'">用户生命周期智能诊断已超时<br />请重新诊断</p>
        <p class="context" v-if="type === ''">{{text1}}<br />{{text2}}</p>
        <div class="btn" @click="hide">确定</div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BASE_TIP'

  export default {
    name: COMPONENT_NAME,
    props: {
      type: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showTip: false,
        text1: '网络异常',
        text2: ''
      }
    },
    methods: {
      show(text1, text2) {
        this.showTip = true
        this.text1 = text1
        this.text2 = text2
      },
      hide() {
        this.showTip = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .bg
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: rgba(0,0,0,0.8)
    z-index: 100
    .box
      background: #FFF
      width: 80vw
      height: 42vw
      border-radius: 6px
      row-center()
      top: 25%
      .context
        display: flex
        justify-content: center
        align-items: center
        text-align: center
        line-height: 1.2
        font-size: 15px
        color: #20202E
        font-family: $font-family-medium
        padding: 0 20px
        height: 27vw
      .btn
        text-align: center
        line-height: 9vw
        border-radius: 10vw
        color: #FFF
        margin: 0 auto
        font-family: $font-family-regular
        font-size: $font-size-14
        background: $color-linear-main
        width: 34vw
        height: 9vw
</style>
