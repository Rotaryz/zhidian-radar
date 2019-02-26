<template>
  <transition name="slide">
    <article class="client-add-user">
      <ul class="custom-tab" v-if="dataArray.length">
        <li v-for="(item, index) in tabList" :key="index" class="tab-item" :class="tabListIndex === index ?'active':''" @click="tabSelect(index)">{{item}}</li>
        <li class="line-tab" :style="'transform: translate3d('+ tabListIndex * 100 +'%, 0, 0)'"></li>
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
              <img class="user-icon" :src="item.image_url" alt="" :style="{borderColor: pnes[item.group_rule_name || 'd']}" >
              <section class="base-info">
                <div class="name">{{item.name}}</div>
                <div class="status">{{item.last_follow_day}}</div>
              </section>
              <div class="ai" v-if="selectText === 'join'">
                <div class="type">{{item.sources}}</div>
                <div class="time">{{item.flow_join_at}}</div>
              </div>
              <div class="ai" v-if="selectText === 'active_index'">
                <div class="type">活跃指数</div>
                <div class="time">{{item.active_value}}</div>
              </div>
              <div class="ai" v-if="selectText === 'rfm'">
                <div class="type">RFM指数</div>
                <div class="time">{{item.last_follow_at}}</div>
              </div>
              <div class="ai" v-if="selectText === 'kol_index'">
                <div class="type">KOL指数</div>
                <div class="time">{{item.kol_value}}</div>
              </div>
            </li>
          </ul>
          <!--<div style="height: 45px;"></div>-->
        </scroll>
      </div>
      <footer class="bottom">
        <div class="btn" @click="submit">确定</div>
      </footer>
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
  import Exception from 'components/exception/exception'
  import {PNES_COLOR} from 'common/js/pnes'

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
        tabList: ['加入时间', '活跃指数', 'KOL指数'],
        tabListIndex: 0,
        selectText: 'join',
        isEmpty: false,
        pnes: PNES_COLOR
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
          item.is_member && arr.push(item.id)
          item.isCheck && arr.push(item.id)
        })
        const data = {
          customer_ids: arr
        }
        Client.addGroupCustomer(this.id, data).then(res => {
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
        if (this.isAll) return this.$refs.scroll && this.$refs.scroll.forceUpdate()
        // 更新数据

        let page = ++this.page
        let limit = this.limit
        const data = {
          group_id: this.id,
          page,
          limit,
          order_by: this.selectText,
          shop_id: this.$storage.get('info').shop_id
        }
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
            this.$refs.scroll && this.$refs.scroll.forceUpdate()
            this.isAll = true
          }
        })
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll && this.$refs.scroll.destroy()
          this.$refs.scroll && this.$refs.scroll.initScroll()
        })
      },
      tabSelect(index) {
        this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0)
        this.tabListIndex = index
        switch (index * 1) {
          case 0:
            this.selectText = 'join'
            this.getNewDataList()
            break
          case 1:
            this.selectText = 'active_index'
            this.getNewDataList()
            break
          case 2:
            this.selectText = 'kol_index'
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
          order_by: this.selectText,
          shop_id: this.$storage.get('info').shop_id
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
          width: 20px
          height: 20px
          border-radius: 50%
          border-1px(#999, 40px)
          box-sizing: border-box
          background: url("")
          &.active
            background: url("./icon-pickup@3x.png") no-repeat center / 100%
            border: none
            &:before,&:after
              border: 0
          &.un-check
            background: url("./icon-nocheck@3x.png") no-repeat center / 100%
            border: none
        .user-icon
          width: 40px
          height: 40px
          border-radius: 50%
          padding: 1.5px
          border: 1.5px solid #F3F3F3
          margin: 0 10px
        .base-info
          flex: 1
          height: 100%
          layout()
          justify-content: space-around
          .name
            font-family: $font-family-regular
            font-size: $font-size-16
            color: #333
            letter-spacing: 0.6px
            max-width :18vw
            no-wrap()
          .status
            font-family: $font-family-regular
            font-size: $font-size-12
            color: #949494
            margin-top: 11px
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
            font-family: $font-family-regular
            font-size: $font-size-12
            color: #333
          .time
            text-align: right
            font-family: $font-family-regular
            font-size: $font-size-12
            color: #949494
            margin-top: 11px
    .bottom
      height: 54px
      background: #FFF
      border-top-1px(#E1E1E1)
      padding: 7px 15px
      box-sizing: border-box
      position: fixed
      left: 0
      right: 0
      bottom: 0
      .btn
        width: 100%
        height: 40px
        z-index: 55
        line-height: 40px
        text-align: center
        background: $color-linear-main
        color: $color-white
        font-family: $font-family-medium
        font-size: $font-size-14
        letter-spacing: 0.3px
        border-radius: 6px
  .scroll-box
    fill-box(absolute)
    top: 45px
    bottom: 54px
    z-index: 50
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
      width: 33.333%
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
</style>
