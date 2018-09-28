<template>
  <div class="service-item">
    <div class="item-content">
      <div class="item-left" :style="{backgroundImage: 'url(' +  + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}">
        <div class="left-cover" :class="tabIdx == 2 ? '' : 'hide'">已下架</div>
      </div>
      <div class="item-right">
        <div class="right-title">较好的附件汇丰晋亨弗交话费和继父回家发好多件返回的海沸江翻活动经费的</div>
        <div class="right-down">
          <div class="down-left">
            <p class="down-txt"><span class="first-txt">现价：¥88.00</span><span class="earn">(赚￥9.50)</span></p>
            <p class="down-txt second"><span class="first-txt">库存：550</span><span v-if="tabIdx != 0">销量：888</span></p>
          </div>
          <div class="down-right">
            <div class="down-right-icon" :class="showEdit ? 'active' : ''" @click.stop="showEditCover(item)"></div>
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
            <div class="editor-item" v-if="page === 'myService'" @click.stop="itemDown(item)">
              <div class="item-icon down"></div>
              <div class="item-txt">下架</div>
            </div>
            <div class="editor-item" v-if="page === 'shelf'" @click.stop="itemUp(item)">
              <div class="item-icon down"></div>
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
    created() {
      console.log(this.page, 'page', this.page === 'shelf')
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
        this.$emit('itemDelete', item)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .service-item
    width: 100%
    padding-top: 29%
    height: 0
    background: $color-white
    border-1px($color-col-line, 2px)
    position: relative
    .item-content
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      box-sizing: border-box
      padding: 15px 10px
      display: flex
      align-items: center
      .item-left
        width: 18.666vw
        height: @width
        background: #ddd
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
          width: 51vw
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
            width: 10.6vw
            height: 5.3vw
            margin-left: 6vw
            position: absolute
            right: 3vw
            bottom: 16px
            .down-right-icon
              width: 10.6vw
              height: 5.3vw
              icon-image('./icon-function')
            .down-right-icon.active
              icon-image('./icon-function_click')
    .editor-box
      position: absolute
      height: 55px
      right: 14.6vw
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
