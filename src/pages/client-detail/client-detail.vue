<template>
  <transition :name="slide">
    <div class="client-detail">
      <div class="container">
        <scroll ref="scroll"
                :data="list"
                :probeType="probeType"
                :bcColor="bcColor"
                :listenScroll="listenScroll"
                @scroll="scroll"
                :pullUpLoad="pullUpLoadObj"
                :showNoMore="false"
                @pullingUp="onPullingUp">
          <div class="client-top" ref="eleven">
            <div class="cliten-bg"></div>
            <div class="cliten-box">
              <div class="cliten-con">
                <img class="cliten-con-bg" src="./bg-customer_details@2x.png" alt="">
                <div class="cliten-top">
                  <div class="cliten-img">
                    <div class="detail-img-box">
                      <div class="img">
                        <img :src="clientData.image_url" alt="">
                      </div>
                      <div class="label-right">
                        <div class="label-name">{{clientData.name}}</div>
                        <div class="text">{{clientData.sources}}</div>
                      </div>
                    </div>
                    <div class="detail-jump" @click="jumpData">
                      <img class="jump-img" src="./icon-pressed@2x.png" alt="">
                    </div>
                  </div>
                  <div class="label-box">
                    <div class="label-content">
                      <div class="label active" v-for="(item, index) in labelList" v-bind:key="index"
                           @click="toClientTag">{{item.label_name}}
                      </div>
                      <div class="label" v-if="labelList.length<3" @click="toClientTag">添加标签</div>
                    </div>
                  </div>
                </div>
                <div class="cliten-bottom">
                  <div class="bottom-number">
                    <div class="number-top">
                      <div class="number">{{clientData.conversion_rate}}</div>
                      <div class="icon" :class="slide === 'slide'? '' : 'iosicon'">%</div>
                    </div>
                    <div class="number-bottom">
                      <div class="text">预计成交率</div>
                    </div>
                  </div>
                  <div class="bottom-number">
                    <div class="number-top" v-if="clientData.progress < 110">
                      <div class="number">{{clientData.progress}}</div>
                      <div class="icon" :class="slide === 'slide'? '' : 'iosicon'">%</div>
                    </div>
                    <div class="number-top" v-if="clientData.progress === '无法签单' || clientData.progress === '成交'">
                      <div class="text">{{clientData.progress}}</div>
                    </div>
                    <div class="number-bottom" @click="showModel">
                      <div class="text">实际跟进阶段</div>
                      <div class="img-box">
                        <img class="img" src="./icon-switch@2x.png" alt="">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="select-tab select-client">
            <div class="tab" v-for="(item, index) in tabList" v-bind:key="index" @click="switchTab(index)">{{item}}
            </div>
            <div class="line" :style="'transform:translate3d('+ (100 * menuIdx) + '%, 0, 0)'">
              <div class="chilen-line"></div>
            </div>
          </div>
          <div class="visitor-box" v-if="menuIdx * 1 === 0">
            <section class="exception-box" v-if="actionList.length * 1 === 0">
              <exception errType="nodata"></exception>
            </section>
            <div class="box-list" v-if="actionList.length * 1 !== 0">
              <div class="msgs-item" v-for="(item, index) in actionList" :key="index">
                <div class="item-time" v-if="item.is_showtime">{{item.created_at | timeFormat}}</div>
                <div class="msg-item-content">
                  <img :src="item.image_url" class="msgs-left">
                  <div class="msgs-right">
                    <div class="msgs-container">
                      <p class="msgs-p" v-show="item.event_no * 1 === 10000">{{item.nickname}}通过扫描他人分享的名片海报<span class="green">查看</span>了<span class="green">你的名片</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 10001">{{item.nickname}}通过点击他人分享的名片链接<span class="green">查看</span>了<span class="green">你的名片</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 10002">{{item.nickname}}第{{item.count_sum}}次<span class="green">查看</span>了<span class="green">你的名片</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 10003">{{item.nickname}}给你<span class="green">点了</span><span class="green">赞</span>，看来认可你</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 10004">{{item.nickname}}<span class="green">取消</span>给你点的<span class="green">赞</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 10005">{{item.nickname}}<span class="green">转发</span>了你的<span class="green">名片</span>，你的人脉圈正在裂变</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 10006">{{item.nickname}}<span class="green">保存</span>了你的<span class="green">名片海报</span>，看来TA对你感兴趣</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 10007">{{item.nickname}}<span class="green">拨打</span>了你的<span class="green">手机</span>，请记录跟进内容</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 10008">{{item.nickname}}<span class="green">保存</span>了你的<span class="green">电话</span>，可以考虑主动沟通</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 10009">{{item.nickname}}<span class="green">复制</span>了你的<span class="green">邮箱</span>，请留意邮件</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 10010">{{item.nickname}}<span class="green">浏览</span>了你的<span class="green">地址</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20002">{{item.nickname}}正在对砍价活动<span class="green">{{item.title  | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20003">{{item.nickname}}正在对商品<span class="green">{{item.title  | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20004">{{item.nickname}}正在对拼团活动<span class="green">{{item.title  | titleCut}}</span>向你<span class="green">咨询</span>，请做好准备应答</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20006">{{item.nickname}}通过扫描他人分享的商品海报<span class="green">查看</span>了<span class="green">你的商品</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20007">{{item.nickname}}通过点击他人分享的商品链接<span class="green">查看</span>了<span class="green">你的商品</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20008">{{item.nickname}}第{{item.count_sum}}次<span class="green">查看</span>了<span class="green">你的商品</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20009">{{item.nickname}}正在<span class="green">购买</span>拼团活动<span class="green">{{item.title  | titleCut}}</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20010">{{item.nickname}}提交了拼团活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20011">{{item.nickname}}提交了拼团活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span>，并完成了支付</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20012">{{item.nickname}}正在参与砍价活动<span class="green">{{item.title  | titleCut}}</span>，成功砍掉<span class="green">{{item.total}}元</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20013">{{item.nickname}}转发了砍价活动<span class="green">{{item.title  | titleCut}}</span>，你的活动正在裂变</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20014">{{item.nickname}}通过他人分享的链接<span class="green">查看</span>了砍价活动<span class="green">{{item.title  | titleCut}}</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20015">{{item.nickname}}正在<span class="green">购买</span>砍价活动<span class="green">{{item.title  | titleCut}}</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20016">{{item.nickname}}提交了砍价活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20017">{{item.nickname}}提交了砍价活动<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span>，并完成了支付</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20018">{{item.nickname}}<span class="green">转发</span>了你的商品<span class="green">{{item.title  | titleCut}}</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20019">{{item.nickname}}<span class="green">保存</span>了你的商品<span class="green">{{item.title  | titleCut}}</span>的海报图片</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20020">{{item.nickname}}提交了商品<span class="green">{{item.title  | titleCut}}</span>的订单，金额为<span class="green">{{item.total}}元</span>，并完成了支付</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 20021">{{item.nickname}}正在<span class="green">查看</span>你的<span class="green">商城</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 30001">{{item.nickname}}第{{item.count_sum}}次<span class="green">查看</span>了你发布的<span class="green">动态</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 30002">{{item.nickname}}给你发布的动态<span class="green">点了</span><span class="green">赞</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 30003">{{item.nickname}}<span class="green">评论</span>了你发布的<span class="green">动态</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 40001">{{item.nickname}}主动<span class="green">添加</span>了<span class="green">收货地址</span>，该客户有望成交</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 50001">{{item.nickname}}正在向你<span class="green">咨询</span>，请做好准备应答</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60001">{{item.nickname}}通过扫描他人分享的小店海报<span class="green">访问</span>了<span class="green">你的小店</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60002">{{item.nickname}}通过扫描他人分享的小店链接<span class="green">访问</span>了<span class="green">你的小店</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60003">{{item.nickname}}第{{item.count_sum}}次<span class="green">查看</span>了<span class="green">你的小店</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60004">{{item.nickname}}<span class="green">转发</span>了你的<span class="green">小店</span>，你的人脉圈正在裂变</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60005">{{item.nickname}}<span class="green">保存</span>了你的<span class="green">小店海报</span>，看来TA对你感兴趣</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60006">{{item.nickname}}正在<span class="green">查看</span>你的<span class="green">名片</span>，看来TA对你感兴趣</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60007">{{item.nickname}}给你的名片<span class="green">点了</span><span class="green">赞</span>，看来认可你</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60008">{{item.nickname}}正在<span class="green">查看</span>拼团活动<span class="green">{{item.title  | titleCut}}</span>，可能对该活动感兴趣</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60009">{{item.nickname}}给拼团活动<span class="green">{{item.title  | titleCut}}</span>点了<span class="green">赞</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60010">{{item.nickname}}正在<span class="green">查看</span>砍价活动<span class="green">{{item.title  | titleCut}}</span>，可能对该活动感兴趣</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60011">{{item.nickname}}给砍价活动<span class="green">{{item.title  | titleCut}}</span>点了<span class="green">赞</span></p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60012">{{item.nickname}}正在<span class="green">查看</span>商品<span class="green">{{item.title  | titleCut}}</span>，可能对该活动感兴趣</p>
                      <p class="msgs-p" v-show="item.event_no * 1 === 60013">{{item.nickname}}给商品<span class="green">{{item.title  | titleCut}}</span>点了<span class="green">赞</span></p>
                    </div>
                    <!--<img src="./icon-pressed@2x.png" class="msgs-rt">-->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section class="exception-box" v-if="menuIdx * 1 === 1 && flowList.length * 1 === 0">
            <exception errType="nodata"></exception>
          </section>
          <div class="follow-box" v-if="menuIdx * 1 === 1 && flowList.length * 1 !== 0">
            <div class="follow-line"></div>
            <div class="follow-list" v-for="(item, index) in flowList" :key="index">
              <div class="time">{{item.created_at}}</div>
              <div class="text">{{item.record}}</div>
              <div class="icon-log" v-if="index * 1 === 0"></div>
              <div class="icon-cri" v-if="index * 1 !== 0"></div>
              <div class="icon-img" v-if="index * 1 === 0">
                <img class="icon-small-img" src="./icon-address@2x.png" alt="">
              </div>
            </div>
          </div>
          <div class="ai-box" v-if="menuIdx * 1 === 2">
            <div class="pie-box">
              <div id="myPie"></div>
              <div class="title-box">
                <div class="title">客户兴趣占比</div>
                <div class="sub-title">(每小时更新)</div>
              </div>
              <div class="pie-list">
                <div class="list" v-for="(item, index) in pieHint" v-bind:key="index">
                  <div class="icon" :class="item.icon"></div>
                  <div class="text">{{item.text}}</div>
                </div>
              </div>
            </div>
            <div class="pie-box">
              <div id="myLine"></div>
              <div class="title-box">
                <div class="title">近7日客户活跃度</div>
                <div class="sub-title">(每小时更新)</div>
              </div>
            </div>
            <div class="pie-box">
              <div id="myBar"></div>
              <div class="title-box">
                <div class="title">客户与我的互动</div>
                <div class="sub-title">(每天0点更新)</div>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <div class="select-tab" v-if="showTab">
        <div class="tab" v-for="(item, index) in tabList" v-bind:key="index" @click="switchTab(index)">{{item}}</div>
        <div class="line" :style="'transform:translate3d('+ (100 * menuIdx) + '%, 0, 0)'">
          <div class="chilen-line"></div>
        </div>
      </div>
      <div class="client-box" v-if="!showBox">
        <div class="box-bg" :class="showMode ? 'submit-bg-active' : ''" @click="hideModel"></div>
        <div class="box-bottom" :class="showMode ? 'model-con-active' : ''">
          <div class="bottom-list" v-for="(item, index) in barList" :key="index" @click="selectBar(index, item)">
            <div class="left">{{item.text}}{{item.icon}}</div>
            <div class="right">
              <img v-if="barIndex === index" class="right-img" src="./icon-selected@2x.png" alt="">
            </div>
          </div>
          <div class="box-line"></div>
          <div class="btn" @click="hideModel">取消</div>
        </div>
      </div>
      <div class="bottom-box">
        <div class="box-btn" @click="phoneCall">
          <img src="./icon-telephone@2x.png" alt="" class="btn-img">
          <div class="text">打电话</div>
        </div>
        <img src="./icon-write@2x.png" alt="" class="add-jump" @click="toAddFlow" v-if="menuIdx * 1 === 1">
        <div class="box-btn message-btn" @click="jumpMessage">
          <img src="./icon-news@2x.png" alt="" class="btn-img">
          <div class="text">发消息</div>
        </div>
      </div>
      <router-view @refresh="refresh"></router-view>
      <toast ref="toast"></toast>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {ClientDetail, Client, Echart} from 'api'
  import {ERR_OK} from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import storage from 'storage-controller'
  import Scroll from 'components/scroll/scroll'
  import Exception from 'components/exception/exception'
  import {mapActions, mapGetters} from 'vuex'
  import utils from 'common/js/utils'
  const PIEHINT = [{text: '动态', icon: 'one'}, {text: '商品', icon: 'two'}, {text: '拼团', icon: 'thr'}, {text: '砍价', icon: 'four'}]
  export default {
    name: 'client-detail',
    data() {
      return {
        listenScroll: true,
        probeType: 3,
        bcColor: '#F0F2F5',
        barList: [
          {
            text: '20',
            icon: '%'
          },
          {
            text: '40',
            icon: '%'
          },
          {
            text: '80',
            icon: '%'
          },
          {
            text: '成交',
            icon: ''
          },
          {
            text: '无法签单',
            icon: ''
          }
        ],
        tabList: ['来访记录', '跟进记录', 'AI分析'],
        showMode: true,
        showBox: true,
        barIndex: null,
        menuIdx: 0,
        dataEcharts: false,
        clientData: {
          image_url: '',
          name: ''
        },
        flow: {
          progress: '',
          create_follow_record: true
        },
        flowPage: 1,
        flowList: [],
        noMore: false,
        id: '',
        flowId: '',
        actionPage: 1,
        actionList: [],
        noActionMore: false,
        mobile: '',
        list: [],
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: ' ',
        pullUpLoadNoMoreTxt: ' ',
        page: 1,
        twoList: [],
        tabhighgt: 216,
        highgt: 216,
        pageUrl: '',
        labelList: [],
        pieData: [
          {value: 1, name: '对我感兴趣'},
          {value: 1, name: '对产品感兴趣'},
          {value: 1, name: '对公司感兴趣'}
        ],
        ationLine: {
          x: [],
          y: []
        },
        barData: {
          x: [],
          y: []
        },
        pieHint: PIEHINT,
        showTab: false
      }
    },
    created() {
      this.id = this.$route.query.id
      this.pageUrl = this.$route.query.pageUrl
      this.getClientId(this.id)
      this.getCusomerTagList()
      this.getActionLineData()
      this.getPieData()
      this.getBarData()
    },
    mounted() {
      this.highgt = this.$refs.eleven.offsetHeight
      this.tabhighgt = this.$refs.eleven.offsetHeight
    },
    beforeDestroy() {
      this.$emit('refresh')
    },
    methods: {
      ...mapActions([
        'setCurrent'
      ]),
      refresh() {
        setTimeout(() => {
          this.getClientId(this.id)
          this.getCusomerTagList()
        }, 300)
      },
      getCusomerTagList() {
        Client.getCusomerTagList({customer_id: this.id}).then(res => {
          if (res.error === ERR_OK) {
            let arr = res.data.slice(0, 3)
            this.labelList = arr
          }
        })
      },
      toClientTag() {
        let path = `${this.pageUrl}/client-tag?customerId=${this.id}`
        this.$router.push(path)
      },
      chatMsg(item) {
        let currentMsg = {
          nickName: item.nickName,
          avatar: item.avatar,
          account: item
        }
        this.setCurrent(currentMsg)
        let url = '/chat?id=' + item.sessionId
        this.$router.push(url)
      },
      scroll(pos) {
        let hightPx = pos.y * -1
        if (hightPx >= this.highgt) {
          this.showTab = true
        } else {
          this.showTab = false
        }
      },
      drawPie() {
        let myChart = this.$echarts.init(document.getElementById('myPie'))
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{d}%'
          },
          color: ['#F9543C', '#23799D', '#8E3C68', '#F9B43C'],
          series: [
            {
              name: '',
              type: 'pie',
              radius: '55%',
              center: ['50%', '54%'],
              data: this.pieData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      },
      drawLine() {
        let myChart = this.$echarts.init(document.getElementById('myLine'))
        // 绘制图表
        myChart.setOption({
          grid: {
            top: 45,
            left: '2%',
            right: '5%',
            bottom: 15,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.ationLine.x,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#E6E6E6',
                width: 0.5
              }
            },
            axisLabel: {
              color: '#343439',
              align: 'center'
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: '活跃度：{c}',
            axisPointer: {
              type: 'none'
            }
          },
          yAxis: {
            minInterval: 1,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#E6E6E6',
                width: 0.5
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            },
            axisLabel: {
              formatter: '{value}',
              color: '#343439'
            },
            axisLine: {
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            }
          },
          series: [{
            data: this.ationLine.y,
            type: 'line',
            smooth: true,
            showSymbol: false,
            smoothMonotone: 'x',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(249,80,60,0.55)'
                }, {
                  offset: 1, color: 'rgba(249,80,60,0.05)'
                }],
                globalCoord: false
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(249,80,60,0.85)',
                borderWidth: 2,
                lineStyle: {
                  color: 'rgba(249,80,60,0.75)',
                  width: 3
                }
              }
            }
          }]
        })
      },
      drawBar() {
        let myChart = this.$echarts.init(document.getElementById('myBar'))
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            formatter: '{b}数：{c}',
            axisPointer: {
              type: 'none'
            }
          },
          grid: {
            top: 45,
            left: '0',
            right: '5%',
            bottom: 15,
            containLabel: true
          },
          xAxis: {
            minInterval: 1,
            type: 'value',
            boundaryGap: false,
            splitLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              color: '#20202E',
              fontSize: 12,
              formatter: function (value) {
                return value
              },
              align: 'center'
            },
            axisTick: {
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            }
          },
          yAxis: {
            type: 'category',
            data: this.barData.y,
            axisLabel: {
              interval: 0,
              color: '#20202E',
              fontSize: 12
            },
            axisTick: {
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            }
          },
          series: [{
            data: this.barData.x,
            type: 'bar',
            showSymbol: false,
            barWidth: 15,
            itemStyle: {
              normal: {
                color: '#F9543C',
                borderWidth: 2,
                lineStyle: {
                  color: '#F9543C',
                  width: 3
                }
              }
            }
          }]
        })
      },
      showModel() {
        this.showBox = false
        setTimeout(() => {
          this.showMode = false
        }, 100)
      },
      hideModel() {
        this.showMode = true
        setTimeout(() => {
          this.showBox = true
        }, 500)
      },
      selectBar(index, item) {
        this.barIndex = index
        this.flow.progress = item.text
        setTimeout(() => {
          this.showMode = true
          ClientDetail.saveClientDetail(this.clientData.id, this.flow).then((res) => {
            if (res.error === ERR_OK) {
              this.getClientId(this.id)
            } else {
              this.$refs.toast.show(res.message)
            }
          })
        }, 800)
        setTimeout(() => {
          this.showBox = true
          this.barIndex = null
        }, 1500)
      },
      switchTab(index) {
        this.$refs.scroll.scrollTo(0, 0)
        this.scroll(0)
        this.menuIdx = index
        if (index * 1 === 2) {
          setTimeout(() => {
            this.drawPie()
            this.drawLine()
            this.drawBar()
          }, 200)
        } else if (index * 1 === 0) {
          this.list = this.flowList
        } else if (index * 0 === 0) {
          this.list = this.twoList
        }
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 20)
      },
      getClientId(id) {
        ClientDetail.getClientId(id).then((res) => {
          if (res.error === ERR_OK) {
            this.clientData = res.data
            this.id = res.data.id
            this.flowId = res.data.flow_id
            ClientDetail.getClientDetail(id).then(res => {
              if (res.error === ERR_OK) {
                if (res.data.flow.real_name.length !== 0) {
                  this.clientData.name = res.data.flow.real_name
                } else {
                  this.clientData.name = res.data.flow.nickname
                }
              }
            })
            this.mobile = res.data.mobile
            this.getNewFlowList(this.id, this.flowId)
            this.getNewActionList(this.id)
          }
        })
      },
      getNewFlowList(id, flowId) {
        this.flowPage = 1
        ClientDetail.getFlowList(id, flowId, this.flowPage).then((res) => {
          if (res.error === ERR_OK) {
            this.flowList = res.data
            this._isAflowList(res)
          }
        })
      },
      getMoreFlowList(id, flowId) {
        if (this.noMore) return
        ClientDetail.getFlowList(id, flowId, this.flowPage).then((res) => {
          if (res.error === ERR_OK) {
            this.flowList.push(...res.data)
            this._isAflowList(res)
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      _isAflowList(res) {
        this.flowPage++
        if (this.flowList.length >= res.meta.total * 1) {
          this.noMore = true
        }
      },
      getNewActionList(id) {
        this.actionPage = 1
        ClientDetail.getActionList(id).then((res) => {
          if (res.error === ERR_OK) {
            this.actionList = res.data
          } else {
            this.noActionMore = true
            this.$refs.toast.show(res.message)
          }
        })
      },
      getMoreActionList(id) {
        if (this.noActionMore) {
          this.$refs.scroll.forceUpdate()
          return
        }
        this.actionPage++
        const number = this.actionList.length
        ClientDetail.getActionList(id, number).then((res) => {
          if (res.error === ERR_OK) {
            if (res.data.length * 1 === 0) {
              this.actionPage--
              this.noActionMore = true
            } else {
              this.actionList.push(...res.data)
            }
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          }
        })
      },
      phoneCall() {
        if (this.mobile.length * 1 === 0) {
          this.$refs.toast.show('还没备注电话号码')
          return
        }
        window.location.href = `tel:${this.mobile}`
      },
      toAddFlow() {
        let path = `${this.pageUrl}/addflow?id=${this.id}&flowId=${this.flowId}`
        this.$router.push(path)
      },
      jumpData() {
        let path = `${this.pageUrl}/detail-data?id=${this.id}&flowId=${this.flowId}`
        this.$router.push(path)
      },
      jumpMessage() {
        let currentMsg = {
          nickName: this.clientData.name,
          avatar: this.clientData.image_url,
          account: this.clientData.im_account
        }
        this.setCurrent(currentMsg)
        let url = '/chat/' + this.clientData.im_account
        this.$router.push(url)
      },
      onPullingUp() {
        if (this.menuIdx * 1 === 1) {
          this.getMoreFlowList(this.id, this.flowId)
        }
        if (this.menuIdx * 1 === 0) {
          this.getMoreActionList(this.id)
        }
        if (this.menuIdx * 1 === 2) {
          this.$refs.scroll.forceUpdate()
        }
        if (this.menuIdx * 1 === 1 && this.noMore) {
          this.$refs.scroll.forceUpdate()
        }
        if (this.menuIdx * 1 === 0 && this.noActionMore) {
          this.$refs.scroll.forceUpdate()
        }
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      },
      getPieData() {
        Echart.getPie(this.userInfo.merchant_id, this.userInfo.id, this.id).then(res => {
          if (res.error === ERR_OK) {
            this.pieData = res.data
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      getActionLineData() {
        Echart.getActionLine(this.userInfo.merchant_id, this.userInfo.id, this.id).then(res => {
          if (res.error === ERR_OK) {
            this.ationLine = res.data
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      getBarData() {
        Echart.getBar(this.userInfo.merchant_id, this.userInfo.id, this.id).then(res => {
          if (res.error === ERR_OK) {
            this.barData = res.data
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      }
    },
    components: {
      Toast,
      Exception,
      Scroll
    },
    computed: {
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      },
      userInfo() {
        return storage.get('info')
      },
      ...mapGetters(['ios']),
      slide() {
        return this.ios ? '' : 'slide'
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
    },
    watch: {
      pullUpLoadObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  div
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box

  .exception-box
    padding-top: 70px

  .tab-padding
    height: 48px

  .client-detail
    fill-box()
    z-index: 50

  .container
    fill-box(absolute)
    bottom: 45px

  .client-top
    position: relative
    .cliten-bg
      position: absolute
      z-index: 1
      height: 73px
      background: #20202E
      width: 100%
      top: 0
      left: 0
    .cliten-box
      position: relative
      padding: 20px 15px 0
      width: 100%
      z-index: 2
      .cliten-con
        background: #fff
        width: 100%
        padding: 15px
        position: relative
        .cliten-con-bg
          position: absolute
          display: block
          width: 100%
          height: 100%
          left: 0px
          top: 0px
          z-index: 0
        .cliten-img
          layout(row)
          justify-content: space-between
          align-items: center
          position: relative
          z-index: 1
          .detail-img-box
            flex: 1
            overflow: hidden
            layout(row)
            .img
              position: relative
              height: 0
              width: 60px
              height: 60px
              background: #333
              img
                width: 60px
                height: 60px
                display: block
            .label-right
              flex: 1
              overflow: hidden
              margin-left: 10px
              .label-name
                font-size: $font-size-medium-x
                color: $color-text
                font-family: $font-family-regular
                padding-top: 5px
                margin-bottom: 15px
              .text
                font-size: $font-size-12
                color: $color-888888
                font-family: $font-family-regular
          .detail-jump
            height: 45px
            width: 25px
            position: relative
            .jump-img
              width: 6px
              height: 12px
              position: absolute
              right: 0
              top: 0
              bottom: 0
              margin: auto
        .label-box
          overflow-x: auto
          position:relative
          margin-top: 10px
          z-index: 66
          .label-content
            display: inline-block
            white-space: nowrap
          .label
            padding: 0 10px
            height: 20px
            line-height: 20px
            text-align: center
            display: inline-block
            font-size: $font-size-12
            color: $color-text-88
            font-family: $font-family-regular
            background: #F0F2F5
            margin-right: 5px
          .active
            background: rgba(86, 186, 21, 0.2)
            color: #56BA15
        .cliten-top
          padding-bottom: 10px
          border-bottom-1px(#e5e5e5)
        .cliten-bottom
          position: relative
          z-index: 1
          layout(row)
          padding: 15px 0
          .bottom-number
            width: 50%
            .number-top
              justify-content: center
              layout(row)
              align-items: flex-end
              .number
                font-size: 40px
                color: $color-text
                font-family: DINCondensed-Bold
                line-height: 1
                height: 40px
              .text
                font-size: 24px
                height: 40px
                line-height: 43px
                color: $color-text
                font-family: DINCondensed-Bold
              .icon
                font-size: $font-size-small
                color: $color-text
                font-family: $font-family-light
                padding-bottom: 5px
              .iosicon
                padding-bottom: 10px
            .number-bottom
              justify-content: center
              layout(row)
              margin-top: 6.5px
              align-items: center
              .text
                font-size: $font-size-medium
                color: $color-text
                font-family: $font-family-regular
              .img-box
                width: 10px
                height: 10px
                margin-left: 5px
                .img
                  display: block
                  width: 10px
                  height: 10px

  .client-box
    position: fixed
    width: 100%
    height: 100%
    left: 0
    top: 0
    z-index: 31
    .box-bg
      width: 100%
      height: 100%
      background: rgba(32, 32, 46, .8)
      transition: all .8s
      -moz-transition: all .8s
      -webkit-transition: all .8s
      -o-transition: all .8s
      opacity: 1
    .submit-bg-active
      opacity: 0
    .box-bottom
      background: #fff
      bottom: 0
      left: 0
      width: 100%
      position: absolute
      transition: all .5s
      -moz-transition: all .5s
      -webkit-transition: all .5s
      -o-transition: all .5s
      .bottom-list
        layout(row)
        justify-content: space-between
        padding: 15px
        align-items: center
        border-bottom: 1px solid rgba(0, 0, 0, .1)
        .left
          font-size: $font-size-medium
          color: $color-text
          font-family: $font-family-regular
        .right
          width: 20px
          height: 20px
          .right-img
            display: block
            width: 20px
            height: 20px
      .box-line
        width: 100%
        height: 10px
        background: #F0F2F5
      .btn
        font-size: $font-size-medium
        color: $color-text
        font-family: $font-family-regular
        padding: 15px 0
        text-align: center
    .model-con-active
      bottom: -100%
      opacity: .3

  .select-tab
    layout(row)
    height: 48px
    line-height: 47px
    border-bottom: 1px solid rgba(0, 0, 0, .1)
    position: fixed
    width: 100%
    top: 0
    left: 0
    z-index: 11
    background: #F0F2F5
    .tab
      flex: 1
      text-align: center
      font-size: $font-size-16
      color: $color-text
      font-family: $font-family-regular
    .line
      position: absolute
      width: 33.33%
      height: 3px
      bottom: 0
      transition: all .3s
      .chilen-line
        height: 3px
        width: 30px
        background: #20202e
        margin: 0 auto

  .select-client
    position: relative

  .visitor-box
    padding: 0 15px
    .box-list
      font-family: $font-family-regular
      .time
        font-size: $font-size-medium
        color: $color-text
      .item-list
        layout(row)
        margin-top: 15px
        background: #fff
        padding: 7.5px 40px 7.5px 10px
        align-items: center
        .left-img
          width: 40px
          height: 40px
          background: #333
          margin-right: 10px
          .img
            display: block
            width: 40px
            height: 40px
            background: #333
        .left-text
          flex: 1
          font-size: $font-size-medium
          color: $color-text
          span
            color: #56BA15

  .follow-box
    padding: 15px 15px 15px 35px
    position: relative
    overflow: hidden
    font-family: $font-family-regular
    .follow-list
      background: #fff
      padding: 15px 10px
      margin-bottom: 15px
      position: relative
      .time
        font-size: $font-size-medium
        color: $color-text-88
      .text
        margin-top: 10px
        font-size: $font-size-medium
        color: $color-text
        min-height: 10px
      .icon-cri
        position: absolute
        border: 1px solid #ccc
        background: #fff
        width: 10px
        height: 10px
        left: -21px
        top: 0
        bottom: 0
        border-radius: 50%
        margin: auto 0
      .icon-log
        position: absolute
        width: 20px
        height: 50%
        left: -21px
        top: 0
        background: #f0f2f5
      .icon-img
        position: absolute
        width: 10px
        height: 14px
        left: -21px
        top: 0
        bottom: 0
        margin: auto 0
        background: #f0f2f5
        .icon-small-img
          height: 14px
          left: -21px
    .follow-list:last-child
      margin-bottom: 0
    .follow-line
      width: 1px
      position: absolute
      height: 100%
      background: #CCCCCC
      top: 15px
      left: 18px

  .ai-box
    padding: 15px
    .pie-box
      position: relative
      background: $color-white
      height: 305px
      margin-bottom: 10px
      #myPie
        width: 100%
        height: 305px
        margin: 0 auto
        padding: 20px
      #myLine
        width: 100%
        height: 305px
        margin: 0 auto
        padding: 35px 10px 0
      #myAddLine
        width: 100%
        height: 305px
        margin: 0 auto
        padding: 35px 10px 0
      #myBar
        width: 100%
        height: 305px
        margin: 0 auto
        padding: 35px 10px 0
      #myChartfour
        width: 100%
        height: 305px
        margin: 0 auto
        padding: 35px 0 0
      .title-box
        position: absolute
        width: 100%
        text-align: center
        top: 20px
        left: 0
        .title
          font-size: $font-size-medium-x
          color: #202020
          font-family: $font-family-regular
        .sub-title
          margin-top: 5px
          font-size: $font-size-small
          color: $color-text-88
          font-family: $font-family-regular
      .bottom-des
        position: absolute
        bottom: 15px
        layout(row)
        width: 100%
        .tab
          layout(row)
          justify-content: center
          align-items: center
          width: 25%
          .icon
            background: #F9B43C
            width: 6px
            height: 6px
            border-radius: 50%
            margin-right: 3px
          .two
            background: #F9543C
          .thr
            background: #8E3C68
          .four
            background: #23799D
          .text
            font-size: $font-size-12
            font-family: $font-family-regular
            color: $color-text
      .pie-list
        layout(row)
        position: absolute
        width: 100%
        bottom: 15px
        left: 0
        .list
          flex: 1
          layout(row)
          align-items: center
          justify-content: center
          .icon
            background: #F9543C
            width: 7px
            height: 7px
            margin-right: 4px
            border-radius: 50%
          .two
            background: #23799D
          .thr
            background: #8E3C68
          .four
            background: #F9B43C
          .text
            line-height: 1
            font-size: $font-size-small
            color: #202020
            font-family: $font-family-regular
  .bottom-box
    layout(row)
    position: absolute
    left: 0
    bottom: 0
    height: 45px
    width: 100%
    z-index: 11
    .box-btn
      layout(row)
      background: #20202E
      width: 50%
      justify-content: center
      align-items: center
      .btn-img
        width: 15px
        height: 17px
        display: block
        margin-right: 4px
      .text
        font-size: $font-size-medium-x
        font-family: $font-family-regular
        color: #fff
    .message-btn
      background: #56BA15
      .btn-img
        width: 18px
        padding-top: 2px

  .add-jump
    position: fixed
    z-index: 11
    width: 63px
    height: 66px
    right: 5px
    bottom: 50px

  .msgs-item
    margin-top: 18px
    .item-time
      font-size: $font-size-18
      color: #20202E
      padding: 10px 0 15px
      font-family: $font-family-medium
    .msg-item-content
      width: 100%
      height: 70px
      background: $color-white
      border: 0.5px solid rgba(32, 32, 46, 0.10)
      box-shadow: 0 4px 12px 0 rgba(43, 43, 145, 0.04)
      border-radius: 5px
      display: flex
      justify-content: space-between
      align-items: center
    .msgs-left
      margin: 0 10px 0 15px
      width: 40px
      height: 40px
      border-radius: 50%
      border: 0.5px solid rgba(32, 32, 46, 0.10)
    .msgs-right
      flex: 1
      overflow: hidden
      margin-right: 13.5px
      height: 100%
      display: flex
      justify-content: space-between
      align-items: center
      .msgs-container
        flex: 1
        overflow: hidden
        height: 100%
        display: flex
        align-items: center
        .msgs-p
          line-height: 18px
          font-size: $font-size-medium
          font-family: $font-family-medium
          .green
            color: $color-text-56
      .msgs-rt
        width: 7.5px
        height: 11.5px
        margin-left: 33px

  .msgs-item:last-child
    margin-bottom: 0
</style>
