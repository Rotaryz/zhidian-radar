<template>
  <div class="cliten-box">
    <div class="cliten-con">
      <img :src="clientData.image_url" class="logo" :style="{borderColor: pnes[clientData.pnes || 'd']}" alt="">
      <div class="label-name">{{clientData.name}}</div>
      <div class="text">{{clientData.sources}}</div>
      <div class="data">
        <div class="item">
          <span class="num">{{clientData.active_values || 0}}</span>
          <span class="text">活跃指数</span>
        </div>
        <div class="item">
          <span class="num">{{clientData.rfm_values || 0}}</span>
          <span class="text">RFM指数</span>
        </div>
        <div class="item">
          <span class="num">{{clientData.kol_values || 0}}</span>
          <span class="text">KOL指数</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {PNES_COLOR} from 'common/js/pnes'
  export default{
    name: 'detail-msg',
    props: {
      clientData: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        pnes: PNES_COLOR
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  div
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box
  .cliten-box
    position: relative
    width: 100%
    height: 100%
    border-radius: 6px
    background: #FFF
    box-shadow: 0 2px 20px 0 rgba(21,24,45,0.1)
    .cliten-con
      width: 100%
      height: 100%
      padding: 20px 0
      box-sizing: border-box
      position: relative
      .logo
        width: 55px
        height: 55px
        object-fit: cover
        border-radius: 50%
        padding: 2px
        border: 2px solid #FFF
        position: absolute
        background-color: #FFF
        left: 50%
        top: 0
        transform: translate(-50%, -50%)
      .label-name,.text
        text-align: center
        margin-top: 18px
        font-family: $font-family-medium
        color: #333
        font-size: $font-size-16
      .text
        font-size: $font-size-12
        font-family: $font-family-regular
        color: #949494
        margin-top: 7px


      .data
        margin-top: 20px
        color: #333
        font-family: $font-family-regular
        font-size: $font-size-10
        display: flex
        align-items: center
        .item
          flex: 1
          overflow: hidden
          position: relative
          text-align: center
          border-right-1px(#F0F0F0)
          &:after
            position: absolute
            right: 0
            height: 30px
            col-center()
          .num
            font-family: DIN-Regular
            font-size: $font-size-18
            margin-bottom: 10px
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis
            display: block

</style>
