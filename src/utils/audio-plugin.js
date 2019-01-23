export const clearTimeSeconds = 5000 // 定时清除语音播放的间隔
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
  // 未触发语音提示
  setTimeout(() => {
    document.removeEventListener('touchstart', play, false)
  }, clearTimeSeconds)
}
window.$playAudio = audioAutoPlay
