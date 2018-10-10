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
            <p class="down-txt"><span class="first-txt">现价：¥{{item.platform_price}}</span><span v-if="item.earn_money" class="earn">(赚￥{{item.earn_money}})</span></p>
            <p class="down-txt second"><span class="first-txt">库存：{{item.stock}}</span><span v-if="tabIdx != 0">销量：{{item.sale_count}}</span></p>
          </div>
          <div class="down-right">
            <div class="down-right-icon"  v-if="page === 'activity'" :class="showEdit ? 'active' : ''" @click.stop="showEditCover(item)"></div>
            <div class="down-right-icon"  v-if="item[`${page === 'team' && 'status'}`] * 1 === 0" :class="showEdit ? 'active' : ''" @click.stop="showEditCover(item)"></div>
            <div class="down-right-text" v-if="item[`${page === 'team' && 'status'}`] *1 === 1">已上架</div>
          </div>
        </div>
      </div>
      <div class="editor-box" :class="showEdit ? '' : 'hide'">
        <div class="editor-container">
          <div class="editor-content">
            <!--<div class="editor-item" @click.stop="itemEditor(item)">-->
              <!--<div class="item-icon edit"></div>-->
              <!--<div class="item-txt">编辑</div>-->
            <!--</div>-->
            <div class="editor-item" v-if="page === 'activity'" @click.stop="itemDown(item)">
              <div class="item-icon down"></div>
              <div class="item-txt">下架</div>
            </div>
            <div class="editor-item" v-if="page === 'team'" @click.stop="itemUp(item)">
              <div class="item-icon up"></div>
              <div class="item-txt">上架</div>
            </div>
            <!--<div class="editor-item" v-if="tabIdx == 2" @click.stop="itemDelete(item)">-->
              <!--<div class="item-icon del"></div>-->
              <!--<div class="item-txt">删除</div>-->
            <!--</div>-->
          </div>
          <div class="editor-arrow"></div>
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
          width: 100%
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .right-down
          width: 46vw
          display: flex
          justify-content: space-between
          align-items: flex-end
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
                margin-left: 3px
                letter-spacing: 0.3px
                color: $color-F9543C
            .second
              margin-top: 5px
              display: flex
              justify-content: space-between
          .down-right
            width: 13.2vw
            height: 5.3vw
            margin-left: 6vw
            position: absolute
            right: 3vw
            bottom: 16px
            .down-right-icon
              width: 10.6vw
              height: 5.3vw
              icon-image('./pic-more')
            .down-right-text
              font-size: 14px
              color: $color-20202E
            .down-right-icon.active
              icon-image('./pic-more_click')
    .editor-box
      position: absolute
      height: 55px
      right: 17vw
      bottom: 9px
      width: 110px
      overflow: hidden
      transition: all 0.3s
      .editor-container
        display: flex
        align-items: flex-end
        height: 100%
        position: absolute
        right: 0
        top: 0
        transition: all 0.3s
        .editor-content
          background: rgba(32,32,46, 0.8)
          box-shadow: 0 1px 10px 0 rgba(54,53,71,0.50)
          border-radius: 2px
          height: 100%
          padding: 0 10px
          display: flex
          .editor-item
            width: 40px
            height: 100%
            display: flex
            flex-direction: column
            align-items: center
            justify-content: center
            .item-icon
              width: 17px
              height: 17px
              margin-bottom: 9px
              &.edit
                icon-image('./icon-compile_kj')
              &.del
                icon-image('./icon-delete')
              &.down
                icon-image('./icon-offline')
              &.up
                icon-image('./icon-online')
            .item-txt
              font-size: $font-size-10
              font-family: $font-family-regular
              color: $color-white
        .editor-arrow
          width: 0
          height: 0
          border-width: 5px 0 5px 5px
          border-style: solid
          border-color: transparent transparent transparent rgba(0, 0, 0, 0.8)/*透明 灰 透明 透明 */
          margin-bottom: 12px

      .hide.editor-container
        right: -100%
    .editor-box.hide
      width: 0
</style>
