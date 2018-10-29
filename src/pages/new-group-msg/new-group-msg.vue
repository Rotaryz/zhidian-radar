<template>
  <div class="new-group-msg">
    <scroll :data="list"
            :bcColor="'#f1f2f5'"
            ref="scroll"
            :pullUpLoad="pullUpLoadObj"
            :showNoMore="showNoMore"
            @pullingUp="onPullingUp">
      <div class="news-list">
        <div class="news-item" v-for="(item, index) in list" :key="index">
          <div class="item-time">
            <span class="time-box">{{item.created_at ? item.created_at : item.msgTimeStamp | timeFormat}}</span>
          </div>
          <div class="item-content">
            <div class="item-top border-bottom-1px">
              <div class="item-title">群发组：<span v-for="(item1, index1) in item.groups" :key="index1">{{index1 == (item.groups.length - 1) ? item1.name + '(' + item1.customers.length + ')' : item1.name + '(' + item1.customers.length + ')，'}}</span></div>
              +
              <div class="item-text" v-html="item.html" v-if="item.type == 1"></div>
              <div class="item-text"  v-if="item.type == 3">[商品信息]</div>
              <div class="item-text"  v-if="item.type == 4">[活动信息]</div>
              <div class="item-text"  v-if="item.type == 5">[活动信息]</div>
              <div class="item-text"  v-if="item.type == 6">[个人微信二维码]</div>
              <div class="item-text"  v-if="item.type == 7">[群微信二维码]</div>
              <img class="item-img" @load="refushBox" v-if="item.type == 20" :src="item.url"/>
            </div>
            <div class="item-down" @click="toChat(item)">再发一条</div>
          </div>
        </div>
      </div>
    </scroll>
    <div class="new-btn" @click="newGroup">新建群发</div>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
  import Toast from 'components/toast/toast'
  import {mapActions, mapGetters} from 'vuex'
  import Scroll from 'components/scroll/scroll'
  import { Im } from 'api'
  import {ERR_OK} from '../../common/js/config'
  import utils from 'common/js/utils'
  export default {
    name: 'NewGroupMsg',
    created() {
      Im.getGroupMsgList({page: 1, limit: 30}).then(res => {
        if (res.error === ERR_OK) {
          this.list = res.data.map((item) => {
            if (item.type * 1 === 1) {
              item.html = utils.msgFaceToHtml(item.content)
            }
            return item
          })
          setTimeout(() => {
            this.$refs.scroll.forceUpdate()
          }, 20)
        }
      })
    },
    mounted() {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    data() {
      return {
        list: [],
        page: 1,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
        showNoMore: false
      }
    },
    methods: {
      ...mapActions([
        'setCurrent',
        'setGroupItem',
        'setCurrentGroupMsg'
      ]),
      chatMsg(item) {
        let currentMsg = {
          nickName: item.nickName,
          avatar: item.avatar,
          account: item.sessionId
        }
        this.setCurrent(currentMsg)
        let url = '/chat?id=' + item.sessionId
        this.$router.push(url)
      },
      toChat(item) {
        if (this.groupMsgIng) {
          this.$refs.toast.show('群发消息发送中，请稍后再发')
          return
        }
        this.setCurrentGroupMsg(item.groups)
        let url = '/news-chat-group'
        this.$router.push(url)
      },
      onPullingUp() {
        if (this.showNoMore) {
          setTimeout(() => {
            this.$refs.scroll.forceUpdate()
          }, 20)
          return
        }
        this.page++
        Im.getGroupMsgList({page: this.page, limit: 30}).then(res => {
          if (res.error === ERR_OK) {
            if (!res.data.length) {
              this.showNoMore = true
              this.page--
            }
            let list = res.data.map((item) => {
              if (item.type * 1 === 1) {
                item.html = utils.msgFaceToHtml(item.content)
              }
              return item
            })
            this.list = [...this.list, ...list]
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      },
      refushBox() {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      },
      newGroup() {
        if (this.groupMsgIng) {
          this.$refs.toast.show('群发消息发送中，请稍后再发')
          return
        }
        let url = '/news-add-group'
        this.$router.push(url)
      }
    },
    computed: {
      ...mapGetters([
        'groupItem',
        'groupMsgIng'
      ]),
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      }
    },
    filters: {
      timeFormat(val) {
        if (val) {
          let res = utils.radarTimeFormat(val)
          return res.time
        }
        return ''
      }
    },
    watch: {
      pullUpLoadObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      }
    },
    components: {
      Scroll,
      Toast
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .new-group-msg
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 50
    background: $color-background
    .news-list
      padding: 0 15px 75px
      .news-item
        padding-top: 25px
        .item-time
          padding-bottom: 15px
          text-align: center
          .time-box
            display: inline-block
            padding: 4px 8px
            background: #D6D6D9
            border-radius: 2px
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-white
            line-height: 14px
        .item-content
          background: $color-white
          border: 1px solid rgba(32,32,46,0.10)
          box-shadow: 0 4px 12px 0 rgba(43,43,145,0.07)
          border-radius: 2px
          .item-top
            padding: 12px 15px 15px
            font-size: 0
            .item-title
              white-space:normal
              word-break:break-all
              font-family: $font-family-regular
              font-size: $font-size-16
              color: $color-text
              line-height: 24px
            .item-text
              padding-top: 12px
              line-height: 21px
              font-family: $font-family-light
              font-size: $font-size-14
              color: $color-888888
            .item-img
              padding-top: 12px
              width: 100%
          .item-down
            width: 100%
            height: 40px
            line-height: 40px
            text-align: center
            font-family: $font-family-regular
            font-size: $font-size-14
            color: #56BA15


  .new-btn
    position: fixed
    left: 0
    bottom: 0
    right: 0
    height: 45px
    z-index: 55
    background: $color-text
    color: $color-white
    text-align: center
    line-height: 44px
    font-family: $font-family-medium
    font-size: $font-size-16
    letter-spacing: 0.3px

</style>
