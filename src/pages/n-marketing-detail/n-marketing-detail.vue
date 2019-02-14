<template>
  <div class="n-marketing-detail">
    <section class="scroll-wrapper">
      <scroll class="market-ai"
              bcColor="#f0f5ff"
      >
        <market-header></market-header>
        <market-choice></market-choice>
      </scroll>
    </section>
    <market-button></market-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'components/scroll/scroll'
  import MarketHeader from './market-header/market-header'
  import MarketChoice from './market-choice/market-choice'
  import MarketButton from './market-button/market-button'

  const PAGE_NAME = 'N_MARKETING_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      Scroll,
      MarketHeader,
      MarketChoice,
      MarketButton
    },
    data() {
      return {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  @import "./market-detail.styl"

  .n-marketing-detail
    fill-box()
    z-index: 50
    background :$color-background
    .scroll-wrapper
      position :absolute
      top:0
      right:0
      left :0
      bottom :$button-height

</style>
