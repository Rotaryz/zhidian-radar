<template>
  <div id="app">
    <router-view />
    <audio ref="musicAudio">
      <source src="./test.mp3" type="audio/mpeg">
    </audio>
    <button @click="playAudio" style="z-index: 9999;height: 100px;width: 200px;position: fixed;bottom: 5px; background: red">音乐播放</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as Helpers from '@/store/helpers'
  export default {
    name: 'App',
    mounted() {
      this.setMusicAudio(this.$refs.musicAudio)
    },
    methods: {
      ...Helpers.musicMethods
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
