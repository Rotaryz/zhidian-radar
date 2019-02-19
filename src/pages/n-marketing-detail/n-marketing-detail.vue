<template>
  <div class="n-marketing-detail">
    <section class="scroll-wrapper">
      <scroll class="market-ai"
              bcColor="#f0f5ff"
      >
        <market-header></market-header>
        <market-choice @income="incomeHandle"></market-choice>
      </scroll>
    </section>
    <market-button></market-button>
    <selector-view ref="selector" @submit="submitHandle"></selector-view>
  </div>
</template>

<script type=text/ecmascript-6>
  import Scroll from 'components/scroll/scroll'
  import MarketHeader from './market-header/market-header'
  import MarketChoice from './market-choice/market-choice'
  import MarketButton from './market-button/market-button'
  import SelectorView from 'components/selector-view/selector-view'
  import * as Helpers from '@/store/helpers'
  import {CONFIG} from './config-detail'
  import {MARKET_TYPE} from 'utils/constant'

  const PAGE_NAME = 'N_MARKETING_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      Scroll,
      MarketHeader,
      MarketChoice,
      MarketButton,
      SelectorView
    },
    data() {
      return {
        couponList: []
      }
    },
    computed: {
      ...Helpers.marketComputed,
      CONFIG() {
        let key = this.marketData.type || MARKET_TYPE.DIY
        return CONFIG[key] || {}
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      ...Helpers.marketMethods,
      async _initPage() {
        let id = +this.$route.query.id
        if (id && !this.marketData.id) {
          await this.requestMarketData({id})
        }
      },
      incomeHandle(idx) {
        let type = this.CONFIG.choicesArr[1].incomeArr[idx].type
        this.$refs.selector.showModel(type)
      },
      submitHandle(item) {
        console.log(item)
        let benefit = [
          {
            benefit_id: item.id,
            recommend_benefit_id: item.recommend_coupon_id,
            name: item.coupon_name,
            start_at: item.start_at,
            end_at: item.end_at,
            image_url_thumb: '',
            coupon_range_type_str: item.range_type_str,
            coupon_denomination: item.denomination,
            coupon_type: item.coupon_type,
            coupon_condition_str: item.condition_str
          }
        ]
        this.updateBenefit(benefit)
      }
    }
  }
</script>

<style scoped lang=stylus rel=stylesheet/stylus>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  @import './market-detail.styl'

  .test-wrapper
    fill-box(fixed)
    background :rgba(0,0,0,0.4)
    z-index :100
    padding :15px
    .test
      height :100px
      background :#fff
      border: 1px solid #E9F0FE;
      box-shadow: 0 2px 8px 0 rgba(21,24,45,0.04);
      border-radius: 1.6vw
      box-sizing :border-box
      margin-bottom :20px
  .n-marketing-detail
    fill-box()
    z-index: 50
    background :$color-background
    .scroll-wrapper
      position :absolute
      top:0
      right:0
      left :0
      bottom :$button-height

</style>
