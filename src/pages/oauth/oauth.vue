<template>
  <div class="oauth">
    <!--<img class="loading" src="./loading.gif" alt="" width="20" height="20" v-if="!errorMsg">-->
    <!--<div class="error" v-if="errorMsg">{{errorMsg}}</div>-->
    <img v-if="!errorMsg" width="20" height="20" class="loading" src="./loading.gif" alt="" >
    <section v-if="errorMsg" class="error">
      <div class="icon"></div>
      <p>员工不存在</p>
    </section>
  </div>
</template>

<script>
  import Oauth from 'common/js/oauth'
  import {Jwt} from 'api'
  import storage from 'storage-controller'
  import {ERR_OK} from 'common/js/config'
  import utils from 'common/js/utils'

  const NORMAL_ROUTE = '/radar'
  const COMPONENT_NAME = 'Oauth'
  const oauth = new Oauth()

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        type: '',
        coverShow: false,
        errorMsg: ''
      }
    },
    created() {
      this._checkAuthorize()
    },
    computed: {
      code() {
        return this.$route.query.code || ''
      },
      hasToken() {
        return storage.has('token')
      },
      beforeLoginRoute() {
        return storage.get('beforeLoginRoute')
      }
    },
    methods: {
      // 微店-企业微型
      // _checkAuthorize() {
      //   if (this.code && !this.hasToken) {
      //     // 有code没有token -> 申请拿token
      //     this._applyOauth()
      //   } else if (!this.hasToken && !this.code) {
      //     this._getCode()
      //   } else {
      //     this.$router.replace(NORMAL_ROUTE)
      //   }
      // },
      // 智店-公众号
      _checkAuthorize() {
        const message = this.$route.query.message
        if (message) {
          this.coverShow = true
          this.errorMsg = message
          return
        }
        const accessToken = this.$route.query.access_token
        if (accessToken) {
          storage.set('token', accessToken)
          Jwt.getEmployeeInfo().then((res) => {
            if (res.error === ERR_OK) {
              storage.set('info', res.data)
              this.$router.replace(NORMAL_ROUTE)
            }
          })
        } else {
          !storage.get('token') && window.location.replace(oauth.oauthUri)
        }
      },
      _getCode() {
        window.location.replace(oauth.oauthUri)
      },
      _applyOauth() {
        Jwt.employeeLogin(this.code).then((res) => {
          if (res.error !== ERR_OK) {
            // todo '跳去系统异常页面'
            utils._handleErrorType(this.code)
            return
          }
          const {access_token: token, employee_info: info} = res.data
          storage.set('token', token)
          storage.set('info', info)
          this.$emit('login')
          // alert(token)
          this.$router.replace(this.beforeLoginRoute || NORMAL_ROUTE)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .oauth
    fill-box()
    display: flex
    align-items: center
    justify-content: center
    z-index: 100
    background: $color-white
    .cover
      position: absolute
      z-index: 9999
      top: 42%
      left: 50%
      min-width: 200px
      max-width: 300px
      margin-left: -100px
      padding: 10px 0
      opacity: .9
      border-radius: 6px
      transition: all .5s ease-out
      text-align: center
      background-color: rgba(0, 0, 0, .8)
      .content
        line-height: 20px
        font-size: $font-size-medium
        color: $color-white

  .error
    margin-bottom :50%
    layout()
    justify-content :center
    align-items :center
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #888888;
    text-align: center;
    .icon
      width :162px
      height :117px
      icon-image(pic-staff)
      margin-bottom :20px

</style>
