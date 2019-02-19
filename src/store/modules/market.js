import * as API from 'api'
import {CONFIG} from '@/pages/n-marketing-detail/config-detail'
import {MARKET_TYPE} from 'utils/constant'
let MARKET_DATA = {
  channel_type: 1,
  benefit: [],
  group: [],
  name: ''
}
MARKET_DATA = JSON.stringify(MARKET_DATA)
function initMarketData() {
  return JSON.parse(MARKET_DATA)
}
const state = {
  marketData: initMarketData(),
  CONFIG: MARKET_TYPE.DIY
}

const getters = {
  marketData: state => state.marketData,
  CONFIG: state => state.CONFIG
}

const actions = {
  // 请求数据
  async requestMarketData({commit, state}, obj = {}) {
    if (!obj.id) {
      commit('REQ_DATA', initMarketData())
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
  // 更新权益类型
  updateBenefitType({commit, state}, type = 1) {
    commit('UPDATE_BENEFIT_TYPE', type)
  },
  // 更新名字
  updateName({commit, state}, name) {
    commit('UPDATE_NAME', name)
  },
  // 更新客户组
  updateGroup({commit, state}, group = []) {
    commit('UPDATE_GROUP', group)
  },
  // 请求创建
  async createMarket({commit, state}) {
    try {
      let data = _formatUpdateData(state.marketData)
      await API.Marketing.create(data)
      // commit('CLEAR_MARKET')
      return true
    } catch (e) {
    }
  },
  // 请求编辑
  async updateMarket({commit, state}) {
    try {
      let data = _formatUpdateData(state.marketData)
      await API.Marketing.update(data)
      // commit('CLEAR_MARKET')
      return true
    } catch (e) {
    }
  }
}

const mutations = {
  // 更新客户组
  UPDATE_GROUP(state, group) {
    state.marketData.group = group
  },
  // 请求数据
  REQ_DATA(state, obj) {
    state.marketData = obj
    let type = obj.type || MARKET_TYPE.DIY
    state.CONFIG = CONFIG[type]
  },
  // 更新权益
  UPDATE_BENEFIT(state, benefit) {
    state.marketData.benefit = benefit
  },
  // 清空数据
  CLEAR_MARKET(state) {
    state.marketData = initMarketData()
  },
  // 更新权益类型
  UPDATE_BENEFIT_TYPE(state, type) {
    state.marketData.benefit_type = type
  },
  // 更新名字
  UPDATE_NAME(state, name) {
    state.marketData.name = name
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

function _formatUpdateData(data) {
  let group = data.group.map((item) => {
    return {
      group_id: item.group_id
    }
  })
  let benefit = data.benefit.map((item) => {
    return {
      benefit_id: item.benefit_id,
      recommend_benefit_id: item.recommend_benefit_id
    }
  })
  return {
    id: data.id,
    name: data.name,
    group,
    benefit_type: data.benefit_type,
    benefit,
    channel_type: data.channel_type
  }
}
