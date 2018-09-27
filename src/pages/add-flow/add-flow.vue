<template>
  <transition :name="slide">
    <div class="add-box">
      <div class="bottom-bg"></div>
      <div class="data-bottom">
        <div class="textarea-number">{{note.length}}<span>/500</span></div>
        <textarea class="data-area" v-model="note" @touchmove.stop maxlength="500" name="" id="" cols="30" rows="10"
                  placeholder="请输入备注"></textarea>
      </div>
      <div class="bottom-box">
        <div class="box-btn" @click="toBack">
          <div class="text">取消</div>
        </div>
        <div class="box-btn message-btn" @click="addFlow">
          <div class="text" >确定</div>
        </div>
      </div>
      <toast ref="toast"></toast>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {ClientDetail} from 'api'
  import {ERR_OK} from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import {mapGetters} from 'vuex'

  export default {
    name: 'add-flow',
    data() {
      return {
        note: '',
        id: '',
        flowId: '',
        subimt: false
      }
    },
    created () {
      this.id = this.$route.query.id
      this.flowId = this.$route.query.id
      console.log(this.id)
      console.log(this.flowId)
    },
    methods: {
      addFlow() {
        if (this.subimt) return
        this.subimt = true
        if (this.note.length === 0) {
          this.$refs.toast.show('跟进内容不能为空')
          return
        }
        ClientDetail.addFlowList(this.id, this.flowId, this.note).then((res) => {
          if (res.error === ERR_OK) {
            this.$refs.toast.show(res.message)
            setTimeout(() => {
              this.$emit('refresh')
              this.$router.back()
            }, 500)
          } else {
            this.subimt = false
            this.$refs.toast.show(res.message)
          }
        })
      },
      toBack() {
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
      Toast
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  *
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box
  .bottom-bg
    position: fixed
    width: 100%
    height: 100%
    z-index: 70
    top: 0
    left: 0
    background: #F0F2F5
  .add-box
    fill-box()
    z-index: 71
  .data-bottom
    padding: 15px
    position: relative
    z-index: 71
    .title
      font-size: $font-size-medium
      color: $color-text-88
      font-family: $font-family-regular
    .data-area
      margin-top: 10px
      width: 100%
      border-color: rgba(0, 0, 0, 0.1)
      padding: 10px 15px
      font-size: $font-size-medium
      color: #20202e
      font-family: $font-family-regular
      height: 185px
      outline:none
    .textarea-number
      position: absolute
      bottom: 25px
      right: 25px
      font-size: $font-size-small
      font-family: $font-family-regular
      color: #202020
      span
        color: #ddd


  .bottom-box
    layout(row)
    position: fixed
    left: 0
    bottom: 0
    height: 45px
    width: 100%
    z-index: 71
    .box-btn
      layout(row)
      background: #20202E
      width: 50%
      justify-content: center
      align-items: center
      .text
        font-size: $font-size-medium-x
        font-family: $font-family-regular
        color: #fff
    .message-btn
      background: #56BA15

</style>
