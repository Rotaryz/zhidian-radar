<template>
  <scroll class="market-ai" bcColor="#f0f5ff">
    <div class="empty"></div>
    <section v-for="(item, index) in '12345'" :key="index" class="item-wrapper">
      <market-card :info="{type: index}"></market-card>
    </section>
    <div class="empty"></div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'components/scroll/scroll'
  import MarketCard from '../market-card/market-card'
  import * as API from 'api'
  const COMPONENT_NAME = 'MARKET_AI'

  export default {
    name: COMPONENT_NAME,
    components: {
      Scroll,
      MarketCard
    },
    data() {
      return {

      }
    },
    created() {
      this._getList()
    },
    methods: {
      _getList() {
        API.Marketing.getList({
          market_type: 0
        }).then((res) => {
          console.log(res)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .empty
    height :20px

  .market-ai
    border-radius :15px 15px 0 0
    padding :0 15px
    .item-wrapper
      margin-bottom :15px
</style>
