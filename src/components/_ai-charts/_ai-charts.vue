<template>
  <div class="charts-line">
    <section class="chart-item-wrapper">
      <div ref="chartItem" class="chart-item"></div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import {CHARTS_TYPE, CHARTS_CONFIG} from 'utils/constants-charts'
  const COMPONENT_NAME = 'CHARTS_LINE'
  export default {
    name: COMPONENT_NAME,
    props: {
      CHARTS_TYPE: {
        type: String,
        default: CHARTS_TYPE.PNES
      }
    },
    data() {
      return {
        myChart: null
      }
    },
    computed: {
      CHARTS_CONFIG() {
        return CHARTS_CONFIG[this.CHARTS_TYPE]
      }
    },
    mounted() {
      this.myChart = this.$echarts.init(this.$refs.chartItem)
    },
    methods: {
      action(data) {
        let config = this.CHARTS_CONFIG.createOption(data)
        this.myChart.setOption(config)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .charts-line
    width: 100%
    height :0
    padding-top :64.67236467236467%
    position :relative
    .chart-item-wrapper
      fill-box(absolute)
      .chart-item
        height :100%

</style>
