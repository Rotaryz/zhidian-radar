<template>
  <div class="mine">
    <scroll :bcColor="'#f5f5f9'">
      <div class="mine-top">
        <div class="top-box">
          <div class="top-box-left">
            <img v-if="mine.avatar&&mine.avatar.length" class="mine-header" :src="mine.avatar">
            <img v-else class="mine-header" src="./pic-default_people@2x.png">
            <p class="peo-name">
              <span>{{mine.name}}</span><br />
              <span class="data">到期日期：至{{mine.merchant.expire_time | timeFormat}}</span>
            </p>
          </div>
          <div class="top-box-right" @click="toShareCard">
            <span class="code"></span>
          </div>
        </div>
        <div class="mine-shadow">
          <div class="mian-box">
            <div class="main">
              <div class="item-box">
                <div class="number">{{allDatas.module_e_count || 0}}</div>
                <div class="text">主力客户</div>
              </div>
              <div class="item-box">
                <div class="number">{{allDatas.order_count || 0}}</div>
                <div class="text">活跃度</div>
              </div>
              <div class="item-box">
                <div class="number">{{allDatas.per_money || 0}}</div>
                <div class="text">客单价</div>
              </div>
            </div>
          </div>
        </div>
        <div class="main-content">
          <h3 class="title">工作台</h3>
          <ul class="content-item">
            <li class="item" v-for="(item, index) in contentList" :key="index" @click="_goPage(item.src)">
              <span class="icon" :class="item.icon"></span>
              <span class="text">{{item.title}}</span>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <transition name="fade">
      <div class="cover" v-if="showCode">
        <div class="bg" @click="hideCode"></div>
        <div class="center-box">
          <div class="top">
            <img class="logo" :src="card.avatar" />
            <p class="name">{{card.name}}</p>
          </div>
          <div class="bottom">
            <img :src="card.qrcode" class="code">
            <p class="text">长按识别二维码进店逛逛</p>
          </div>
        </div>
      </div>
    </transition>
    <toast ref="toast"></toast>
    <router-view @refresh="refresh" v-if="show"></router-view>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Mine, Business } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import storage from 'storage-controller'
  import {mapGetters} from 'vuex'
  import Toast from 'components/toast/toast'

  const CONTENTLIST = [
    {title: '报表', src: 'mine/my-data', icon: 'myform'},
    {title: '话术', src: 'mine/useful-word', icon: 'useful'},
    {title: '微信', src: '', icon: 'weixin'},
    {title: '微信群', src: '', icon: 'group'}
  ]

  export default {
    name: 'Mine',
    data () {
      return {
        contentList: CONTENTLIST,
        mine: {},
        allDatas: {},
        show: true,
        count: 0,
        showCode: false,
        card: {name: '国颐堂', avatar: '', qrcode: ''}
      }
    },
    created () {
      this.$emit('tabChange', '我的')
      this.getMine()
      this.getMineData()
    },
    methods: {
      toShareCard() {
        // this.$router.push('/mine/shareCard')
        this.showCode = true
        this.card.avatar = storage.get('info').avatar
        this.card.name = storage.get('info').name
      },
      hideCode() {
        this.showCode = false
      },
      _goPage (src) {
        if (!src) {
          this.$toast.show('正在研发中・敬请期待')
          return
        }
        this.$router.push(src)
      },
      refresh () {
        this.mine = storage.get('info')
      },
      getMine () {
        this.mine = storage.get('info')
        Business.Myshop({is_hyaline: 0, path: '/pages/guide'}).then((res) => {
          if (res.data) {
            this.card.qrcode = res.data.image_url
          }
        })
      },
      getMineData() {
        Mine.getMineData({shop_id: this.$storage.get('info').shop_id}).then(res => {
          if (res.error === ERR_OK) {
            this.allDatas = res.data
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'ios'
      ]),
      userInfo() {
        return storage.get('info')
      },
      slide() {
        return 'slide'
      },
      tag() {
        switch (this.mine.role_id) {
          case 0:
            return '未知'
          case 1:
            return '店长'
          case 2:
            return '普通店员'
          case 3:
            return '财务'
        }
      }
    },
    filters: {
      timeFormat(val) {
        if (val) {
          let res = new Date(val * 1000).toLocaleDateString().replace(/\//g, '-')
          return res
        }
        return ''
      }
    },
    components: {
      Scroll,
      Toast
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  div
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box
  .mine
    position: fixed
    background: #f0f5ff
    z-index: 10
    left: 0
    right: 0
    bottom: 50px
    top: 0
  .mine-top
    bg-image('bg-my')
    padding: 25px 15px
    height: 172px
    background-size: 100% 100%
    box-sizing: border-box
    position: relative
    margin-bottom: 56px
    .top-box
      layout(row)
      align-items: center
      justify-content: space-between
      .top-box-left
        layout(row)
        align-items: center
        .mine-header
          width: 54px
          height: 54px
          display: block
          border-radius: 50%
          margin-right: 10px
          border: 2px solid rgba(255,255,255,0.30)
        .peo-name
          font-size: $font-size-16
          font-family: $font-family-medium
          color: $color-white
          width: 180px
          no-wrap()
          .data
            font-size: $font-size-12
            font-family: $font-family-regular
            margin-top: 10px
            display: inline-block
            opacity: .6
      .top-box-right
        layout(row)
        align-items: center
        .code
          icon-image('icon-code')
          width: 36px
          height: 36px
    .mine-shadow
      margin-top: 26px
      .mian-box
        box-shadow: 0 2px 16px 0 rgba(21,24,45,0.04)
        border-radius: 6px
        background: $color-white
        padding: 15px 15px 20px
        display: block
        border-1px(#D9F0FE, 12px)
        .main
          layout(row)
          align-items: center
          .item-box
            width: 33.33%
            text-align: center
            position: relative
            border-right-1px(#E1E1E1)
            &:after
              content: ''
              display: block
              background: #000
              height: 20px
              right: 0
              margin: auto
              col-center()
              position: absolute
            &:last-child:after
              width: 0
              border: 0
            .number
              color: #333
              font-family: $font-family-bold
              font-size: $font-size-18
              margin-bottom: 14px
            .text
              color: #333
              font-family: $font-family-regular
              font-size: $font-size-12


    .main-content
      box-shadow: 0 2px 16px 0 rgba(21,24,45,0.04)
      border-radius: 6px
      background: $color-white
      padding: 15px 15px 20px
      display: block
      border-1px(#D9F0FE, 12px)
      margin-top: 10px
      .title
        color: #333
        font-size: $font-size-16
        font-family: $font-family-medium
      .content-item
        padding: 30px 0
        height: 200px
        .item
          width: 25%
          display: flex
          flex-direction: column
          align-items: center
          justify-content: center
          float: left
          .icon
            width: 32px
            height: 32px
          .myform
            icon-image(icon-statement)
          .useful
            icon-image(icon-talk)
          .weixin
            icon-image(icon-wechat_my)
          .group
            icon-image(icon-wechatgroup)
          .text
            font-family: $font-family-regular
            font-size: $font-size-14
            color: #333
            margin-top: 10px
            display: block

  .cover
    position: fixed
    z-index: 20
    left: 0
    right: 0
    bottom: 0
    top: 0
    overflow :hidden
    display :flex
    align-items :center
    justify-content :center
    .bg
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      background: rgba(0,0,0,0.8)
    .center-box
      width: 80vw
      height: 106vw
      border-radius: 6px
      background: #FFF
      overflow: hidden
      position: relative
      .top
        width: 100%
        height: 32vw
        icon-image(pic-mycodebg)
        .logo
          width: 14vw
          height: 14vw
          border: 2px solid rgba(255,255,255,0.5)
          border-radius: 50px
          margin: 5.3vw auto 2vw
          display: block
        .name
          font-size: $font-size-16
          color: #FFF
          text-align: center
          padding: 0 5vw
          font-family: $font-family-medium
      .bottom
        height: 74vw
        .code
          width: 45vw
          height: 45vw
          margin: 10.6vw auto 0
          display: block
        .text
          font-family: $font-family-regular
          font-size: $font-size-14
          color: #999
          text-align: center
          margin-top: 5.3vw

</style>
