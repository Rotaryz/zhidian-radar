<template>
  <div id="app">
    <router-view />
    <audio ref="musicAudio">
      <source src="./test.mp3" type="audio/mpeg">
    </audio>
    <button @click="play" style="z-index: 9999;height: 100px;width: 200px;position: fixed; background: red">音乐播放</button>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'App',
    methods: {
      play() {
        this.$refs.musicAudio.play()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
