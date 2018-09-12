<template>
  <transition :name="slide">

    <div class="dynamic-list">
      <a href="" id="link"></a>
      <scroll ref="scroll"
              :data="dynamicList"
              :pullUpLoad="pullUpLoadObj"
              :pullDownRefresh="pullDownRefreshObj"
              @pullingUp="onPullingUp"
              @pullingDown="onPullingDown"
      >
        <div class="dynamic-item" v-for="(item, index) in dynamicList" :key="index" v-if="item.live_log_detail.length">
          <!--<img class="copy-item" @click="_goCopy(item.live_log_detail, item.content, item)" v-if="isMine && imageUrl" :src="imageUrl + '/ws-image/btn-share@2x.png'">-->
          <div class="find-item img-one" v-if="item.live_log_detail[0].type === 1 && item.live_log_detail.length === 1">
            <!--<img src="./btn-share@2x.png" class="copy-item" v-clipboard:copy="item.content" @click="_goCopy(item.live_log_detail)" v-clipboard:error="onError">-->
            <div class="find-box">
              <div class="cainter">
                <div class="user">
                  <!-- 头像-->
                  <img class="header" :src="item.employee_image_url">
                  <p class="nickname">{{item.employee_name}}</p>
                </div>
                <!--{{comment?'':'special'}}-->
                <pre class="words" width="20">{{item.content}}</pre>
                <div class="one-box">
                  <div class="img-one-item" :style="{'background-image': 'url('+items.file_url+')'}" v-for="(items, idx) in item.live_log_detail" :key="idx" @click="_seeImage(idx, item.live_log_detail)">
                    <!--<img class="img-small" :src="items.file_url">-->
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
                  <p v-if="(isBoss && !item.employee_id) || item.employee_id" class="del" @click="_delItem(index)">删除</p>
                </div>
                <!--<div class="share" :class="{'share-active': item.show}">-->
                <!--<div class="share-item comment">-->
                <!--<img class="find-icon" src="./icon-review@2x.png">-->
                <!--</div>-->
                <!--<div class="share-item" @click="_goodLike(index)">-->
                <!--<img class="find-icon" v-if="!item.is_like" src="./icon-like@2x.png">-->
                <!--<img class="find-icon" v-if="item.is_like" src="./icon-like2_pressed@2x.png">-->
                <!--</div>-->
                <!--&lt;!&ndash;{{find.is_like ? 'thumbs-up' : ''}}&ndash;&gt;-->
                <!--</div>-->
              </div>
              <div class="likes-peo" v-if="item.live_log_like.length || item.live_log_comment.length">
                <img src="./pic-trends_zan1@2x.png" class="likes-peo-bg" mode="widthFix">
                <div class="peo-big-box">
                  <img src="./icon-spot@2x.png" class="like-icon" v-if="item.live_log_like.length">
                  <div class="like-name">
                    <span v-for="(items,idx) in item.live_log_like" :key="idx">{{idx > 0 ? '，' : ''}}{{items.employee_name || items.customer_name}}</span>
                  </div>
                </div>
                <div class="comment-peo" v-for="(com, comIdx) in item.live_log_comment" :key="comIdx"><span class="ro-peo-name">{{com.customer_name}}：</span><span class="comment-name">{{com.content}}</span></div>
                <img src="./pic-trends_zan3@2x.png" class="likes-peo-bg" mode="widthFix">
              </div>
            </div>
          </div>
          <div class="find-item img-two" v-if="item.live_log_detail[0].type === 1 && item.live_log_detail.length === 2">
            <!--<img src="./btn-share@2x.png" class="copy-item" v-clipboard:copy="item.content" @click="_goCopy(item.live_log_detail)" v-clipboard:error="onError">-->
            <div class="find-box">
              <div class="cainter">
                <div class="user">
                  <img class="header" :src="item.employee_image_url">
                  <p class="nickname">{{item.employee_name}}</p>
                </div>
                <pre class="words" width="20">{{item.content}}</pre>
                <div class="img-item-two">
                  <div class="two-item" v-for="(items, idx) in item.live_log_detail" :key="idx" :style="{'background-image': 'url('+items.file_url+')'}" @click="_seeImage(idx, item.live_log_detail)">
                    <!--<img class="img-small" :src="items.file_url" @click="_seeImage(idx, item.live_log_detail)">-->
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
                  <p v-if="(isBoss && !item.employee_id) || item.employee_id" class="del" @click="_delItem(index)">删除</p>
                </div>
                <!--<div class="share" :class="{'share-active': item.show}">-->
                <!--<div class="share-item comment">-->
                <!--<img class="find-icon" src="./icon-review@2x.png">-->
                <!--</div>-->
                <!--<div class="share-item" @click="_goodLike(index)">-->
                <!--<img class="find-icon" v-if="!item.is_like" src="./icon-like@2x.png">-->
                <!--<img class="find-icon" v-if="item.is_like" src="./icon-like2_pressed@2x.png">-->
                <!--</div>-->
                <!--&lt;!&ndash;{{find.is_like ? 'thumbs-up' : ''}}&ndash;&gt;-->
                <!--</div>-->
              </div>
              <div class="likes-peo" v-if="item.live_log_like.length || item.live_log_comment.length">
                <img src="./pic-trends_zan1@2x.png" class="likes-peo-bg" mode="widthFix">
                <div class="peo-big-box">
                  <img src="./icon-spot@2x.png" class="like-icon" v-if="item.live_log_like.length">
                  <div class="like-name">
                    <span v-for="(items,idx) in item.live_log_like" :key="idx">{{idx > 0 ? '，' : ''}}{{items.employee_name || items.customer_name}}</span>
                  </div>
                </div>
                <div class="comment-peo" v-for="(com, comIdx) in item.live_log_comment" :key="comIdx"><span class="ro-peo-name">{{com.customer_name}}：</span><span class="comment-name">{{com.content}}</span></div>
                <img src="./pic-trends_zan3@2x.png" class="likes-peo-bg" mode="widthFix">
              </div>
            </div>
          </div>
          <div class="find-item img-more" v-if="item.live_log_detail[0].type === 1 && item.live_log_detail.length > 2">
            <!--<img src="./btn-share@2x.png" class="copy-item" v-clipboard:copy="item.content" @click="_goCopy(item.live_log_detail)" v-clipboard:error="onError">-->
            <div class="find-box">
              <div class="cainter">
                <div class="user">
                  <img class="header" :src="item.employee_image_url">
                  <p class="nickname">{{item.employee_name}}</p>
                </div>
                <!--{{comment?'':'special'}}"-->
                <pre class="words" width="20">{{item.content}}</pre>
                <div class="img-item-two">
                  <div class="two-item" v-for="(items, idx) in item.live_log_detail" :key="idx" :style="{'background-image': 'url('+items.file_url+')'}" @click="_seeImage(idx, item.live_log_detail)">
                    <!--<img class="img-small" :src="items.file_url" @click="_seeImage(idx, item.live_log_detail)">-->
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
                  <p v-if="(isBoss && !item.employee_id) || item.employee_id" class="del" @click="_delItem(index)">删除</p>
                </div>
                <!--<div class="share" :class="{'share-active': item.show}">-->
                <!--<div class="share-item comment">-->
                <!--<img class="find-icon" src="./icon-review@2x.png">-->
                <!--</div>-->
                <!--<div class="share-item" @click="_goodLike(index)">-->
                <!--<img class="find-icon" v-if="!item.is_like" src="./icon-like@2x.png">-->
                <!--<img class="find-icon" v-if="item.is_like" src="./icon-like2_pressed@2x.png">-->
                <!--</div>-->
                <!--&lt;!&ndash;{{find.is_like ? 'thumbs-up' : ''}}&ndash;&gt;-->
                <!--</div>-->
              </div>
              <div class="likes-peo" v-if="item.live_log_like.length || item.live_log_comment.length">
                <img src="./pic-trends_zan1@2x.png" class="likes-peo-bg" mode="widthFix">
                <div class="peo-big-box">
                  <img src="./icon-spot@2x.png" class="like-icon" v-if="item.live_log_like.length">
                  <div class="like-name">
                    <span v-for="(items,idx) in item.live_log_like" :key="idx">{{idx > 0 ? '，' : ''}}{{items.employee_name || items.customer_name}}</span>
                  </div>
                </div>
                <div class="comment-peo" v-for="(com, comIdx) in item.live_log_comment" :key="comIdx">{<span class="ro-peo-name">{{com.customer_name}}：</span><span class="comment-name">{{com.content}}</span></div>
                <img src="./pic-trends_zan3@2x.png" class="likes-peo-bg" mode="widthFix">
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
      <transition name="fade">
        <div class="down-img" v-show="downBig">
          <div class="down-loading" v-show="showDown">
            <img src="./loading.gif" class="loading-icon">
            <p class="loading-text">正在加载{{downNum}}/{{this.dynamicCopy.length}}张图片</p>
          </div>
          <transition name="fade">
            <div class="down-content" v-show="showSmallDown">
              <p class="down-tip">温馨提示</p>
              <p class="down-text">图片已保存至你的手机相册 并复制描述！</p>
              <p class="down-btn" @click="_hideDown">确定</p>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import Vue from 'vue'
  import Scroll from 'components/scroll/scroll'
  import {Live, Global} from 'api'
  import {ERR_OK, BASE_URL} from '../../common/js/config'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import Toast from 'components/toast/toast'
  import {mapGetters} from 'vuex'
  import wx from 'weixin-js-sdk'
  import VueClipboard from 'vue-clipboard2'

  Vue.use(VueClipboard)

  export default {
    name: 'dynamic-list',
    data() {
      return {
        dynamicList: [],
        delIndex: null,
        page: 1,
        pullUpLoad: true,
        loadMore: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        scrollbar: true,
        scrollbarFade: true,
        pullDownRefresh: true,
        showDown: false,
        showSmallDown: false,
        downBig: false,
        dynamicCopy: [],
        downNum: 0,
        isBoss: false
      }
    },
    created() {
      let url = location.href
      Global.jssdkConfig({weixin: 'ai_radar', url}).then((res) => {
        if (res.error === ERR_OK) {
          res = res.data
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appid, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.noncestr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名，见附录1
            jsApiList: ['previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        }
      })
      this._getList()
      this._checkBoss()
    },
    computed: {
      scrollbarObj: function () {
        return this.scrollbar ? {fade: this.scrollbarFade} : false
      },
      pullDownRefreshObj: function () {
        return this.pullDownRefresh ? {
          threshold: parseInt(this.pullDownRefreshThreshold),
          stop: parseInt(this.pullDownRefreshStop)
        } : false
      },
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
    watch: {
      pullDownRefreshObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      },
      pullUpLoadObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      }
    },
    methods: {
      _checkBoss() {
        Live.isBoss().then((res) => {
          if (res.error !== ERR_OK) {
            return
          }
          this.isBoss = res.data.is_boss
        })
      },
      _hideDown() {
        this.showDown = false
        this.showSmallDown = false
        this.downBig = false
      },
      onError(e) {
        console.log('无法复制文本！')
      },
      _goCopy(imgArr) {
        this.dynamicCopy = imgArr
        console.log(imgArr)
        this.showDown = true
        this.downBig = true
        if (!this.dynamicCopy.length) {
          return
        }
        this._downItem(0)
      },
      _downItem(i) {
        let url = `${BASE_URL.api}/getpic?u=${this.dynamicCopy[i].file_url}`
        var a = document.querySelector('#link')
        var event = new MouseEvent('click')
        a.href = url
        a.download = `${i}.jpg`
        this.downNum = i + 1
        a.dispatchEvent(event)
        if (i >= this.dynamicCopy.length - 1) {
          setTimeout(() => {
            this.showSmallDown = true
            this.showDown = false
          }, 800)
          return
        }
        setTimeout(() => {
          a.href = ''
          this._downItem(i + 1)
        }, 200)
      },
      onPullingDown() {
        this.page = 1
        this.loadMore = true
        this._getList()
      },
      // 预览图片
      _seeImage(index, image) {
        let imageArr = image.map(item => item.file_url)
        // console.log(imageArr[index], imageArr)
        // 预览图片，正式上面需要打开注释
        wx.previewImage({
          current: imageArr[index], // 当前显示图片的http链接
          urls: imageArr // 需要预览的图片http链接列表
        })
      },
      onPullingUp() {
        this.page++
        this._getList()
      },
      _getList() {
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
      _delItem(index) {
        this.delIndex = index
        this.$refs.confirm.show({msg: '确定删除该动态？'})
      },
      // 是否确认删除
      _sureDel() {
        Live.delLogsList(this.dynamicList[this.delIndex].id).then((res) => {
          if (res.error === ERR_OK) {
            this.dynamicList.splice(this.delIndex, 1)
            this.$refs.toast.show('删除动态成功')
            return
          }
          this.$refs.toast.show(res.message)
        })
      },
      _goodLike(index) {
        let data = {live_log_id: this.dynamicList[index].id, like: this.dynamicList[index].is_like ? 0 : 1}
        Live.likeLog(data).then((res) => {
          if (res.error === ERR_OK) {
            this.dynamicList[index].is_like = !this.dynamicList[index].is_like
            this.dynamicList[index].live_log_like = res.data
            return
          }
          this.$refs.toast.show(res.message)
        })
      },
      rebuildScroll() {
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
  .down-img
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: rgba(32, 32, 46, .8)
    z-index: 100
    display: flex
    align-items: center
    justify-content: center
    .down-loading
      background: rgba(0, 0, 0, 0.50)
      border-radius: 2px
      width: 125px
      height: @width
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      .loading-icon
        width: 45px
      .loading-text
        font-size: $font-size-12
        color: $color-white
        font-family: $font-family-medium
        margin-top: 15px
    .down-content
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      background: $color-white
      width: 300px
      height: 170px
      border-radius: 2px
      border-bottom-1px(rgba(32, 32, 46, 0.10), 2px)
      .down-tip
        font-size: $font-size-16
        color: $color-20202E
        font-family: $font-family-medium
      .down-text
        width: 196px
        font-size: $font-size-16
        color: $color-20202E
        font-family: $font-family-regular
        text-align: center
        margin-top: 15px
      .down-btn
        width: 100px
        height: 32px
        line-height: 32px
        text-align: center
        color: $color-white
        font-family: $font-family-regular
        font-size: $font-size-14
        background: $color-56
        margin-top: 19px
        border-radius: 2px

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
    position: relative
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
        white-space: pre-wrap
        word-wrap: break-word
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
        margin: 19px 0 0
        font-size: $font-size-12
        justify-content: space-between
        align-items: center
      .del
        color: #839FC0
        margin-left: 3.2vw
      .find-num, .time
        white-space: nowrap
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-888888
        display: flex
      .share
        display: flex
        height: 30px
        align-items: center
        border-radius: 2px
        line-height: 30px
        right: 20px
        .share-item
          flex: 1
          height: 15px
          justify-content: center
          display: flex
          align-items: center
          margin-right: 8vw
          &:last-child
            margin-right: 0
          .find-icon
            width: 18px
            height: 18px
          .find-num
            margin-left: 2.5px
            font-size: $font-size-12
            color: $color-white

          .share-active
            opacity: 1
            width: 148px
            z-index: 10
            transition: all 0.3s
    .likes-peo
      margin-top: 5px
      position: relative
      width: 79.73vw
      box-sizing: border-box
      .likes-peo-bg
        display: block
        width: 100%
      .peo-big-box
        width: 100%
        box-sizing: border-box
        border-right-1px(rgba(0, 0, 0, 0.10))
        border-left-1px(rgba(0, 0, 0, 0.10))
        background: #F9F9F9
        padding: 3px 0
        display: flex
      .like-icon
        margin: 4px 0 0 10px
        z-index: 10
        width: 14px
        height: 13px
      .like-name
        font-size: $font-size-14
        color: #7C7C8F
        margin-left: 5px
        z-index: 10
        line-height: 21px
        flex: 1
      .comment-peo
        border-right-1px(rgba(0, 0, 0, 0.10))
        border-left-1px(rgba(0, 0, 0, 0.10))
        width: 100%
        padding: 0 10px
        box-sizing: border-box
        background: #F9F9F9
        font-size: $font-size-14
        line-height: 22px
        color: #7C7C8F
        display: flex
        .ro-peo-name
          font-family: $font-family-medium
          white-space: nowrap
        .comment-name
          font-family: $font-family-regular
          color: $color-374B63

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
      height: 174px
      background-repeat: no-repeat
      background-size: cover
      background-position: center
      overflow: hidden
    .one-box
      display: inline-block

  .img-two
    .img-item-two
      display: flex
      justify-content: space-between
      .two-item
        background-repeat: no-repeat
        background-position: center
        background-size: cover
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
        background-repeat: no-repeat
        background-position: center
        background-size: cover
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
    max-width: 100%
    max-height: 100%

  .copy-item
    z-index: 60
    right: 14px
    top: 13px
    position: absolute
    width: 81px

  #link
    display: none

</style>
