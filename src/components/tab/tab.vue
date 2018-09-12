<template>
  <div class="tab border-top-1px">
    <router-link tag="div" v-for="(item, index) in tabList" :key="index" :to="item.path" class="tab-item">
      <div class="item-container">
        <div  class="icon" :class="item.iconClass"></div>
        <p class="icon-text">{{item.text}}</p>
      </div>
    </router-link>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'Tab'
  const TABS = [
    {text: '雷达', path: '/radar', id: 1, iconClass: 'icon-radar'},
    {text: '消息', path: '/news', id: 2, iconClass: 'icon-news'},
    {text: '客户', path: '/client', id: 3, iconClass: 'icon-client'},
    {text: '我的', path: '/mine', id: 4, iconClass: 'icon-mine'}
  ]
  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        tabList: TABS
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .tab
    position: fixed
    bottom: 0
    width: 100vw
    height: 45px
    background: $color-white
    display: flex
    .tab-item
      flex: 1
      overflow: hidden
      height: 45px
      .item-container
        overflow: hidden
        width: 100%
        height: 100%
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        font-size: 0
        .icon
          display: block
          width: 20px
          height: 20px
          margin-bottom: 3px
          background-size: 20px 20px
          &.icon-radar
            bg-image('./icon-radar_tabbar')
          &.icon-news
            bg-image('./icon-news_tabbar')
          &.icon-client
            bg-image('./icon-customer_tabbar')
          &.icon-mine
            bg-image('./icon-my_tabbar')
        .icon-text
          font-family: $font-family-light
          font-size: $font-size-small-s
      &.router-link-active .item-container
        .icon-radar
          bg-image('./icon-radar_selected')
        .icon-news
          bg-image('./icon-news_selected')
        .icon-client
          bg-image('./icon-customer_selected')
        .icon-mine
          bg-image('./icon-my_selected')
</style>
