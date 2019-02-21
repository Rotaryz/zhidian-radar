<template>
  <article class="exception">
    <section class="e-content">
      <div :class="['err-img',imgStyle] "></div>
      <div class="err-msg" v-if="errType !== 'closed'">{{errMsg[errType][1]}}</div>
      <div class="err-txt-black" v-if="errType === 'closed'">你的店铺已暂停使用，无法访问</div>
      <div class="err-txt-gray" v-if="errType === 'closed'">如需续费，请联系管理员</div>
    </section>
  </article>
</template>

<script type="text/ecmascript-6">
  const imgJson = {
    '404': ['pic-404', '网络异常，请刷新重试'],
    'customer': ['pic-customer', '暂无客户'],
    'orderfrom': ['pic-customer', '暂无订单'],
    'delcard': ['pic-delcard', '名片被删除，请联系公司管理员'],
    'disablecard': ['pic-disablecard', '名片被禁用，请联系公司管理员'],
    'closed': ['pic-closed', '你的店铺已暂停使用，无法访问'],
    'nodata': ['pic-nodata', '暂无数据'],
    'nogroup': ['pic-nogroup', '暂无分组'],
    'noservice': ['pic-nogroup', '暂无服务'],
    'nonews': ['pic-nonews', '暂无消息'],
    'noresult': ['pic-noresult', '找不到您所要的结果'],
    'nocode': ['pic-nocode', '暂无群二维码'],
    // AI智能运营无数据背景
    'noflow': ['pic-notalk', '暂无话术'],
    'noactive': ['pic-noactivity', '暂无活动'],
    'nogoods': ['pic-nogoods', '暂无商品'],
    'nocoupon': ['pic-nocoupon', '暂无优惠券'],
    'nosearch': ['pic-noadult', '暂无搜索结果']
  }
  export default {
    props: {
      errType: String
    },
    data() {
      return {
        errMsg: imgJson
      }
    },
    computed: {
      imgStyle() {
        return imgJson[this.errType][0]
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .exception
    .e-content
      layout()
      align-items :center
      .err-img
        width: 162px
        height: 117px
        margin-bottom: 20px
        &.pic-nogroup
          icon-image("pic-nogroup")
        &.pic-404
          icon-image("pic-404")
        &.pic-customer
          icon-image("pic-customer")
        &.pic-delcard
          icon-image("pic-delcard")
        &.pic-disablecard
          icon-image("pic-disablecard")
        &.pic-nodata
          icon-image("pic-nodata")
        &.pic-nonews
          icon-image("pic-nonews")
        &.pic-noresult
          icon-image("pic-noresult")
        &.pic-nocode
          icon-image("pic-nocode")
        &.pic-closed
          icon-image("pic-shopsuspend")
        &.pic-notalk
          width: 103px
          height: 90px
          icon-image("pic-notalk")
        &.pic-noactivity
          width: 103px
          height: 90px
          icon-image("pic-noactivity")
        &.pic-nogoods
          width: 103px
          height: 90px
          icon-image("pic-nogoods")
        &.pic-nocoupon
          width: 103px
          height: 90px
          icon-image("pic-nocoupon")
        &.pic-noadult
          width: 103px
          height: 90px
          icon-image("pic-noadult")
      .err-msg
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-888888
      .err-txt-black
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-20202E
        padding-top: 5px
      .err-txt-gray
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-888888
        padding-top: 15px
</style>
