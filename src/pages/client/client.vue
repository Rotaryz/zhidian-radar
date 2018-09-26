<template>
  <div class="client">
    <header>
      <search @toNav="toSearch"></search>
      <dl class="tab-wrapper">
        <dt class="line-wrap" :style="'transform: translate3d('+ selectTab * 100 +'%, 0, 0)'"></dt>
        <dd class="tab" v-for="(item,index) in tabList" :key="index" @click="changeTab(index)">{{item.title}}({{item.number}})</dd>
      </dl>
      <div class="f3"></div>
    </header>
    <section class="custom-content" v-if="selectTab === 0">
      <ul class="custom-tab border-bottom-1px" v-if="dataArray.length">
        <li v-for="(item, index) in groupList" :key="index" class="tab-item" :class="item.isCheck?'active':''" @click="checkCustom(item)">{{item.name}}</li>
      </ul>
      <div class="custom-scroll" v-if="dataArray.length">
        <scroll bcColor="#fff"
                ref="scroll"
                :data="dataArray"
                :pullUpLoad="pullUpLoadObj"
                @pullingUp="onPullingUp"
        >
          <ul class="user-list">
            <li class="user-list-item"
                v-for="(item,index) in dataArray"
                :key="index"
                @click="check(item)"
            >
              <slide-view :useType="1" @grouping="groupingHandler" :item="item">
                <user-card :userInfo="item" slot="content" :useType="checkedGroup.orderBy"></user-card>
              </slide-view>
            </li>
          </ul>
        </scroll>
      </div>
      <section class="exception-box" v-if="isEmpty">
        <exception errType="customer"></exception>
      </section>
    </section>
    <section class="group-content" v-if="selectTab === 1">
      <section class="group-add border-bottom-1px" @click="toCreateGroup">
        <div class="icon"></div>
        <div class="title">新建分组</div>
      </section>
      <article class="group-scroll" v-if="userListArr.length">
        <scroll bcColor="#fff"
                :data="userListArr"
        >
          <ul class="user-list-box" v-if="userListArr.length">
            <li class="user-list-item"
                v-for="(item,index) in userListArr"
                :key="index"
                @click="toUserList(item)"
            >
              <slide-view :useType="3" @del="delHandler" :item="item">
                <div slot="content" class="user-list-item-wrapper">
                  <div class="users-avatar">
                    <img v-if="item.icon && item.icon.length"
                         v-for="(user,i) in item.icon"
                         class="avatar"
                         :key="i"
                         :src="user"
                    />
                  </div>
                  <div class="name">{{item.name}}</div>
                  <div class="number">{{item.number}}人</div>
                </div>
              </slide-view>
            </li>
          </ul>
        </scroll>
      </article>
      <section class="exception-box" v-if="userListIsEmpty">
        <exception errType="nodata"></exception>
      </section>
    </section>
    <toast ref="toast"></toast>
    <confirm-msg ref="confirm" @confirm="msgConfirm"></confirm-msg>
    <router-view @refresh="refresh"></router-view>
  </div>
</template>

