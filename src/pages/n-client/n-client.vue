<template>
  <div class="client">
    <!--头部搜索/tab栏-->
    <header>
      <search @toNav="toSearch"></search>
      <dl class="tab-wrapper">
        <dt class="bg-wrap" :style="'transform: translate3d('+ selectTab * 100 +'%, 0, 0)'"></dt>
        <dd class="tab" :class="{'active':selectTab === index}" v-for="(item,index) in tabList" :key="index" @click="changeTab(index)">{{item.title}}({{item.number}})</dd>
      </dl>
    </header>

    <!--客户列表-->
    <section class="custom-content" v-if="selectTab === 0">
      <ul class="custom-tab border-bottom-1px" v-if="dataArray.length">
        <li v-for="(item, index) in groupList" :key="index" class="tab-item" :class="item.isCheck?'active':''" @click="checkCustom(item, index)">{{item.name}}</li>
        <li class="line-tab" :style="'transform: translate3d('+ tabIndex * 100 +'%, 0, 0)'"></li>
      </ul>
      <div class="custom-scroll" v-if="dataArray.length">
        <scroll bcColor="#fff"
                ref="scroll"
                :data="dataArray"
                :pullUpLoad="pullUpLoadObj"
                @pullingUp="onPullingUp"
        >
          <ul class="user-list" v-if="checkedGroup.orderBy === 'join' || checkedGroup.orderBy === 'activity'">
            <li class="user-list-item"
                v-for="(item,index) in dataArray"
                :key="index"
                @click="check(item)"
            >
              <slide-view :useType="1" @grouping="groupingHandler" :item="item"  @touchBegin="touchBegin" @touchEnd="touchEnd" :index="index" :hasFn="true" :ref="'slide' + index">
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

    <!--分组列表-->
    <section class="group-content" v-if="selectTab === 1">
      <section class="group-add border-top-1px border-bottom-1px" @click="toCreateGroup">
        <div class="icon"></div>
        <div class="title">新建分组</div>
      </section>
      <article class="group-scroll" v-if="userListArr.length">
        <scroll bcColor="#fff"
                :data="userListArr"
        >
          <ul class="user-list-box" v-if="userListArr.length">
            <!--默认分组-->
            <li class="user-list-item"
                v-for="(item,index) in clientGroup"
                :key="'g'+index"
                @click="toUserList(item)"
            >
              <slide-view :useType="4" @del="delHandler" :item="item">
                <div slot="content" class="user-list-item-wrapper">
                  <div class="users-avatar" :class="{'no-border': item.customers.length === 1}">
                    <img v-if="item.customers && item.customers.length && i < 9"
                         v-for="(user,i) in item.customers"
                         class="avatar"
                         :key="i"
                         :src="user.avatar"
                         :class="{
                         'one':item.customers.length === 1,
                         'four': (item.customers.length > 1 && item.customers.length < 5),
                         'six': item.customers.length > 4
                         }"
                    />
                  </div>
                  <div class="name">{{item.name}}</div>
                  <div class="number">{{item.total || 0}}人</div>
                </div>
              </slide-view>
            </li>

            <!--自定义分组-->
            <li class="user-list-item"
                v-for="(item,index) in userListArr"
                :key="index"
                @click="toUserList(item)"
            >
              <slide-view :useType="3" @del="delHandler" :item="item" @touchBegin="touchBegin" @touchEnd="touchEnd" :index="index" :hasFn="true" :ref="'slide' + index">
                <div slot="content" class="user-list-item-wrapper">
                  <div class="users-avatar" :class="{'no-border': item.customers.length === 1}">
                    <img v-if="item.customers && item.customers.length && i < 9"
                         v-for="(user,i) in item.customers"
                         class="avatar"
                         :key="i"
                         :src="user.avatar"
                         :class="{
                         'one':item.customers.length === 1,
                         'four': (item.customers.length > 1 && item.customers.length < 5),
                         'six': item.customers.length > 4
                         }"
                    />
                  </div>
                  <div class="name">{{item.name}}</div>
                  <div class="number">{{item.total || 0}}人</div>
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

    <!--客户分析-->
    <section class="data-content" v-if="selectTab === 2">
      <ul class="custom-tab border-bottom-1px" v-if="dataArray.length">
        <li v-for="(item, index) in dataList" :key="index" class="tab-item" :class="dataIndex === index ?'active':''" @click="checkData(index)">{{item}}</li>
        <li class="line-tab" :style="'transform: translate3d('+ dataIndex * 100 +'%, 0, 0)'"></li>
      </ul>
      <div class="custom-scroll">
        <scroll bcColor="#fff">
          <div style="height: 3px"></div>
          <article class="panel">
            <h1 class="title ">客户性别占比</h1>
            <ai-charts ref="c1" :CHARTS_TYPE="CHARTS_TYPE.GENDER"></ai-charts>
          </article>
          <article class="panel">
            <h1 class="title ">客户城市占比 TOP6</h1>
            <ai-charts ref="c2" :CHARTS_TYPE="CHARTS_TYPE.CITY_TOP"></ai-charts>
          </article>
          <router-link tag="div" to="" class="panel">
            <router-link tag="div" to="z-test" class="title ">KOL传播 TOP10</router-link>
            <ai-charts ref="c3" :CHARTS_TYPE="CHARTS_TYPE.USER_TOP6"></ai-charts>
          </router-link>
          <div style="height: 5px"></div>
        </scroll>
      </div>
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
  import AiCharts from 'components/_ai-charts/_ai-charts'
  import {CHARTS_TYPE} from 'utils/constants-charts'

  const groupList = [{
    orderBy: 'join',
    name: '加入时间',
    isCheck: true
  }, {
    orderBy: 'active_index',
    name: '活跃指数',
    isCheck: false
  }, {
    orderBy: '',
    name: 'RFM指数',
    isCheck: false
  }, {
    orderBy: 'kol_index',
    name: 'KOL指数',
    isCheck: false
  }]
  const clientGroup = [{
    name: '潜在客户',
    total: 0,
    customers: [1, 2, 3, 4, 5]
  }, {
    name: '新客户',
    total: 0,
    customers: [1, 2, 3]
  }, {
    name: '主力客户',
    total: 0,
    customers: [1, 2, 3]
  }, {
    name: '沉睡客户',
    total: 0,
    customers: [1, 2, 3]
  }]
  const LIMIT = 10
  export default {
    name: 'Client',
    data() {
      return {
        groupList,
        clientGroup,
        tabList: [{title: '客户', number: 0}, {title: '分组', number: 0}, {title: '客户分析', number: 0}],
        dataList: ['昨天', '近7天', '近30天', '全部'],
        data: ['today', 'week', 'month', 'all'],
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
        total: 0,
        tabIndex: 0,
        dataIndex: 0,
        CHARTS_TYPE: CHARTS_TYPE,
        moveIdx: -1
      }
    },
    created() {
      this.$emit('tabChange', 3)
      this.getGroupList()
      this.getCustomerList()
    },
    beforeDestroy() {
    },
    methods: {
      changeTab(index) {
        this.selectTab = index
        this.moveIdx = -1
        if (index === 2) {
          this.$nextTick(() => {
            let pieData = {
              seriesData: [
                {name: '男 50%', value: 50},
                {name: '女 40%', value: 40},
                {name: '未知 10%', value: 10}
              ]
            }
            let barData = {
              xAxisData: ['北京', '广州', '成都', '上海', '西安', '深圳'],
              seriesData: [500, 300, 800, 1000, 200, 600]
            }
            this.$refs.c1.action(pieData)
            this.$refs.c2.action(barData)
            this.$refs.c3.action()
          })
        }
      },
      // 客户列表切换
      checkCustom(item, index) {
        if (item.isCheck) return
        this.groupList.forEach(item => { item.isCheck = false })
        item.isCheck = true
        this.tabIndex = index
        this.pullUpLoad = true
        this.isAll = false
        this.page = 1
        this.changeGroup()
      },
      // 客户分析切换时间
      checkData(index) {
        if (this.dataIndex === index) return
        this.dataIndex = index
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
        const data = {order_by: this.checkedGroup.orderBy, limit: this.limit}
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
        Client.delGroup(data).then(res => {
          if (res.error === ERR_OK) {
            const idx = this.userListArr.findIndex(val => val.id === this.checkedItem.id)
            this.userListArr.splice(idx, 1)
            this.tabList[1].number = this.userListArr.length
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
      touchBegin(idx) {
        if (+idx !== +this.moveIdx && this.moveIdx !== -1) {
          let refName = 'slide' + this.moveIdx
          this.$refs[refName][0] && this.$refs[refName][0]._itemInit()
        }
      },
      touchEnd(idx) {
        this.moveIdx = idx
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
      Exception,
      AiCharts
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
    background-color: $color-white
    .tab-wrapper
      background: #F0F0F0
      layout(row, block, nowrap)
      margin: 15px 37px 10px
      border-radius: 20px
      height: 30px
      line-height: 30px
      position: relative
      .tab
        flex: 1
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-main
        text-align: center
        position: relative
        transition: all 0.3s
      .bg-wrap
        position: absolute
        left: 0
        top: 0
        width: 33.333%
        layout()
        height: 30px
        background: $color-linear-main
        border-radius: 30px
        transition: all 0.3s
      .active
        color: #FFF
    .custom-content
      .custom-tab
        height: 45px
        layout(row, block, nowrap)
        align-items: center
        padding: 0 20px
        justify-content: space-between
        font-family: $font-family-medium
        font-size: $font-size-14
        color: $color-text-main
        letter-spacing: 0.52px
        text-align: center
        line-height: 45px
        border-bottom-1px(#E1E1E1)
        position: relative
        .line-tab
          width: 25%
          height: 4px
          position: absolute
          left: 0
          bottom: 0
          display: flex
          justify-content: center
          transition: all 0.3s
          &:after
            content: ''
            height: 4px
            width: 42px
            border-radius: 4px
            background: $color-linear-main
      .custom-scroll
        position: absolute
        top: 150px
        bottom: 0
        left: 0
        right: 0
        overflow: hidden
        .user-list
          position: relative
          .user-list-item
            height: 70px
            border-bottom-1px($color-col-line)

    .data-content
      .custom-tab
        height: 45px
        layout(row, block, nowrap)
        align-items: center
        justify-content: space-around
        font-family: $font-family-medium
        font-size: $font-size-14
        color: $color-text-main
        letter-spacing: 0.52px
        text-align: center
        line-height: 45px
        border-bottom-1px(#E1E1E1)
        position: relative
        .tab-item
          flex: 1
          text-align: center
        .line-tab
          width: 25%
          height: 4px
          position: absolute
          left: 0
          bottom: 0
          display: flex
          justify-content: center
          transition: all 0.3s
          &:after
            content: ''
            height: 4px
            width: 42px
            border-radius: 4px
            background: $color-linear-main
      .custom-scroll
        position: absolute
        top: 150px
        bottom: 6px
        left: 0
        right: 0
        overflow: hidden
        .user-list
          position: relative
          .user-list-item
            height: 70px
            border-bottom-1px($color-col-line)

      .panel
        margin :12px
        background: #FFFFFF
        box-shadow: 0 2px 20px 0 rgba(21,24,45,0.12)
        border-radius: 6px
        overflow :hidden
        .title
          font-family: PingFangSC-Regular
          font-size: 16px
          color: #0E1249
          line-height: 16px
          padding :13.5px 0
          margin : 0 15px 10px
          border-bottom-1px(#E1E1E1)
  .group-content
    font-family: $font-family-regular
    font-size: $font-size-16
    color: #0E1249
    letter-spacing: 0.6px
    .group-add
      height: 70px
      layout(row)
      align-items: center
      padding-left: 22px
      .icon
        width: 34px
        height: 34px
        margin-right: 18px
        background: linear-gradient(-180deg, #02E68B, #06D4AA)
        border-radius: 2px
        position: relative
        &:before,&:after
          content: ''
          width: 2px
          height: 15px
          all-center()
          background: #FFF
          border-radius: 2px
        &:after
          width: 15px
          height: 2px
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
          height: 70px
          border-bottom-1px($color-col-line)
          .user-list-item-wrapper
            width: 100%
            box-sizing: border-box
            layout(row, block, nowrap)
            align-items: center
            .users-avatar
              width: 45px
              height: 45px
              background-color: #E6E6E6
              border: 2px solid #EBEBEB
              border-radius: 2px
              overflow: hidden
              margin-left: 15px
              box-sizing: border-box
              .avatar
                float: left
                box-sizing: border-box
                border: 1px solid $color-white-fff
                object-fit :cover
                width: 45px
                height: 45px
              .one
                width: 45px
                height: 45px
              .four
                width: 20px
                height: 20px
                margin-right: 1px
                margin-bottom: 1px
                &:nth-child(2n)
                  margin-right: 0
                &:nth-child(n+2)
                  margin-bottom: 0
              .six
                width: 13px
                height: 13px
                margin-right: 1px
                margin-bottom: 1px
                &:nth-child(3n)
                  margin-right: 0
                &:nth-child(n+6)
                  margin-bottom: 0
            .no-border
              border: 0
            .name
              flex: 1
              margin: 0 10px
              height: 70px
              line-height: @height
              color: $color-text
              no-wrap()
            .number
              font-size: $font-size-14
              color: $color-text-99
              letter-spacing: 0.3px
              margin-right: 15px

</style>
