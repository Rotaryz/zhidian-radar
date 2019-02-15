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
    <!--test-->
    <ul v-if=isShow class=test-wrapper>
      <li v-for="(item, index) in couponList" :key="index" class="test" @click="chooseHandle(item)">{{item.coupon_name}}</li>
    </ul>
  </div>
</template>

<script type=text/ecmascript-6>
  import Scroll from 'components/scroll/scroll'
  import MarketHeader from './market-header/market-header'
  import MarketChoice from './market-choice/market-choice'
  import MarketButton from './market-button/market-button'
  import * as API from 'api'
  import * as Helpers from '@/store/helpers'

  const PAGE_NAME = 'N_MARKETING_DETAIL'

  export default {
    name: PAGE_NAME,
    components: {
      Scroll,
      MarketHeader,
      MarketChoice,
      MarketButton
    },
    data() {
      return {
        isShow: false,
        couponList: []
      }
    },
    computed: {
      ...Helpers.marketComputed
    },
    created() {
      this._initPage()
    },
    methods: {
      ...Helpers.marketMethods,
      _initPage() {
        let id = +this.$route.query.id
        if (id !== this.marketData.id) {
          this.requestMarketData({id})
        }
      },
      incomeHandle(idx) {
        this.isShow = true
        this._test()
      },
      _test() {
        API.Marketing.getCouponList().then((res) => {
          this.couponList = res.data
          console.log(res.data)
        })
      },
      chooseHandle(item) {
        this.isShow = false
        let benefit = [
          {
            benefit_id: item.id,
            recommend_benefit_id: item.recommend_coupon_id,
            name: item.coupon_name,
            start_at: item.start_at,
            end_at: item.end_at,
            stock: '20',
            status: '1',
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
