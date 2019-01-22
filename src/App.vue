<template>
  <div id="app">
    <router-view />
    <audio ref="musicAudio">
      <source src="./test.mp3" type="audio/mpeg">
    </audio>
    <button @click="play" style="z-index: 9999;height: 100px;width: 200px;position: fixed;bottom: 0; background: red">音乐播放</button>
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
      ...Helpers.musicMethods,
      play() {
        this.$refs.musicAudio.play()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
