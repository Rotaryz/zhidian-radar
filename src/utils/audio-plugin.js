// window.$nowTime = 0 // 记录播放的开始时刻
// function _createAudio() {
//   window.$audio = document.querySelector('#musicAudio')
//   window.$audio.addEventListener('loadedmetadata', () => {
//     // alert(window.$audio.duration)
//     console.log(window.$audio.duration)
//   })
// }
// _createAudio()
//
// window.$playAudio = function () {
//   // let duration = this.$audio.duration * 1000
//   // if (!duration) return
//   // if (Date.now() - this.$nowTime < duration) return
//   // this.$nowTime = Date.now
//   // document.getElementById('musicAudio').play()
//   document.addEventListener('WeixinJSBridgeReady', function () {
//     let media = document.getElementById('musicAudio').play()
//     media.src = '/static/qq.mp3'
//     media.play()
//   }, false)
// }
//
// console.log(window.WeixinJSBridge)
// import wx from 'weixin-js-sdk'
// function autoPlayAudio1() {
//   wx.config({
//     // 配置信息, 即使不正确也能使用 wx.ready
//     debug: false,
//     appId: '',
//     timestamp: 1,
//     nonceStr: '',
//     signature: '',
//     jsApiList: []
//   })
// }
// autoPlayAudio1()
// window.$playAudio = () => {
//   wx.ready(function() {
//     document.getElementById('musicAudio').play()
//   })
// }
window.$nowTime = 0 // 记录播放的开始时刻

function _createAudio() {
  // window.$audio = document.querySelector('#musicAudio')
  window.$audio = new Audio()
  window.$audio.src = '/static/qq.mp3'
  window.$audio.addEventListener('loadedmetadata', () => {
    // alert(window.$audio.duration)
    console.log(window.$audio.duration)
  })
  // alert(window.$audio.src)
}
_createAudio()
/* eslint-disable */
window.$playAudio = function () {
  // let duration = this.$audio.duration * 1000
  // if (!duration) return
  // if (Date.now() - this.$nowTime < duration) return
  // this.$nowTime = Date.now
  // document.getElementById('musicAudio').play()
  // document.addEventListener('WeixinJSBridgeReady', function () {
  //   let media = document.getElementById('musicAudio').play()
  //   media.src = '/static/qq.mp3'
  //   media.play()
  // }, false)
  // alert(window.$audio.src)
  // window.$audio.play()
  let voice = window.$audio
  // 判斷 WeixinJSBridge 是否存在
  if (WeixinJSBridge && typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
    voice.play()
  } else {
    //監聽客户端抛出事件"WeixinJSBridgeReady"
    if (document.addEventListener) {
      document.addEventListener("WeixinJSBridgeReady", function(){
        voice.play();
      }, false);
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", function(){
        voice.play();
      });
      document.attachEvent("onWeixinJSBridgeReady", function(){
        voice.play();
      });
    }
  }
}
