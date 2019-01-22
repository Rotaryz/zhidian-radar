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
    state.musicAudio.play()
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
