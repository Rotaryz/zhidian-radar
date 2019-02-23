<template>
  <transition name="slide">
    <article class="client-search">
      <section class="search-box border-bottom-1px">
        <div class="input-box">
          <img class="icon" src="./icon-search@3x.png" alt="">
          <input class="input" type="text" placeholder="请输客户姓名" v-model="userName">
        </div>
        <div class="cancel-btn" @click="cancelHandler">取消</div>
      </section>
      <div class="content" v-if="dataArray.length">
        <scroll bcColor="#fff"
                ref="scroll"
                :data="dataArray"
                :pullUpLoad="pullUpLoadObj"
                @pullingUp="onPullingUp"
        >
          <ul class="user-list">
            <li class="user-box border-bottom-1px" v-for="(item,index) in dataArray" :key="index" @click="check(item)">
              <user-card :userInfo="item" useType="join"></user-card>
            </li>
          </ul>
        </scroll>
      </div>
      <section class="exception-box" v-if="isEmpty">
        <exception errType="nosearch"></exception>
      </section>
      <toast ref="toast"></toast>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Client} from 'api'
  import UserCard from 'components/client-user-card/client-user-card'
  import Toast from 'components/toast/toast'
  import {ERR_OK} from 'common/js/config'
  import Exception from 'components/exception/exception'
  import Scroll from 'components/scroll/scroll'
  import utils from 'common/js/utils'

  const LIMIT = 10
  export default {
    name: 'ClientSearch',
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
        limit: LIMIT,
        isAll: false
      }
    },
    created() {
      this.searchUser(this.userName)
    },
    mounted() {
      this.$watch('userName', utils.debounce((userName) => {
        this.scrollTop()
        this.searchUser(userName)
      }, 200))
    },
    beforeRouteLeave(to, from, next) {
      this.$emit('refresh')
      next(true)
    },
    methods: {
      cancelHandler() {
        this.$router.back()
      },
      check(item) {
        const path = `/client-detail`
        const pageUrl = `/client/client-detail`
        this.$router.push({path, query: {id: item.id, pageUrl}})
      },
      searchUser(name) {
        this.isAll = false
        this.page = 1
        this.limit = LIMIT
        const data = {
          name,
          page: 1,
          limit: LIMIT,
          shop_id: this.$storage.get('info').shop_id
        }
        Client.getCustomerList(data).then(res => {
          if (res.error === ERR_OK) {
            this.dataArray = [...res.data]
            console.log(res.data, this.dataArray)
            this.isEmpty = !this.dataArray.length
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      scrollTop() {
        this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0)
      },
      onPullingUp() {
        // 更新数据
        console.info('pulling up and load data')
        if (!this.pullUpLoad) return // 防止下拉报错
        if (this.isAll) return this.$refs.scroll && this.$refs.scroll.forceUpdate()
        let page = ++this.page
        let limit = this.limit
        const data = {name: this.userName, page, limit}
        Client.getCustomerList(data).then(res => {
          if (res.error === ERR_OK) {
            if (res.data && res.data.length) {
              let newArr = this.dataArray.concat(res.data)
              this.dataArray = newArr
            } else {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
              this.isAll = true
            }
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll && this.$refs.scroll.destroy()
          this.$refs.scroll && this.$refs.scroll.initScroll()
        })
      }
    },
    watch: {
      // userName(newVal) {
      //   utils.debounce((newVal) => {
      //     console.log(newVal)
      //     this.scrollTop()
      //     this.searchUser(newVal)
      //   }, 200)
      // },
      pullUpLoadObj: {
        handler() {
          if (!this.pullUpLoad) return // 防止下拉报错
          this.rebuildScroll()
        },
        deep: true
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
    components: {
      UserCard,
      Toast,
      Exception,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .exception-box
    padding-top: 92px

  .client-search
    fill-box()
    z-index: 20
    background: #FFF
    layout(column, block, nowrap)
    .search-box
      height: 55px
      background-color: #F7F7F7
      layout(row, block, no-wrap)
      align-items: center
      .input-box
        flex: 1
        layout(row, block, no-warp)
        height: 36px
        margin-left: 15px
        align-items: center
        background: $color-white
        border-radius: 4px
        border-1px($color-line, 4px)
        .icon
          width: 12.8px
          height: 13.2px
          margin: 0 5px 0 15px
        .input
          flex: 1
          outline: none
          font-family: $font-family-regular
          font-size: $font-size-14
          color: #333
          &::-webkit-input-placeholder
            font-family: $font-family-regular
            font-size: $font-size-14
            color: $color-888888
          &:-moz-placeholder
            font-family: $font-family-regular
            font-size: $font-size-14
            color: $color-888888
          &::-moz-placeholder
            font-family: $font-family-regular
            font-size: $font-size-14
            color: $color-888888
          &:-ms-input-placeholder
            font-family: $font-family-regular
            font-size: $font-size-14
            color: $color-888888
      .cancel-btn
        width: 60px
        height: 100%
        font-family: $font-family-medium
        font-size: $font-size-14
        color: #5929DC
        layout()
        justify-content: center
        align-items: center
    .content
      top: 55px
      position: absolute
      left: 0
      right: 0
      bottom: 0
      overflow: hidden

      .user-list
        position: relative
        padding-left: 15px
        .user-box
          layout(row, block, nowrap)
</style>
