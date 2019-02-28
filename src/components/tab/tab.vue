<template>
  <div class="tab border-top-1px">
    <router-link tag="div" v-for="(item, index) in tabList" :key="index" :to="item.path" class="tab-item">
      <div class="item-container">
        <div  class="icon" :class="item.iconClass">
          <div class="red-block" v-if="index == 1 && hasNoRead"></div>
        </div>
        <p class="icon-text">{{item.text}}</p>
      </div>
    </router-link>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  const COMPONENT_NAME = 'Tab'
  const TABS = [
    {text: '雷达', path: '/radar', id: 1, iconClass: 'icon-radar'},
    {text: '消息', path: '/news', id: 2, iconClass: 'icon-news'},
    {text: '营销', path: '/market', id: 3, iconClass: 'icon-market'},
    {text: '客户', path: '/client', id: 4, iconClass: 'icon-client'},
    {text: '我的', path: '/mine', id: 5, iconClass: 'icon-mine'}
  ]
  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        tabList: TABS
      }
    },
    computed: {
      ...mapGetters([
        'hasNoRead'
      ])
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
    height: 50px
    background: $color-white
    display: flex
    .tab-item
      flex: 1
      overflow: hidden
      height: 50px
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
          width: 21px
          height: 21px
          margin-bottom: 5px
          background-size: 20px 20px
          position: relative
          .red-block
            position: absolute
            width: 6px
            height: 6px
            border: 1px solid $color-white
            border-radius: 50%
            background: $color-red
            top: -2px
            right: -1px
          &.icon-radar
            icon-image('./icon-radar')
          &.icon-news
            icon-image('./icon-news')
          &.icon-market
            icon-image('./icon-marketing')
          &.icon-client
            icon-image('./icon-customer')
          &.icon-mine
            icon-image('./icon-mine')
        .icon-text
          font-family: $font-family-regular
          color: #15182D
          font-size: $font-size-10
      &.router-link-active .item-container
        .icon-radar
          icon-image('./icon-radar_pressed')
        .icon-news
          icon-image('./icon-news_pressed')
        .icon-market
          icon-image('./icon-marketing_pressed')
        .icon-client
          icon-image('./icon-customer_pressed')
        .icon-mine
          icon-image('./icon-mine_pressed')
        .icon-text
          color: $color-main
</style>
