<template>
  <div class="market-header">
    <header v-if="!CONFIG.icon" class="header-wrapper">
      <label class="header">
        <p class="left">活动名称</p>
        <section class="right">
          <input type="text" class="input-wrapper" maxlength="10" v-model="groupName">
          <aside class="number-wrapper"><p>{{marketData.name.length}}</p>/<p>10</p></aside>
        </section>
      </label>
      <div class="h-empty"></div>
    </header>
    <header v-else class="header-wrapper-auto">
      <section class="top">
        <img v-if="CONFIG.icon" class="left" :src="CONFIG.icon" alt=""/>
        <div class="right">
          <p class="title">{{marketData.name}}</p>
          <p class="explain">{{marketData.desc}}</p>
        </div>
      </section>
      <div class="h-empty"></div>
    </header>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as Helpers from '@/store/helpers'

  const COMPONENT_NAME = 'MARKET_HEADER'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
      }
    },
    computed: {
      ...Helpers.marketComputed,
      groupName: {
        get() {
          return this.marketData.name
        },
        set(val) {
          this.updateName(val)
        }
      }
    },
    methods: {
      ...Helpers.marketMethods
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .header-wrapper-auto
    position :relative
    height :100px
    padding-bottom :20px
    background-image :url("./bg-znyx_xq@1x.png")
    background-size :100% 100%
    .top
      height :100%
      display :flex
      justify-content :center
      align-items :center
      padding :0 30px 0 15px
      .left
        width :50px
        height :@width
      .right
        flex: 1
        margin-left :10px
        .title
          opacity: 0.8;
          font-family: $font-family-medium
          font-size: 16px
          color: #FFFFFF
          line-height: @font-size
        .explain
          margin-top :7px
          opacity: 0.4;
          font-family: $font-family-regular
          font-size: 12px;
          color: #FFFFFF;
          line-height: 1.4
    .h-empty
      position :absolute
      bottom :0
      left :0
      right :0
      height :20px
      border-radius :15px 15px 0 0
      background :$color-background

  .header-wrapper
    .h-empty
      height :15px
    .header
      font-family: $font-family-regular
      line-height: 1
      font-size: 3.733333333333334vw;
      color: #0E1249;
      layout(row,block,nowrap)
      padding :0 15px
      align-items :center
      background: #FFFFFF;
      box-shadow: 0 2px 16px 0 rgba(21,24,45,0.04);
      .left
        padding-right :6px
      .right
        flex: 1
        height :36px
        margin :12px 0
        background: #FFFFFF;
        border-1px($color-line, 4px)
        display :flex
        padding :0 12px
        align-items :center
        .input-wrapper
          height :28px
          flex: 1
          outline :none
        .number-wrapper
          display :flex
          padding-left :12px
          font-size: 12px;
          color: #666666;
          align-items :center

</style>
