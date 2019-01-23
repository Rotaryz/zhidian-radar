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
        CHARTS_TYPE: CHARTS_TYPE
      }
    },
    mounted() {
      this.$refs.c1.action()
      this.$refs.c2.action()
      this.$refs.c3.action()
      this.$refs.c4.action()
      this.$refs.c5.action()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .z-test-echarts
    fill-box(fixed)
    z-index :999
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
