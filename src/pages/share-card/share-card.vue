<template>
  <div class="share-card" v-if="show">
    <div class="card-con"></div>
    <div class="card-main">
      <div class="main-con" v-if="card">
        <div class="title">{{card.name}}</div>
        <div class="title-img"></div>
        <img :src="card.avatar" alt="" class="avatar-img">
        <img :src="card.qrcode" alt="" class="avatar-card">
        <div class="qrcode-text">长按识别二维码</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Business } from 'api'
  import { mapGetters } from 'vuex'

  export default {
    name: 'share-card',
    data() {
      return {
        card: null,
        show: false
      }
    },
    created() {
      Business.Myshop({is_hyaline: 1}).then((res) => {
        if (res.data) {
          this.card = res.data
        }
      })
      if (this.ios) {
        setTimeout(() => {
          this.show = true
        }, 300)
      } else {
        this.show = true
      }
    },
    computed: {
      ...mapGetters([
        'ios'
      ])
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .card-con
    padding-top: 31px

  .card-main
    box-sizing: border-box
    width: 317px
    padding: 20px 20px 25px
    margin: auto
    background: url("./bg-shopcode@2x.png") no-repeat center center
    .main-con
      background: $color-white
      padding-top: 29px
      padding-bottom: 15px
      width: 275px
      margin: 0 auto
      layout()
      align-items: center
      .title
        font-family: $font-family-medium
        font-size: $font-size-18
        color: $color-20202E
      .title-img
        display: block
        width: 175px
        height: 16px
        margin-top: 13.5px
        background-image: url("./pic-myshop@2x.png")
        background-repeat: no-repeat
        background-position: center center
        background-size: cover
      .avatar-img
        display: block
        width: 235px
        height: 235px
        margin-top: 21px
      .avatar-card
        display: block
        width: 80px
        height: 80px
        padding: 100px
        margin-top: -80px
        z-index: 50
      .qrcode-text
        font-family: $font-family-regular
        font-size: $font-size-12
        color: #7C7C8F
        margin-top: -90px

  .share-card
    height: 100vh
    box-sizing: border-box
    overflow: hidden
</style>
