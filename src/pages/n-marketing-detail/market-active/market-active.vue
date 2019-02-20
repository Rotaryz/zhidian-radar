<template>
  <div class="market-active">
    <div class="container">
      <section class="left">
        <img class="pic" :src="info.image_url_thumb" alt="">
      </section>
      <section class="right">
        <p class="title">{{info.name}}</p>
        <p class="explain">有效期至{{info.end_at}}</p>
      </section>
      <img v-if="info.activity_type === 1" class="icon" src="./pic-label@2x.png" alt="">
      <img v-if="info.activity_type === 3" class="icon" src="./pic-label_kj@2x.png" alt="">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'MARKET_ACTIVE'

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

  .market-active
    position: relative
    width: 100%
    height :0
    padding-top :24.137931034482758%
    background: rgba(246,147,26,0.06)
    border: 1px solid rgba(246,147,26,0.2)
    border-radius :1.0666666666666667vw
    .container
      fill-box(absolute)
      layout(row,block,nowrap)
      align-items :center
      padding :0 3.2vw
      .icon
        width :8.799999999999999vw
        height :@width
        position :absolute
        top:0
        left :0
      .left
        width :14.666666666666666vw
        height :@width
        border-radius:0.5333333333333333vw
        overflow :hidden
        .pic
          width :100%
          height :100%
          object-fit :cover
      .right
        flex: 1
        height :100%
        font-family: $font-family-regular
        margin-left :2.666666666666667vw
        layout(column,block,nowrap)
        justify-content :space-around
        overflow :hidden
        line-height :1.2
        .title
          font-size: 4.266666666666667vw
          color: #333333;
          letter-spacing: 0.34px;
          no-wrap()
        .explain
          font-size: 3.2vw
          color: #666666;
          letter-spacing: 0.3px;
          no-wrap()


</style>
