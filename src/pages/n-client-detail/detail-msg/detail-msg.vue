<template>
  <div class="cliten-box">
    <div class="cliten-con">
      <img :src="clientData.image_url" class="logo" :style="{borderColor: pnes.n}" alt="">
      <div class="label-name">{{clientData.name}}</div>
      <div class="text">{{clientData.sources}}</div>
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
      },
      labelList: {
        type: Array,
        default: []
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
      padding: 15px
      position: relative
      .logo
        width: 55px
        height: 55px
        object-fit: cover
        border-radius: 50%
        padding: 2px
        border: 2px solid #fff
      .cliten-con-bg
        position: absolute
        display: block
        width: 100%
        height: 100%
        left: 0px
        top: 0px
        z-index: 0

</style>
