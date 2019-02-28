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
      <div class="radar-top" :class="{'showTop' : topType}" ref="radarTop" v-if="hasLoading">
        <img src="./pic-bg_ld@2x.jpg" class="top-bc" v-show="!topType">
        <img src="./bg-ld@2x.jpg" class="top-bc" v-show="topType">
        <div class="top-content" :class="{'active' : topType}">
          <div class="pnes-container" :class="{'active' : topType}">
            <div class="refresh-box" v-show="topType">
              <img src="./pic-circle2@2x.png" class="refresh-bc">
              <div class="refresh-btn" :class="{'active' : loading}" @click="getPnesModel"></div>
            </div>
            <transition name="fade">
              <div class="pnes-content" v-if="topType">
                <img src="./pnes-model.gif" class="content-bc">
                <div class="pnes-item" v-for="(item, idx) in pnesObj" :key="idx" :class="item.type">
                  <div class="pnes-title">{{item.valTxt}}</div>
                  <div class="pnes-num-box">{{modelObj[item.valKey]}}%</div>
                </div>
              </div>
            </transition>
          </div>
          <div class="top-container" :class="{'active' : topType}">
            <p class="top-title" v-if="!topType">用户生命周期智能诊断</p>
            <div class="icon-content">
              <img src="./pic-move@2x.png" class="move-img">
              <div class="icon-item">
                <div class="item-bc">
                  <div class="icon-bc-center p">
                    <img src="./pic-p@2x.png" class="icon-type-img" v-if="!topType">
                    <span class="icon-type-num" v-if="topType">{{modelObj.p_count}}</span>
                  </div>
                </div>
                <div class="icon-txt">潜力客户</div>
              </div>
              <div class="line-item">
                <img src="./pic-diagnose@2x.png" class="line-img">
              </div>
              <div class="icon-item">
                <div class="item-bc">
                  <div class="icon-bc-center n">
                    <img src="./pic-n@2x.png" class="icon-type-img" v-if="!topType">
                    <span class="icon-type-num" v-if="topType">{{modelObj.n_count}}</span>
                  </div>
                </div>
                <div class="icon-txt">新客户</div>
              </div>
              <div class="line-item">
                <img src="./pic-diagnose@2x.png" class="line-img">
              </div>
              <div class="icon-item">
                <div class="item-bc">
                  <div class="icon-bc-center e">
                    <img src="./pic-e@2x.png" class="icon-type-img" v-if="!topType">
                    <span class="icon-type-num" v-if="topType">{{modelObj.e_count}}</span>
                  </div>
                </div>
                <div class="icon-txt">主力客户</div>
              </div>
              <div class="line-item">
                <img src="./pic-diagnose@2x.png" class="line-img">
              </div>
              <div class="icon-item">
                <div class="item-bc">
                  <div class="icon-bc-center s">
                    <img src="./pic-s@2x.png" class="icon-type-img" v-if="!topType">
                    <span class="icon-type-num" v-if="topType">{{modelObj.s_count}}</span>
                  </div>
                </div>
                <div class="icon-txt">沉睡客户</div>
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
          <div class="radar-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
            <div class="item-time" v-if="item.is_showtime">{{item.created_at | timeFormat}}</div>
            <div class="msg-item-content">
              <div class="flag" :style="{background: item.group_rule_name ? pnesColor[item.group_rule_name] : '#f3f3f3'}"></div>
              <div class="item-top">
                <div class="top-left">
                  <img v-if="item.image_url" :src="item.image_url" class="top-avatar">
                  <img v-else class="top-avatar" src="./pic-default_people@2x.png">
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
    <router-view></router-view>
    <base-tip ref="baseTip" :type="'fail'"></base-tip>
    <toast ref="toast"></toast>
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
  import Toast from 'components/toast/toast'
  const PNES = [
    {type: 'p', txt: '潜力客户', valTxt: '新增率', valKey: 'growth_rate'},
    {type: 'n', txt: '新客户', valTxt: '转化率', valKey: 'conversion_rate'},
    {type: 'e', txt: '主力客户', valTxt: '流失率', valKey: 'churn_rate'},
    {type: 's', txt: '沉睡客户', valTxt: '唤醒率', valKey: 'wakeup_rate'}
  ]
  export default {
    name: 'Radar',
    data() {
      return {
        pnesObj: PNES,
        pnesColor: PNES_COLOR,
        topType: false, // 头部信息是否点击诊断
        hasLoading: false, // 头部信息是否返回
        topHide: false, // 头部是否消失
        list: [],
        showNoMore: false,
        loading: false,
        timer: '',
        loadingTime: '',
        listenScroll: true,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多了',
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
        modelObj: {
          'p_count': 0,
          'n_count': 0,
          'e_count': 1,
          's_count': 0,
          'growth_rate': 0,
          'conversion_rate': 0,
          'churn_rate': 0,
          'wakeup_rate': 0
        } // pnes模型初始数据
      }
    },
    components: {
      Scroll,
      Toast
    },
    created() {
      if (!this.imIng) {
        this.$emit('login')
      }
      this.setCustomCount('clear')
      this.getDiagnoseState()
      this.getRadarList()
      this._refreshInfo()
    },
    methods: {
      ...mapActions([
        'setCustomCount',
        'setImIng',
        'setImInfo'
      ]),
      toDetail(item) {
        let url = '/radar/client-detail'
        this.$router.push({path: url, query: {id: item.customer_id, pageUrl: url}})
      },
      diagnose() {
        this.topType = true
        setTimeout(() => {
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          this.getPnesModel(1)
        }, 20)
      },
      _refreshInfo() {
        Jwt.getEmployeeInfo().then((res) => {
          if (res.error === ERR_OK) {
            storage.set('info', res.data)
          }
        })
      },
      getDiagnoseState() {
        Radar.getDiagnose().then(res => {
          if (res.error === ERR_OK) {
            this.topType = +res.data.ai_state
            this.hasLoading = true
            if (this.topType) {
              setTimeout(() => {
                this.$refs.scroll && this.$refs.scroll.forceUpdate()
                this.getPnesModel()
              }, 20)
            }
          }
        })
      },
      getPnesModel(type = 0) {
        if (this.loading) return
        let timeS = Date.parse(new Date())
        if (this.loadingTime && (timeS - this.loadingTime) < 60000) {
          this.$refs.toast.show('数据已刷新，请稍后再试！')
          return
        }
        this.loading = true
        this.loadingTime = timeS
        this.getPnesVal(type, () => {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.loading = false
            clearTimeout(this.timer)
          }, 1000)
        })
      },
      getPnesVal(type = 0, callback) {
        let data = {
          merchant_id: this.userInfo.merchant_id,
          store_id: this.userInfo.store_id,
          shop_id: this.userInfo.shop_id,
          operation: type
        }
        Radar.getPNESModel(data).then(res => {
          if (res.error === ERR_OK) {
            this.modelObj = res.data
            callback && callback()
          } else {
            callback && callback()
            this.$refs.baseTip && this.$refs.baseTip.show()
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

  @keyframes lineMove {
    0% {
      left: 10vw
    }
    50% {
      left: 38vw
    }
    100% {
      left: 66vw
    }
  }

  @keyframes spinning {
    0% {
      transform: translate(-50%, 0) rotateZ(360deg)
    }
    50% {
      transform: translate(-50%, 0) rotateZ(720deg)
    }
    100% {
      transform: translate(-50%, 0) rotateZ(1080deg)
    }
  }

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
        .pnes-content
          position: absolute
          all-center()
          width: 88vw
          .content-bc
            width: 88vw
          .pnes-item
            position: absolute
            &.p
              left: 35vw
              top: 16vw
            &.n
              left: 50vw
              top: 27vw
            &.e
              right: 0
              bottom: 10vw
            &.s
              right: 7vw
              bottom: 25vw
            .pnes-title
              font-family: $font-family-regular
              color: $color-text-main
              font-size: $font-size-10
              line-height: 14px
            .pnes-num-box
              width: 30px
              height: 14px
              background: $color-F94346
              text-align: center
              line-height: 14px
              font-size: $font-size-10
              color: $color-white
              font-family: $font-family-bold
              border-radius: 2px
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
            z-index: 20
            left: 50%
            transform: translate(-50%, 0)
            top: 7px
            icon-image('icon-refresh')
            &.active
              animation: spinning 3s linear infinite
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
          height: 22.66vw
          background: $color-white
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
        .icon-content
          display: flex
          position: relative
          .move-img
            position: absolute
            width: 21px
            height: 10.5px
            top: 6vw
            left: 13vw
            transform: translate(0, -50%)
            animation: lineMove 5s linear infinite
          .icon-item
            width: 12vw
            position: relative
            .item-bc
              width: 12vw
              height: 12vw
              border-radius: 50%
              background: #5929DC
              position: relative
              .icon-bc-center
                width: 10.66vw
                height: 10.66vw
                border-radius: 50%
                display: flex
                align-items: center
                justify-content: center
                position: absolute
                all-center()
                .icon-type-img
                  display: block
                  width: 14px
                  height: auto
                .icon-type-num
                  font-family: $font-family-bold
                  font-size: 18px
                  color: $color-white
                &.p
                  background: $color-linear-p
                &.n
                  background: $color-linear-n
                &.e
                  background: $color-linear-e
                &.s
                  background: $color-linear-s
            .icon-txt
              font-family: $font-family-regular
              color: $color-0E1249
              font-size: $font-size-11
              opacity: 0.8
              text-align: center
              white-space: nowrap
              margin-top: 7px
          .line-item
            width: 9.7vw
            height: 12vw
            margin: 0 -2px
            display: flex
            align-items: center
            .line-img
              width: 100%
              height: auto
              display: block
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
                .left-name
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
