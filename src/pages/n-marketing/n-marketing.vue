<template>
  <div class="n-marketing">
    <header class="header">
      <dl class="tab-wrapper">
        <dd v-for="(item,index) in TAB_LIST" :key="index" class="tab-item" @click="tabHandle(index)">{{item.text}}</dd>
        <dt class="line-wrapper" :style="{transform: 'translate3d('+tabIndex*100+'%,0,0)'}">
          <div class="line"></div>
        </dt>
      </dl>
    </header>
    <section class="content-wrapper">
      <market-ai v-show="tabIndex===0"></market-ai>
      <market-scene v-show="tabIndex===1"></market-scene>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import MarketAi from './market-ai/market-ai'
  import MarketScene from './market-scene/market-scene'
  const PAGE_NAME = 'N_MARKETING'
  const TAB_LIST = [
    {
      text: '智能营销'
    },
    {
      text: '场景营销'
    }
  ]
  export default {
    name: PAGE_NAME,
    components: {
      MarketAi,
      MarketScene
    },
    data() {
      return {
        TAB_LIST: TAB_LIST,
        tabIndex: 0
      }
    },
    methods: {
      tabHandle(index) {
        if (this.tabIndex === index) return
        this.tabIndex = index
      }
    }
  }
</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
  $header-height=60px
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .n-marketing
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: $tab-height
    .header
      height :75px
      width :100vw
      display: inline-block
      background-size: 100% 100%
      background-image: url("./bg-znyx@1x.png")
      .tab-wrapper
        height :60px
        margin :0 46.5px
        display :flex
        position :relative
        .tab-item
          flex: 1
          padding-top:20px
          display :flex
          justify-content :center
          font-family: $font-family-medium
          font-size: 16px
          color: #FFFFFF
          line-height: 16px
        .line-wrapper
          position :absolute
          bottom :11px
          height :4px
          width :50%
          display :flex
          justify-content :center
          transform :translate3d(0,0,0)
          transition :transform 0.3s
          .line
            width :42.5px
            height :100%
            background: #FFFFFF
            border-radius: 4px
    .content-wrapper
      position :absolute
      top:$header-height
      left :0
      right :0
      bottom :0
</style>
