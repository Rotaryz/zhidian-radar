const state = {
  musicAudio: null
}

const getters = {
  musicAudio: state => state.musicAudio
}

const actions = {
  setMusicAudio({commit, state}, obj) {
    commit('SET_MUSIC_AUDIO', obj)
  },
  playAudio({commit, state}, obj) {
    commit('PLAY_AUDIO', obj)
  }
}

const mutations = {
  SET_MUSIC_AUDIO(state, obj) {
    state.musicAudio = obj
    console.log(state.musicAudio)
  },
  PLAY_AUDIO(state, obj) {
    document.addEventListener('WeixinJSBridgeReady', function () {
      state.musicAudio.play()
    }, false)
    if (WeixinJSBridge && typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') { // eslint-disable-line
      state.musicAudio.play()
    } else {
      // 監聽客户端抛出事件"WeixinJSBridgeReady"
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', function () {
        }, false)
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', function () {
          state.musicAudio.play()
        })
        document.attachEvent('onWeixinJSBridgeReady', function () {
          state.musicAudio.play()
        })
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
