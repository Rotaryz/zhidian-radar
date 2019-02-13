<template>
  <div class="market-card-button">
    <div v-for="(item, index) in CARD_LIST" class="item-wrapper">
      <img class="icon" :src="item.icon" alt="">
      <p class="text">{{item.text}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'MARKET_CARD_BUTTON'
  const CARD_LIST = [
    {
      icon: require('./icon-active_new@2x.png'),
      text: '活跃新客'
    },
    {
      icon: require('./icon-already@2x.png'),
      text: '已购客户'
    },
    {
      icon: require('./icon-add@2x.png'),
      text: '添加'
    }
  ]
  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        CARD_LIST
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .market-card-button
    width: 100%
    layout(row)
    .item-wrapper
      width :21.333333333333336vw
      height :26.666666666666668vw
      background: #FFFFFF;
      border: 1px solid #E9F0FE;
      box-shadow: 0 2px 8px 0 rgba(21,24,45,0.04);
      border-radius: 1.6vw
      margin-right :2.1333333333333333vw
      layout()
      justify-content :center
      align-items :center
      .icon
        width :12vw
        height :@width
      .text
        font-family: $font-family-regular
        font-size: 3.2vw
        color: #9FA7B3;
        margin-top :2.1333333333333333vw
        line-height: @font-size
</style>
