<template>
  <div class="mine">
    <Scroll :bcColor="'#f1f2f5'">
      <div class="ba-dark">
        <!--我的-->
      </div>
      <div class="mine-card">
        <div class="mine-card-bg">
          <div class="mind-card-left">
            <p class="buss-name">{{mine.department}}</p>
            <p class="peo-name">{{mine.name}}</p>
            <p class="peo-position">{{mine.position}}</p>
            <p class="peo-phone">{{mine.mobile}}</p>
          </div>
          <div class="mine-card-right">
            <div class="mine-header-box" :style="{'background-image': 'url('+ mine.avatar +')'}">
              <!--<img class="mine-header" :src="mine.avatar">-->
            </div>
            <router-link tag="p" to="mine/editCard" class="card">编辑名片</router-link>
          </div>
        </div>
      </div>
      <ul class="content-list">
        <li @click="navTo(item.src)" class="content-item" v-for="(item, index) in contentList" :key="index">
          <span class="text"><span class="item-logo" :class="item.name"></span>{{item.title}}</span>
          <span class="icon"></span>
        </li>
      </ul>
    </Scroll>
    <router-view @refresh="refresh"></router-view>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import {Business} from 'api'
  import {ERR_OK} from '../../common/js/config'
  import {mapGetters} from 'vuex'
  // import storage from 'storage-controller'

  const CONTENTLIST = [{title: '个人信息', src: 'mine/mine-info', name: 'user'}, {title: '查看名片', src: '/shareCard', name: 'see-card'}, {title: '我的产品', src: 'mine/goodList', name: 'goods'}, {title: '我的动态', src: 'mine/dynamicList', name: 'dynamic'}, {title: '我的报表', src: 'mine/my-data', name: 'data'}]

  export default {
    name: 'Mine',
    data() {
      return {
        contentList: CONTENTLIST,
        mine: {}
      }
    },
    created() {
      this.$emit('tabChange', '我的')
      this.getMine()
    },
    methods: {
      navTo(src) {
        if (src !== '/shareCard') {
          this.$router.push(src)
        } else {
          this.$router.push(src)
          if (this.ios) {
            setTimeout(() => {
              location.reload()
              location.reload()
            }, 200)
          }
        }
      },
      refresh() {
        this.getMine()
        // this.mine = storage.get('info', {})
      },
      getMine() {
        // if (storage.get('info')) {
        //   this.mine = storage.get('info')
        //   console.log(this.mine)
        //   return
        // }
        Business.myBusinessCard().then((res) => {
          if (res.error === ERR_OK) {
            this.mine = res.data
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'ios'
      ])
    },
    components: {
      Scroll
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .mine
    position: fixed
    background: $color-background
    z-index: 10
    left: 0
    right: 0
    bottom: 45px
    top: 0

  .ba-dark
    text-align: center
    color: $color-white
    width: 100vw
    font-size: $font-size-large
    font-family: $font-family-regular
    height: 15px

  .mine-card
    position: relative
    z-index: 100
    background-color: $color-white
    margin: 0 auto
    height: 50.67vw
    width: 92vw
    .mine-card-bg
      padding: 0 15px
      display: flex
      box-sizing: border-box
      justify-content: space-between
      background-size: cover
      bg-image('pic-card_bg')
      height: 100%
      width: 100%
      .mine-card-right, .mind-card-left
        height: 100%
      .buss-name
        margin-top: 5.33vw
        font-family: $font-family-regular
        font-size: $font-size-medium
        color: $color-white
      .peo-name
        margin-top: 8.27vw
        font-family: PingFangSC-Semibold
        font-size: $font-size-large-xx
        color: $color-white
      .peo-position
        font-family: $font-family-regular
        font-size: $font-size-small
        color: $color-white
        margin-top: 2.67vw
      .peo-phone
        margin-top: 9.33vw
        font-family: $font-family-regular
        font-size: $font-size-medium
        color: $color-white
      .mine-header-box
        height: 60px
        width: 60px
        margin-top: 4vw
        overflow: hidden
        background: $color-white
        background-repeat: no-repeat
        background-position: center
        background-size: cover
        border-1px($color-row-line, 0)
        .mine-header
          width: 100%
      .card
        font-family: $font-family-regular
        font-size: $font-size-medium
        color: #56BA15
        text-decoration: underline
        margin-top: 18.93vw

  .content-list
    background-color: $color-white
    width: 92vw
    margin: 15px auto 0
    padding-left: 15px
    box-sizing: border-box
    border-radius: 2px
    border-1px($color-row-line)
    .content-item
      font-family: $font-family-regular
      font-size: $font-size-medium
      color: $color-text
      height: 55px
      align-items: center
      display: flex
      padding-right: 15px
      box-sizing: border-box
      justify-content: space-between
      border-bottom-1px($color-row-line)
      &:last-child
        border-none()
      .icon
        icon-image('icon-pressed')
        width: 5px
        height: 10px
      .text
        display: flex
        align-items: center
      .item-logo
        margin-right: 10px
        height: 18px
        width: 18px
      .user
        icon-image('icon-perinfor')
      .see-card
        icon-image('icon-relaycard')
      .goods
        icon-image('icon-goods')
      .dynamic
        icon-image('icon-trends')
      .data
        icon-image('icon-myforms')
</style>

