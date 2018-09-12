<template>
  <div class="index">
    <div class="route-box">
      <router-view v-on:tabChange="_changeTab"/>
    </div>
    <div class="tab-box border-top-1px">
      <div class="tab-item" v-for="item in tabList" :key="item.id">
        <router-link :to="item.path" class="item-container">
          <img :src="'../../static/img/' + (item.id * 1 === tabIdx * 1 ? item.activeIcon : item.icon)" class="icon">
          <p class="icon-text">{{item.text}}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  const TABS = [
    {text: '雷达', path: '/', id: 1, icon: 'icon-radar_tabbar@3x.png', activeIcon: 'icon-radar_selected@3x.png'},
    {text: '消息', path: 'news', id: 2, icon: 'icon-news_tabbar@3x.png', activeIcon: 'icon-news_selected@3x.png'},
    {text: '客户', path: 'client', id: 3, icon: 'icon-customer_tabbar@3x.png', activeIcon: 'icon-customer_selected@3x.png'},
    {text: '我的', path: 'mine', id: 4, icon: 'icon-my_tabbar@3x.png', activeIcon: 'icon-my_selected@3x.png'}
  ]
  export default {
    name: 'Index',
    data() {
      return {
        tabList: TABS,
        tabIdx: ''
      }
    },
    created() {
    },
    methods: {
      _changeTab(idx) {
        this.tabIdx = idx
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .index
    width: 100vw
    height: 100vh
    display: flex
    flex-direction: column
    .route-box
      flex: 1
    .tab-box
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
            width: 20px
            height: 20px
            margin-bottom: 3px
          .icon-text
            font-family: $font-family-light
            font-size: $font-size-small-s
</style>
