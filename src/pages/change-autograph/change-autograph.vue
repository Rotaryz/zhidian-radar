<template>
  <transition :name="slide">
    <div class="change-autograph">
      <scroll ref="scroll">
        <textarea name="autograph" v-model="title" maxlength="50"  @touchmove.stop placeholder="请输入签名内容" id="autograph"></textarea>
        <div class="text-num">
          <span class="text-dark">{{title.length}}</span>
          <span class="text-light">/50</span>
        </div>
      </scroll>
      <div class="btn">
        <div class="btn-item btn-dark" @click="_back">取消</div>
        <div class="btn-item btn-green" @click="_submit">确定</div>
      </div>
      <toast ref="toast"></toast>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Business } from 'api'
  import { ERR_OK } from 'common/js/config'
  import Toast from 'components/toast/toast'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'change-autograph',
    data () {
      return {
        title: ''
      }
    },
    created () {
      this.title = this.$store.state.signature
      console.log(this.title)
    },
    methods: {
      ...mapActions(['setSignature']),
      _submit () {
        Business.updateMySignature({signature: this.title}).then((res) => {
          if (res.error === ERR_OK) {
            this._back()
            this.setSignature(this.title)
            this.$emit('getSign')
            return
          }
          this.$refs.toast.show(res.message)
        })
      },
      _back () {
        this.$router.back()
      }
    },
    computed: {
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
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .change-autograph
    position: fixed
    background: $color-background
    z-index: 10
    left: 0
    right: 0
    bottom: 45px
    top: 0
    #autograph
      outline: none
      resize: none
      margin: 4vw
      border-radius: 2px
      background: $color-white
      height: 191px
      width: 92vw
      padding: 15px
      border: none
      box-sizing: border-box
      font-family: $font-family-regular
      font-size: $font-size-medium
      border-1px($color-col-line, 2px)
      &::-webkit-input-placeholder
        font-family: $font-family-regular
        font-size: $font-size-medium
        color: #CCCCCC
    .text-num
      position: absolute
      right: 30px
      bottom: 30px
      font-size: $font-size-small
      font-family: $font-family-regular
      .text-dark
        color: $color-text
      .text-light
        color: #CCCCCC

  .btn
    position: relative
    z-index: 10
    display: flex
    height: 45px
    .btn-item
      font-family: $font-family-regular
      font-size: $font-size-medium
      color: $color-white
      line-height: 45px
      text-align: center
      flex: 1
    .btn-dark
      background: $color-text
    .btn-green
      background: $color-56
</style>
