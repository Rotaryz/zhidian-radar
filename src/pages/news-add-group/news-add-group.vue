<template>
  <transition :name="slide">
    <article class="news-add-group">
      <section class="content" v-if="dataArray.length">
        <scroll bcColor="#fff"
                ref="scroll"
                :data="dataArray"
                :pullUpLoad="pullUpLoadObj"
                @pullingUp="onPullingUp"
        >
          <ul class="group-list">
            <li class="group-box border-bottom-1px" v-for="(item,index) in dataArray" :key="index" @click="check(item)">
              <div v-if="!item.number" class="select un-check"></div>
              <div v-else class="select" :class="item.isCheck?'is-check':'no-check'"></div>
              <article class="group-logo">
                <img v-if="item.icon && item.icon.length"
                     v-for="(user,i) in item.icon"
                     class="avatar"
                     :key="i"
                     :src="user"
                />
              </article>
              <div class="name">{{item.name}}</div>
              <div class="number">{{item.number}}人</div>
            </li>
          </ul>
        </scroll>
      </section>
      <section class="btn-confirm" v-if="dataArray.length" :class="checkArr.length ? '' : 'gray'" @click="checkOver">确定</section>
      <section class="exception-box" v-if="isEmpty && !dataArray.length">
        <exception errType="nodata"></exception>
      </section>
      <toast ref="toast"></toast>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from 'vuex'
  import Scroll from 'components/scroll/scroll'
  import Exception from 'components/exception/exception'
  import Toast from 'components/toast/toast'
  import { News } from 'api'
  import { ERR_OK } from '../../common/js/config'

  export default {
    components: {
      Scroll,
      Exception,
      Toast
    },
    data() {
      return {
        userName: '',
        dataArray: [],
        isEmpty: false,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        page: 1,
        hasMore: true,
        checkStatus: 0,
        checkArr: []
      }
    },
    created() {
      this._getGroupList()
    },
    methods: {
      ...mapActions([
        'setCurrentGroupMsg'
      ]),
      check(item) {
        if (!item.number) return
        item.isCheck = !item.isCheck
        this.checkArr = this.dataArray.filter((item) => {
          return item.isCheck
        })
      },
      _getGroupList(data) {
        News.getGroupList(data).then(res => {
          if (res.error !== ERR_OK) {
            return this.$refs.toast.show(res.message)
          }
          let arr = res.data
          arr = arr.map(item => {
            item.isCheck = false
            return item
          })
          if (this.page === 1) {
            this.dataArray = arr
            this.isEmpty = !arr.length
          } else {
            arr = [] // todo
            this.pullUpLoad = arr.length
            let newArr = this.dataArray.concat(arr)
            this.dataArray = newArr
          }
          this.hasMore = arr.length
        })
      },
      checkOver() {
        if (!this.checkArr.length) return
        this.setCurrentGroupMsg(this.checkArr)
        let url = '/news-chat-group'
        this.$router.replace(url)
      },
      scrollTop() {
        this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0)
      },
      onPullingUp() {
        // 更新数据
        if (!this.pullUpLoad) return // 防止下拉报错
        if (!this.hasMore) return this.$refs.scroll.forceUpdate()
        let page = ++this.page
        this._getGroupList({page})
        console.info('pulling up and load data')
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
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
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .exception-box
    padding-top: 92px

  .btn-confirm
    position: fixed
    left: 0
    right: 0
    bottom: 0
    height: 44.5px
    line-height: 44.5px
    text-align: center
    background: $color-20202E
    font-family: $font-family-medium
    font-size: $font-size-16
    color: $color-white-fff
    letter-spacing: 0.3px
  .gray.btn-confirm
    background: #ccc

  .news-add-group
    fill-box()
    background-color: $color-white-fff
    z-index: 10
    .content
      fill-box(absolute)
      overflow: hidden
      padding-bottom: 45px

      .group-list
        background: $color-white-fff
        padding-left: 15px
        font-family: $font-family-regular
        line-height: 1

        .group-box
          height: 75px
          layout(row, block, nowrap)
          align-items: center
          .select
            width: 20px
            height: 20px
            margin-right: 10px
            &.un-check
              icon-image(icon-nocheck)
            &.no-check
              icon-image(icon-uncheck)
            &.is-check
              icon-image(icon-selected)
          .group-logo
            width: 45px
            height: 45px
            background: #F3F5F7
            overflow: hidden
            .avatar
              float: left
              width: 15px
              height: 15px
              box-sizing: border-box
              border: 1px solid $color-white-fff
          .name
            flex: 1
            font-size: $font-size-16
            color: $color-20202E
            letter-spacing: 0.6px
            margin: 0 10px
            no-wrap()
          .number
            margin-right: 15px
            font-size: $font-size-14
            color: $color-888888
            letter-spacing: 0.3px


</style>