<script>
  // import {ease} from 'common/js/ease'
  import Search from 'components/client-header-search/client-header-search'
  import SlideView from 'components/slide-view/slide-view'
  import Scroll from 'components/scroll/scroll'
  import UserCard from 'components/client-user-card/client-user-card'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import {Client} from 'api'
  import ActionSheet from 'components/action-sheet/action-sheet'
  import Toast from 'components/toast/toast'
  import {ERR_OK} from '../../common/js/config'
  import Exception from 'components/exception/exception'

  const groupList = [{
    orderBy: 'join',
    name: '加入时间',
    isCheck: true
  }, {
    orderBy: '',
    name: '成交率',
    isCheck: false
  }, {
    orderBy: 'follow',
    name: '跟进时间',
    isCheck: false
  }, {
    orderBy: 'active',
    name: '活跃时间',
    isCheck: false
  }]
  const LIMIT = 10
  export default {
    name: 'Client',
    data() {
      return {
        groupList: groupList,
        tabList: [{title: '客户', number: 0}, {title: '分组', number: 0}],
        selectTab: 0,
        userListArr: [],
        dataArray: [],
        userListIsEmpty: false,
        isEmpty: false,
        checkedItem: null, // 被选中的分组
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        page: 1,
        limit: LIMIT,
        isAll: false,
        total: 0
      }
    },
    created() {
      this.$emit('tabChange', 3)
      this.getGroupList()
      this.getCustomerList()
    },
    beforeDestroy() {
    },
    mounted() {
    },
    methods: {
      changeTab(index) {
        this.selectTab = index
      },
      checkCustom(item) {
        if (item.isCheck) return
        this.groupList.forEach(item => { item.isCheck = false })
        item.isCheck = true
        this.pullUpLoad = true
        this.isAll = false
        this.page = 1
        this.changeGroup()
      },
      refresh() {
        this.isAll = false
        this.page = 1
        this.limit = LIMIT
        this.getGroupList()
        this.getCustomerList()
      },
      toSearch() {
        const path = `/client/client-search`
        this.$router.push({path})
      },
      getGroupList() {
        Client.getGroupList().then(res => {
          if (res.error === ERR_OK) {
            let arr = res.data
            this.userListArr = arr
            this.tabList[1].number = arr.length
            this.userListIsEmpty = !arr.length
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      getCustomerList() {
        const data = {order_by: this.checkedGroup.orderBy, page: 1, limit: LIMIT}
        Client.getCustomerList(data).then(res => {
          if (res.error === ERR_OK) {
            this.dataArray = res.data
            this.tabList[0].number = res.meta.total
            this.isEmpty = !this.dataArray.length
            this.pullUpLoad = !!this.dataArray.length // 防止下拉报错
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      toUserList(item) {
        const path = `/client/client-user-list`
        this.$router.push({path, query: {title: item.name, id: item.id}}) // 分组名称 和 分组id
      },
      toCreateGroup() {
        const path = `/client/client-create-group`
        this.$router.push({path})
      },
      check(item) {
        const path = `/client/client-detail`
        this.$router.push({path, query: {id: item.id, pageUrl: path}})
      },
      groupingHandler(index, item) {
        const path = `/client/client-set-group`
        this.$router.push({path, query: {id: item.id}}) // 客户id
      },
      changeGroup() {
        const data = {order_by: this.checkedGroup.orderBy}
        Client.getCustomerList(data).then(res => {
          if (res.data) {
            this.dataArray = res.data
            this.total = res.meta.total // 共多少人
          }
        })
      },
      delHandler(index, item) {
        this.checkedItem = item
        this.$refs.confirm.show()
      },
      msgConfirm() {
        const data = {groupId: this.checkedItem.id}
        const idx = this.userListArr.findIndex(val => val.id === this.checkedItem.id)
        this.userListArr.splice(idx, 1)
        this.tabList[1].number = this.userListArr.length
        Client.delGroup(data).then(res => {
          if (res.error === ERR_OK) {
          } else {
            this._getGroupList()
            this.$refs.toast.show(res.message)
          }
        })
      },
      msgCancel() {
        this.checkedItem = null
      },
      scrollTop() {
        this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0)
      },
      onPullingUp() {
        // 更新数据
        console.info('pulling up and load data')
        if (!this.pullUpLoad) return
        if (this.isAll) return this.$refs.scroll.forceUpdate()

        let page = ++this.page
        let limit = this.limit
        const data = {order_by: this.checkedGroup.orderBy, page, limit}
        Client.getCustomerList(data).then(res => {
          if (res.error === ERR_OK) {
            if (res.data && res.data.length) {
              let newArr = this.dataArray.concat(res.data)
              this.dataArray = newArr
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
      checkedGroup() {
        let node = this.groupList.find(val => val.isCheck)
        return node
      },
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
      ActionSheet,
      Toast,
      Exception
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .exception-box
    padding-top: 70px

  .client
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 45px
    background-color: $color-white-fff
    .tab-wrapper
      height: 44.5px
      background: $color-white-fff
      layout(row, block, nowrap)
      margin: 0 45px
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
          width: 30px
          height: 3px
          background: $color-20202E

    .f3
      height: 10px
      background: $color-F0F2F5

    .custom-content
      .custom-tab
        height: 45px
        layout(row, block, nowrap)
        align-items: center
        padding: 0 20px
        justify-content: space-between
        font-family: $font-family-medium
        font-size: $font-size-14
        color: $color-20202E
        letter-spacing: 0.52px
        text-align: center
        line-height: 45px
        .tab-item
          transition: all 0.3s
        .active
          color: #56BA15
      .custom-scroll
        position: absolute
        top: 145px
        bottom: 0
        left: 0
        right: 0
        overflow: hidden
        .user-list
          position: relative
          .user-list-item
            height: 75px
            lr-border-bottom-1px()

  .group-content
    font-family: $font-family-regular
    font-size: $font-size-16
    color: $color-20202E
    letter-spacing: 0.6px
    .group-add
      height: 75px
      layout(row)
      align-items: center
      margin-left: 15px
      .icon
        width: 45px
        height: 45px
        margin-right: 10px
        opacity: 0.8
        background: $color-20202E url("./icon-newconstruction@3x.png") no-repeat center / 20px 20px
    .group-scroll
      position: absolute
      top: 175px
      bottom: 0
      left: 0
      right: 0
      overflow: hidden
      .user-list-box
        background-color: $color-white-fff
        .user-list-item
          height: 75px
          lr-border-bottom-1px()
          .user-list-item-wrapper
            width: 100%
            box-sizing: border-box
            layout(row, block, nowrap)
            align-items: center
            .users-avatar
              width: 45px
              height: 45px
              background-color: $color-f5f7f9
              overflow: hidden
              margin-left: 15px
              .avatar
                float: left
                width: 15px
                height: 15px
                box-sizing: border-box
                border: 1px solid $color-white-fff
            .name
              flex: 1
              margin: 0 10px
              height: 75px
              line-height: @height
              no-wrap()
            .number
              font-size: $font-size-14
              color: $color-888888
              letter-spacing: 0.3px
              margin-right: 15px

</style>
