<template>
  <transition :name="slide">
    <div class="share-card" v-if="show">
      <div class="share-box">
        <div class="share-con">
          <img class="share-top" :src="card.avatar" alt="">
          <div class="share-bottom">
            <div class="name-profession">
              <div class="name">{{card.name}}</div>
              <div class="line" v-if="showPosition"></div>
              <div class="name-profession">{{card.position}}</div>
            </div>
            <div class="buss-name">{{card.department}}</div>
            <div class="code-padding"></div>
            <div class="code-phone">
              <div class="code-phone-box" v-if="showMobile">
                <img src="./icon-telephone_ash@2x.png" alt="" class="img-phone">
                <div class="text">{{card.business_card_mobile}}</div>
              </div>
              <img :src="card.qrcode" alt="" class="share-code">
            </div>
          </div>
          <!--<p class="peo-name">{{card.name}}</p>-->
          <!--<p class="peo-position">{{card.position}}</p>-->
          <!--<p class="buss-name">{{card.department}}</p>-->
          <!--<img class="qr-code" :src="card.qrcode" alt="">-->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  // import { ERR_OK } from 'api/config'
  import Scroll from 'components/scroll/scroll'
  import { Business } from 'api'
  import { mapGetters } from 'vuex'

  export default {
    name: 'share-card',
    data () {
      return {
        card: {},
        showPosition: true,
        showMobile: true,
        show: false
      }
    },
    created () {
      Business.Myqrcode({is_hyaline: 0}).then((res) => {
        this.card = res.data || {}
        if (this.card.position.length === 0) {
          this.showPosition = false
        }
        if (this.card.business_card_mobile.length === 0) {
          this.showMobile = false
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
      ...mapGetters(['ios']),
      slide () {
        return this.ios ? '' : 'slide'
      }
    },
    components: {
      Scroll
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .share-card
    z-index: 100
    height: 100vh
    padding-top: 20px
    box-sizing: border-box
    background: $color-background
    .share-box
      display: flex
      flex-direction: column
      width: 305px
      margin: 0 auto
    .share-con
      background: $color-white-fff
      border-radius: 2px
      box-shadow: 0 2px 6px 0 rgba(43, 43, 145, 0.04)
      .share-top
        display: block
        width: 305px
        height: 305px
        border: 0px solid #fff
      .share-bottom
        padding: 20px
        position: relative
        .name-profession
          layout(row)
          align-items: flex-end
          .name
            font-family: 'PingFangSC-Semibold'
            font-size: $font-size-18
            color: $color-20202E
          .name-profession
            font-family: $font-family-regular
            font-size: $font-size-medium
            color: $color-text-88
          .line
            height: 16px
            width: 1px
            margin: 0 10px
            background: rgba(0, 0, 0, .1)

        .buss-name
          font-family: $font-family-regular
          font-size: $font-size-medium
          color: $color-20202E
          margin-top: 15px
        .code-padding
          padding-bottom: 31px
          width: 100%
        .code-phone
          layout(row)
          display :flex
          height: 74px
          align-items :flex-end
          justify-content :space-between
          .code-phone-box
            display :flex
          .img-phone
            display: block
            width: 14px
            height: 14px
            margin-right: 5px
          .text
            height: $font-size-medium
            font-family: $font-family-regular
            font-size: $font-size-medium
            color: $color-text-88

  .share-code
    display :block
    width: 74px
    height: 74px
    padding: 25px
    margin: -25px
</style>
