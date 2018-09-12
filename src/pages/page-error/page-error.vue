<template>
  <article class="page-error">
    <div>
      <section class="exception-box">
        <exception :errType="useType"></exception>
      </section>
      <div v-if="useType==='404'" class="btn" @click="_refresh">刷新</div>
    </div>
  </article>
</template>

<script type="text/ecmascript-6">
  import Exception from 'components/exception/exception'

  export default {
    name: 'PageError',
    data() {
      return {
        useType: ''
      }
    },
    created() {
      const useType = this.$route.query.useType
      useType && (this.useType = useType)
    },
    methods: {
      _refresh() {
        this.$router.replace('/')
      }
    },
    components: {
      Exception
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .page-error
    fill-box()
    z-index: 100
    background-color: $color-white-fff
    .exception-box
      padding-top: 137px
    .btn
      margin: 30px auto 0
      width: 83px
      height: 30px
      line-height: 30px
      text-align: center
      background: $color-56BA15
      border-radius: 2px
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-white-fff

</style>
