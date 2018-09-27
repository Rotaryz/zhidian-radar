<template>
  <transition :name="slide">
    <article class="client-add-user">
      <ul class="tablist-box" v-if="dataArray.length">
        <li class="tablist-item" v-for="(item, index) in tabList" v-bind:key="index" :class="tabListIndex===index?'active':''" @click="tabSelect(index)">{{item}}</li>
      </ul>
      <div class="scroll-box" v-if="dataArray.length">
        <scroll ref="scroll"
                bcColor="#fff"
                :data="dataArray"
                :pullUpLoad="pullUpLoadObj"
                @pullingUp="onPullingUp"
        >
          <ul class="user-list">
            <li class="user-box" v-if="dataArray.length" v-for="(item,index) in dataArray" :key="index" @click="check(item)">
              <div :class="['check-box',item.is_member?'un-check':'' ,item.isCheck?'active':'']"></div>
              <img class="user-icon" :src="item.image_url" alt="">
              <section class="base-info">
                <div class="name">{{item.name}}</div>
                <div class="status">{{item.last_follow_day}}</div>
              </section>
              <div class="ai" v-if="selectText === ''">
                <div class="ai-null">AI预计成交率{{item.conversion_rate}}%</div>
              </div>
              <div class="ai" v-if="selectText === 'join'">
                <div class="type">{{item.sources}}</div>
                <div class="time">{{item.flow_join_at}}</div>
              </div>
              <div class="ai" v-if="selectText === 'follow'">
                <div class="type">最后跟进</div>
                <div class="time">{{item.last_follow_at}}</div>
              </div>
              <div class="ai" v-if="selectText === 'active'">
                <div class="type">最后活跃</div>
                <div class="time">{{item.last_active_at}}</div>
              </div>
            </li>
          </ul>
          <!--<div style="height: 45px;"></div>-->
        </scroll>
      </div>
      <footer class="btn" @click="submit">确定</footer>
      <section class="exception-box" v-if="isEmpty">
        <exception errType="nodata"></exception>
      </section>
      <toast ref="toast"></toast>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Client} from 'api'
  import Toast from 'components/toast/toast'
  import Scroll from 'components/scroll/scroll'
  import {ERR_OK} from '../../common/js/config'
  import {mapGetters} from 'vuex'
  import Exception from 'components/exception/exception'

  const LIMIT = 10

  export default {
    name: 'ClientAddUser',
    data() {
      return {
        dataArray: [],
        id: null,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        page: 1,
        limit: LIMIT,
        isAll: false,
        tabList: ['加入时间', '成交率', '跟进时间', '活跃时间'],
        tabListIndex: 0,
        selectText: 'join',
        isEmpty: false
      }
    },
    created() {
      this.id = this.$route.query.id
      this.getNewDataList()
    },
    beforeRouteLeave(to, from, next) {
      this.$emit('refresh')
      next(true)
    },
    methods: {
      check(item) {
        if (item.is_member) return
        item.isCheck = !item.isCheck
      },
      submit() {
        let arr = []
        this.dataArray.map(item => {
          item.isCheck && arr.push({customer_id: item.id})
        })
        const data = {
          group_id: this.id,
          data: arr
        }
        Client.addGroupCustomer(data).then(res => {
          if (res.error === ERR_OK) {
            this.$refs.toast.show('保存成功')
            setTimeout(() => {
              this.$emit('refresh')
              this.$router.back()
            }, 300)
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      onPullingUp() {
        if (!this.pullUpLoad) return
        if (this.isAll) return this.$refs.scroll.forceUpdate()
        // 更新数据
        console.info('pulling up and load data')

        let page = ++this.page
        let limit = this.limit
        const data = {group_id: this.id, page, limit, order_by: this.selectText}
        Client.getCustomerList(data).then(res => {
          if (res.error !== ERR_OK) {
            this.$refs.toast.show(res.message)
            return
          }
          if (res.data && res.data.length) {
            let arr = res.data.map(item => {
              return {...item, isCheck: false}
            })
            this.dataArray.push(...arr)
            this.$refs.scroll && this.$refs.scroll.refresh()
          } else {
            this.$refs.scroll.forceUpdate()
            this.isAll = true
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
        switch (index * 1) {
          case 0:
            this.selectText = 'join'
            this.getNewDataList()
            break
          case 1:
            this.selectText = ''
            this.getNewDataList()
            break
          case 2:
            this.selectText = 'follow'
            this.getNewDataList()
            break
          case 3:
            this.selectText = 'active'
            this.getNewDataList()
            break
        }
      },
      getNewDataList() {
        this.page = 1
        this.isAll = false
        const data = {
          group_id: this.id,
          page: 1,
          limit: LIMIT,
          order_by: this.selectText
        }
        Client.getCustomerList(data).then(res => {
          if (res.error !== ERR_OK) {
            this.$refs.toast.show(res.message)
            return
          }
          if (res.data) {
            this.dataArray = res.data.map(item => {
              return {...item, isCheck: false}
            })
            this.isEmpty = !this.dataArray.length
            this.$refs.scroll && this.$refs.scroll.refresh()
          }
        })
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
      Toast,
      Scroll,
      Exception
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .exception-box
    padding-top: 70px
  .client-add-user
    fill-box()
    background-color: $color-white-fff
    z-index: 50
    .user-list
      position: relative
      padding-left: 15px
      .user-box
        layout(row, block, no-warp)
        align-items: center
        padding: 15px 0
        lr-border-bottom-1px($color-col-line,0)
        height: 45px
        .check-box
          width: 21px
          height: 21px
          border-radius: 50%
          border: 1px solid $color-col-line
          box-sizing: border-box
          background: url("")
          transition: all 0.1s
          &.active
            background: url("./icon-selected@3x.png") no-repeat center / 100%
            border: none
          &.un-check
            background: url("./icon-nocheck@3x.png") no-repeat center / 100%
            border: none
        .user-icon
          width: 45px
          height: 45px
          opacity: 0.8
          margin: 0 10px
        .base-info
          flex: 1
          height: 100%
          layout()
          justify-content: space-around
          .name
            font-family: $font-family-regular
            font-size: $font-size-16
            color: $color-20202E
            letter-spacing: 0.6px
            max-width :18vw
            no-wrap()
          .status
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-56BA15
        .ai
          width: 142px
          height: 100%
          padding-right: 15px
          padding-top: 5px
          font-family: $font-family-regular
          font-size: $font-size-12
          color: $color-888888
          text-align: right
          .type
            text-align: right
            height: 20px
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-888888
          .time
            text-align: right
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-888888
          .ai-null
            text-align: right
            padding-top: 10px
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-888888
    .btn
      height: 45px
      position: fixed
      bottom: 0
      left: 0
      right: 0
      line-height: 45px
      text-align: center
      background-color: $color-20202E
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-white-fff
      letter-spacing: 0.3px
      z-index: 2
  .scroll-box
    fill-box(absolute)
    top: 45px
    bottom: 45px
    z-index: 50
  .tablist-box
    layout(row)
    width: 100%
    box-sizing: border-box
    position: fixed
    top: 0
    left: 0
    z-index: 60
    background: #fff
    border-bottom-1px(#e5e5e5)
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
</style>
