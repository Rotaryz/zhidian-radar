<template>
  <section class="search-box">
    <div class="input-box" @click="clickHandler">
      <img class="icon" src="./icon-search@3x.png" alt=""/>
      <span class="txt">客户姓名</span>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    methods: {
      clickHandler() {
        this.$emit('toNav')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search-box
    background-color: #F7F7F7
    border-bottom-1px(#E1E1E1)
    padding: 7px 12px
    .input-box
      height: 36px
      layout(row)
      background: #FFF
      justify-content: center
      align-items: center
      border-radius: 4px
      border-1px($color-line, 4px)
      .icon
        width: 14.7px
        height: 14.6px
        margin-right: 5px
      .txt
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #979797

</style>
