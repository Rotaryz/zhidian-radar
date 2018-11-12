<template>
  <div class="share-card" v-if="show">
    <div class="card-con"></div>
    <div class="card-main">
      <div class="main-con" v-if="card">
        <img :src="card.avatar" alt="" class="avatar-img">
        <div class="title">{{card.name}}</div>
        <img :src="card.qrcode" alt="" class="avatar-card">
        <!--<div class="qrcode-text">长按识别二维码进店逛逛</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import { Business } from 'api'
  import storage from 'storage-controller'

  export default {
    name: 'share-card',
    data() {
      return {
        card: {name: '国颐堂', avatar: '', qrcode: ''},
        show: false
      }
    },
    created() {
      this.card.avatar = storage.get('info').avatar
      this.card.name = storage.get('info').name
      Business.Myshop({is_hyaline: 0, path: '/pages/guide'}).then((res) => {
        if (res.data) {
          this.card.qrcode = res.data.image_url
        }
      })
      if (this.ios) {
        setTimeout(() => {
          this.show = true
        }, 300)
      } else {
        this.show = true
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .card-con
    padding-top: 30px

  .card-main
    box-sizing: border-box
    width: 317px
    padding: 20px 20px 25px
    margin: auto
    background: url("./pic-code_shop@2x.png") no-repeat center center
    background-size: 100% 100%
    .main-con
      padding-top: 40px
      padding-bottom: 11px
      width: 260px
      margin: 0 auto
      layout()
      align-items: center
      .avatar-img
        display: block
        width: 50px
        height: 50px
      .title
        font-family: $font-family-medium
        font-size: 20px
        color: $color-202020
        margin-top: 20px
        padding: 0 10px
        text-align: center
        line-height: 26px
      .avatar-card
        display: block
        width: 120px
        height: 120px
        margin-top: 80px
        margin-bottom: 45px
        border-radius: 50%
        padding: 6px
        border: 6px solid #ecf6e5
        z-index: 50
      .qrcode-text
        font-family: $font-family-regular
        font-size: $font-size-12
        color: $color-9B9B9B

  .share-card
    height: 100vh
    box-sizing: border-box
    overflow: hidden
    background: $color-20202E
</style>
