<template>
  <div class="n-marketing-detail">
    <section class="scroll-wrapper">
      <scroll class="market-ai"
              bcColor="#f0f5ff"
              @pullingDown="onPullingDown"
              :pullDownRefresh="true"
              :data="dataArray"
      >
        <market-header></market-header>
        <div class="empty"></div>
      </scroll>
    </section>
    <footer class="button-wrapper" @click="submitHandle">
      <div class="button">创建计划</div>
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'components/scroll/scroll'
  import MarketHeader from './market-header/market-header'
  import * as API from 'api'

  const PAGE_NAME = 'N_MARKETING_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      Scroll,
      MarketHeader
    },
    data() {
      return {
        dataArray: [],
        nowTime: 0
      }
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
      },
      submitHandle() {
        if (Date.now() - this.nowTime < 100) return
        this.nowTime = Date.now()
        this.$router.back()
        this.$emit('refresh')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $button-height=55px
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .n-marketing-detail
    fill-box()
    z-index: 50
    background :$color-background
    .button-wrapper
      position :absolute
      bottom :0
      height :$button-height
      right :0
      left :0
      padding :0 15px
      background: #FFFFFF;
      box-shadow: 0 -1px 0 0 #E1E1E1;
      line-height :@height
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
    .scroll-wrapper
      position :absolute
      top:0
      right:0
      left :0
      bottom :$button-height

</style>
