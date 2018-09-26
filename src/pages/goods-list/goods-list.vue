<template>
  <transition :name="slide">

    <div class="goods-list">
      <div class="tab">
        <div class="tab-item" @click="_change(1)">我的推荐</div>
        <div class="tab-item" @click="_change(0)">全部产品</div>
        <span class="line" :class="{'line-buss': !tabIndex}"></span>
      </div>
      <transition name="slide-left">
        <div class="goods-box">
          <scroll
            ref="scroll"
            :data="goodsListMine"
            v-if="tabIndex === 1"
            :pullUpLoad="pullUpLoadObj"
            :pullDownRefresh="pullDownRefreshObj"
            @pullingUp="onPullingUp"
            @pullingDown="onPullingDown"
          >
            <div class="goods-item" v-for="(item, index) in goodsListMine" :key="index" @click="_goDetail(item.id)">
              <div class="img-box">
                <img class="goods-image" :src="item.image_url">
              </div>
              <div class="goods-content">
                <p class="goods-text">{{item.title}}</p>
                <p class="goods-time">发布日期：{{item.created_at}}</p>
              </div>
              <div class="goods-use">
                <p class="tip">公司发布</p>
                <div class="btn" :class="{'btn-green': !item.recommend_status}" @click.stop="_presellGoods(item.id, item.recommend_status)">{{item.recommend_status ? '取消推荐' : '推荐'}}</div>
                <!--btn-green-->
              </div>
            </div>
          </scroll>
        </div>
      </transition>
      <transition name="slide-right">
        <div class="goods-box">
          <scroll
            ref="scrolls"
            v-if="tabIndex === 0"
            :data="goodsList"
            :pullUpLoad="pullUpLoadObj"
            :pullDownRefresh="pullDownRefreshObj"
            @pullingUp="onPullingUp"
            @pullingDown="onPullingDown"
          >
            <div class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="_goDetail(item.id)">
              <div class="img-box">
                <img class="goods-image" :src="item.image_url">
              </div>
              <div class="goods-content">
                <p class="goods-text">{{item.title}}</p>
                <p class="goods-time">发布日期：{{item.created_at}}</p>
              </div>
              <div class="goods-use">
                <p class="tip">公司发布</p>
                <div class="btn" :class="{'btn-green': !item.recommend_status}" @click.stop="_presellGoods(item.id, item.recommend_status)">{{item.recommend_status ? '取消推荐' : '推荐'}}</div>
                <!--btn-green-->
              </div>
            </div>
          </scroll>
        </div>
      </transition>
      <toast ref="toast"></toast>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  // import { ERR_OK } from 'api/config'
  import Scroll from 'components/scroll/scroll'
  import {Goods} from 'api'
  import {ERR_OK} from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import {mapGetters} from 'vuex'

  export default {
    name: 'goods-list',
    data() {
      return {
        startY: 0,
        goodsList: [],
        goodsListMine: [],
        loadMore: true,
        tabIndex: 1,
        page: 1,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        scrollbar: true,
        scrollbarFade: true,
        pullDownRefresh: true
      }
    },
    created() {
      this._goodslist()
    },
    methods: {
      _goDetail(id) {
        this.$router.push({path: 'goodList/goodsDetail', query: {id}})
      },
      onPullingUp() {
        this.page++
        this._goodslist()
      },
      onPullingDown() {
        this.page = 1
        this._goodslist()
      },
      _presellGoods(id, status) {
        let index = this.tabIndex ? this.goodsListMine.findIndex(item => item.id === id) : this.goodsList.findIndex(item => item.id === id)
        if (status) {
          Goods.unPresellGoods({goods_id: id}).then((res) => {
            if (res.error === ERR_OK) {
              if (this.tabIndex) {
                this.goodsListMine.splice(index, 1)
              } else {
                this.goodsList[index].recommend_status = !this.goodsList[index].recommend_status
              }
              this.$refs.toast.show('成功取消推荐')
              return
            }
            this.$refs.toast.show(res.message)
          })
          return
        }
        Goods.presellGoods({goods_id: id}).then((res) => {
          if (res.error === ERR_OK) {
            this.$refs.toast.show('成功加入推荐')
            this.goodsList[index].recommend_status = !this.goodsList[index].recommend_status
            return
          }
          this.$refs.toast.show(res.message)
        })
      },
      _change(status) {
        this.loadMore = true
        this.tabIndex = status
        this.page = 1
        this._goodslist()
      },
      _goodslist() {
        let data = {is_self: this.tabIndex, limit: 15, page: this.page}
        Goods.goods(data).then((res) => {
          if (res.error === ERR_OK) {
            if (this.page === 1) {
              if (this.tabIndex) {
                this.goodsListMine = res.data
              } else {
                this.goodsList = res.data
              }
              return
            }
            if (res.data.length === 0) {
              this.$refs.scroll.forceUpdate()
              this.$refs.scrolls.forceUpdate()
              this.loadMore = false
              return
            }
            if (this.tabIndex) {
              this.goodsListMine = this.goodsListMine.concat(res.data)
            } else {
              this.goodsList = this.goodsList.concat(res.data)
            }
          }
        })
      }
    },
    computed: {
      scrollbarObj: function () {
        return this.scrollbar ? {fade: this.scrollbarFade} : false
      },
      pullDownRefreshObj: function () {
        return this.pullDownRefresh ? {
          threshold: parseInt(this.pullDownRefreshThreshold),
          stop: parseInt(this.pullDownRefreshStop)
        } : false
      },
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      },
      ...mapGetters(['ios']),
      slide() {
        return this.ios ? '' : 'slide'
      }
    },
    watch: {
      scrollbarObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      },
      pullDownRefreshObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      },
      pullUpLoadObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      },
      startY() {
        this.rebuildScroll()
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
  .goods-list
    position: fixed
    background: goods-list
    z-index: 10
    left: 0
    right: 0
    background: $color-background
    bottom: 0
    top: 0
    padding-bottom: 60px

  .line
    height: 15px

  .tab
    height: 45px
    line-height: 45px
    display: flex
    background: $color-white
    padding: 0 7vw
    box-sizing: border-box
    position: relative
    .tab-item
      text-align: center
      flex: 1
      font-family: $font-family-regular
      font-size: $font-size-medium
    .line
      height: 3px
      width: 30px
      bottom: 0
      left: 24vw // 24 67
      background: $color-text
      position: absolute
      transition: all 0.3s
    .line-buss
      left: 67.5vw
      transition: all 0.3s
  .goods-box
    position: absolute
    width: 100vw
    height: 93.35vh
    top: 45px
    background :$color-text
    left: 0

  .goods-item
    width: 92vw
    background: $color-white
    margin: 15px auto 0
    display: flex
    padding: 10px
    box-sizing: border-box
    font-family: $font-family-regular
    font-size: $font-size-small
    color: $color-text-88
    .img-box
      overflow: hidden
      height: 70px
      width: 70px
      .goods-image
        width: 100%
    .goods-content
      margin-left: 10px
      margin-right: 17px
      position: relative
      .goods-text
        line-height: 18px
        font-family: $font-family-regular
        font-size: $font-size-medium
        color: $color-text
        width: 45.07vw
      .goods-time
        position: absolute
        bottom: 15px
    .goods-use
      position: relative
      text-align: right
    .btn
      min-width: 60px
      height: 22px
      line-height: 22px
      padding: 0 6px
      margin-top: 33px
      white-space: nowrap
      text-align: center
      border-1px($color-col-line)
    .btn-green
      background: $color-56
      color: $color-white
      border-none()
</style>
