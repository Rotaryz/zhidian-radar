<template>
  <scroll class="market-ai"
          ref="scroll"
          bcColor="#f0f5ff"
          @pullingDown="onPullingDown"
          :pullDownRefresh="true"
          :data="dataArray"
  >
    <div class="empty"></div>
    <section v-for="(item, index) in dataArray" :key="index" class="item-wrapper">
      <market-card :info="item"></market-card>
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
        dataArray: []
      }
    },
    created() {
      this._getList()
    },
    methods: {
      _getList(loading) {
        let data = {
          market_type: 0
        }
        API.Marketing.getList(data, loading).then((res) => {
          this.dataArray = res.data
        })
      },
      onPullingDown() {
        this._getList(false)
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
