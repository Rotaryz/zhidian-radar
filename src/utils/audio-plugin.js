window.$nowTime = 0 // 记录播放的开始时刻
function _createAudio() {
  window.$audio = new Audio()
  window.$audio.src = '/static/qq.mp3'
  window.$audio.addEventListener('loadedmetadata', () => {
    // alert(window.$audio.duration)
    // console.log(this)
  })
}
_createAudio()

window.$playAudio = function () {
  alert(window.$audio.play)
  if (!this.$audio) return
  // let duration = this.$audio.duration * 1000
  // if (!duration) return
  // if (Date.now() - this.$nowTime < duration) return
  // this.$nowTime = Date.now
  document.addEventListener('WeixinJSBridgeReady', function () {
    window.$audio && window.$audio.play()
    // document.getElementById('audio').play();
    // document.getElementById('video').play();
  }, false)
}
