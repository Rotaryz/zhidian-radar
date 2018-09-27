<template>
  <div class="my-goods">
    <Scroll bcColor="#f1f2f5">
      <div class="tab-wrap">
        什么
      </div>
    </Scroll>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Business } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import storage from 'storage-controller'

  export default {
    name: 'MyGoods',
    data () {
      return {
      }
    },
    created () {
    },
    methods: {
    },
    computed: {
    },
    components: {
      Scroll
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'

  .my-goods
    position: fixed
    background: $color-background
    z-index: 10
    left: 0
    right: 0
    bottom: 45px
    top: 0
</style>
