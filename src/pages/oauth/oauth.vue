<template>
  <div class="oauth">
    <img class="loading" src="./loading.gif" alt="" width="20" height="20">
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
    created() {
      // this._checkAuthorize()
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
      _checkAuthorize() {
        if (this.code && !this.hasToken) {
          // 有code没有token -> 申请拿token
          this._applyOauth()
        } else if (!this.hasToken && !this.code) {
          this._getCode()
        } else {
          this.$router.replace(NORMAL_ROUTE)
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
</style>
