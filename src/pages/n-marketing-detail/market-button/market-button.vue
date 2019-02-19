<template>
  <footer class="market-button" @click="submitHandle">
    <div class="button">{{CONFIG.submitButton.text}}</div>
  </footer>
</template>

<script type="text/ecmascript-6">
  import * as Helpers from '@/store/helpers'

  const COMPONENT_NAME = 'MARKET_BUTTON'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        nowTime: 0
      }
    },
    computed: {
      ...Helpers.marketComputed
    },
    methods: {
      ...Helpers.marketMethods,
      async submitHandle() {
        if (Date.now() - this.nowTime < 100) return
        this.nowTime = Date.now()
        let method = this.CONFIG.submitButton.fn
        let flag = await this[method]()
        if (!flag) return
        this.$router.back()
        this.$emit('refresh')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  @import "../market-detail.styl"

  .market-button
    position :absolute
    bottom :0
    height :$button-height
    right :0
    left :0
    padding :0 15px
    background: #FFFFFF;
    box-shadow: 0 -1px 0 0 #E1E1E1;
    line-height :@height
    z-index :60
    .button
      display :inline-block
      width :100%
      height :40px
      line-height :@height
      background-image: linear-gradient(135deg, #953DE1 0%, #4541F9 100%);
      border-radius: 6px;
      font-family: $font-family-medium
      font-size: 14px;
      color: #FFFFFF;
      text-align: center
</style>
