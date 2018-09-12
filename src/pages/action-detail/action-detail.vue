<template>
  <transition  :name="slide">
    <div class="action-box">
      <div class="action-ab">
        <scroll ref="scroll"
                :data="list"
                :probeType="probeType"
                :bcColor="bcColor"
                :listenScroll="listenScroll"
                :pullUpLoad="pullUpLoadObj"
                :showNoMore="false"
                @pullingUp="onPullingUp">
          <ul class="action-tab">
            <li class="tab-item"  :class="actionIndex===index?'active':''"
                v-for="(item,index) in actionList"
                :key="index"
                @click="actionTab(index)">{{item}}</li>
          </ul>
          <div class="data-box">
            <div class="data-title">
              <span class="text">共</span><span class="number">88</span><span class="text">次</span>
            </div>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import Scroll from 'components/scroll/scroll'

  export default {
    name: 'action-detail',
    data() {
      return {
        listenScroll: true,
        probeType: 3,
        bcColor: '#F0F2F5',
        pullUpLoadThreshold: 0,
        pullUpLoad: true,
        list: [],
        actionList: ['全部', '今天', '7天', '30天'],
        actionIndex: 0
      }
    },
    methods: {
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      },
      onPullingUp() {
        console.log(111)
      },
      actionTab(index) {
        this.actionIndex = index
      }
    },
    computed: {
      ...mapGetters(['ios']),
      slide() {
        return this.ios ? '' : 'slide'
      },
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      }
    },
    components: {
      Scroll
    },
    watch: {
      pullUpLoadObj: {
        handler() {
          this.rebuildScroll()
          this.$refs.scroll.forceUpdate()
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  div
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box
  .action-box
    fill-box()
    z-index: 50
  .action-tab
    padding: 20px 0
    layout(row)
    justify-content: center
    align-items: center
    .tab-item
      width: 60px
      height: 30px
      text-align: center
      line-height: 30px
      background: $color-white-fff
      font-family: $font-family-medium
      color: $color-20202E
      font-size: $font-size-14
      border-1px(#e5e5e5)
    .active
      background: $color-20202E
      color: $color-white-fff
      border-1px(rgba(255,2555,255,0))
  .data-title
    layout(row)
    justify-content: center
    align-items: flex-end
    .text
      font-family: $font-family-medium
      color: $color-20202E
      font-size: $font-size-14
      padding-bottom: 2px
    .number
      font-family: 'DINCondensed-Bold'
      color: #56BA15
      font-size: 26px
      line-height: 26px
      margin: 0 5px
  .action-ab
    fill-box(absolute)
</style>
