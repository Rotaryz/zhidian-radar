import * as API from 'api'

const state = {
  marketData: {
    channel_type: 1,
    group: [
      {}
    ]
  }
}

const getters = {
  marketData: state => state.marketData
}

const actions = {
  async requestMarketData({commit, state}, obj = {}) {
    if (!obj.id) {
      commit('REQ_DATA', obj)
    } else {
      let data = {id: obj.id}
      await API.Marketing.getDetail(data, true).then((res) => {
        commit('REQ_DATA', res.data)
      })
    }
  },
  updateBenefit({commit, state}, benefit = []) {
    commit('UPDATE_BENEFIT', benefit)
  }
}

const mutations = {
  'REQ_DATA'(state, obj) {
    state.marketData = obj
  },
  UPDATE_BENEFIT(state, benefit) {
    state.marketData.benefit = benefit
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
