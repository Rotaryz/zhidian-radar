<template>
  <div class="news">
    <scroll :data="latelyList" :bcColor="'#ffffff'" ref="scroll">
      <div class="news-item group-item border-bottom-1px" @click="createGroup">
        <div class="news-left group">
          <img src="./icon-mass@2x.png" class="left-img group-icon">
        </div>
        <div class="news-right">
          <div class="right-top">
            <span class="top-name">群发小秘书</span>
            <span class="top-time">{{groupItem.time}}</span>
          </div>
          <div class="right-down">
            <div class="down-left" v-html="groupItem.html"></div>
          </div>
        </div>
      </div>
      <div class="news-list border-bottom-1px">
        <div class="news-item" v-for="(item, index) in latelyList" :key="index" @click="chatMsg(item)">
          <div class="underline">
            <div class="left"></div>
            <div class="right" :class="{'border-bottom-1px' : index != latelyList.length - 1}"></div>
          </div>
          <slide-view :useType="3" @del="delHandler" @touchBegin="touchBegin" @touchEnd="touchEnd" :item="item" :index="index" :hasFn="true" :ref="'slide' + index">
            <div slot="content" class="news-item-content">
              <div class="news-left" :class="{'android' : !isIos}">
                <div class="avatar-box" :class="{'android' : !isIos}" :style="{borderColor: item.group_rule_name ? pnesColor[item.group_rule_name] : '#f3f3f3'}">
                  <img v-if="item.avatar" :src="item.avatar" class="left-img" :class="{'android' : !isIos}">
                  <img v-else src="./pic-default_people@2x.png" class="left-img" :class="{'android' : !isIos}">
                </div>
              </div>
              <div class="news-right">
                <div class="right-top">
                  <span class="top-name">{{item.nickName}}</span>
                  <span class="top-time">{{item.time}}</span>
                </div>
                <div class="right-down">
                  <div class="down-left" v-html="item.html"></div>
                  <div class="down-right">
                    <span class="news-count" v-show="item.unreadMsgCount">{{item.unreadMsgCount > 99 ? '···' : item.unreadMsgCount}}</span>
                  </div>
                </div>
              </div>
            </div>
          </slide-view>
        </div>
      </div>
    </scroll>
    <confirm-msg ref="confirm" @confirm="msgConfirm"></confirm-msg>
    <toast ref="toast"></toast>
    <router-view/>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Scroll from 'components/scroll/scroll'
  import SlideView from 'components/slide-view/slide-view'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import { Im } from 'api'
  import { ERR_OK } from 'common/js/config'
  import storage from 'storage-controller'
  import Toast from 'components/toast/toast'
  import {PNES_COLOR} from 'common/js/pnes'

  export default {
    name: 'News',
    created() {
      if (this.newsGetType) {
        this.setNewsGetType(false)
        return
      }
      Im.getGroupMsgList({page: 1, limit: 1}).then(res => {
        if (res.error === ERR_OK) {
          let data = res.data[0]
          let msg = {
            time: (data && data.created_at) || '',
            lastMsg: (data && data.content) || ''
          }
          this.setGroupItem(msg)
        }
      })
    },
    mounted() {
      setTimeout(() => {
        this.$refs.scroll && this.$refs.scroll.refresh()
      }, 20)
    },
    data() {
      return {
        checkedItem: {},
        checkedIdx: -1,
        moveIdx: -1,
        pnesColor: PNES_COLOR,
        isIos: storage.get('isIos'),
        created: false
      }
    },
    methods: {
      ...mapActions([
        'setCurrent',
        'setGroupItem',
        'setNewsGetType',
        'saveList'
      ]),
      chatMsg(item) {
        let currentMsg = {
          nickName: item.nickName,
          avatar: item.avatar,
          account: item.sessionId
        }
        this.setCurrent(currentMsg)
        let url = '/chat/' + item.sessionId + '?modelType=' + item.group_rule_name
        this.$router.push(url)
      },
      createGroup() {
        if (this.created) return
        this.created = true
        setTimeout(() => {
          this.created = false
        }, 1000)
        let pageUrl = this.$route.path
        let path = `${pageUrl}/new-group-msg`
        this.$router.push(path)
      },
      delHandler(idx, item) {
        this.checkedItem = item
        this.checkedIdx = idx
        let data = {
          msg: '确定删除这条记录吗?'
        }
        this.$refs.confirm.show(data)
      },
      msgConfirm() {
        let data = {
          shop_id: this.userInfo.shop_id,
          im_account: this.checkedItem.sessionId
        }
        Im.delContact(data).then((res) => {
          if (res.error === ERR_OK) {
            let newList = this.latelyList.filter((item) => {
              return item.sessionId !== this.checkedItem.sessionId
            })
            this.saveList(newList)
            let refName = 'slide' + this.checkedIdx
            this.$refs[refName][0] && this.$refs[refName][0]._itemInit(false)
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
      }
    },
    computed: {
      ...mapGetters([
        'latelyList',
        'groupItem',
        'newsGetType'
      ]),
      userInfo() {
        return storage.get('info')
      }
    },
    watch: {
      latelyList: function () {
        setTimeout(() => {
          this.$refs.scroll && this.$refs.scroll.refresh()
        }, 20)
      }
    },
    components: {
      Scroll,
      Toast,
      SlideView,
      ConfirmMsg
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .news
    position: fixed
    left: 0
    top: 0
    right: 0
    z-index: 30
    bottom: 50px
    background: $color-white
    .news-list
      background: $color-white
    .group-item
      padding-left: 15px
      .news-left
        .group-icon.left-img
          width: 34px
          height: 34px
          position: absolute
          all-center()

    .news-item
      display: flex
      height: 69px
      align-items: center
      position: relative
      .underline
        position: absolute
        left: 15px
        bottom: 0
        right: 0
        display: flex
        .left
          width: 45px
          margin-right: 10px
        .right
          flex: 1
      .news-item-content
        box-sizing: border-box
        padding-left: 15px
        width: 100%
        display: flex
        align-items: center
      .news-left
        width: 47px
        height: 47px
        position: relative
        margin-right: 10px
        display: flex
        align-items: center
        justify-content: center
        .avatar-box
          border: 1.5px solid red
          border-radius: 50%
          box-sizing: border-box
          overflow: hidden
          &.android
            border: 2px solid red
          .left-img
            width: 39px
            height: 39px
            border: 1.5px solid #fff
            border-radius: 50%
            display: block
            &.android
              width: 38px
              height: 38px
              border: 2px solid #fff
        .news-count
          display: inline-block
          min-width: 7px
          height: 16px
          border-radius: 8px
          background: $color-red
          text-align: center
          line-height: 16px
          font-family: PingFangSC-Semibold
          font-size: $font-size-small-s
          color: $color-white
          position: absolute
          right: -6px
          top: -6px
          padding: 0 4.5px
      .news-right
        padding-right: 15px
        flex: 1
        overflow: hidden
        height: 100%
        display: flex
        flex-direction: column
        justify-content: center
        .right-top
          padding-bottom: 6px
          width: 100%
          display: flex
          justify-content: space-between
          align-items: center
          .top-name
            font-family: $font-family-regular
            font-size: $font-size-medium-x
            letter-spacing: 1px
            width: 88%
            color: $color-0E1249
            overflow: hidden
            line-height: 1.2
          .top-time
            font-family: $font-family-light
            font-size: $font-size-11
            color: $color-text-99
        .right-down
          width: 100%
          display: flex
          .down-left
            width: 80%
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            font-family: $font-family-regular
            font-size: $font-size-13
            color: $color-text-88
            line-height: 1.2
          .down-right
            width: 20%
            display: flex
            justify-content: flex-end
            .news-count
              display: inline-block
              min-width: 7px
              height: 16px
              border-radius: 8px
              background: $color-red
              text-align: center
              line-height: 16px
              font-family: PingFangSC-Semibold
              font-size: $font-size-small-s
              color: $color-white
              padding: 0 4.5px

</style>
