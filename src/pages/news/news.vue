<template>
  <div class="news">
    <scroll :data="latelyList" :bcColor="'#ffffff'" ref="scroll">
      <div class="news-list">
        <div class="news-item border-bottom-1px" @click="createGroup">
          <div class="news-left">
            <img src="./icon-Group@2x.png" class="left-img">
          </div>
          <div class="news-right">
            <div class="right-top">
              <span class="top-name">群发助手</span>
              <span class="top-time">{{groupItem.time}}</span>
            </div>
            <div class="right-down" v-html="groupItem.html"></div>
          </div>
        </div>
        <div class="news-item border-bottom-1px" v-for="(item, index) in latelyList" :key="index" @click="chatMsg(item)">
          <div class="news-left">
            <img :src="item.avatar" class="left-img">
            <span class="news-count" v-show="item.unreadMsgCount">{{item.unreadMsgCount > 99 ? '···' : item.unreadMsgCount}}</span>
          </div>
          <div class="news-right">
            <div class="right-top">
              <span class="top-name">{{item.nickName}}</span>
              <span class="top-time">{{item.time}}</span>
            </div>
            <div class="right-down" v-html="item.html"></div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import Scroll from 'components/scroll/scroll'
  import { Im } from 'api'
  import {ERR_OK} from '../../common/js/config'
  export default {
    name: 'News',
    created() {
      if (this.newsGetType) {
        this.setNewsGetType(false)
        return
      }
      Im.getLastGroupMsg().then(res => {
        if (res.error === ERR_OK) {
          let msg = {
            time: res.data.created_at || '',
            lastMsg: res.data.content || ''
          }
          this.setGroupItem(msg)
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
      }
    },
    methods: {
      ...mapActions([
        'setCurrent',
        'setGroupItem',
        'setNewsGetType'
      ]),
      chatMsg(item) {
        let currentMsg = {
          nickName: item.nickName,
          avatar: item.avatar,
          account: item.sessionId
        }
        this.setCurrent(currentMsg)
        let url = '/chat/' + item.sessionId
        this.$router.push(url)
      },
      createGroup() {
        let url = '/new-group-msg'
        this.$router.push(url)
      }
    },
    computed: {
      ...mapGetters([
        'latelyList',
        'groupItem',
        'newsGetType'
      ])
    },
    watch: {
      latelyList: function() {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    },
    components: {
      Scroll
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
    bottom: 45px
    background: $color-white
    .news-list
      background: $color-white
      padding: 0 15px
      .news-item
        display: flex
        height: 75px
        align-items: center
        .news-left
          width: 45px
          height: 45px
          position: relative
          margin-right: 10px
          .left-img
            width: 100%
            height: 100%
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
              letter-spacing: 0.6px
            .top-time
              font-family: $font-family-regular
              font-size: $font-size-small
              color: $color-text-99
          .right-down
            width: 100%
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            font-family: $font-family-regular
            font-size: $font-size-small
            color: $color-text-88

</style>
