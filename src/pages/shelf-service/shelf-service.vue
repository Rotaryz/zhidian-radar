<template>
  <div class="shelf-service">
    <div class="tab-wrapper">
      <div class="line-wrap" :style="'transform: translate3d('+ selectTab * 100 +'%, 0, 0)'"></div>
      <div class="tab" v-for="(item,index) in tabList" :key="index" @click="changeTab(index)">{{item.txt}}({{item.id}})</div>
    </div>
    <div class="container">
      <div class="big-container" :style="'transform: translate(-' + selectTab*50 + '%,0)'">
        <div class="container-item">
          <scroll ref="scroll"
                  :data="dataArray0"
                  :pullUpLoad="pullUpLoadObj0"
                  @pullingUp="onPullingUp0"
                  :showNoMore="showNoMore0">
            <div class="list-container">
              <div class="list-item" v-for="(item, index) in dataArray0" :key="index">
                <service-item :tabIdx="selectTab"
                              :item="item"
                              :showEdit="item.showEdit"
                              @showEdit="showEditor"
                              @itemUp="itemUp"
                              :page="pageType"
                              >
                </service-item>
              </div>
            </div>
          </scroll>
        </div>
        <div class="container-item">
          <scroll ref="scroll"
                  :data="dataArray1"
                  :pullUpLoad="pullUpLoadObj1"
                  @pullingUp="onPullingUp1"
                  :showNoMore="showNoMore1">
            <div class="list-container">
              <div class="list-item" v-for="(item, index) in dataArray1" :key="index">
                <service-item :tabIdx="selectTab"
                              :item="item"
                              :showEdit="item.showEdit"
                              @showEdit="showEditor"
                              :page="pageType">
                </service-item>
              </div>
            </div>
          </scroll>
        </div>
      </div>
    </div>
    <confirm-msg ref="confirm" @confirm="msgConfirm"></confirm-msg>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import Exception from 'components/exception/exception'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import ServiceItem from 'components/service-item/service-item'
  import { Service } from 'api'
  import { ERR_OK } from '../../common/js/config'

  const LIMIT = 10
  const TABS = [
    {txt: '待上线', id: 10},
    {txt: '出售中', id: 10}
  ]
  export default {
    name: 'ShelfService',
    data () {
      return {
        dataArray: [{id: 1, showEdit: false}, {id: 2, showEdit: false}],
        tabList: TABS,
        dataArray0: [{id: 1}, {id: 2}],
        dataArray1: [{id: 1}, {id: 2}, {id: 3}],
        selectTab: 0,
        pullUpLoad0: true,
        pullUpLoadThreshold0: 0,
        showNoMore0: true,
        page0: 1,
        pullUpLoad1: true,
        pullUpLoadThreshold1: 0,
        showNoMore1: true,
        page1: 1,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        limit: LIMIT,
        popShow: true,
        loaded: false,
        loading: true,
        pageType: 'shelf'
      }
    },
    created () {
      this.getServiceAll()
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
      getServiceAll(page = 1) { // 服务库
        Service.getServiceAll({page, limit: LIMIT})
          .then((res) => {
            if (res.error !== ERR_OK) {
              this.$ref.tost.show(res.message)
              return
            }
            if (page > 1) {
              if (this.selectTab === 0) {
                this.dataArray0 = this.dataArray0.concat(res.data)
              } else {
                this.dataArray1 = this.dataArray1.concat(res.data)
              }
            } else {
              this.dataArray0 = res.data
              this.dataArray1 = res.data
            }
            if (res.data.length === LIMIT) {
              this.showNoMore0 = false
            }
          })
      },
      onPullingUp0() {
        this.page0++
        this.getServiceAll(this.page0)
      },
      onPullingUp1() {
        this.page1++
        this.getServiceAll(this.page0)
      },
      msgConfirm() {
        console.log('confirm')
      },
      delClick() {
        this.$refs.confirm.show('确定下架该服务')
      },
      showEditor(item) { // 点击右边小按钮
        this['dataArray' + this.selectTab] = this['dataArray' + this.selectTab].map((data) => {
          if (+item.id === +data.id) {
            data.showEdit = !data.showEdit
          } else {
            data.showEdit = false
          }
          return data
        })
      },
      itemUp(item) { // 点击上架按钮
        this['dataArray' + this.selectTab] = this['dataArray' + this.selectTab].map((data) => {
          if (+item.id === +data.id) {
            data.showEdit = !data.showEdit
          } else {
            data.showEdit = false
          }
          return data
        })
      }
    },
    computed: {
      pullUpLoadObj0: function () {
        return this.pullUpLoad0 ? {
          threshold: parseInt(this.pullUpLoadThreshold0),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      },
      pullUpLoadObj1: function () {
        return this.pullUpLoad1 ? {
          threshold: parseInt(this.pullUpLoadThreshold1),
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

  .shelf-service
    position: fixed
    background: $color-background
    z-index: 60
    left: 0
    right: 0
    bottom: 0
    top: 0
    .tab-wrapper
      height: 44.5px
      background: $color-white-fff
      layout(row, block, nowrap)
      position: relative
      .tab
        flex: 1
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-20202E
        letter-spacing: 0.6px
        text-align: center;
        line-height: 44.5px
      .line-wrap
        position: absolute
        left: 0
        bottom: 0
        right: 0
        width: 50%
        layout()
        align-items: center
        transition: all 0.3s
        &:after
          content: ''
          width: 50px
          height: 3px
          background: $color-20202E

    .container
      width: 100vw
      height: 100vh
      .big-container
        width: 200vw
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
              margin-top: 15px
              box-shadow: 0 2px 6px 0 rgba(43,43,145,0.04)
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
