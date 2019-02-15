<template>
  <div class="radar">
    <span class="msg-box-fixed" :class="{'show' : !customCount}" v-if="topHide" @click.stop="clearNum">
      <img src="./icon-news_up@2x.png" class="msg-arrow">
      <span class="msg-hint">{{customCount}}条信息</span>
    </span>
    <scroll ref="scroll"
            :data="list"
            bcColor="#f0f5ff"
            :pullUpLoad="pullUpLoadObj"
            :showNoMore="showNoMore"
            :listenScroll="listenScroll"
            @pullingUp="onPullingUp"
            @scroll="viewScroll"
            >
      <div class="radar-top" :class="{'showTop' : topType}" ref="radarTop">
        <img src="./pic-bg_ld@2x.jpg" class="top-bc" v-show="!topType">
        <img src="./bg-ld@2x.jpg" class="top-bc" v-show="topType">
        <div class="top-content" :class="{'active' : topType}">
          <div class="pnes-container" :class="{'active' : topType}">
            <div class="refresh-box" v-if="topType">
              <img src="./pic-circle2@2x.png" class="refresh-bc">
              <div class="refresh-btn"></div>
            </div>
          </div>
          <div class="top-container" :class="{'active' : topType}">
            <p class="top-title" v-if="!topType">用户生命周期智能诊断</p>
            <div class="icon-content">
              <img src="./pic-diagnose_bg@2x.png" class="icon-bc-img">
              <div class="icon-container">
                <div class="icon-left">
                  <div class="icon-item">
                    <div class="icon-bc p">P</div>
                  </div>
                  <div class="icon-item">
                    <div class="icon-bc n">N</div>
                  </div>
                </div>
                <div class="icon-right">
                  <div class="icon-item">
                    <div class="icon-bc e">E</div>
                  </div>
                  <div class="icon-item">
                    <div class="icon-bc s">S</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="icon-txt-container">
              <div class="txt-left">
                <div class="icon-item">
                  <div class="icon-txt">潜力客户</div>
                </div>
                <div class="icon-item">
                  <div class="icon-txt">新客户</div>
                </div>
              </div>
              <div class="txt-right">
                <div class="icon-item">
                  <div class="icon-txt">主力客户</div>
                </div>
                <div class="icon-item">
                  <div class="icon-txt">沉睡客户</div>
                </div>
              </div>
            </div>
            <div v-if="!topType" class="top-btn" @click="diagnose">智能诊断</div>
          </div>
        </div>
      </div>
      <div class="radar-content">
        <span class="msg-box" :class="{'show' : !customCount, 'active' : topHide}"  v-if="!topHide" @click.stop="clearNum">
          <img src="./icon-news_up@2x.png" class="msg-arrow">
          <span class="msg-hint">{{customCount}}条信息</span>
        </span>
        <div class="radar-list">
          <div class="radar-item" v-for="(item, index) in list" :key="index">
            <div class="item-time" v-if="item.is_showtime">{{item.created_at | timeFormat}}</div>
            <div class="msg-item-content">
              <div class="flag" :style="{background: item.group_rule_name ? pnesColor[item.group_rule_name] : '#f3f3f3'}"></div>
              <div class="item-top">
                <div class="top-left">
                  <img :src="item.image_url" class="top-avatar">
                  <p class="left-name">{{item.nickname}}</p>
                </div>
                <div class="top-right"></div>
              </div>
              <div class="item-down">
                <p class="msgs-p" v-show="item.event_no * 1 === 10001">通过扫描他人分享的小店海报<span class="green">访问</span>了<span class="green">你的小店</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 10002">通过点击他人分享的小店链接<span class="green">访问</span>了<span class="green">你的小店</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 10003">第{{item.count_sum | titleCut}}次<span class="green">查看</span>了<span class="green">你的小店</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 10004"><span class="green">转发</span>了你的<span class="green">小店</span>，你的人脉圈正在裂变</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 10005"><span class="green">保存</span>了你的<span class="green">小店海报</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 10006">给你<span class="green">点了</span><span class="green">赞</span>，看来认可你</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 10007"><span class="green">取消</span>给你点的<span class="green">赞</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 20001">正在查看大转盘，可能对该活动感兴趣</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 20002">正在转发你的大转盘，您的活动正在裂变</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 20003">正在参加大转盘活动</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 20004">中了大转盘的{{item.title | titleCut}}，现在去使用</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 20006">未中奖，返回了店铺首页</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30001">给拼团活动<span class="green">{{item.title | titleCut}}</span>点了<span class="green">赞</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30002">正在转发你的拼团活动<span class="green">{{item.title | titleCut}}</span>，您的活动正在裂变</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30003"><span class="green">保存</span>了你的拼团活动<span class="green">{{item.title | titleCut}}</span>海报</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30004">通过扫描他人分享的拼团海报<span class="green">访问</span>了你的拼团活动<span class="green">{{item.title | titleCut}}</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30005">通过点击他人分享的拼团链接<span class="green">访问</span>了你的拼团活动<span class="green">{{item.title | titleCut}}</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30006">正在<span class="green">查看</span>拼团活动<span class="green">{{item.title  | titleCut}}</span>，可能对该活动感兴趣</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30007">正在<span class="green">发起</span>拼团活动<span class="green">{{item.title  | titleCut}}</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30008">正在<span class="green">参加</span>拼团活动<span class="green">{{item.title  | titleCut}}</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30009">提交了拼团活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30010">提交了拼团活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span>，并完成了支付</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30011">正在<span class="green">邀请</span>好友来参加拼团活动<span class="green">{{item.title  | titleCut}}</span>您的活动正在裂变</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30012">通过他人分享的拼团链接，正在参加拼团活动<span class="green">{{item.title  | titleCut}}</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30013">通过扫描他人分享的砍价海报<span class="green">访问</span>了你的砍价活动<span class="green">{{item.title | titleCut}}</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30014">通过点击他人分享的砍价链接<span class="green">访问</span>了你的砍价活动<span class="green">{{item.title | titleCut}}</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30015">正在<span class="green">查看</span>砍价活动<span class="green">{{item.title  | titleCut}}</span>，可能对该活动感兴趣</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30016">正在<span class="green">转发</span>你的砍价活动<span class="green">{{item.title  | titleCut}}</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30017"><span class="green">保存</span>你的砍价活动海报</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30018">给砍价活动<span class="green">{{item.title  | titleCut}}</span>点了<span class="green">赞</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30019">正在<span class="green">参与</span>砍价活动<span class="green">{{item.title  | titleCut}}</span>，成功砍掉<span class="green">{{item.total}}元</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30020"><span class="green">邀请</span>好友来参加砍价活动<span class="green">{{item.title  | titleCut}}</span>您的活动正在裂变</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30021">正在<span class="green">购买</span>砍价活动<span class="green">{{item.title  | titleCut}}</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30022">提交了砍价活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total | titleCut}}元</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 30023">提交了砍价活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total | titleCut}}元</span>，并完成了支付</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40001">通过扫描他人分享的服务海报<span class="green">查看</span>了<span class="green">你的服务</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40002">通过点击他人分享的服务链接<span class="green">查看</span>了<span class="green">你的服务</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40003">正在<span class="green">查看</span>你的服务<span class="green">{{item.title | titleCut}}</span>，可能对该服务感兴趣</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40004"><span class="green">转发</span>了你的服务<span class="green">{{item.title | titleCut}}</span>，你的服务正在裂变</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40005"><span class="green">保存</span>了你的服务<span class="green">{{item.title | titleCut}}</span>海报</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40006">提交了服务<span class="green">{{item.title | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span>，并完成了支付</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40007">第{{item.count_sum}}次<span class="green">查看</span>了你的<span class="green">品牌故事</span>，请把握商机</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40008">正在查看门店的相册，对门店装修很感兴趣</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40009">正在查看门店的位置，在想如何去门店</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40010">正在查看门店的联系方式，对门店很感兴趣</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40013">正在购买服务{{item.title | titleCut}}</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40014">从{{item.title | titleCut}}返回您的店铺</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40017">通过扫描他人分享的服务海报<span class="green">查看</span>了<span class="green">你的服务</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40016">通过点击他人分享的服务链接<span class="green">查看</span>了<span class="green">你的服务</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40015">正在<span class="green">查看</span>你的商品<span class="green">{{item.title | titleCut}}</span>，可能对该商品感兴趣</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40018"><span class="green">转发</span>了你的商品<span class="green">{{item.title | titleCut}}</span>，你的商品正在裂变</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40019"><span class="green">保存</span>了你的商品<span class="green">{{item.title | titleCut}}</span>海报</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40020">正在对商品<span class="green">{{item.title  | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40023">提交了商品<span class="green">{{item.title | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span>，并完成了支付</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40022">从{{item.title | titleCut}}返回您的店铺</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 40021">正在购买商品{{item.title | titleCut}}</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 50001">第{{item.count_sum}}次<span class="green">查看</span>了你的<span class="green">动态</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 50002">通过扫描他人分享的动态海报<span class="green">访问</span>了你的动态<span class="green">{{item.title | titleCut}}</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 50003">通过点击他人分享的动态链接<span class="green">访问</span>了你的动态<span class="green">{{item.title | titleCut}}</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 50004"><span class="green">评论</span>了你的<span class="green">动态</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 50005">给你的动态<span class="green">{{item.title  | titleCut}}</span>点了<span class="green">赞</span></p>
                <p class="msgs-p" v-show="item.event_no * 1 === 50006">正在转发你的动态</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 50007">保存你的动态海报</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 60001"><span class="green">拨打</span>了你的<span class="green">手机</span>，请记录跟进内容</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 60002">正在对砍价活动<span class="green">{{item.title  | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 60003">正在对拼团活动<span class="green">{{item.title  | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 60004">正在对服务<span class="green">{{item.title  | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                <p class="msgs-p" v-show="item.event_no * 1 === 60006">保存你的微信号，请准备通过好友</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <selector-view ref="selector"></selector-view>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import storage from 'storage-controller'
  import Scroll from 'components/scroll/scroll'
  import {Jwt, Radar} from 'api'
  import {ERR_OK} from 'common/js/config'
  import {ease} from 'common/js/ease'
  import utils from 'common/js/utils'
  import {PNES_COLOR} from 'common/js/pnes'
  import SelectorView from 'components/selector-view/selector-view'
  const PNES = [
    {type: 'p', txt: '潜力客户'},
    {type: 'n', txt: '新客户'},
    {type: 'e', txt: '主力客户'},
    {type: 's', txt: '沉睡客户'}
  ]
  export default {
    name: 'Radar',
    data() {
      return {
        pnesObj: PNES,
        pnesColor: PNES_COLOR,
        topType: false, // 头部信息是否点击诊断
        topHide: false, // 头部是否消失
        list: [],
        showNoMore: false,
        listenScroll: true,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce']
      }
    },
    components: {
      Scroll,
      SelectorView
    },
    created() {
      if (!this.imIng) {
        this.$emit('login')
      }
      this.setCustomCount('clear')
      this.getRadarList()
      this._refreshInfo()
    },
    methods: {
      ...mapActions([
        'setCustomCount',
        'setImIng',
        'setImInfo'
      ]),
      diagnose() {
        // this.topType = true
        this.$refs.selector.showModel()
        setTimeout(() => {
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
        }, 20)
      },
      _refreshInfo() {
        Jwt.getEmployeeInfo().then((res) => {
          if (res.error === ERR_OK) {
            storage.set('info', res.data)
          }
        })
      },
      getRadarList() {
        Radar.getRadarList(0, 30, this.userInfo ? this.userInfo.id : '').then((res) => {
          if (res.error === ERR_OK) {
            this.list = res.data
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      viewScroll(e) {
        let topHeight = this.$refs.radarTop.clientHeight
        this.topHide = (e.y + topHeight - 7) < 0
      },
      clearNum() {
        Radar.getRadarList(0, 30, this.userInfo.id).then((res) => {
          if (res.error === ERR_OK) {
            this.list = res.data
            this.setCustomCount('clear')
            let topX = this.$refs.radarTop.clientHeight * -1
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
              if (this.topHide) {
                this.$refs.scroll && this.$refs.scroll.scrollTo(0, topX, 300, ease[this.scrollToEasing])
              }
            }, 20)
          }
        })
      },
      onPullingUp() {
        if (this.showNoMore) {
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          return
        }
        const num = this.list.length * 1 + this.customCount * 1
        Radar.getRadarList(num, 30, this.userInfo.id).then((res) => {
          if (res.error === ERR_OK) {
            let list = res.data
            if (!list.length) {
              this.showNoMore = true
            } else {
              this.list = [...this.list, ...list]
            }
            setTimeout(() => {
              this.$refs.scroll && this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'customCount',
        'imIng'
      ]),
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      },
      userInfo() {
        return storage.get('info')
      }
    },
    watch: {
      pullUpLoadObj: {
        handler() {
          if (!this.pullUpLoad) return
          this.rebuildScroll()
        },
        deep: true
      }
    },
    filters: {
      titleCut(val) {
        if (val && val.length > 8) {
          return val.slice(0, 8) + '···'
        } else {
          return val
        }
      },
      timeFormat(val) {
        if (val) {
          let res = utils.radarTimeFormat(val)
          return res.time
        }
        return ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .radar
    width: 100vw
    z-index: 50
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 50px
    font-family: $font-family-regular
    background: $color-F0F5FF
    .msg-box-fixed
      min-width: 95px
      height: 30px
      background: $color-white
      border-radius: 15px 0 0 15px
      line-height: 30px
      font-size: 0
      position: fixed
      top: 30px
      right: 0
      z-index: 20
      transition: all .3s
      border: 0.5px solid #E8F0FC
      .msg-arrow
        width: 7px
        height: 8px
        padding-bottom: 1px
        margin-left: 12px
      .msg-hint
        font-size: $font-size-medium
        color: #0DCDAE
        letter-spacing: 0.3px
        margin: 0 10px
    .show.msg-box-fixed
      right: -100%
    .radar-top
      transition: all 0.3s
      width: 100vw
      height: 65.33vw
      position: relative
      .top-bc
        width: 100%
        height: 100%
        display: block
      .top-content
        transition: all .3s
        position: absolute
        left: 12px
        right: 12px
        top: 15.5px
        bottom: 37px
        &.active
          top: 23.5px
      .pnes-container
        transition: all 0.3s
        width: 100%
        height: 0
        position: relative
        border-radius: 4px 4px 0 0
        background: $color-F0F5FF
        .refresh-box
          position: absolute
          width: 64px
          height: 48px
          top: -13px
          right: 23px
          .refresh-bc
            width: 64px
            height: 25px
          .refresh-btn
            width: 40px
            height: 40px
            position: absolute
            left: 50%
            transform: translate(-50%, 0)
            top: 7px
            icon-image('icon-refresh')
        &.active
          height: 64.8vw
      .top-container
        transition: all 0.3s
        width: 100%
        height: 100%
        background: $color-F0F5FF
        border-radius: 4px
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        &.active
          height: 22.6vw
          border-radius: 0 0 4px 4px
        .top-title
          margin-bottom: 5.6vw
          font-family: $font-family-regular
          font-size: $font-size-16
          color: #0E1249
        .top-btn
          width: 100px
          height: 28px
          text-align: center
          line-height: 28px
          background-image: linear-gradient(139deg, #7D2EF6 0%, #4541F9 100%)
          border-radius: 32px
          color: $color-white
          font-family: $font-family-regular
          font-size: $font-size-14
          margin-top: 4.8vw
        .icon-txt-container
          margin-top: 7px
          width: 100%
          padding: 0 9.4vw
          box-sizing: border-box
          display: flex
          justify-content: space-between
          .txt-left, .txt-right
            flex: 1
            display: flex
            justify-content: space-between
          .txt-left
            margin-right: 8.8vw
          .icon-item
            min-width: 10.66vw
            font-size: $font-size-11
            font-family: $font-family-regular
            color: #0E1249
            text-align: center
        .icon-content
          width: 100%
          padding: 0 9.4vw
          box-sizing: border-box
          position: relative
          .icon-bc-img
            width: 100%
            height: 100%
            display: block
          .icon-container
            padding: 0 9.4vw
            position: absolute
            top: 0
            left: 0
            right: 0
            bottom: 0
            display: flex
            align-items: center
            .icon-left, .icon-right
              flex: 1
              display: flex
              justify-content: space-between
            .icon-left
              margin-right: 8.8vw
            .icon-item
              width: 12vw
              height: 12vw
              display: flex
              justify-content: center
              align-items: center
              .icon-bc
                width: 10.66vw
                height: 10.66vw
                border-radius: 50%
                background: red
                text-align: center
                line-height: 10.66vw
                color: $color-white
                &.p
                  background: $color-pnes-p
                &.n
                  background: $color-pnes-n
                &.e
                  background: $color-pnes-e
                &.s
                  background: $color-pnes-s
              .icon-txt
                font-family: $font-family-regular
                color: #0E1249
                font-size: $font-size-11

    .showTop
      height: 104vw
    .radar-content
      position: relative
      background: $color-F0F5FF
      margin-top: -18px
      border-radius: 15px 15px 0 0
      padding-top: 50px
      .msg-box
        min-width: 95px
        height: 30px
        background: $color-white
        border-radius: 15px 0 0 15px
        line-height: 30px
        font-size: 0
        position: absolute
        top: 20px
        right: 0
        z-index: 20
        transition: all .3s
        .msg-arrow
          width: 7px
          height: 8px
          padding-bottom: 1px
          margin-left: 12px
        .msg-hint
          font-size: $font-size-medium
          color: #0DCDAE
          letter-spacing: 0.3px
          margin: 0 10px
      .show.msg-box
        right: -100%
      .radar-list
        padding: 0 20px
        .radar-item
          margin-bottom: 10px
          .item-time
            font-family: $font-family-medium
            color: $color-text-main
            font-size: $font-size-16
            margin-bottom: 15px
          .msg-item-content
            background: $color-white
            border: 1px solid #E9F0FE
            box-shadow: 0 2px 16px 0 rgba(21,24,45,0.04);
            border-radius: 3px
            min-height: 63px
            padding: 8px 15px 0
            position: relative
            .flag
              width: 3px
              height: 43px
              position: absolute
              left: 0
              top: 50%
              transform: translate(0, -50%)
              border-radius: 0 3px 3px 0
            .item-top
              height: 30px
              display: flex
              justify-content: space-between
              align-items: center
              .top-left
                display: flex
                align-items: center
                flex: 1
                overflow: hidden
                .top-avatar
                  width: 26px
                  height: 26px
                  border: 2px solid #f3f3f3
                  border-radius: 50%
                  margin-right: 5px
                .top-name
                  font-family: $font-family-regular
                  color: $color-text-sub
                  font-size: $font-size-14
                  letter-spacing: 1.23px
                  word-break: break-all
                  flex: 1
                  overflow: hidden
                  white-space: nowrap
              .top-right
                width: 12px
                height: 7px
                margin-left: 15px
                icon-image('icon-presse_down')
            .item-down
              margin: 3px 0 9px
              .msgs-p
                line-height: 21px
                font-family: $font-family-regular
                color: $color-text-main
                font-size: $font-size-14
  .test
    height: 123px

</style>
