<template>
  <div class="my-msg">
    <div class="container">
      <div class="list"><span class="type">微信号</span><input class="txt" type="text" v-model="weixin_no" placeholder="请输入微信号"></div>
      <div class="list"><span class="type">联系电话</span><input class="txt" type="text" v-model="mobile" placeholder="请输入手机号"></div>
    </div>
    <div class="footer-box">
      <div class="footer-btn" @click="saveMsg">保存</div>
    </div>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
  import { Mine } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import Toast from 'components/toast/toast'

  export default {
    name: 'OrderDetail',
    data() {
      return {
        mobile: '',
        weixin_no: ''
      }
    },
    created() {
      this._getMine()
    },
    methods: {
      saveMsg() {
        const REGPHONE = /(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}/
        // if (!this.weixin_no || this.weixin_no.replace(/^\s+|\s+$/g, '') === '') {
        //   this.$refs.toast.show('请输入微信号')
        //   return
        // }
        if (!this.mobile) {
          // this.$refs.toast.show('请输入手机号')
          // return
        } else if (!REGPHONE.test(this.mobile)) {
          this.$refs.toast.show('输入的手机号格式不正确')
          return
        }
        let data = {
          mobile: this.mobile,
          weixin_no: this.weixin_no
        }
        Mine.saveMsg(data)
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.$refs.toast.show('保存成功')
            setTimeout(() => {
              this.$router.back()
            }, 1000)
          })
      },
      _getMine () {
        Mine.getMyData().then((res) => {
          if (res.error === ERR_OK) {
            this.mobile = res.data.mobile
            this.weixin_no = res.data.weixin_no
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      }
    },
    computed: {
    },
    watch: {
      mobile(val, oldVal) {
        val = val.match(/\d{0,11}/) ? val.match(/\d{0,11}/)[0] : ''
        this.mobile = val
      },
      weixin_no(val, oldVal) {
        val = val.match(/[^\u4e00-\u9fa5]+/) ? val.match(/[^\u4e00-\u9fa5]+/) : ''
        this.weixin_no = val[0] ? val[0].replace(/^\s+|\s+$/g, '') : val
      }
    },
    components: {
      Toast
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .my-msg
    position: fixed
    z-index: 10
    left: 0
    right: 0
    bottom: 0
    top: 0
    background: $color-F0F2F5
    font-size: 14px
    font-family: $font-family-regular
    .container
      padding: 0 15px
      background: $color-white
      border-bottom-1px(#ECEDEF)
    .list
      height: 55px
      display: flex
      align-items: center
      color: $color-20202E
      border-bottom-1px(#E5E5E5)
      .type
        width: 85px
      .txt
        outline: none
        &::-webkit-input-placeholder
          color: $color-ccc
    .footer-box
      position: fixed
      width: 100vw
      height: 44.5px
      z-index: 60
      bottom: 0
      left: 0
      background: $color-white
      box-sizing: border-box
      .footer-btn
        width: 100%
        height: 100%
        background: $color-20202E
        line-height: 44.5px
        text-align: center
        font-family: $font-family-regular
        color: $color-white
        font-size: $font-size-16
        letter-spacing: 0.8px
</style>
