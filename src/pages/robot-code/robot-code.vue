<template>
  <transition :name="slide">
    <div class="robot-main-box">
      <Scroll bcColor="#fff">
        <div class="wechat-top">
          <div class="wechat-img">
            <img :src="wechatImg" alt="">
          </div>
          <div class="wehcat-text" v-if="loginStatus * 1 === 0">
            用机器人的微信账号扫描上方二维码(<span class="green">长按识别无效</span>)，重新登录微信机器人
          </div>
          <div class="wehcat-text wehcat-status"  v-if="loginStatus * 1 === 1">
            <span class="green">登录成功</span>
          </div>
          <div class="wehcat-text wehcat-status"  v-if="loginStatus * 1 === 2">
            登录失败
          </div>
        </div>
        <div class="f0f2f5"></div>
        <div class="wechat-bottom">
          <div class="wechat-title">如何让专属机器人更加稳定，不容易掉线？</div>
          <div class="wechat-noet">
            <div class="wechat-text">1.机器人微信账号不要退出微信登录，也不要在电脑上登录微信；
            </div>
          </div>
          <div class="wechat-noet">
            <div class="wechat-text">2.机器人手机不要长时间处于断网或关机状态；</div>
          </div>
          <div class="wechat-noet">
            <div class="wechat-text">3.7天左右定时查看登录机器人的手机微信存储量。</div>
          </div>
        </div>
      </Scroll>
      <router-view></router-view>
      <toast ref="toast"></toast>
      <div class="loding-box" v-show="loading">
        <img class="loading" src="./loading.gif" alt="" width="30" height="30">
      </div>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import {Mine} from 'api'
  import {ERR_OK} from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import storage from 'storage-controller'
  import {mapGetters} from 'vuex'

  export default {
    name: 'robot-code',
    data() {
      return {
        wechatImg: '',
        loading: true,
        loginStatus: 0,
        loginTime: 0,
        timerStatus: '',
        timerCode: ''
      }
    },
    created() {
      this.loginTime = 0
      this.getDataCode()
    },
    beforeRouteLeave(to, from, next) {
      this.$emit('refReshStatus')
      clearTimeout(this.timerStatus)
      clearTimeout(this.timerCode)
      next(true)
    },
    methods: {
      getDataCode() {
        Mine.getWechatLogin().then((res) => {
          if (res.error === ERR_OK) {
            this.getWechatLoginCodeData()
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      getWechatLoginCodeData() {
        Mine.getWechatLoginCode().then((res) => {
          if (res.error === ERR_OK) {
            if (res.data.wx_mock_image.length === 0) {
              this.timerCode = setTimeout(() => {
                this.getWechatLoginCodeData()
              }, 1000)
            } else {
              this.wechatImg = res.data.wx_mock_image
              this.loading = false
              this.getLoginStatus()
            }
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      getLoginStatus() {
        Mine.getWechatStatus().then((res) => {
          if (res.error === ERR_OK) {
            if (res.data.status * 1 === 0 && this.loginTime < 300) {
              this.loginTime++
              this.timerStatus = setTimeout(() => {
                this.getLoginStatus()
              }, 1000)
              this.loginStatus = 0
            } else if (res.data.status * 1 === 1) {
              this.loginStatus = 1
            } else if (res.data.status * 1 === 0 && this.loginTime >= 300) {
              this.loginStatus = 2
            }
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      onCopy(e) {
        this.$refs.toast.show('复制成功')
      },
      onError(e) {
        console.log('无法复制文本！')
      }
    },
    computed: {
      userInfo() {
        return storage.get('info')
      },
      ...mapGetters(['ios']),
      slide() {
        return this.ios ? '' : 'slide'
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

  .robot-main-box
    position: fixed
    background: $color-background
    z-index: 151
    left: 0
    right: 0
    bottom: 0
    top: 0

  .wechat-top
    padding: 25px 0 20px
    box-shadow: 0 2px 6px 0 rgba(43, 43, 145, 0.04)
    .wechat-img
      width: 160px
      height: 160px
      margin: 0 auto 17.5px
      img
        width: 100%
        height: 100%
    .wehcat-text
      padding: 0 35.5px
      font-size: $font-size-16
      font-family: $font-family-medium
      color: $color-20202E
      line-height: 24px
      text-align: justify
      .green
        color: $color-56BA15
    .wehcat-status
      text-align: center

  .f0f2f5
    height: 10px
    background: $color-F0F2F5
    width: 100%

  .wechat-bottom
    padding: 0 20px 20px 15px
    box-shadow: 0 2px 6px 0 rgba(43, 43, 145, 0.04)
    .wechat-title
      padding: 20px 0 15px
      font-size: $font-size-16
      font-family: $font-family-medium
      color: $color-20202E
    .wechat-noet
      margin-bottom: 10px
      line-height: 20px
      .wechat-text
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-888888
        text-align: justify
        .green
          color: $color-56BA15

  .loding-box
    background: rgba(255, 255, 255, .5)
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: 11
    .loading
      all-center()

  .w
    width: 100%
</style>
