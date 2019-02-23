<template>
  <footer class="market-button border-top-1px" @click="submitHandle">
    <div class="button">{{CONFIG.submitButton && CONFIG.submitButton.text}}</div>
  </footer>
</template>

<script type="text/ecmascript-6">
  import * as Helpers from '@/store/helpers'
  import {MARKET_TYPE} from 'utils/constant'

  const COMPONENT_NAME = 'MARKET_BUTTON'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        nowTime: 0
      }
    },
    computed: {
      ...Helpers.marketComputed
    },
    methods: {
      ...Helpers.marketMethods,
      submitHandle() {
        if (Date.now() - this.nowTime < 100) return
        this.nowTime = Date.now()
        this._check(async () => {
          let id = +this.$route.query.id
          let method = id ? this.CONFIG.submitButton.fn : this.CONFIG.submitButton.defaultFn
          let flag = await this[method]()
          if (!flag) return
          this.$parent.$emit('refresh')
          this.$router.back()
        })
      },
      _check(cb) {
        let marketData = this.marketData
        let checkArr = []
        let flag = false
        if (+this.marketData.type === +MARKET_TYPE.DIY || !+this.$route.query.id) {
          flag = marketData.name.trim()
          !flag && checkArr.push('请输入活动名称')
        }
        this.CONFIG.checkArr.forEach((item) => {
          switch (item) {
            case 'hasGroup':
              flag = marketData.group && marketData.group.length
              !flag && checkArr.push('请选择人群')
              break
            case 'hasBenefit':
              flag = marketData.benefit && marketData.benefit.length
              !flag && checkArr.push('请选择权益')
              break
            default:
              break
          }
        })
        this._toast(checkArr, cb)
      },
      _toast(arr, cb) {
        if (!arr.length) {
          cb && cb()
          return
        }
        this.$toast.show(arr[0])
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  @import "../market-detail.styl"

  .market-button
    position :absolute
    bottom :0
    height :$button-height
    right :0
    left :0
    padding :0 15px
    background: #FFFFFF;
    line-height :@height
    z-index :60
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
</style>
