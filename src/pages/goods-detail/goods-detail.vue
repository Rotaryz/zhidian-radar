<template>
  <transition :name="slide">
    <div class="goods-detail">
      <scroll ref="scroll">
        <div class="cover-box">
          <img :src="goods.image_url" class="cover">
        </div>
        <div class="goods-title">
          <p class="goods-content">{{goods.title}}</p>
          <p class="content-reason">{{goods.subtitle}}</p>
        </div>
        <div class="goods-icon">
          <span class="goods-small-box goods-small-tall"></span>
          <span class="goods-small-box goods-small-width"></span>
          <span class="goods-small-text">产品详情</span>
        </div>
        <img :src="item.image_url" class="goods-img" v-for="(item, index) in goods.goods_images" :key="index" @load="loadImage">
      </scroll>
    </div>
  </transition>
</template>

<script>
  // import { ERR_OK } from 'api/config'
  import Scroll from 'components/scroll/scroll'
  import { Goods } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import {mapGetters} from 'vuex'

  export default {
    name: 'goods-detail',
    data () {
      return {
        goods: {},
        imageLength: 0
      }
    },
    created () {
      this._goods()
    },
    methods: {
      _goods () {
        let id = this.$route.query.id
        console.log(id)
        Goods.doogsDetail(id).then((res) => {
          if (res.error === ERR_OK) {
            this.goods = res.data
          }
        })
      },
      loadImage() {
        if (this.imageLength < this.goods.goods_images.length) {
          this.imageLength += 1
          console.log(this.imageLength)
          setTimeout(() => {
            this.$refs.scroll.refresh()
          }, 20)
        }
      }
    },
    computed: {
      ...mapGetters(['ios']),
      slide() {
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
  .goods-detail
    position: fixed
    background: goods-detail
    z-index: 10
    left: 0
    background: $color-background
    right: 0
    bottom: 0
    top: 0

  .cover-box
    overflow: hidden
    height: 230px
    .cover
      width: 100%

  .goods-title
    position: relative
    z-index: 40
    border-radius: 2px
    border-1px($color-col-line, 2px)
    background: $color-white
    height: 112px
    margin: -30px auto 0
    width: 92vw
    padding: 20px 25px
    box-sizing: border-box
    .goods-content
      line-height: 24px
      color: $color-text
      font-family: PingFangSC-Semibold
      font-size: 19px
    .content-reason
      font-family: $font-family-regular
      font-size: $font-size-medium
      color: $color-text
      margin-top: 10px

  .goods-icon
    position: relative
    height: 63px
    .goods-small-box
      border-1px(#CCCCCC, 0px)
      all-center()
    .goods-small-tall
      height: 33px
      width: 95px
    .goods-small-width
      height: 27px
      width: 101px
    .goods-small-text
      all-center()

  .goods-img
    width: 100vw
    display: block
</style>
