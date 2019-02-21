<template>
  <transition name="slide">
    <article class="client-user-list">
      <section class="add-user">
        <p class="txt">{{this.title}}（{{dataArray.length}}人）</p>
        <div v-if="this.groupType === 0" class="icon" @click="toAddUser"></div>
      </section>
      <div class="simple-scroll"  v-if="dataArray.length">
        <div class="scroll-list-wrap">
          <scroll ref="scroll"
                  bcColor="#fff"
                  :data="dataArray"
                  :pullUpLoad="pullUpLoadObj"
                  @pullingUp="onPullingUp">
            <ul class="user-list">
              <li class="user-list-item" v-for="(item,index) in dataArray" :key="index" @click="check(item)">
                <slide-view @grouping="groupingHandler" :item="item" @del="delHandler" @touchBegin="touchBegin" @touchEnd="touchEnd" :index="index" :hasFn="true" :ref="'slide' + index">
                  <user-card :userInfo="item" slot="content" useType="join"></user-card>
                </slide-view>
              </li>
            </ul>
          </scroll>
        </div>
      </div>
      <section class="exception-box" v-if="isEmpty">
        <exception errType="nodata"></exception>
      </section>
      <div class="bottom">
        <div class="btn" @click="marketing">
          <span class="icon"></span>
          <span class="text">场景营销</span>
        </div>
        <span style="width: 12px"></span>
        <router-link tag="div" to="" class="btn ">
          <span class="icon"></span>
          <span class="text">发消息</span>
        </router-link>
      </div>
      <confirm-msg ref="confirm" @confirm="msgConfirm" @cancel="msgCancel"></confirm-msg>
      <toast ref="toast"></toast>
      <router-view @refresh="refresh"></router-view>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
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
        isEmpty: false,
        moveIdx: -1,
        groupType: null,
        userInfo: ''
      }
    },
    created() {
      this.userInfo = this.$storage.get('info')
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
        this.groupType = this.$route.query.groupType
      },
      getCustomerList() {
        this.page = 1
        this.isAll = false
        let data = {
          page: this.page,
          limit: this.limit,
          group_id: this.id,
          group_type: this.groupType, // 分组类型0自定义1pens，2kol，3活跃新客，4已购客户
          store_id: this.userInfo.store_id,
          merchant_id: this.userInfo.merchant_id
        }
        Client.getGroupCustomerList(data).then(res => {
          if (res.error === ERR_OK) {
            this.dataArray = res.data
            this.isEmpty = !this.dataArray.length
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      marketing() {
        this.$router.push(`/market?groupId=${this.id}&groupName=${this.title}`)
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
        const data = {
          // group_id: this.id, // 分组id
          customer_id: this.checkedItem.id
        }
        Client.delCustomer(data, this.id).then(res => {
          if (res.error === ERR_OK) {
            const idx = this.dataArray.findIndex(val => val.id === this.checkedItem.id)
            this.dataArray.splice(idx, 1)
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
        if (this.isAll) return this.$refs.scroll && this.$refs.scroll.forceUpdate()
        let page = ++this.page
        let limit = this.limit
        const data = {
          page: page,
          limit: limit
        }
        Client.getGroupCustomerList(this.id, data).then(res => {
          if (res.error === ERR_OK) {
            if (res.data && res.data.length) {
              let arr = this.dataArray.concat(res.data)
              this.dataArray = arr
            } else {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
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
          this.$refs.scroll && this.$refs.scroll.destroy()
          this.$refs.scroll && this.$refs.scroll.initScroll()
        })
      },
      touchBegin(idx) {
        if (+idx !== +this.moveIdx && this.moveIdx !== -1) {
          let refName = 'slide' + this.moveIdx
          this.$refs[refName][0] && this.$refs[refName][0]._itemInit(false)
        }
      },
      touchEnd(idx) {
        this.moveIdx = idx
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
      height: 50px
      layout(row)
      align-items: center
      padding: 0 12px
      justify-content: space-between
      background: #F7F7F8
      .txt
        font-family: $font-family-medium
        font-size: $font-size-16
        color: #0E1249
        letter-spacing: 1px
      .icon
        width: 30px
        height: 30px
        icon-image(icon-addgroup)

    .total
      height: 29px
      background-color: $color-F0F2F5
      line-height: 29px
      text-indent: 15px
      font-family: $font-family-regular
      font-size: $font-size-12
      color: $color-888888

  .simple-scroll
    position: fixed
    left: 0
    top: 50px
    right: 0
    bottom: 55px
    z-index: 10
    .scroll-list-wrap
      position relative
      height: 100%
      transform: rotate(0deg)
      overflow: hidden
      .user-list
        position: relative
        .user-list-item
          height: 76px
          lr-border-bottom-1px()
  .bottom
    height: 55px
    width: 100%
    bottom: 0
    left: 0
    background: #FFFF
    border-top-1px(#E1E1E1)
    position: absolute
    z-index: 20
    display: flex
    justify-content: space-between
    align-items: center
    padding: 0 12px
    box-sizing: border-box
    .icon
      width: 18px
      height: 18px
      margin-right: 5px
    .btn
      flex: 1
      overflow: hidden
      height: 40px
      display: flex
      justify-content: center
      align-items: center
      background: $color-linear-main
      border-radius: 6px
      color: #FFF
      font-size: $font-size-14
      font-family: $font-family-regular
      .icon
        icon-image(icon-addwechat)
      &:last-child
        background: linear-gradient(129deg, #02E68B, #06D4AA)
        .icon
          icon-image(icon-sendnews)

</style>
