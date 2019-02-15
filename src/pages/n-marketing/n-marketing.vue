<template>
  <div class="n-marketing">
    <section class="tab-bg"></section>
    <header class="header" :class="{active: tabChanging}">
      <dl class="tab-wrapper">
        <dd v-for="(item,index) in TAB_LIST" :key="index" class="tab-item" @click="tabHandle(index)">{{item.text}}</dd>
        <dt class="line-wrapper" :style="{transform: 'translate3d('+tabIndex*100+'%,0,0)'}">
          <div class="line"></div>
        </dt>
      </dl>
      <div v-if="tabChanging" class="header-tab-empty"></div>
    </header>
    <section class="container">
      <div class="big-container" :style="'transform: translate(-' + tabIndex*(100 / tabLength) + '%,0)'">
        <template v-for="(item, index) in TAB_LIST">
          <nav class="scroll-wrapper" :key="index">
            <div class="top-bg"></div>
            <div class="scroll-item">
              <market-ai v-if="index===0"></market-ai>
              <market-scene  v-if="index===1" :key="1"></market-scene>
            </div>
          </nav>
        </template>
      </div>
    </section>
    <base-router-view></base-router-view>
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
        tabLength: TAB_LIST.length,
        tabIndex: 0,
        tabChanging: false,
        nowTime: 0,
        timer: null
      }
    },
    methods: {
      tabHandle(index) {
        if (this.tabIndex === index) return
        this.timer && clearTimeout(this.timer)
        this.tabChanging = true
        this.tabIndex = index
        this.timer = setTimeout(() => {
          this.tabChanging = false
        }, 600)
      }
    }
  }
</script>



<style scoped lang="stylus" rel="stylesheet/stylus">
  $header-height=60px
  $tab-number=2
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .n-marketing
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: $tab-height
    z-index :20
    .tab-bg
      position :fixed
      height :75px
      width :100vw
      display: inline-block
      background-size: 100% 100%
      background-image: url("./bg-znyx@1x.png")
    .header
      position :fixed
      height :75px
      width :100vw
      z-index :40
      &.active
        display: inline-block
        background-size: 100% 100%
        background-image: url("./bg-znyx@1x.png")
      .header-tab-empty
        position :absolute
        bottom :0
        height :15px
        left :0
        right :0
        border-radius :15px 15px 0 0
        background:$color-background
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
    .container
      width: 100%
      height: 100%
      overflow :hidden
      .big-container
        width: 200%
        height: 100%
        display :flex
        flex-direction :row
        transition: transform 0.6s
        .scroll-wrapper
          height :100%
          position :relative
          .top-bg
            height :75px
            padding-bottom :5px
            width :100vw
          .scroll-item
            position :absolute
            top:$header-height
            left :0
            right :0
            bottom :0
            z-index :22
</style>
