<template>
  <nav class="market-choice">
    <section v-for="(item, index) in dataArray" :key="index" class="panel-wrapper">
      <aside v-if="dataArray" class="line-wrapper">
        <div v-if="dataArray.length - index >= 1" class="icon" :class="{active:lineCheckHandle(index)}">{{index+1}}</div>
        <p v-if="dataArray.length - index > 1" class="line" :class="{active:lineCheckHandle(index)}"></p>
      </aside>
      <div class="panel" :class="{active: index===0}">
        <section class="top">
          <div class="left">
            <p class="title">{{item.title}}</p>
            <p v-if="index === 0" class="explain">{{item.explain}}{{groupData.cover_count}}人)</p>
            <p v-else class="explain">{{item.explain}}</p>
          </div>
          <div v-if="isShowDelButton(index, item) && hasBenefit" class="right" @click="delHandle(index)">
            <img class="del-icon" src="./icon-del_yx@2x.png" alt="">
          </div>
        </section>
        <section v-if="index==0" class="bottom one">
          <div class="left">
            <customer-group :dataArray="groupData.customers"></customer-group>
          </div>
          <div class="right">
            <p class="title">{{groupData.group_name}}</p>
            <p class="explain">{{groupData.group_desc}}</p>
          </div>
        </section>
        <section v-if="index==1" class="bottom two">
          <!--<div class="income-wrapper">-->
            <!--<market-active></market-active>-->
          <!--</div>-->
          <ul v-if="!(marketData.benefit && marketData.benefit.length)" class="button-group">
            <li v-for="(child, idx) in item.incomeArr" :key="idx" class="button" @click="incomeHandle(child, idx)">
              <img class="add-icon" src="./icon-add@2x.png" alt="">
              <p class="text">{{child.text}}</p>
            </li>
          </ul>
          <div v-else v-for="(child,index) in marketData.benefit" :key="index" class="income-wrapper">
            <market-coupon v-if="marketData.benefit_type === 1" :info="child"></market-coupon>
            <market-active v-if="marketData.benefit_type === 4" :info="child"></market-active>
          </div>
        </section>
        <section v-if="index===2" class="bottom three">
          <ul class="button-group">
            <li v-for="(child, idx) in item.channelTextArr" :key="idx" class="button">
              <img v-if="idx===marketData.channel_type" class="icon" src="./icon-ok@2x.png" alt="">
              <img v-else class="icon" src="./icon-no@2x.png" alt="">
              <p class="text">{{child}}</p>
            </li>
          </ul>
        </section>
      </div>
    </section>
  </nav>
</template>

