<template>
  <div class="box-list">
    <div class="msgs-item" v-for="(item, index) in actionList" :key="index">
      <div class="item-time" v-if="item.is_showtime">{{item.created_at | timeFormat}}</div>
      <div class="msg-item-content">
        <!--<img :src="item.image_url" class="msgs-left">-->
        <div class="msgs-right">
          <div class="msgs-container">
            <p class="msgs-p" v-show="item.event_no * 1 === 10001">通过扫描他人分享的小店海报<span class="blue">访问</span>了<span class="blue">你的小店</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 10002">通过点击他人分享的小店链接<span class="blue">访问</span>了<span class="blue">你的小店</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 10003">第{{item.count_sum | titleCut}}次<span class="blue">查看</span>了<span class="blue">你的小店</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 10004"><span class="blue">转发</span>了你的<span class="blue">小店</span>，你的人脉圈正在裂变</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 10005"><span class="blue">保存</span>了你的<span class="blue">小店海报</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 10006">给你<span class="blue">点了</span><span class="blue">赞</span>，看来认可你</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 10007"><span class="blue">取消</span>给你点的<span class="blue">赞</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 20001">正在查看大转盘，可能对该活动感兴趣</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 20002">正在转发你的大转盘，您的活动正在裂变</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 20003">正在参加大转盘活动</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 20004">中了大转盘的{{item.title | titleCut}}，现在去使用</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 20006">未中奖，返回了店铺首页</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30001">给拼团活动<span class="blue">{{item.title | titleCut}}</span>点了<span class="blue">赞</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30002">正在转发你的拼团活动<span class="blue">{{item.title | titleCut}}</span>，您的活动正在裂变</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30003"><span class="blue">保存</span>了你的拼团活动<span class="blue">{{item.title | titleCut}}</span>海报</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30004">通过扫描他人分享的拼团海报<span class="blue">访问</span>了你的拼团活动<span class="blue">{{item.title | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30005">通过点击他人分享的拼团链接<span class="blue">访问</span>了你的拼团活动<span class="blue">{{item.title | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30006">正在<span class="blue">查看</span>拼团活动<span class="blue">{{item.title  | titleCut}}</span>，可能对该活动感兴趣</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30007">正在<span class="blue">发起</span>拼团活动<span class="blue">{{item.title  | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30008">正在<span class="blue">参加</span>拼团活动<span class="blue">{{item.title  | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30009">提交了拼团活动<span class="blue">{{item.title  | titleCut}}</span>的订单，金额为<span class="blue">{{item.total}}元</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30010">提交了拼团活动<span class="blue">{{item.title  | titleCut}}</span>的订单，金额为<span class="blue">{{item.total}}元</span>，并完成了支付</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30011">正在<span class="blue">邀请</span>好友来参加拼团活动<span class="blue">{{item.title  | titleCut}}</span>您的活动正在裂变</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30012">通过他人分享的拼团链接，正在参加拼团活动<span class="blue">{{item.title  | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30013">通过扫描他人分享的砍价海报<span class="blue">访问</span>了你的砍价活动<span class="blue">{{item.title | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30014">通过点击他人分享的砍价链接<span class="blue">访问</span>了你的砍价活动<span class="blue">{{item.title | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30015">正在<span class="blue">查看</span>砍价活动<span class="blue">{{item.title  | titleCut}}</span>，可能对该活动感兴趣</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30016">正在<span class="blue">转发</span>你的砍价活动<span class="blue">{{item.title  | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30017"><span class="blue">保存</span>你的砍价活动海报</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30018">给砍价活动<span class="blue">{{item.title  | titleCut}}</span>点了<span class="blue">赞</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30019">正在<span class="blue">参与</span>砍价活动<span class="blue">{{item.title  | titleCut}}</span>，成功砍掉<span class="blue">{{item.total}}元</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30020"><span class="blue">邀请</span>好友来参加砍价活动<span class="blue">{{item.title  | titleCut}}</span>您的活动正在裂变</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30021">正在<span class="blue">购买</span>砍价活动<span class="blue">{{item.title  | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30022">提交了砍价活动<span class="blue">{{item.title  | titleCut}}</span>的订单，金额为<span class="blue">{{item.total | titleCut}}元</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 30023">提交了砍价活动<span class="blue">{{item.title  | titleCut}}</span>的订单，金额为<span class="blue">{{item.total | titleCut}}元</span>，并完成了支付</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40001">通过扫描他人分享的服务海报<span class="blue">查看</span>了<span class="blue">你的服务</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40002">通过点击他人分享的服务链接<span class="blue">查看</span>了<span class="blue">你的服务</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40003">正在<span class="blue">查看</span>你的服务<span class="blue">{{item.title | titleCut}}</span>，可能对该服务感兴趣</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40004"><span class="blue">转发</span>了你的服务<span class="blue">{{item.title | titleCut}}</span>，你的服务正在裂变</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40005"><span class="blue">保存</span>了你的服务<span class="blue">{{item.title | titleCut}}</span>海报</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40006">提交了服务<span class="blue">{{item.title | titleCut}}</span>的订单，金额为<span class="blue">{{item.total}}元</span>，并完成了支付</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40007">第{{item.count_sum}}次<span class="blue">查看</span>了你的<span class="blue">品牌故事</span>，请把握商机</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40008">正在查看门店的<span class="blue">相册</span>，对门店装修很感兴趣</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40009">正在查看门店的<span class="blue">位置</span>，在想如何去门店</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40010">正在查看门店的<span class="blue">联系方式</span>，对门店很感兴趣</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40013">正在购买服务<span class="blue">{{item.title | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40014">从{{item.title | titleCut}}返回您的店铺</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40017">通过扫描他人分享的服务海报<span class="blue">查看</span>了<span class="blue">你的服务</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40016">通过点击他人分享的服务链接<span class="blue">查看</span>了<span class="blue">你的服务</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40015">正在<span class="blue">查看</span>你的商品<span class="blue">{{item.title | titleCut}}</span>，可能对该商品感兴趣</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40018"><span class="blue">转发</span>了你的商品<span class="blue">{{item.title | titleCut}}</span>，你的商品正在裂变</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40019"><span class="blue">保存</span>了你的商品<span class="blue">{{item.title | titleCut}}</span>海报</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40020">正在对商品<span class="blue">{{item.title  | titleCut}}</span>向你<span class="blue">咨询</span>，请做好准备应答</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40023">提交了商品<span class="blue">{{item.title | titleCut}}</span>的订单，金额为<span class="blue">{{item.total}}元</span>，并完成了支付</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40022">从{{item.title | titleCut}}返回您的店铺</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 40021">正在购买商品{{item.title | titleCut}}</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 50001">第{{item.count_sum}}次<span class="blue">查看</span>了你的<span class="blue">动态</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 50002">通过扫描他人分享的动态海报<span class="blue">访问</span>了你的动态<span class="blue">{{item.title | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 50003">通过点击他人分享的动态链接<span class="blue">访问</span>了你的动态<span class="blue">{{item.title | titleCut}}</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 50004"><span class="blue">评论</span>了你的<span class="blue">动态</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 50005">给你的动态<span class="blue">{{item.title  | titleCut}}</span>点了<span class="blue">赞</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 50006">正在<span class="blue">转发</span>你的<span class="blue">动态</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 50007"><span class="blue">保存</span>你的<span class="blue">动态海报</span></p>
            <p class="msgs-p" v-show="item.event_no * 1 === 60001"><span class="blue">拨打</span>了你的<span class="blue">手机</span>，请记录跟进内容</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 60002">正在对砍价活动<span class="blue">{{item.title  | titleCut}}</span>向你<span class="blue">咨询</span>，请做好准备应答</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 60003">正在对拼团活动<span class="blue">{{item.title  | titleCut}}</span>向你<span class="blue">咨询</span>，请做好准备应答</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 60004">正在对服务<span class="blue">{{item.title  | titleCut}}</span>向你<span class="blue">咨询</span>，请做好准备应答</p>
            <p class="msgs-p" v-show="item.event_no * 1 === 60006"><span class="blue">保存</span>你的<span class="blue">微信号</span>，请准备通过好友</p>
          </div>
          <!--<img src="./icon-pressed@2x.png" class="msgs-rt">-->
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {PNES_COLOR} from 'common/js/pnes'
  export default{
    name: 'detail-msg',
    props: {
      actionList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        pnes: PNES_COLOR
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
          // let res = utils.radarTimeFormat(val)
          let res = new Date(val * 1000).toLocaleString('zh-CN', { hour12: false })
            .replace(/\//g, '-').replace(/\b\d\b/g, '0$&')
          return res
        }
        return ''
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
  .box-list
    font-family: $font-family-regular
    padding: 0 30px
  .msgs-item
    padding-top: 24px
    border-left-1px(#e3eefc)
    padding-left: 15px
    &:after
      content: ''
      width: 4px
      height: 4px
      border: 1.5px solid #4B92F2
      border-radius: 50%
      position: absolute
      left: -3px
      top: 27px
      background: #FFF
    .item-time
      font-size: $font-size-12
      color: #949494
      padding-bottom: 10px
      font-family: $font-family-regular
      position: relative

    .msg-item-content
      display: flex
      justify-content: space-between
      align-items: center
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
          color: #151515
          font-size: $font-size-14
          font-family: $font-family-regular
          .blue
            color: #4B92F2
      .msgs-rt
        width: 7.5px
        height: 11.5px
        margin-left: 33px

    .msgs-item:last-child
      margin-bottom: 0

</style>
