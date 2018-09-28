<template>
  <div class="my-service">
    <div class="container">
      <div class="big-container" :style="'transform: translate(-' + selectTab*33.333 + '%,0)'">
        <div class="container-item">
          <scroll ref="scroll"
                  :data="dataArray"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingUp="onPullingUp"
                  :showNoMore="showNoMore">
            <div class="list-container">
              <div class="list-item" v-for="(item, index) in dataArray" :key="index">
                <service-item :tabIdx="selectTab"
                              :item="item"
                              :showEdit="item.showEdit"
                              @showEdit="showEditor"
                              @itemEditor="itemEditor"
                              @itemDown="itemDown"
                              @itemDelete="itemDelete">
                </service-item>
              </div>
            </div>
          </scroll>
        </div>
      </div>
    </div>
    <div class="footer-box">
      <div class="footer-btn" @click="toDetail('new')">上架服务</div>
    </div>
    <confirm-msg ref="confirm" @confirm="msgConfirm"></confirm-msg>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import Exception from 'components/exception/exception'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import ServiceItem from 'components/service-item/service-item'
  // import { Business } from 'api'
  // import { ERR_OK } from '../../common/js/config'
  // import storage from 'storage-controller'

  const LIMIT = 10

  export default {
    name: 'MyService',
    data () {
      return {
        dataArray: [{id: 1, showEdit: false}, {id: 2, showEdit: false}],
        selectTab: 0,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        showNoMore: true,
        page: 1,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        limit: LIMIT,
        popShow: true,
        loaded: false,
        loading: true
      }
    },
    created () {
    },
    methods: {
      changeTab(index) {
        this.selectTab = index
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      },
      onPullingUp() {
        console.log(7776767)
      },
      msgConfirm() {
        console.log('confirm')
      },
      delClick() {
        this.$refs.confirm.show('确定下架该服务')
      },
      showEditor(item) {
        this['list' + this.selectTab] = this['list' + this.selectTab].map((item1) => {
          if (+item.id === +item1.id) {
            item1.showEdit = !item1.showEdit
          } else {
            item1.showEdit = false
          }
          return item1
        })
      },
      itemEditor(item) {
        console.log(item)
        let id = item.id
        this.toDetail('editor', id)
      },
      itemDown(item) {
        console.log('down', item)
      },
      itemDelete(item) {
        console.log('del', item)
      }
    },
    computed: {
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      }
    },
    watch: {
      pullUpLoadObj: {
        handler() {
          if (!this.pullUpLoad) return // 防止下拉报错
          this.rebuildScroll()
        },
        deep: true
      }
    },
    components: {
      Scroll,
      Exception,
      ConfirmMsg,
      ServiceItem
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .my-service
    position: fixed
    background: $color-background
    z-index: 10
    left: 0
    right: 0
    bottom: 0
    top: 0
    .container
      width: 100vw
      height: 100vh
      .big-container
        width: 300vw
        height: 100vh
        display: flex
        transition: all 0.3s
        .container-item
          width: 100vw
          height: 100vh
          box-sizing: border-box
          .list-container
            padding: 0 15px
            .list-item
              padding-top: 10px
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
    .pop
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 100
      background: rgba(0, 0, 0, 0.6)
      .pop-main
        position: absolute
        top: 30%
        left: 0
        right: 0
        width: 80%
        height: 170px
        background: $color-white
        border-radius: 4px
        margin: 0 auto
        padding-top: 60px
        text-align: center
        box-sizing: border-box
        .tip
          font-size: $font-size-14
          color: $color-20202E
        .confirm-btn
          height: 45px
          line-height: 45px
          border-top-1px($color-E3E6E9)
          color: $color-C1C3C3
          display: flex
          position: absolute
          bottom: 0
          left: 0
          right: 0
          .pop-btn
            width: 50%
            border-right-1px($color-E3E6E9)
            color: $color-A3A2A0
            font-size: 16px
            &.right
              border: 0
              color: $color-C3A66C

</style>
