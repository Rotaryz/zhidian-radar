<template>
  <div class="market-card-button">
    <div v-for="(item, index) in dataArray" class="item-wrapper" @click="navHandle(item)">
      <img class="icon" :src="CARD_CONFIG[item.type].icon" alt="">
      <p class="text">{{CARD_CONFIG[item.type].text}}</p>
    </div>
    <div class="item-wrapper" @click="navHandle({})">
      <img class="icon" :src="CARD_CONFIG['ADD'].icon" alt="">
      <p class="text">{{CARD_CONFIG['ADD'].text}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {MARKET_TYPE} from 'utils/constant'
  import * as Helpers from '@/store/helpers'

  const COMPONENT_NAME = 'MARKET_CARD_BUTTON'

  const CARD_CONFIG = {
    [MARKET_TYPE.activeCustomer]: {
      icon: require('./icon-active_new@2x.png'),
      text: '活跃新客'
    },
    [MARKET_TYPE.boughtCustomer]: {
      icon: require('./icon-already@2x.png'),
      text: '已购客户'
    },
    'ADD': {
      icon: require('./icon-add@2x.png'),
      text: '添加'
    }
  }
  export default {
    name: COMPONENT_NAME,
    props: {
      dataArray: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        CARD_CONFIG
      }
    },
    methods: {
      ...Helpers.marketMethods,
      async navHandle(item = {}) {
        await this.requestMarketData(item)
        let url = this.$route.path + '/market-detail'
        this.$router.push(url)
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
