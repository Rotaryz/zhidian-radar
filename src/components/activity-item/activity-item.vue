<template>
  <div class="activity-item">
    <div class="item-content">
      <!--<div class="item-left" :style="{backgroundImage: 'url(' + item.image_url + ')',backgroundPosition: 'center',backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}">-->
        <!--&lt;!&ndash;<div class="left-cover" :class="tabIdx == 1 ? '' : 'hide'">已下架</div>&ndash;&gt;-->
      <!--</div>-->
      <img class="item-left" :src="item.image_url" alt="">
      <div class="item-right">
        <div class="right-title">{{item.goods_title}}</div>
        <div class="right-down">
          <div class="down-left">
            <p class="down-txt"><span class="first-txt">库存{{item.stock}}</span></p>
            <p class="down-txt second"><span class="first-txt"><i class="small">¥</i>{{item.platform_price}}</span><span v-if="item.earn_money" class="earn">(赚￥{{item.earn_money}})</span></p>
          </div>
          <div class="down-right">
            <div class="up" v-if="page === 'activity'" @click.stop="itemDown(item)">下架</div>
            <div class="down" v-if="page === 'team'" @click.stop="itemUp(item)">上架</div>
          </div>
        </div>
      </div>
    </div>
    <p class="title" :class="{'group' : item.rule_id * 1 === 1}"></p>
    <div class="time-down" v-if="item.start_at_timestamp">
      <div class="time-box">
        <p class="time">距开始
          <span v-if="endTime && endTime.day && endTime.day>0" class="date">{{endTime.day}}</span><span v-if="endTime && endTime.day>0">:</span>
          <span v-if="endTime && endTime.hour" class="date">{{endTime.hour}}</span>:
          <span v-if="endTime && endTime.minute" class="date">{{endTime.minute}}</span>:
          <span v-if="endTime && endTime.second" class="date">{{endTime.second}}</span></p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['tabIdx', 'item', 'showEdit', 'page'],
    data() {
      return {
        endTime: {},
        current_timestamp: 0
      }
    },
    created() {
      this._endTimePlay()
    },
    methods: {
      showEditCover(item) {
        this.$emit('showEdit', item)
      },
      itemEditor(item) {
        this.$emit('itemEditor', item)
      },
      itemDown(item) {
        this.$emit('itemDown', item)
      },
      itemDelete(item) {
        this.$emit('itemDelete', item)
      },
      itemUp(item) {
        this.$emit('itemUp', item)
      },
      _endTimePlay() {
        clearInterval(this.timer)
        this.current_timestamp = this.item.current_timestamp
        this.current_timestamp++
        this.endTime = this._groupTimeCheckout(this.item.start_at_timestamp, this.current_timestamp)
        this.timer = setInterval(() => {
          this.current_timestamp++
          this.endTime = this._groupTimeCheckout(this.item.start_at_timestamp, this.current_timestamp)
        }, 1000)
      },
      _groupTimeCheckout(time, nowTime) {
        let differ = time - nowTime
        let day = Math.floor(differ / (60 * 60 * 24))
        day = day >= 10 ? day : '0' + day
        let hour = Math.floor(differ / (60 * 60)) - (day * 24)
        hour = hour >= 10 ? hour : '0' + hour
        let minute = Math.floor(differ / 60) - (day * 24 * 60) - (hour * 60)
        minute = minute >= 10 ? minute : '0' + minute
        let second = Math.floor(differ) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
        second = second >= 10 ? second : '0' + second
        let times
        if (differ > 0) {
          times = {
            day,
            hour,
            minute,
            second
          }
        } else {
          times = {
            day: '00',
            hour: '00',
            minute: '00',
            second: '00'
          }
        }
        return times
      }
    },
    beforeDestroy() {
      clearInterval(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .activity-item
    width: 100%
    background: $color-white
    position: relative
    .item-content
      width: 100%
      height: 100%
      box-sizing: border-box
      padding: 15px 10px
      display: flex
      align-items: center
      position: relative
      .item-left
        width: 18.666vw
        height: @width
        margin-right: 10px
        position: relative
        object-fit :cover
        .left-cover
          position: absolute
          width: 100%
          height: 100%
          background: rgba(54,53,71,0.8)
          line-height: 18.666vw
          text-align: center
          color: $color-white
          font-size: $font-size-12
          font-family: $font-family-regular
          transition: all .3s
        .hide.left-cover
          opacity: 0
      .item-right
        flex: 1
        overflow: hidden
        height: 18vw
        display: flex
        flex-direction: column
        justify-content: space-between
        .right-title
          font-size: $font-size-16
          color: $color-20202E
          font-family: $font-family-regular
          letter-spacing: 0.8px
          width: 70%
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .right-down
          display: flex
          justify-content: space-between
          .down-left
            flex: 1
            overflow: hidden
            .down-txt
              font-family: $font-family-regular
              color: $color-888888
              font-size: $font-size-14
              letter-spacing: 0.6px
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              .earn
                font-size: 12px
                margin-left: 5px
                letter-spacing: 0.3px
                color: $color-F9543C
              .small
                font-style: normal
                font-size: 14px
            .second
              margin-top: 14px
              color: #010000
              font-size: $font-size-18
              display: flex
              align-items: center
          .down-right
            width: 16vw
            text-align: center
            .up,.down
              color: $color-white
              width: 14vw
              height: 6vw
              background: $color-20202E
              font-size: $font-size-14
              text-align: center
              line-height: 6vw
              border-radius: 20px
              margin: 0 auto
            .sale-count
              color: $color-888888
              font-size: $font-size-12
              margin-top: 5px
    .time-down
      height: 46px
      padding: 0 15px
      background: $color-white
    .title
      bg-image(pic-label_kj)
      width: 10vw
      height: 10vw
      background-size: 100% 100%
      position: absolute
      left: -3px
      top: 13px
    .group
      bg-image(pic-label_pt)
      background-size: 100% 100%
    .time-box
      height: 100%
      display: flex
      align-items: center
      justify-content: space-between
      border-top-1px($color-F3F3F3)
      .time
        font-size: 14px
        display: flex
        align-items: center
        color: $color-20202E
        .date
          width: 18px
          height: 18px
          line-height: 18px
          text-align: center
          background: $color-20202E
          border-radius: 2px
          margin: 0 2px
          font-size: $font-size-10
          color: $color-white
          &:first-child
            margin-left: 4px
</style>
