<template>
  <transition :name="slide">
    <div class="dynamic-list">
      <scroll ref="scroll"
              :data="dynamicList"
              :pullUpLoad="pullUpLoadObj"
              @pullingUp="onPullingUp">
        <div class="dynamic-item" v-for="(item, index) in dynamicList" :key="index" v-if="item.live_log_detail.length">
          <div class="find-item img-one" v-if="item.live_log_detail[0].type === 1 && item.live_log_detail.length === 1">
            <div class="find-box">
              <div class="cainter">
                <div class="user">
                  <!-- 头像-->
                  <img class="header" :src="item.employee_image_url">
                  <p class="nickname">{{item.employee_name}}</p>
                </div>
                <!--{{comment?'':'special'}}-->
                <pre class="words">{{item.content}}</pre>
                <div class="one-box">
                  <div class="img-one-item" v-for="(items, idx) in item.live_log_detail" :key="idx">
                    <img class="img-small" :src="items.file_url" @click="_seeImage(idx, item.live_log_detail)">
                  </div>
                </div>
              </div>
              <!--<div class="address">-->
              <!--<img class="add-icon">-->
              <!--地址-->
              <!--</div>-->
              <div class="information">
                <div class="time">
                  {{item.created_at}}
                  <p class="del" @click="_delItem(index)">删除</p>
                </div>
                <div class="share">
                  <div class="share-item comment">
                    <img class="find-icon" src="./icon-comment@2x.png">
                    <div class="find-num">
                      评论
                    </div>
                  </div>
                  <!--{{find.is_like ? 'thumbs-up' : ''}}-->
                  <div class="share-item" @click="_goodLike(index)">
                    <img class="find-icon" :src="item.is_like ? require('./icon-like_select@2x.png') : require('./icon-like@2x.png')">
                    <div class="find-num">
                      赞
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="find-item img-two" v-if="item.live_log_detail[0].type === 1 && item.live_log_detail.length === 2">
            <div class="find-box">
              <div class="cainter">
                <div class="user">
                  <img class="header" :src="item.employee_image_url">
                  <p class="nickname">{{item.employee_name}}</p>
                </div>
                <pre class="words">{{item.content}}</pre>
                <div class="img-item-two">
                  <div class="two-item" v-for="(items, idx) in item.live_log_detail" :key="idx">
                    <img class="img-small" :src="items.file_url" @click="_seeImage(idx, item.live_log_detail)">
                  </div>
                </div>
              </div>
              <!--<div class="address">-->
              <!--<img class="add-icon">-->
              <!--地址-->
              <!--</div>-->
              <div class="information">
                <div class="time">
                  {{item.created_at}}
                  <p class="del" @click="_delItem(index)">删除</p>
                </div>
                <div class="share">
                  <div class="share-item comment">
                    <img class="find-icon" src="./icon-comment@2x.png">
                    <div class="find-num">
                      评论
                    </div>
                  </div>
                  <!--{{find.is_like ? 'thumbs-up' : ''}} -->
                  <div class="share-item " @click="_goodLike(index)">
                    <img class="find-icon" :src="item.is_like ? require('./icon-like_select@2x.png') : require('./icon-like@2x.png')">
                    <div class="find-num">
                      赞
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="find-item img-more" v-if="item.live_log_detail[0].type === 1 && item.live_log_detail.length > 2">
            <div class="find-box">
              <div class="cainter">
                <div class="user">
                  <img class="header" :src="item.employee_image_url">
                  <p class="nickname">{{item.employee_name}}</p>
                </div>
                <!--{{comment?'':'special'}}"-->
                <pre class="words">{{item.content}}</pre>
                <div class="img-item-two">
                  <div class="two-item" v-for="(items, idx) in item.live_log_detail" :key="idx">
                    <img class="img-small" :src="items.file_url" @click="_seeImage(idx, item.live_log_detail)">
                  </div>
                </div>
              </div>
              <!--<div class="address" >-->
              <!--<img class="add-icon">-->
              <!--地址-->
              <!--</div>-->
              <div class="information">
                <div class="time">
                  {{item.created_at}}
                  <p class="del" @click="_delItem(index)">删除</p>
                </div>
                <div class="share">
                  <div class="share-item comment">
                    <img class="find-icon" src="./icon-comment@2x.png">
                    <div class="find-num">
                      评论
                    </div>
                  </div>
                  <!--{{find.is_like ? 'thumbs-up' : ''}} -->
                  <div class="share-item" @click="_goodLike(index)">
                    <img class="find-icon" :src="item.is_like ? require('./icon-like_select@2x.png') : require('./icon-like@2x.png')">
                    <div class="find-num">
                      赞
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
      <router-link to="dynamicList/editDynamic" class="new-dynamic">
        <img src="./Oval@2x.png" class="new-dynamic-img">
      </router-link>
      <confirm-msg ref="confirm" @confirm="_sureDel"></confirm-msg>
      <toast ref="toast"></toast>
      <router-view @refresh="_getList"></router-view>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Live, Global } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import Toast from 'components/toast/toast'
  import { mapGetters } from 'vuex'
  import wx from 'weixin-js-sdk'

  export default {
    name: 'dynamic-list',
    data () {
      return {
        dynamicList: [],
        delIndex: null,
        page: 1,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        loadMore: true
      }
    },
    created () {
      let url = location.href
      console.log(location.href)
      Global.jssdkConfig({weixin: 'ai_radar', url}).then((res) => {
        if (res.error === ERR_OK) {
          res = res.data
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appid, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: res.appid, // 必填，生成签名的时间戳
            nonceStr: res.noncestr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名，见附录1
            jsApiList: ['previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        }
      })
      this._getList()
    },
    computed: {
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      },
      ...mapGetters(['ios']),
      slide () {
        return this.ios ? '' : 'slide'
      }
    },
    watch: {
      pullUpLoadObj: {
        handler () {
          this.rebuildScroll()
        },
        deep: true
      }
    },
    methods: {
      _seeImage (index, image) {
        console.log(index, image)
        let imageArr = image.map(item => item.file_url)
        // console.log(imageArr[index], imageArr)
        // 预览图片，正式上面需要打开注释
        wx.previewImage({
          current: imageArr[index], // 当前显示图片的http链接
          urls: imageArr // 需要预览的图片http链接列表
        })
      },
      onPullingUp () {
        this.page++
        this._getList()
      },
      _getList () {
        if (!this.loadMore) {
          this.$refs.scroll.forceUpdate()
          return
        }
        Live.liveLogsList({page: this.page}).then((res) => {
          if (res.error === ERR_OK) {
            if (this.page === 1) {
              this.dynamicList = res.data
              return
            }
            if (res.data.length === 0) {
              this.$refs.scroll.forceUpdate()
              this.loadMore = false
              return
            }
            this.dynamicList = this.dynamicList.concat(res.data)
          }
        })
      },
      _delItem (index) {
        this.delIndex = index
        this.$refs.confirm.show({msg: '确定删除该动态？'})
      },
      // 是否确认删除
      _sureDel () {
        Live.delLogsList(this.dynamicList[this.delIndex].id).then((res) => {
          if (res.error === ERR_OK) {
            this.dynamicList.splice(this.delIndex, 1)
          }
          this.$refs.toast.show(res.message)
        })
      },
      _goodLike (index) {
        let data = {live_log_id: this.dynamicList[index].id, like: this.dynamicList[index].is_like ? 0 : 1}
        Live.likeLog(data).then((res) => {
          if (res.error === ERR_OK) {
            this.dynamicList[index].is_like = !this.dynamicList[index].is_like
            return
          }
          this.$refs.toast.show(res.message)
        })
      },
      rebuildScroll () {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      }
    },
    components: {
      Scroll,
      ConfirmMsg,
      Toast
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .dynamic-list
    position: fixed
    background: dynamic-list
    z-index: 10
    left: 0
    right: 0
    background: $color-background
    bottom: 0
    top: 0

  .find-item
    padding-top: 14px
    background: $color-white
    .find-box
      padding-bottom: 15px
      border-bottom-1px($color-col-line)
      margin-left: 60px
      padding-right: 21px
      .user
        display: flex
        align-items: center
        transform: translateX(-45px)
        .header
          height: 34px
          width: 34px
        .nickname
          transform: translateY(-25%)
          font-family: $font-family-regular
          color: $color-text
          font-size: $font-size-medium-x
          margin-left: 10px
      .words
        display: block
        width: 78.67vw
        font-family: $font-family-regular
        font-size: $font-size-medium
        line-height: 21px
        margin-bottom: 3.5px
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 6
        -webkit-box-orient: vertical
        .p-more
          color: $color-del
          margin-left: 12px
      .words.special
        height: 21px
      .address
        font-size: $font-size-small
        color: $color-del
        margin-top: 8px
        .add-icon
          height: 13px
          width: @height
          margin-left: 3px
          transform: translateY(1.5px)
      .information
        height: 20px
        display: flex
        margin: 12px 0 0
        font-size: $font-size-small
        justify-content: space-between
        align-items: center
        .del
          color: #839FC0
          margin-left: 12px
        .find-num, .time
          color: $color-text-88
          display: flex
        .share
          display: flex
          .share-item
            display: flex
            align-items: center
            &:last-child
              margin-left: 19px
          .find-icon
            height: 16px
            width: 16px
        .find-num
          margin-left: 1px
          transform: translateY(2px)
        .thumbs-up
          .find-num
            color: $color-theme-tw

  .video
    .find-video
      width: 54vw
      height: 30.134vw
      position: relative
      .play-icon
        height: 41px
        width: 41px
        all-center()

  .img-one
    .img-one-item
      box-sizing: border-box
      border: 0.5px solid $color-background
      width: 34.134vw
      overflow: hidden
    .one-box
      display: inline-block

  .img-two
    .img-item-two
      display: flex
      justify-content: space-between
      .two-item
        overflow: hidden
        box-sizing: border-box
        height: 31.2vw
        width: 49%

  .img-more
    .img-item-two
      display: flex
      flex-wrap: wrap
      transform: translateX(-5PX)
      .two-item
        overflow: hidden
        box-sizing: border-box
        height: 23.5vw
        width: @height
        margin-left: 1vw
        margin-top: 1vw

  .new-dynamic
    border-radius: 50%
    position: absolute
    bottom: 66px
    right: 15px
    z-index: 100
    box-shadow: 0 8px 7px 0 rgba(211, 211, 215, 0.29)
    width: 50px
    height: @width
    .new-dynamic-img
      width: 100%

  .img-small
    width: 100%
</style>
