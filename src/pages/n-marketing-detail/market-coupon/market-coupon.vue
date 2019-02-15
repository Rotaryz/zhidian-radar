<template>
  <div class="market-coupon">
    <div class="container">
      <section class="left">
        <div class="top">
          <p v-if="info.coupon_type === 3" class="unit">¥</p>
          <p class="number">{{info.coupon_denomination}}</p>
          <p v-if="info.coupon_type === 4" class="unit">折</p>
        </div>
        <div class="bottom">{{info.coupon_condition_str}}</div>
      </section>
      <section class="right">
        <ul class="wrapper">
          <li class="title">{{info.name}}</li>
          <li class="explain">{{info.coupon_range_type_str}}</li>
          <li class="explain">有效期{{info.start_at}}至{{info.end_at}}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'MARKET_COUPON'

  export default {
    name: COMPONENT_NAME,
    props: {
      info: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .market-coupon
    position: relative
    width: 100%
    height :0
    padding-top :24.137931034482758%
    icon-image(pic-coupon_xq)
    .container
      fill-box(absolute)
      layout(row,block,nowrap)
      .left
        flex: 1
        overflow :hidden
        layout()
        align-items :center
        justify-content :center
        .top
          layout(row,block,nowrap)
          align-items :flex-end
          justify-content :center
          font-family: DINAlternate-Bold;
          color: #F94346;
          overflow :hidden
          line-height :1
          .unit
            font-size: 3.8vw
            position :relative
            bottom :0.6vw
          .number
            margin :0 1px
            font-size: 7.333333333333334vw
            no-wrap()
        .bottom
          margin-top :1.8vw
          font-family: $font-family-regular
          font-size: 2.6vw
          color: #333333;
          text-align: center;
          line-height: 1
          no-wrap()
      .right
        flex: 2.7060702875399363
        overflow :hidden
        .wrapper
          height :100%
          padding : 2.933333333333333vw
          box-sizing :border-box
          layout(column,block,nowrap)
          line-height: 1
          font-family: $font-family-regular
          justify-content :space-between
          overflow :hidden
          .title
            font-size: 4.266666666666667vw
            color: #333333;
            letter-spacing: 0.34px;
            no-wrap()
          .explain
            font-size: 2.933333333333333vw
            color: #666666;
            letter-spacing: 0.28px;
            no-wrap()
</style>
