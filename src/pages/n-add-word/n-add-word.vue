<template>
  <transition :name="slide">
    <div class="add-box">
      <div class="data-bottom">
        <div class="textarea-number">{{note.length}}<span>/200</span></div>
        <textarea class="data-area" v-model="note" @touchmove.stop maxlength="200" name="" id="" cols="30" rows="10"
                  placeholder="请输入话术内容，最多200字"></textarea>
      </div>
      <div class="bot-btn" @click="addFlow">确定</div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {ClientDetail} from 'api'
  import {ERR_OK} from '../../common/js/config'
  import {mapGetters} from 'vuex'

  export default {
    name: 'add-word',
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
    },
    methods: {
      addFlow() {
        if (this.subimt) return
        this.subimt = true
        if (this.note.length === 0) {
          this.$toast.show('话术内容不能为空')
          return
        }
        ClientDetail.addFlowList(this.id, this.flowId, this.note).then((res) => {
          if (res.error === ERR_OK) {
            this.$toast.show(res.message)
            setTimeout(() => {
              this.$emit('refresh')
              this.$router.back()
            }, 500)
          } else {
            this.subimt = false
            this.$toast.show(res.message)
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
  .add-box
    fill-box()
    z-index: 71
    background: #f0f5ff
  .data-bottom
    padding: 15px 12px 0
    position: relative
    z-index: 71
    .title
      font-size: $font-size-medium
      color: $color-text-88
      font-family: $font-family-regular
    .data-area
      width: 100%
      border-color: #E1E1E1
      padding: 15px
      font-size: $font-size-14
      color: #20202e
      font-family: $font-family-medium
      height: 185px
      outline:none
      resize: none
      border-radius: 4px
      &::-webkit-input-placeholder{
        color: #979797
      }
    .textarea-number
      position: absolute
      bottom: 25px
      right: 25px
      font-size: $font-size-12
      font-family: $font-family-medium
      color: #333
      span
        color: #AFAFAF

  .bot-btn
    margin: 20px 12px
    height: 40px
    line-height: 40px
    text-align: center
    border-radius: 6px
    font-size: $font-size-14
    font-family: $font-family-medium
    color: $color-white
    background: $color-linear-main

</style>
