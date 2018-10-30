<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script type="text/ecmascript-6">
  import {Jwt} from 'api'
  import storage from 'storage-controller'

  export default {
    name: 'App',
    created() {
      Jwt.getemployeeInfo().then(res => {
        if (res && res.data) {
          storage.set('info', res.data)
        }
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
