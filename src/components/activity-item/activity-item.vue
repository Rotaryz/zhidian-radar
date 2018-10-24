<template>
  <div class="activity-item">
    <div class="item-content">
      <div class="item-left" :style="{backgroundImage: 'url(' + item.image_url + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}">
        <!--<div class="left-cover" :class="tabIdx == 1 ? '' : 'hide'">已下架</div>-->
      </div>
      <div class="item-right">
        <div class="right-title">{{item.goods_title}}</div>
        <div class="right-down">
          <div class="down-left">
            <p class="down-txt"><span class="first-txt">库存{{item.stock}}</span></p>
            <p class="down-txt second"><span class="first-txt"><i class="small">¥</i>{{item.platform_price}}</span><span v-if="item.earn_money" class="earn">(赚￥{{item.earn_money}})</span></p>
          </div>
          <div class="down-right">
            <div class="up" v-if="page === 'activity'" @click.stop="itemDown(item)">下架</div>
            <div class="down" v-if="page === 'team'" @click.stop="itemUp(item)">上架</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['tabIdx', 'item', 'showEdit', 'page'],
    data() {
      return {
      }
    },
    methods: {
      showEditCover(item) {
        this.$emit('showEdit', item)
      },
      itemEditor(item) {
        this.$emit('itemEditor', item)
      },
      itemDown(item) {
        this.$emit('itemDown', item)
      },
      itemDelete(item) {
        this.$emit('itemDelete', item)
      },
      itemUp(item) {
        this.$emit('itemUp', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .activity-item
    width: 100%
    background: $color-white
    position: relative
    .item-content
      width: 100%
      height: 100%
      box-sizing: border-box
      padding: 15px 10px
      display: flex
      align-items: center
      .item-left
        width: 18.666vw
        height: @width
        margin-right: 10px
        position: relative
        .left-cover
          position: absolute
          width: 100%
          height: 100%
          background: rgba(54,53,71,0.8)
          line-height: 18.666vw
          text-align: center
          color: $color-white
          font-size: $font-size-12
          font-family: $font-family-regular
          transition: all .3s
        .hide.left-cover
          opacity: 0
      .item-right
        flex: 1
        overflow: hidden
        height: 18vw
        display: flex
        flex-direction: column
        justify-content: space-between
        .right-title
          font-size: $font-size-16
          color: $color-20202E
          font-family: $font-family-regular
          letter-spacing: 0.8px
          width: 70%
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .right-down
          display: flex
          justify-content: space-between
          .down-left
            flex: 1
            overflow: hidden
            .down-txt
              font-family: $font-family-regular
              color: $color-888888
              font-size: $font-size-14
              letter-spacing: 0.6px
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              .earn
                font-size: 12px
                margin-left: 5px
                letter-spacing: 0.3px
                color: $color-F9543C
              .small
                font-style: normal
                font-size: 14px
            .second
              margin-top: 14px
              color: #010000
              font-size: $font-size-18
              display: flex
              align-items: center
          .down-right
            width: 16vw
            text-align: center
            .up,.down
              color: $color-white
              width: 14vw
              height: 6vw
              background: $color-20202E
              font-size: $font-size-14
              text-align: center
              line-height: 6vw
              border-radius: 20px
              margin: 0 auto
            .sale-count
              color: $color-888888
              font-size: $font-size-12
              margin-top: 5px
</style>
