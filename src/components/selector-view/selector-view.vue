<template>
  <div class="selector-view">
    <div class="selector-cover" @click.stop="hideModel" v-show="modelShow"></div>
    <div class="selector-container" :class="modelShow ? 'show' : ''" @click.stop="">
      <div class="selector-title" v-if="showType === 'words'">选择话术</div>
      <div class="selector-title" v-if="showType === 'coupon'">可用<span class="red-num">{{total}}</span>张优惠券</div>
      <div class="selector-title" v-if="showType === 'goods'">上线<span class="red-num">{{total}}</span>个商品</div>
      <div class="selector-title" v-if="showType === 'service'">上线<span class="red-num">{{total}}</span>个服务</div>
      <div class="selector-title" v-if="showType === 'activity'">上线<span class="red-num">{{total}}</span>个活动</div>
      <div class="selector-title" v-if="showType === 'group'">可用<span class="red-num">{{total}}</span>组用户</div>
      <div class="selector-list">
        <scroll
          ref="scroll"
          :data="list"
          bcColor="#ffffff"
          :pullUpLoad="pullUpLoadObj"
          :showNoMore="showNoMore"
          @pullingUp="onPullingUp">
          <div class="list-container">
            <div class="words-list" v-if="showType === 'words'">
              <div class="words-item" v-for="(item, index) in list" :key="index" @click.stop="chioceItem(index, item)">
                <div class="item-left">
                  <p class="left-txt">{{item.message}}</p>
                </div>
                <div class="item-right">
                  <div class="circle" v-if="index != checkIdx"></div>
                  <img v-if="index == checkIdx" src="./icon_pick_goods@2x.png" class="right-img">
                </div>
              </div>
            </div>
            <div class="coupon-list" v-if="showType === 'coupon'">
              <div class="coupon-item" v-for="(item, index) in list" :key="index" @click.stop="chioceItem(index, item)">
                <img src="./pic-coupon_xzyhq@2x.png" class="item-bc">
                <div class="item-content">
                  <div class="item-left">
                    <div class="left-money" v-if="item.coupon_type == 3">
                      <span class="money-icon">¥</span>
                      <span class="money-txt">{{item.denomination}}</span>
                    </div>
                    <div class="left-money" v-if="item.coupon_type == 4">
                      <span class="money-txt">{{item.denomination}}</span>
                      <span class="discount-txt">折</span>
                    </div>
                    <div class="left-txt">{{item.condition_str}}</div>
                  </div>
                  <div class="item-right">
                    <div class="right-msg">
                      <div class="msg-title">{{item.coupon_name}}</div>
                      <div class="msg-subtitle">{{item.range_type_str}}</div>
                      <div class="msg-time">{{item.start_at}}-{{item.end_at}}</div>
                    </div>
                    <div class="right-checked">
                      <div class="circle" v-if="index != checkIdx"></div>
                      <img src="./icon-pick@2x.png" class="right-img" v-if="index == checkIdx">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="goods-list" v-if="showType === 'goods' || showType === 'service'">
              <div class="goods-item" v-for="(item, index) in list" :key="index" @click.stop="chioceItem(index, item)">
                <div class="item-left">
                  <div class="left-img">
                    <img :src="item.image_url_thumb" class="goods-img">
                  </div>
                  <div class="left-msg">
                    <div class="goods-title">{{item.goods_title}}</div>
                    <div class="flag">
                      <div class="flag-box">销量{{item.sale_count}}个</div>
                    </div>
                    <div class="goods-price">现价: ¥{{item.platform_price}}</div>
                  </div>
                </div>
                <div class="item-right">
                  <div v-if="index != checkIdx" class="circle"></div>
                  <img v-if="index == checkIdx" src="./icon_pick_goods@2x.png" class="right-img">
                </div>
              </div>
            </div>
            <div class="activity-list" v-if="showType === 'activity'">
              <div class="activity-item" v-for="(item, index) in list" :key="index" @click.stop="chioceItem(index, item)">
                <div class="item-left">
                  <div class="left-img">
                    <img :src="item.image_url_thumb" class="goods-img">
                  </div>
                  <div class="left-msg">
                    <div class="goods-title">{{item.goods_title}}</div>
                    <div class="goods-price">有效期至{{item.end_at}}</div>
                  </div>
                </div>
                <div class="item-right">
                  <div v-if="index != checkIdx" class="circle"></div>
                  <img v-if="index == checkIdx" src="./icon-pick_activity@2x.png" class="right-img">
                </div>
                <div class="item-flag">
                  <img src="./pic-label@2x.png" class="flag-img" v-if="item.rule_id * 1 === 1">
                  <img src="./pic-label_kj@2x.png" class="flag-img" v-if="item.rule_id * 1 === 3">
                </div>
              </div>
            </div>
            <div class="group-list" v-if="showType === 'group'">
              <div class="group-item" v-for="(item, index) in list" :key="index" @click.stop="chioceItem(index, item)">
                <div class="item-left">
                  <div class="left-img-box">
                    <customer-group :dataArray="item.customers"></customer-group>
                  </div>
                  <div class="left-title">{{item.name}}({{item.total}}人)</div>
                </div>
                <div class="item-right">
                  <div v-if="index != checkIdx" class="circle"></div>
                  <img v-if="index == checkIdx" src="./icon_pick_goods@2x.png" class="right-img">
                </div>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom-btn border-top-1px" @click="submitHandle">
        <div class="btn">发送</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'components/scroll/scroll'
  import CustomerGroup from 'components/customer-group/customer-group'
  import { Im, Coupon, Client } from 'api'
  import { ERR_OK } from 'common/js/config'
  import {ease} from 'common/js/ease'
  export default {
    components: {
      Scroll,
      CustomerGroup
    },
    props: {
      // hasFn是否要等方法执行完再收起遮罩
      'hasFn': {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        modelShow: false,
        showNoMore: false,
        showType: 'words', // 话术库words 优惠券coupon 商品goods 服务service 活动activity 分组group
        list: [],
        pullUpLoad: true,
        page: 1,
        total: 0, // 总数
        checkIdx: -1, // 被选中索引
        checkItem: {},
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce']
      }
    },
    methods: {
      submitHandle() {
        this.$emit('submit', this.checkItem, this.showType)
        if (this.hasFn) return
        this.hideModel()
      },
      _resetItem() {
        this.page = 1
        this.checkIdx = -1
        this.checkItem = {}
      },
      onPullingUp() {
        if (this.showNoMore) {
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          return
        }
        switch (this.showType) {
          case 'coupon':
            this.getMoreCouponList()
            break
          case 'goods':
            this.getMoreGoodsList()
            break
          case 'service':
            this.getMoreServiceList()
            break
          case 'activity':
            this.getMoreActivityList()
            break
          case 'words':
            break
          case 'group':
            this.getMoreGroupList()
            break
          default:
            break
        }
      },
      showModel(type) {
        this.modelShow = true
        this.showType = type
        this._resetItem()
        this.getList()
      },
      hideModel() {
        this.modelShow = false
        this._resetItem()
      },
      chioceItem(idx, item) {
        if (+this.checkIdx !== +idx) {
          this.checkIdx = +idx
          this.checkItem = item
        }
      },
      getList() {
        switch (this.showType) {
          case 'coupon':
            this.getCouponList()
            break
          case 'goods':
            this.getGoodsList()
            break
          case 'service':
            this.getServiceList()
            break
          case 'activity':
            this.getActivityList()
            break
          case 'words':
            this.getWordsList()
            break
          case 'group':
            this.getGroupList()
            break
          default:
            break
        }
      },
      // 客户分组
      getGroupList() {
        let data = {
          page: 1,
          limit: 15,
          shop_id: this.$storage.get('info').shop_id
        }
        Client.getGroupList(data).then(res => {
          if (res.error === ERR_OK) {
            this.list = res.data
            this.total = res.meta.total
          } else {
            this.$refs.toast.show(res.message)
          }
          if (this.total < 15) {
            this.showNoMore = true
          }
          setTimeout(() => {
            this.$refs.scroll && this.$refs.scroll.forceUpdate()
            this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 0, ease[this.scrollToEasing])
          }, 20)
        })
      },
      getMoreGroupList() {
        if (this.showNoMore) {
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          return
        }
        this.page++
        let data = {
          page: this.page,
          limit: 15
        }
        Client.getGroupList(data).then(res => {
          if (res.error === ERR_OK) {
            this.total = res.meta.total
            if (res.data < 15) {
              this.showNoMore = true
              return
            }
            this.list = [...this.list, ...res.data]
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      // 优惠券
      getCouponList() {
        let data = {
          page: this.page,
          limit: 15
        }
        Coupon.getCouponList(data).then(res => {
          if (res.error === ERR_OK) {
            this.list = res.data
            this.total = res.meta.total
            if (this.total < 15) {
              this.showNoMore = true
            }
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
              this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 0, ease[this.scrollToEasing])
            }, 20)
          }
        })
      },
      // 优惠券
      getMoreCouponList() {
        if (this.showNoMore) {
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          return
        }
        this.page++
        let data = {
          page: this.page,
          limit: 15
        }
        Coupon.getCouponList(data).then(res => {
          if (res.error === ERR_OK) {
            this.total = res.meta.total
            if (res.data < 15) {
              this.showNoMore = true
              return
            }
            this.list = [...this.list, ...res.data]
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      // 商品
      getGoodsList() {
        let data = {
          page: this.page,
          limit: 15,
          status: 1
        }
        Im.getProductList(data).then(res => {
          if (res.error === ERR_OK) {
            this.list = res.data
            this.total = res.meta.total
            if (this.total < 15) {
              this.showNoMore = true
            }
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
              this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 0, ease[this.scrollToEasing])
            }, 20)
          }
        })
      },
      // 商品
      getMoreGoodsList() {
        if (this.showNoMore) {
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          return
        }
        this.page++
        let data = {
          page: this.page,
          limit: 15,
          status: 1
        }
        Im.getProductList(data).then(res => {
          if (res.error === ERR_OK) {
            this.total = res.meta.total
            if (res.data < 15) {
              this.showNoMore = true
            }
            this.list = [...this.list, ...res.data]
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      // 服务
      getServiceList() {
        let data = {
          page: this.page,
          limit: 15,
          status: 1
        }
        Im.getGoodsList(data).then(res => {
          if (res.error === ERR_OK) {
            this.list = res.data
            this.total = res.meta.total
            if (this.total < 15) {
              this.showNoMore = true
            }
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
              this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 0, ease[this.scrollToEasing])
            }, 20)
          }
        })
      },
      // 服务
      getMoreServiceList() {
        if (this.showNoMore) {
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          return
        }
        this.page++
        let data = {
          page: this.page,
          limit: 15,
          status: 1
        }
        Im.getGoodsList(data).then(res => {
          if (res.error === ERR_OK) {
            this.total = res.meta.total
            if (res.data < 15) {
              this.showNoMore = true
            }
            this.list = [...this.list, ...res.data]
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      // 活动
      getActivityList() {
        let data = {
          page: this.page,
          limit: 15,
          status: 1
        }
        Im.getActivityList(data).then(res => {
          if (res.error === ERR_OK) {
            this.list = res.data
            this.total = res.meta.total
            if (this.total < 15) {
              this.showNoMore = true
            }
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
              this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 0, ease[this.scrollToEasing])
            }, 20)
          }
        })
      },
      // 活动
      getMoreActivityList() {
        if (this.showNoMore) {
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          return
        }
        this.page++
        let data = {
          page: this.page,
          limit: 15,
          status: 1
        }
        Im.getActivityList(data).then(res => {
          if (res.error === ERR_OK) {
            this.total = res.meta.total
            if (res.data < 15) {
              this.showNoMore = true
            }
            this.list = [...this.list, ...res.data]
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      // 话术
      getWordsList() {
        Im.getMyWordList().then(res => {
          if (res.error === ERR_OK) {
            this.list = res.data
            this.showNoMore = true
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
              this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 0, ease[this.scrollToEasing])
            }, 20)
          }
        })
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
          if (!this.pullUpLoad) return
          this.rebuildScroll()
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .selector-view
    .selector-cover
      background: rgba(0,0,0,0.80)
      position: fixed
      left: 0
      top: 0
      right: 0
      bottom: 0
      z-index: 888
    .selector-container
      position: fixed
      left: 0
      bottom: -130%
      right: 0
      background: $color-white
      border-radius: 8px 8px 0 0
      transition: all 0.3s
      z-index: 999
      &.show
        bottom: 0
      .selector-title
        line-height: 48px
        padding: 0 15px
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-0E1249
        letter-spacing: 0.6px
        .red-num
          font-family: $font-family-medium
          color: #f94346
          padding: 0 5px
      .selector-list
        height: 85vw
        position: relative
        .list-container
          box-sizing: border-box
          padding: 6px 15px 0
          .words-list
            .words-item
              min-height: 42px
              padding: 14px 15px
              display: flex
              align-items: center
              border-1px(#e1e1e1, 8px)
              margin-bottom: 15px
              .item-left
                flex: 1
                overflow: hidden
                .left-txt
                  line-height: 21px
                  font-family: $font-family-regular
                  font-size: $font-size-14
                  color: $color-text-main
                  letter-spacing: 0.3px
              .item-right
                width: 20px
                margin-left: 8.2vw
                .circle
                  width: 20px
                  height: 20px
                  border: 1px solid $color-main
                  border-radius: 50%
                  box-sizing: border-box
                .right-img
                  width: 20px
                  height: 20px
                  display: block
          .coupon-list
            .coupon-item
              width: 100%
              height: 0
              padding-bottom: 24.63%
              position: relative
              margin-bottom: 15px
              .item-bc
                width: 100%
                height: 100%
                position: absolute
                left: 0
                top: 0
              .item-content
                width: 100%
                height: 100%
                position: absolute
                left: 0
                top: 0
                display: flex
                align-items: center
                .item-left
                  width: 26%
                  height: 100%
                  display: flex
                  flex-direction: column
                  justify-content: center
                  align-items: center
                  overflow: hidden
                  .left-money
                    display: flex
                    align-items: flex-end
                    margin-bottom: 5px
                    .money-icon
                      font-family: $font-family-bold
                      font-size: $font-size-18
                      color: $color-F94346
                      margin-bottom: 4px
                      line-height: 15px
                    .money-txt
                      font-family: $font-family-bold
                      font-size: 35px
                      color: $color-F94346
                      margin: 0 1px
                      line-height: 35px
                    .discount-txt
                      font-family: $font-family-regular
                      font-size: $font-size-16
                      color: $color-F94346
                      margin-bottom: 4px
                      line-height: 14px
                  .left-txt
                    font-family: $font-family-regular
                    font-size: $font-size-11
                    color: $color-text-main
                    line-height: 11px
                .item-right
                  width: 74%
                  height: 100%
                  display: flex
                  align-items: center
                  .right-msg
                    flex: 1
                    overflow: hidden
                    display: flex
                    flex-direction: column
                    justify-content: center
                    margin-left: 11px
                    .msg-title
                      font-family: $font-family-regular
                      font-size: $font-size-16
                      color: $color-text-main
                      margin-bottom: 8px
                      width: 100%
                      line-height: 16px
                      overflow: hidden
                      white-space: nowrap
                      text-overflow: ellipsis
                    .msg-subtitle
                      font-family: $font-family-regular
                      font-size: $font-size-12
                      color: $color-text-sub
                      line-height: 12px
                      margin-bottom: 5px
                    .msg-time
                      font-family: $font-family-regular
                      font-size: $font-size-12
                      color: $color-text-sub
                      line-height: 12px
                  .right-checked
                    width: 20px
                    margin: 0 7.4vw 0 2.6vw
                    .circle
                      width: 20px
                      height: 20px
                      border: 1px solid $color-F94346
                      border-radius: 50%
                      box-sizing: border-box
                    .right-img
                      width: 20px
                      height: 20px
                      display: block
          .goods-list
            .goods-item
              margin-bottom: 15px
              display: flex
              align-items: center
              height: 85px
              background: rgba(89,41,220,0.03)
              border: 1px solid rgba(89,41,220,0.16)
              border-radius: 4px
              .item-left
                flex: 1
                overflow: hidden
                display: flex
                align-items: center
                margin-left: 15px
                .left-img
                  width: 55px
                  height: 55px
                  margin-right: 10px
                  .goods-img
                    width: 55px
                    height: 55px
                    object-fit: cover
                    border-radius: 2px
                .left-msg
                  flex: 1
                  overflow: hidden
                  display: flex
                  flex-direction: column
                  justify-content: center
                  .goods-title
                    font-family: $font-family-regular
                    font-size: $font-size-16
                    color: $color-text-main
                    letter-spacing: 0.34px
                    margin-bottom: 5px
                  .flag
                    display: flex
                    margin-bottom: 6px
                    .flag-box
                      padding: 2px 6px
                      border-1px($color-text-sub, 6px)
                      font-family: $font-family-regular
                      color: $color-text-sub
                      letter-spacing: 0.43px
                      font-size: $font-size-10
                  .goods-price
                    font-family: $font-family-regular
                    font-size: $font-size-12
                    color: $color-text-sub
                    letter-spacing: 0.3px
              .item-right
                width: 20px
                margin: 0 4.8vw 0 2.6vw
                .circle
                  width: 20px
                  height: 20px
                  border: 1px solid $color-main
                  border-radius: 50%
                  box-sizing: border-box
                .right-img
                  width: 20px
                  height: 20px
                  display: block
          .activity-list
            .activity-item
              margin-bottom: 15px
              display: flex
              align-items: center
              height: 85px
              background: rgba(246,147,26,0.06)
              border: 1px solid rgba(246,147,26,0.20)
              border-radius: 4px
              position: relative
              .item-left
                flex: 1
                overflow: hidden
                display: flex
                align-items: center
                margin-left: 15px
                .left-img
                  width: 55px
                  height: 55px
                  margin-right: 10px
                  .goods-img
                    width: 55px
                    height: 55px
                    object-fit: cover
                    border-radius: 2px
                .left-msg
                  flex: 1
                  overflow: hidden
                  display: flex
                  flex-direction: column
                  justify-content: center
                  .goods-title
                    font-family: $font-family-regular
                    font-size: $font-size-16
                    color: $color-text-main
                    letter-spacing: 0.34px
                    margin-bottom: 23px
                  .goods-price
                    font-family: $font-family-regular
                    font-size: $font-size-12
                    color: $color-text-sub
                    letter-spacing: 0.3px
              .item-right
                width: 20px
                margin: 0 4.8vw 0 2.6vw
                .circle
                  width: 20px
                  height: 20px
                  border: 1px solid $color-F6931A
                  border-radius: 50%
                  box-sizing: border-box
                .right-img
                  width: 20px
                  height: 20px
                  display: block
              .item-flag
                position: absolute
                left: 0
                top: 0
                width: 33px
                height: 33px
                .flag-img
                  width: 33px
                  height: 33px
                  display: block
          .group-list
            .group-item
              display: flex
              align-items: center
              border-1px(#e1e1e1, 8px)
              margin-bottom: 15px
              height: 70px
              .item-left
                flex: 1
                overflow: hidden
                display: flex
                align-items: center
                margin-left: 15px
                margin-right: 10px
                .left-img-box
                  width: 45px
                  height: 45px
                .left-title
                  margin-left :11px
                  font-family: $font-family-regular
                  color: $color-text-main
                  font-size: $font-size-16
              .item-right
                width: 20px
                margin: 0 4.8vw 0 2.6vw
                .circle
                  width: 20px
                  height: 20px
                  border: 1px solid $color-main
                  border-radius: 50%
                  box-sizing: border-box
                .right-img
                  width: 20px
                  height: 20px
                  display: block
      .bottom-btn
        height: 55px
        display: flex
        align-items: center
        padding: 0 15px
        .btn
          width: 100%
          height: 40px
          background-image: linear-gradient(135deg, #953DE1 0%, #4541F9 100%)
          border-radius: 6px
          text-align: center
          line-height: 40px
          color: $color-white
          font-family: $font-family-medium
          font-size: $font-size-14



</style>
