function audioAutoPlay(id = 'musicAudio') {
  let audio = document.getElementById(id)
  let play = function() {
    audio.play()
    document.removeEventListener('touchstart', play, false)
  }
  audio.play()
  document.addEventListener('WeixinJSBridgeReady', function () { // 微信
    play()
  }, false)
  document.addEventListener('YixinJSBridgeReady', function() { // 易信
    play()
  }, false)
  document.addEventListener('touchstart', play, false)
}
window.$playAudio = audioAutoPlay
