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
    <selector-view ref="selector" buttonText="确定" @submit="submitHandle"></selector-view>
  </div>
</template>

<script type=text/ecmascript-6>
  import Scroll from 'components/scroll/scroll'
  import MarketHeader from './market-header/market-header'
  import MarketChoice from './market-choice/market-choice'
  import MarketButton from './market-button/market-button'
  import SelectorView from 'components/selector-view/selector-view'
  import * as Helpers from '@/store/helpers'
  import {Client} from 'api'

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
        couponList: [],
        chooseType: ''
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
      async _initPage() {
        let id = +this.$route.query.id
        if (isNaN(id) || !id) {
          await this.requestMarketData()
        }
        if (id && !this.marketData.id) {
          await this.requestMarketData({id})
        }
        this._getGroupInfo()
      },
      _getGroupInfo() {
        let {groupName, groupId} = this.$route.query
        if (!groupId) return
        let data = {
          page: 1,
          limit: 9,
          group_id: groupId
        }
        Client.getGroupCustomerList(data).then(res => {
          if (res.error === this.$ERR_OK) {
            let group = [{
              group_id: groupId,
              group_name: groupName,
              cover_count: res.meta.total,
              group_desc: '',
              customers: res.data
            }]
            this.updateGroup(group)
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      incomeHandle(idx, chooseType) {
        let type = ''
        if (chooseType === 'group') {
          type = this.CONFIG.choicesArr[0].groupArr[idx].type
        } else {
          type = this.CONFIG.choicesArr[1].incomeArr[idx].type
        }
        this.$refs.selector.showModel(type)
        this.chooseType = chooseType
      },
      submitHandle(item) {
        if (!item.id) return
        if (this.chooseType === 'group') {
          let group = [{
            group_id: item.id,
            group_name: item.name,
            cover_count: item.total,
            group_desc: '',
            customers: item.customers
          }]
          this.updateGroup(group)
        } else {
          let benefit = [
            {
              benefit_id: item.id || item.activity_id,
              recommend_benefit_id: item.recommend_coupon_id || item.recommend_activity_id,
              name: item.coupon_name || item.goods_title,
              start_at: item.start_at,
              end_at: item.end_at,
              image_url_thumb: item.image_url_thumb,
              activity_type: item.rule_id,
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
