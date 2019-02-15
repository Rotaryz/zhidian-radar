<template>
  <transition name="slide">
    <article class="client-create-group">
      <div class="title">添加分组</div>
      <section class="content">
        <input class="input" type="text" placeholder="请输入组名" v-model="groupName" maxlength="11"/>
      </section>
      <footer class="btn" :class="{'active': hasName}" @click="save">保存</footer>
      <toast ref="toast"></toast>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Toast from 'components/toast/toast'
  import {ERR_OK} from '../../common/js/config'
  import {Client} from 'api'

  export default {
    name: 'ClientSetGroup',
    data() {
      return {
        groupName: ''
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$emit('refresh')
      next(true)
    },
    methods: {
      save() {
        if (!this.groupName) {
          return this.$refs.toast.show('请输入分组名称')
        }
        Client.createGroup({name: this.groupName}).then(res => {
          if (res.error === ERR_OK) {
            this.$refs.toast.show('保存成功')
            setTimeout(() => {
              this.$emit('refresh')
              this.$router.back()
            }, 300)
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      }
    },
    computed: {
      hasName() {
        return this.groupName
      }
    },
    components: {
      Toast
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .client-create-group
    fill-box()
    background-color: $color-white-fff
    z-index: 200
    .title
      font-family: $font-family-regular
      font-size: $font-size-16
      color: #333
      padding: 15px
      background: #F7F7F8
      border-bottom-1px(#E1E1E1)
    .content
      padding: 15px
      border-1px($color-line, 8px, solid)
      border-radius: 4px
      margin: 15px 15px 20px
      .input
        width: 100%
        outline: none
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-20202E
        &::-webkit-input-placeholder
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-888888
        &:-moz-placeholder
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-888888
        &::-moz-placeholder
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-888888
        &:-ms-input-placeholder
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-888888
    .btn
      height: 45px
      line-height: 45px
      text-align: center
      margin: 0 15px
      border-radius: 6px
      background: $color-linear-main
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-white-fff
      letter-spacing: 0.3px
      opacity: 0.6
      transition: all 0.3s
    .active
      opacity: 1

</style>
