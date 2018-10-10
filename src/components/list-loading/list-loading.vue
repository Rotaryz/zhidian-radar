<template>
  <div class="load-bg">
    <img src="./loading.gif" class="gif">
  </div>
</template>
<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'listLoading'
  export default {
    name: COMPONENT_NAME
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .load-bg
    width: 60px
    height: 60px
    border-radius: 4px
    background: rgba(0,0,0,0.3)
    display: flex
    justify-content: center
    align-items: center
  .gif
    width: 30px
    height: 30px
</style>
