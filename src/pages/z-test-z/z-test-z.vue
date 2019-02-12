<template>
  <div class="z-test-z">
    <ai-charts ref="c1" :CHARTS_TYPE="CHARTS_TYPE.USER_TOP6_DETAIL"></ai-charts>
  </div>
</template>

<script type="text/ecmascript-6">
  import AiCharts from 'components/_ai-charts/_ai-charts'
  import {CHARTS_TYPE} from 'utils/constants-charts'

  const PAGE_NAME = 'Z_TEST_Z'

  export default {
    name: PAGE_NAME,
    components: {
      AiCharts
    },
    data() {
      return {
        CHARTS_TYPE: CHARTS_TYPE

      }
    },
    mounted() {
      this.$refs.c1.action()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .z-test-z
    fill-box(fixed)
    z-index :9999
</style>
