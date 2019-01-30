<template>
  <div class="z-test-echarts">
    <scroll>
      <div style="height: 12px"></div>
      <article class="panel">
        <h1 class="title border-bottom-1px">PNES动力模型</h1>
        <ai-charts ref="c1" :CHARTS_TYPE="CHARTS_TYPE.PNES"></ai-charts>
      </article>
      <article class="panel">
        <h1 class="title border-bottom-1px">近15天活跃度</h1>
        <ai-charts ref="c2" :CHARTS_TYPE="CHARTS_TYPE.VITALITY"></ai-charts>
      </article>
      <article class="panel">
        <h1 class="title border-bottom-1px">兴趣的商品占比</h1>
        <ai-charts ref="c3" :CHARTS_TYPE="CHARTS_TYPE.SHOP"></ai-charts>
      </article>
      <article class="panel">
        <h1 class="title border-bottom-1px">客户性别占比</h1>
        <ai-charts ref="c4" :CHARTS_TYPE="CHARTS_TYPE.GENDER"></ai-charts>
      </article>
      <article class="panel">
        <h1 class="title border-bottom-1px">用户分组</h1>
        <ai-charts ref="c5" :CHARTS_TYPE="CHARTS_TYPE.USER"></ai-charts>
      </article>
      <article class="panel">
        <h1 class="title border-bottom-1px">客户城市占比 TOP6</h1>
        <ai-charts ref="c6" :CHARTS_TYPE="CHARTS_TYPE.CITY_TOP"></ai-charts>
      </article>
      <router-link tag="div" to="" class="panel">
        <router-link tag="div" to="z-test" class="title border-bottom-1px">用户分享占比 TOP6</router-link>
        <ai-charts ref="c7" :CHARTS_TYPE="CHARTS_TYPE.USER_TOP6"></ai-charts>
      </router-link>
      <article class="panel">
        <h1 class="title border-bottom-1px">订单和金额</h1>
        <ai-charts ref="c8" :CHARTS_TYPE="CHARTS_TYPE.ORDER_AMOUNT"></ai-charts>
      </article>
      <section class="panel-card" v-for="(item, index) in dataArray" :key="index">
        <article class="top-wrapper border-bottom-1px" @click="closeHandle(index)">
          <p class="title">活跃新客</p>
        </article>
        <article class="bottom-wrapper">
          <section class="left item">
            <p class="number">182</p>
            <p class="text">触达数</p>
          </section>
          <section class="middle item">
            <p class="number">123</p>
            <p class="text">进店数</p>
          </section>
          <section class="right">
            <ai-charts :ref="'c9' + index" :CHARTS_TYPE="CHARTS_TYPE.SEM_LIST"></ai-charts>
          </section>
        </article>
      </section>
      <div style="height: 12px"></div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'components/scroll/scroll'
  import AiCharts from 'components/_ai-charts/_ai-charts'
  import {CHARTS_TYPE} from 'utils/constants-charts'

  const PAGE_NAME = 'Z_TEST_ECHARTS'

  export default {
    name: PAGE_NAME,
    components: {
      Scroll,
      AiCharts
    },
    data() {
      return {
        CHARTS_TYPE: CHARTS_TYPE,
        isClosed: false,
        dataArray: new Array(9).fill(false)
      }
    },
    created() {
    },
    mounted() {
      setTimeout(() => {
        this.$loading.hide()
        this.$toast.show('test')
      }, 1000)
      this.$loading.show()
      this.$refs.c1.action()
      this.$refs.c2.action()
      this.$refs.c3.action()
      this.$refs.c4.action()
      this.$refs.c5.action()
      this.$refs.c6.action()
      this.$refs.c7.action()
      this.$refs.c8.action()
      this.dataArray.map((item, index) => {
        this.$refs[`c9${index}`][0].action()
      })
    },
    methods: {
      closeHandle(index) {
        this.dataArray[index] = !this.dataArray[index]
        let isClosed = this.dataArray[index]
        this.$refs[`c9${index}`][0].action({isClosed})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .z-test-echarts
    fill-box(fixed)
    z-index :999
    .panel-card
      margin :15px
      background: #FFFFFF;
      box-shadow: 0 0 20px 0 rgba(141,151,158,0.20);
      border-radius: 8px;
      padding :0 15px
      .top-wrapper
        .title
          padding :14px 0
      .bottom-wrapper
        display :flex
        align-items :center
        justify-content :space-between
        .left
          margin-left :11.5px
        .item
          layout(column,block,nowrap)
          justify-content :center
          align-items :center
          .number
            font-family: $font-family-light
            font-size: 20px;
            color: #333333;
          .text
            margin-top :10px
            font-family: $font-family-regular
            font-size: 12px;
            color: #949494;
        .right
          width :100px
          height :61.5px
          padding :12px 0
    .panel
      margin :12px
      background: #FFFFFF;
      box-shadow: 0 0 10px 0 rgba(141,151,158,0.30);
      border-radius: 8px;
      overflow :hidden
      .title
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333333;
        line-height: 16px;
        padding :13.5px 0
        margin :0 15px
</style>