<script type="text/ecmascript-6">
  import CustomerGroup from 'components/customer-group/customer-group'
  import * as Helpers from '@/store/helpers'
  import MarketCoupon from '../market-coupon/market-coupon'
  import MarketActive from '../market-active/market-active'
  // import {INCOME_TYPE} from '../config-detail'

  const COMPONENT_NAME = 'MARKET_CHOICE'
  export default {
    name: COMPONENT_NAME,
    components: {
      CustomerGroup,
      MarketCoupon,
      MarketActive
    },
    data() {
      return {
      }
    },
    computed: {
      ...Helpers.marketComputed,
      dataArray() {
        return this.CONFIG.choicesArr
      },
      hasBenefit() {
        let benefit = this.marketData.benefit
        let flag = benefit && benefit.length
        return flag
      },
      groupData() {
        let group = this.marketData.group || []
        return group[0] || {}
      },
      _checkDefault() {
        return true
      }
    },
    methods: {
      ...Helpers.marketMethods,
      isShowDelButton(index, item) {
        let position = index + 1 !== this.dataArray.length
        let enableChange = item.enableChange
        return position && enableChange
      },
      incomeHandle(child, idx) {
        console.log(child)
        this.updateBenefitType(child.benefit_type)
        this.$emit('income', idx)
      },
      delHandle(idx) {
        this.updateBenefit()
      },
      lineCheckHandle(idx) {
        let key = this.CONFIG.checkArr[idx]
        let flag = this[key]
        if (idx !== 0) {
          key = this.CONFIG.checkArr[idx - 1]
          flag = flag && this[key]
        }
        return flag
      }
      // showIncome(item, idx, type) {
      //   // let flag = idx === 0
      //   // let income = item.incomeArr[idx].type === type
      //   console.log(item.incomeArr[idx].type)
      //   return item.incomeArr[idx].type === type
      // }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .income-wrapper
    width :100%
    display :flex
    justify-content :center
    align-items :center

  .market-choice
    display :flex
    flex-wrap wrap
    padding :0 15px
    .panel-wrapper
      layout(row,block,nowrap)
      width :100%
      padding-bottom : 15px
      &:nth-of-type(1)
        .panel
          height:34.66666666666667vw
      &:last-child
        padding-bottom :20px
      .line-wrapper
        flex: 1
        height :100%
        position :relative
        top:16px
        .icon
          position :absolute
          width :4vw
          height :@width
          border-radius :100%
          background: #d6d6d6
          font-family: $font-family-medium
          font-size: 2.666666666666667vw
          color: #969696;
          line-height: @height
          text-align :center
          z-index :2
          &.active
            background-image: linear-gradient(133deg, #7D2EF6 9%, #4541F9 96%);
            box-shadow: 0 2px 8px 0 rgba(89,41,220,0.40);
            color: #fff
        .line
          position:absolute
          top:0
          left :1.7333333333333332vw
          width :1px
          height :112%
          background :repeating-linear-gradient(0deg,#D6D6D6,#D6D6D6 6px,$color-background 0,$color-background 8px)
          &.active
            background :repeating-linear-gradient(0deg,#8867F2,#8867F2 6px,$color-background 0,$color-background 8px)
      .panel
        width :85.33333333333334vw
        height :40.53333333333333vw
        background: #FFFFFF;
        border: 1px solid #E9F0FE;
        box-shadow: 0 2px 8px 0 rgba(21,24,45,0.04);
        border-radius: 1.6vw
        box-sizing :border-box
        layout()
        padding :0 15px
        .top
          height :12vw
          position :relative
          display :flex
          align-items :center
          &:after
            content: ""
            display: block
            position: absolute
            border-bottom: 1px dotted $color-row-line
            left: 0
            bottom: 0
            width: 100%
            transform-origin: 0 bottom
          .left
            flex:1
            font-family: $font-family-regular
            line-height: 1
            display :flex
            height :100%
            align-items :center
            .title
              font-size: 3.733333333333334vw
              color: #333333;
            .explain
              margin-left :3px
              font-size: 3.2vw
              color: #666
          .right
            width :3.2vw
            height :@width
            extend-click(-10px)
            .del-icon
              width :100%
              height :100%
        .bottom
          flex:1
          &.three
            display :flex
            .button-group
              flex:1
              layout(row,block,nowrap)
              align-items :center
              justify-content :space-around
              .button
                display :flex
                flex-direction :column
                align-items :center
                justify-content :center
                .icon
                  width :13.333333333333334vw
                  height :@width
                  text-align :center
                .text
                  margin-top :2.666666666666667vw
                  font-family: $font-family-regular
                  font-size: 3.2vw
                  color: #333333;
                  line-height: @font-size
                  text-align :center
          &.two
            display :flex
            .button-group
              flex:1
              layout(row,block,nowrap)
              align-items :center
              justify-content :space-around
              .button
                display :flex
                flex-direction :column
                align-items :center
                justify-content :center
                .add-icon
                  display :inline-block
                  text-align :center
                  width :10.666666666666668vw
                  height :@width
                .text
                  margin-top :1.3333333333333335vw
                  font-family: $font-family-regular
                  font-size: 3.2vw
                  color: #333333;
                  line-height: @font-size
                  text-align :center
          &.one
            layout(row,block,nowrap)
            align-items :center
          .left
            width :12vw
            height :@width
          .right
            flex: 1
            overflow :hidden
            margin-left :3.0666666666666664vw
            font-family: $font-family-regular
            line-height: 1
            .title
              font-size: 3.733333333333334vw
              color: #333333;
              no-wrap()
            .explain
              margin-top :3.2vw
              font-size: 3.2vw
              color: #666666;
              no-wrap()
</style>
