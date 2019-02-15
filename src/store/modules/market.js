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
  // 请求数据
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
  // 更新权益
  updateBenefit({commit, state}, benefit = []) {
    commit('UPDATE_BENEFIT', benefit)
  },
  // 请求创建
  async createMarket({commit, state}) {
    try {
      await API.Marketing.create(state.marketData)
      commit('CLEAR_MARKET')
      return true
    } catch (e) {
    }
  },
  // 请求编辑
  async updateMarket({commit, state}) {
    try {
      await API.Marketing.update(state.marketData)
      commit('CLEAR_MARKET')
      return true
    } catch (e) {
    }
  }
}

const mutations = {
  // 请求数据
  REQ_DATA(state, obj) {
    state.marketData = obj
  },
  // 更新权益
  UPDATE_BENEFIT(state, benefit) {
    state.marketData.benefit = benefit
  },
  // 清空数据
  CLEAR_MARKET(state) {
    this.state.marketData = {}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
