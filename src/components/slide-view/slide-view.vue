<template>
  <div class="slide-item" @touchstart="touchBegin" @touchend="touchEnd" @touchmove="touchMove">
    <div class="content">
      <div class="main-content">
        <slot name="content"></slot>
      </div>
    </div>
    <div class="del-box" :style="styles" v-if="useType===1">
      <div class="del-btn" @click.stop="grouping(item)">分组</div>
    </div>
    <div class="del-box" :style="styles" v-if="useType===2">
      <div class="del-btn" @click.stop="grouping(item)">分组</div>
    </div>
    <div class="del-box" :style="styles" v-if="useType===2">
      <div class="del-btn" @click.stop="del(item)">删除</div>
    </div>
    <div class="del-box" :style="styles" v-if="useType===3">
      <div class="del-btn" @click.stop="del(item)">删除</div>
    </div>
    <div v-if="useType===4">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    // props: ['index', 'showIdx'],
    props: {
      index: Number,
      showIdx: Number,
      useType: {
        type: Number,
        default: 2
      },
      item: {
        type: Object,
        default: {}
      },
      // 是否需要出发函数后收起
      hasFn: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        startX: '',
        endX: '',
        endY: '',
        moveStart: '',
        show: false,
        styles: '',
        timeStamp: 0
      }
    },
    methods: {
      touchBegin(e) {
        this.timeStamp = e.timeStamp
        this.$emit('touchBegin', this.index, this.item)
        this.startX = e.touches[0].clientX
        this.moveStart = this.startX
      },
      touchEnd(e) {
        this.$emit('touchEnd', this.index, this.item)
        this.endX = e.changedTouches[0].clientX
        // this.endY = e.changedTouches[0].clientY
        // if (this.endY > this.endX) {
        //   this.styles = 'width: 0px; transition: all .3s'
        //   return
        // }
        if (this.endX === this.startX) return
        let differ
        if (this.show) {
          differ = this.endX - this.startX
          if (differ > 0) {
            this.styles = 'width: 0px; transition: all .3s ease-out'
            this.show = false
          } else {
            this.styles = 'width: 70px; transition: all .3s ease-out'
            this.show = true
          }
        } else {
          differ = (this.startX - this.endX) / 2
          if (differ <= 70) {
            this.styles = 'width: 0px; transition: all .3s ease-out'
            this.show = false
          } else {
            this.styles = 'width: 70px; transition: all .3s ease-out'
            this.show = true
          }
        }
      },
      touchMove(e) {
        let moveEnd = e.changedTouches[0].clientX
        // let moveEndY = e.changedTouches[0].clientY
        // if (e.timeStamp - this.timeStamp > 500 && moveEndY > moveEnd) {
        //   console.log(e.timeStamp - this.timeStamp)
        //   return
        // }
        // this.endY = e.changedTouches[0].clientY
        // if (this.endY > this.endX && e.timeStamp - this.timeStamp > 200) {
        //   this.styles = 'width: 0px; transition: all .3s'
        //   return
        // }
        if (moveEnd === this.moveStart) return
        let differ, width
        if (this.show && moveEnd > this.moveStart) {
          differ = (moveEnd - this.moveStart) * 2
          width = 70 - differ
          this.styles = `width: ${width > 0 ? width : 0}px`
        } else if (this.show && moveEnd < this.moveStart) {
          differ = (this.moveStart - moveEnd) / 3
          width = differ + 70
          this.styles = `width: ${width}px`
        } else {
          differ = (this.moveStart - moveEnd) / 2
          width = differ
          this.styles = `width: ${width}px`
        }
        // this.moveStart = moveEnd
      },
      del(item) {
        this.$emit('del', this.index, item)
        console.log(this.hasFn)
        if (this.hasFn) return
        this.styles = 'width: 0px; transition: all .3s ease-out'
        this.show = false
      },
      grouping(item) {
        this.$emit('grouping', this.index, item)
        this.styles = 'width: 0px; transition: all .3s ease-out'
        this.show = false
      },
      _itemInit(animation = true) {
        this.styles = `width: 0px; transition: ${animation ? 'all .3s ease-out' : ''}`
        this.show = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .slide-item
    width: 100vw
    height: 100%
    background: white
    overflow: hidden
    display: flex
    .content
      flex: 1
      height: 100%
      justify-content: flex-end
      overflow: hidden
      position: relative
      .main-content
        width: 100vw
        height: 100%
        white-space: nowrap
        position: absolute
        right: 0
        bottom: 0
        display: flex
        justify-content: space-between
    .del-box
      width: 0
      height: 100%
      background: #ccc
      overflow: hidden
      position: relative
      &:last-child
        background: #F94346
      .del-btn
        width: 70px
        height: 100%
        position: absolute
        left: 0
        bottom: 0
        layout()
        justify-content: center
        align-items: center
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-white


</style>
