const state = {
  register: []
}

const getters = {
  register: state => state.register
}

const actions = {
  updateRegister({commit, state}, obj) {
    commit('UPDATE_REGISTER', obj)
  }
}

const mutations = {
  UPDATE_REGISTER(state, obj) {
    let flag = state.register.some(val => val.url === obj.url)
    if (!flag) {
      state.register.push(obj)
    }
    return flag
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
