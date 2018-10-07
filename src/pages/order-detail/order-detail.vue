<template>
  <div class="order-detail">
    <scroll bcColor="#f0f2f5" :showNoMore="false">
      <div class="msg">
        <header class="top-msg">
          <p class="title">{{data.title}}</p>
          <h2 class="total-price">￥{{data.total}}</h2>
          <p class="status">{{data.status_str}}</p>
        </header>
        <section class="content">
          <p class="list"><span class="type">业务类型</span><span class="contxt">{{data.order_type}}</span></p>
          <p class="list"><span class="type">创建时间</span><span class="contxt">{{data.create_at}}</span></p>
          <p class="list"><span class="type">支付时间</span><span class="contxt">{{data.pay_at}}</span></p>
          <p class="list"><span class="type">商户订单号</span><span class="contxt">{{data.transaction_id}}</span></p>
        </section>
        <section class="content">
          <p class="list border"><span class="type">售卖方</span><span class="contxt">{{data.employee_name}}</span></p>
          <p class="list"><span class="type">客户姓名</span><span class="contxt">{{data.customer_name}}</span></p>
          <p class="list"><span class="type">手机号码</span><span class="contxt">{{data.customer_mobile}}</span></p>
        </section>
        <footer class="content last-child">
          <p class="list"><span class="type">服务单价</span><span class="contxt">{{data.price}}</span></p>
          <p class="list"><span class="type">服务数量</span><span class="contxt">{{data.num}}</span></p>
          <p class="list"><span class="type">服务总价</span><span class="contxt">{{data.total}}</span></p>
          <p class="list"><span class="type">优惠金额</span><span class="contxt">{{data.discount_price}}</span></p>
          <p class="list"><span class="type">实收金额</span><span class="contxt">{{data.total_price}}</span></p>
        </footer>
      </div>
      <div class="null-data" v-if="loaded && data.length === 0">
        <exception errType="nodata"></exception>
      </div>
      <div class="loading" v-if="loading">
        <list-loading></list-loading>
      </div>
      <toast ref="toast"></toast>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import Exception from 'components/exception/exception'
  import { OrderForm } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import ListLoading from 'components/list-loading/list-loading'

  export default {
    name: 'OrderDetail',
    data() {
      return {
        loaded: false,
        loading: false,
        shopId: '',
        arr: [],
        data: []
      }
    },
    created() {
      this.shopId = this.$route.query.id
      this.orderFormDetail()
    },
    methods: {
      orderFormDetail() { // 订单详情
        if (!this.loaded) {
          this.loading = true
        }
        OrderForm.orderFormDetail(this.shopId)
          .then((res) => {
            this.loaded = true
            this.loading = false
            if (res.error !== ERR_OK) {
              this.$refs.toast.show(res.message)
              return
            }
            this.data = res.data
          })
      }
    },
    computed: {
    },
    watch: {
    },
    components: {
      Scroll,
      Exception,
      Toast,
      ListLoading
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .order-detail
    position: fixed
    z-index: 10
    left: 0
    right: 0
    bottom: 0
    top: 0
    font-family: $font-family-regular
    .msg
      padding: 0 15px
      background: $color-white
      box-shadow: 0 0 6px 0 rgba(43,43,145,0.05)
    .top-msg
      padding: 20px 0 29px
      text-align: center
      border-bottom-1px(#E9E9E9)
      .title
        font-size: 16px
        color: $color-202020
        margin-bottom: 18px
      .total-price
        font-size: 30px
        font-family: $font-family-semibold
        color: $color-202020
        margin-bottom: 8px
      .status
        color: $color-9B9B9B
        font-size: 14px
    .content
      font-size: 14px
      border-bottom-1px(#E9E9E9)
      padding-bottom: 19px
      .list
        display: flex
        justify-content: space-between
        align-items: center
        padding-top: 19px
      .type
        color: $color-888888
      .contxt
        color: $color-202020
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        width: 70%
        text-align: right
      .border
        padding-bottom: 19px
        border-bottom-1px(#FBFBFB)
    .last-child:after
      border: 0
</style>
