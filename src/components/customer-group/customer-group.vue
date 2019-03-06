<template>
  <div class="customer-group">
    <ul class="container" :class="{'no-border':dataArray.length === 1, 'bg': dataArray.length === 0}">
      <template v-for="(item,index) in dataArray">
        <li v-if="index < 9"  :key="index" class="avatar-wrapper":style="avatarWrapperStyles">
          <div class="avatar" :class="{single: dataArray.length <= 1}">
            <img v-if="item && (item.avatar || item.image_url)" class="avatar-img" :src="item.avatar || item.image_url" alt="">
            <img v-else class="avatar-img" src="./pic-default_people@2x.png" alt="">
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'CUSTOMER_GROUP'
  const RATIO = [1, 0.5, 1 / 3]
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
      }
    },
    mounted() {
      console.log(this.dataArray)
    },
    computed: {
      avatarWrapperStyles() {
        let len = this.dataArray.length || 1
        let ratio = len <= 1 ? RATIO[0] : len <= 4 ? RATIO[1] : RATIO[2]
        ratio *= 100
        return `width:${ratio}%;height:0;padding-top:${ratio}%`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .customer-group
    width: 100%
    height :0
    padding-top :100%
    position :relative
    .container
      fill-box(absolute)
      background: #E6E6E6;
      border: 1px solid #EBEBEB;
      border-radius: 4px;
      overflow :hidden
      box-sizing :border-box
      .avatar-wrapper
        float: left
        position :relative
        .avatar
          fill-box(absolute)
          border :1px solid #efefef
          &.single
            border :none
          .avatar-img
            display :inline-block
            font-size :0
            width :100%
            height :100%
            object-fit :cover
    .no-border
      border: 0
    .bg
      border: 2px solid #F2F2F2
      icon-image(pic-nogroup)
</style>
