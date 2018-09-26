<template>
  <transition :name="slide">
    <article class="client-user-list">
      <!--<search @toNav="toSearch"></search>-->
      <section class="add-user" @click="toAddUser">
        <img class="icon" src="./icon-add@3x.png" alt="">
        <div class="txt">添加成员</div>
      </section>
      <div class="f3"></div>
      <!--<section class="total">共 {{total}} 位</section>-->
      <ul class="tablist-box border-bottom-1px" v-if="dataArray.length" >
        <li class="tablist-item" v-for="(item, index) in tabList" v-bind:key="index" :class="tabListIndex===index?'active':''" @click="tabSelect(index)">{{item}}</li>
      </ul>
      <div class="simple-scroll-demo"  v-if="dataArray.length">
        <div class="scroll-list-wrap">
          <scroll ref="scroll"
                  bcColor="#fff"
                  :data="dataArray"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingUp="onPullingUp">
            <ul class="user-list">
              <li class="user-list-item" v-for="(item,index) in dataArray" :key="index" @click="check(item)">
                <slide-view @grouping="groupingHandler" :item="item" @del="delHandler">
                  <user-card :userInfo="item" slot="content" :useType="selectText"></user-card>
                </slide-view>
              </li>
            </ul>
          </scroll>
        </div>
      </div>
      <section class="exception-box" v-if="isEmpty">
        <exception errType="nodata"></exception>
      </section>
      <confirm-msg ref="confirm" @confirm="msgConfirm" @cancel="msgCancel"></confirm-msg>
      <toast ref="toast"></toast>
      <router-view @refresh="refresh"></router-view>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import Search from 'components/client-header-search/client-header-search'
  import SlideView from 'components/slide-view/slide-view'
  import Scroll from 'components/scroll/scroll'
  import UserCard from 'components/client-user-card/client-user-card'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import {Client} from 'api'
  import Toast from 'components/toast/toast'
  import {ERR_OK} from 'common/js/config'
  import Exception from 'components/exception/exception'

  const LIMIT = 10
  export default {
    name: 'ClientUserList',
    data() {
      return {
        dataArray: [],
        title: null, // 分组名称
        id: null, // 分组ID
        checkedItem: null,
        scrollbar: true,
        scrollbarFade: true,
        pullDownRefresh: false,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        startY: 0,
        scrollToX: 0,
        scrollToY: -200,
        scrollToTime: 700,
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
        items: [],
        itemIndex: 0,
        page: 1,
        limit: LIMIT,
        isAll: false,
        total: 0,
        tabList: ['加入时间', '成交率', '跟进时间', '活跃时间'],
        tabListIndex: 0,
        selectText: 'join',
        isEmpty: false
      }
    },
    created() {
      this.getParams()
      this.getCustomerList()
      document.title = this.title
    },
    beforeRouteLeave(to, from, next) {
      this.$emit('refresh')
      next(true)
    },
    mounted() {
    },
    methods: {
      refresh() {
        this.page = 1
        this.limit = LIMIT
        this.isAll = false
        this.$nextTick(() => {
          this.title && (document.title = this.title)
        })
        this.getCustomerList()
      },
      toSearch() {
        const path = `/client/client-user-list/client-search`
        this.$router.push({path})
      },
      getParams() {
        this.title = this.$route.query.title
        this.id = this.$route.query.id
      },
      getCustomerList() {
        this.page = 1
        this.isAll = false
        const data = {
          get_group_detail: 1,
          group_id: this.id,
          page: 1,
          limit: LIMIT,
          order_by: this.selectText
        }
        Client.getCustomerList(data).then(res => {
          if (res.error === ERR_OK) {
            this.dataArray = res.data
            this.isEmpty = !this.dataArray.length
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      toAddUser() {
        const path = `/client/client-user-list/client-add-user`
        this.$router.push({path, query: {id: this.id}}) // 分组id
      },
      check(item) {
        const path = `/client/client-user-list/client-detail`
        this.$router.push({path, query: {id: item.id, pageUrl: path}})
      },
      groupingHandler(index, item) {
        const path = `/client/client-user-list/client-set-group`
        this.$router.push({path, query: {id: item.id}}) // 客户id
      },
      delHandler(index, item) {
        this.checkedItem = item
        this.$refs.confirm.show()
      },
      msgConfirm() {
        const idx = this.dataArray.findIndex(val => val.id === this.checkedItem.id)
        this.dataArray.splice(idx, 1)
        const data = {
          group_id: this.id, // 分组id
          customer_id: this.checkedItem.id
        }
        Client.delCustomer(data).then(res => {
          if (res.error === ERR_OK) {
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      msgCancel() {
        this.checkedItem = null
      },
      onPullingUp() {
        // 更新数据
        if (!this.pullUpLoad) return // 防止下拉报错
        if (this.isAll) return this.$refs.scroll.forceUpdate()
        console.info('pulling up and load data')
        let page = ++this.page
        let limit = LIMIT
        const data = {
          get_group_detail: 1,
          group_id: this.id,
          page: page,
          limit: limit,
          order_by: this.selectText
        }
        Client.getCustomerList(data).then(res => {
          if (res.error === ERR_OK) {
            if (res.data && res.data.length) {
              let arr = this.dataArray.concat(res.data)
              this.dataArray = arr
            } else {
              this.$refs.scroll.forceUpdate()
              this.isAll = true
              this.pullUpLoad = false
            }
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      },
      tabSelect(index) {
        this.$refs.scroll.scrollTo(0, 0)
        this.tabListIndex = index
        this.isAll = false
        this.pullUpLoad = true
        switch (index * 1) {
          case 0:
            this.selectText = 'join'
            this.getCustomerList()
            break
          case 1:
            this.selectText = ''
            this.getCustomerList()
            break
          case 2:
            this.selectText = 'follow'
            this.getCustomerList()
            break
          case 3:
            this.selectText = 'active'
            this.getCustomerList()
            break
        }
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
    components: {
      Search,
      Scroll,
      SlideView,
      UserCard,
      ConfirmMsg,
      Toast,
      Exception
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .exception-box
    padding-top: 70px

  .f3
    height: 10px
    background: $color-F0F2F5

  .client-user-list
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 10
    background-color: $color-white-fff
    layout()
    .add-user
      height: 49px
      layout(row)
      align-items: center
      .icon
        width: 22.5px
        height: 19px
        margin: 0 8px 0 15px
      .txt
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-20202E
        letter-spacing: 0.6px
    .total
      height: 29px
      background-color: $color-F0F2F5
      line-height: 29px
      text-indent: 15px
      font-family: $font-family-regular
      font-size: $font-size-12
      color: $color-888888

  .simple-scroll-demo
    position: fixed
    left: 0
    top: 104px
    right: 0
    bottom: 0
    z-index: 10
    .scroll-list-wrap
      position relative
      height: 100%
      border-radius: 4px
      transform: rotate(0deg)
      overflow: hidden
  .tablist-box
    layout(row)
    width: 100%
    box-sizing: border-box
    .tablist-item
      width: 25%
      height: 45px
      line-height: 45px
      text-align: center
      font-size: $font-size-14
      color: $color-20202E
      font-family: $font-family-regular
      transition: all 0.3s
    .active
      font-size: $font-size-14
      color: $color-56BA15
      font-family: $font-family-medium
  .user-list
    position: relative
    .user-list-item
      height: 76px
      lr-border-bottom-1px()
</style>
