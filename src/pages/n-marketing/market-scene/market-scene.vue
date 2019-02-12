<template>
  <scroll class="market-scene" bcColor="#f0f5ff">
    market-scene
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'components/scroll/scroll'

  const COMPONENT_NAME = 'MARKET_SCENE'

  export default {
    name: COMPONENT_NAME,
    components: {
      Scroll
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

  .market-scene
    border-radius :15px 15px 0 0
</style>
