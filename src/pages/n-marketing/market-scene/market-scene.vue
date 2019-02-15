<template>
  <scroll class="market-scene"
          bcColor="#f0f5ff"
          :data="dataArray"
          :pullDownRefresh="true"
          :pullUpLoad="pullUpLoad"
          :showNoMore="false"
          @pullingDown="onPullingDown"
          @pullingUp="onPullingUp"
  >
    <div class="empty"></div>
    <market-card-button :dataArray="dataArray"></market-card-button>
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
  import MarketCardButton from '../market-card-button/market-card-button'
  import * as API from 'api'

  const COMPONENT_NAME = 'MARKET_SCENE'

  export default {
    name: COMPONENT_NAME,
    components: {
      Scroll,
      MarketCard,
      MarketCardButton
    },
    data() {
      return {
        dataArray: [],
        page: 1,
        limit: 15,
        pullUpLoad: true
      }
    },
    created() {
      this._getList()
    },
    methods: {
      _getList(loading) {
        let data = {
          market_type: 1,
          page: this.page
        }
        API.Marketing.getList(data, loading).then((res) => {
          if (res.meta.current_page === 1) {
            this.dataArray = res.data
          } else {
            let arr = res.data
            this.dataArray.concat(arr)
          }
          this.pullUpLoad = res.meta.current_page < res.meta.last_page
        })
      },
      onPullingDown() {
        this.page = 1
        this.pullUpLoad = true
        this._getList(false)
      },
      onPullingUp() {
        this.page++
        this._getList(true)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .empty
    height :20px

  .market-scene
    border-radius :15px 15px 0 0
    padding :0 15px
    .item-wrapper
      margin-bottom :15px
</style>
