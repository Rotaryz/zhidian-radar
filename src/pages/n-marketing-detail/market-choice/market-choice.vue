<template>
  <nav class="market-choice">
    <section v-for="(item, index) in dataArray" :key="index" class="panel-wrapper">
      <aside v-if="dataArray" class="line-wrapper">
        <div v-if="dataArray.length - index >= 1" class="icon" :class="{active:lineCheckHandle(index)}">
          <p class="before">{{index+1}}</p>
        </div>
        <p v-if="dataArray.length - index > 1" class="line" :class="{active:lineCheckHandle(index)}"></p>
      </aside>
      <div class="panel" :class="{active: index===0}">
        <section class="top">
          <div class="left">
            <p class="title">{{item.title}}</p>
            <p v-if="index === 0" class="explain">{{item.explain}}{{groupData2.cover_count || groupData.cover_count}}人)</p>
            <p v-else class="explain">{{item.explain}}</p>
          </div>
          <div v-if="isShowDelButton(index, item, 'group') && hasGroup" class="right" @click="delHandle(index, 'group')">
            <img class="del-icon" src="./icon-del_yx@2x.png" alt="">
          </div>
          <div v-if="isShowDelButton(index, item, 'income') && hasBenefit" class="right" @click="delHandle(index), 'income'">
            <img class="del-icon" src="./icon-del_yx@2x.png" alt="">
          </div>
        </section>
        <section v-if="item.title === '选择人群' && MARKET_TYPE.newProduct === marketData.type" class="bottom one">
          <!--<ul v-if="isShowGroupButton" class="button-group">-->
            <!--<li v-for="(child, idx) in item.groupArr" :key="idx" class="button" @click="incomeHandle(child, idx, 'group')">-->
              <!--<img class="add-icon" src="./icon-add@2x.png" alt="">-->
              <!--<p class="text">{{child.text}}</p>-->
            <!--</li>-->
          <!--</ul>-->
          <div v-if="!isShowGroupButton && hasGroup" class="left">
            <customer-group :dataArray="groupData2.customers"></customer-group>
          </div>
          <div v-if="!isShowGroupButton && hasGroup" class="right">
            <p class="title">{{groupData2.group_name}}</p>
            <p class="explain">{{groupData2.group_desc}}</p>
          </div>
        </section>
        <section v-else-if="item.title === '选择人群'" class="bottom one">
          <ul v-if="isShowGroupButton" class="button-group">
            <li v-for="(child, idx) in item.groupArr" :key="idx" class="button" @click="incomeHandle(child, idx, 'group')">
              <img class="add-icon" src="./icon-add@2x.png" alt="">
              <p class="text">{{child.text}}</p>
            </li>
          </ul>
          <div v-if="!isShowGroupButton && hasGroup" class="left">
            <customer-group :dataArray="groupData.customers"></customer-group>
          </div>
          <div v-if="!isShowGroupButton && hasGroup" class="right">
            <p class="title">{{groupData.group_name}}</p>
            <p class="explain">{{groupData.group_desc}}</p>
          </div>
        </section>
        <section v-if="item.title === '选择权益'" class="bottom two">
          <p v-if="!item.enableChange && !marketData.benefit.length" class="income-empty">每日上新的商品或活动，只推送一次</p>
          <ul v-if="isShowIncomeButton" class="button-group">
            <li v-for="(child, idx) in item.incomeArr" :key="idx" class="button" @click="incomeHandle(child, idx)">
              <img class="add-icon" src="./icon-add@2x.png" alt="">
              <p class="text">{{child.text}}</p>
            </li>
          </ul>
          <div v-else v-for="(child,index) in marketData.benefit" :key="index" class="income-wrapper">
            <market-coupon v-if="showIncomeType(INCOME_TYPE.coupon.benefit_type)" :info="child"></market-coupon>
            <market-active v-if="showIncomeType(INCOME_TYPE.activity.benefit_type)" :info="child"></market-active>
            <market-server-goods v-if="showIncomeType([INCOME_TYPE.goods.benefit_type, INCOME_TYPE.service.benefit_type])" :info="child"></market-server-goods>
          </div>
        </section>
        <section v-if="item.title === '选择渠道'" class="bottom three">
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
  import MarketServerGoods from '../market-server-goods/market-server-goods'
  import {INCOME_TYPE} from '../config-detail'
  import {MARKET_TYPE} from 'utils/constant'

  const COMPONENT_NAME = 'MARKET_CHOICE'
  export default {
    name: COMPONENT_NAME,
    components: {
      CustomerGroup,
      MarketCoupon,
      MarketActive,
      MarketServerGoods
    },
    data() {
      return {
        INCOME_TYPE,
        MARKET_TYPE
      }
    },
    computed: {
      ...Helpers.marketComputed,
      dataArray() {
        return this.CONFIG.choicesArr
      },
      isShowGroupButton() {
        return !(this.marketData.group && this.marketData.group.length)
      },
      isShowIncomeButton() {
        return !(this.marketData.benefit && this.marketData.benefit.length)
      },
      hasBenefit() {
        let benefit = this.marketData.benefit
        let flag = benefit && benefit.length
        return flag
      },
      hasGroup() {
        let group = this.marketData.group
        let flag = group && group.length
        return flag
      },
      groupData() {
        let group = this.marketData.group || []
        return group[0] || {}
      },
      groupData2() {
        let customers = []
        let groupName = []
        let number = 0
        this.marketData.group.forEach((item) => {
          customers.push(...item.customers)
          groupName.push(item.group_name)
          number += item.cover_count
        })
        groupName = groupName.join('和')
        let groupDesc = '进入店铺' + groupName || '客户'
        return {
          customers,
          group_name: groupName,
          group_desc: groupDesc,
          cover_count: number
        }
      },
      _checkDefault() {
        return true
      }
    },
    methods: {
      ...Helpers.marketMethods,
      showIncomeType(arr) {
        let type = this.marketData.benefit_type
        let flag = false
        if (arr instanceof Array) {
          flag = arr.some((val) => val === type)
        } else {
          flag = arr === type
        }
        return flag
      },
      isShowDelButton(index, item, type) {
        let position = item.enableChangeType === type
        let enableChange = item.enableChange
        return position && enableChange
      },
      incomeHandle(child, idx, type) {
        if (type === 'group') {
          this.$emit('income', idx, 'group')
          return
        }
        this.updateBenefitType(child.benefit_type)
        this.$emit('income', idx)
      },
      delHandle(idx, type) {
        if (type === 'group') {
          this.updateGroup()
        } else {
          this.updateBenefit()
        }
      },
      lineCheckHandle(idx) {
        let key = ''
        let flag = false
        for (let index = idx; index >= 0; index--) {
          key = this.CONFIG.checkArr[index]
          flag = this[key]
          if (!flag) break
        }
        return flag
      }
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

  .income-empty
    width :100%
    display :flex
    justify-content :center
    align-items :center
    font-family: $font-family-regular
    font-size: 3.733333333333334vw
    color: #666666;
    line-height: 1

  .market-choice
    display :flex
    flex-wrap wrap
    padding :0 4vw
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
        top:4.266666666666667vw
        .icon
          position :absolute
          width :5.333333333333334vw
          height :@width
          border-radius :100%
          background :#e7ebf4
          z-index :2
          .before
            width :4vw
            height :@width
            all-center()
            border-radius :100%
            background-image: linear-gradient(167deg, #EDEDED 5%, #D6D6D6 99%)
            font-family: $font-family-medium
            font-size: 2.666666666666667vw
            color: #969696
            line-height: @height
            text-align :center
          &.active
            background :#dad6fb
            .before
              background-image: linear-gradient(133deg, #7D2EF6 9%, #4541F9 96%);
              box-shadow: 0 2px 8px 0 rgba(89,41,220,0.40);
              color: #fff

        .line
          position:absolute
          top:0
          left :2.54vw
          width :1px
          height :112%
          transform :scaleX(0.5)
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
          overflow :hidden
          &:after
            content: ""
            display: block
            position: absolute
            height: 1px
            left: 0
            bottom: 0
            width: 100%
            background-image: repeating-linear-gradient(90deg, #E1E1E1 0,#E1E1E1 4px, #fff 4px, #fff 6px)
            transform: scale(1, 1)
            @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2)
              width: 200%
              transform: scale(1, .5)
            @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
              width: 300%
              transform: scale(1, 1 / 3)
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
                  width :12.666666666666668vw
                  height :@width
                .text
                  margin-top :0.3333333333333335vw
                  font-family: $font-family-regular
                  font-size: 3.2vw
                  color: #333333;
                  line-height: @font-size
                  text-align :center
          &.one
            layout(row,block,nowrap)
            align-items :center
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
                margin-top : -5px
                display :inline-block
                text-align :center
                width :12.666666666666668vw
                height :@width
              .text
                position :relative
                top: 1px
                font-family: $font-family-regular
                font-size: 3.2vw
                color: #333333;
                line-height: @font-size
                text-align :center
          .left
            width :12vw
            height :@width
          .right
            flex: 1
            overflow :hidden
            margin-left :3.0666666666666664vw
            font-family: $font-family-regular
            line-height: 1.2
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
