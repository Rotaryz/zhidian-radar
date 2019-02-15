import request from 'common/js/request'

export default {
  // im获取签名，应用信息
  getImInfo(imAccount, loading = false) {
    const url = `/api/employee/im/signature`
    const data = {
      im_account: imAccount
    }
    return request.get(url, data, loading)
  },

  // 雷达消息（所有人）
  getRadarList(from = 0, limit = 30, id, loading = false) {
    const url = `/api/employee/analysis/logs`
    const data = {
      page: 0,
      limit,
      from,
      customer_id: 0,
      employee_id: id
    }
    return request.get(url, data, loading)
  },

  // 行为雷达消息（所有人）
  getActionList(from = 0, limit = 30, id, type = 1, time, loading = false) {
    const url = `/api/employee/analysis/logs`
    const data = {
      from,
      limit,
      page: 0,
      type,
      time,
      customer_id: 0,
      employee_id: id
    }
    return request.get(url, data, loading)
  },
  // 聊天记录
  getMsgList(data, loading = false) {
    const url = `/api/employee/contacts/${data.customer_im_account}`
    return request.get(url, data, loading)
  },

  // 最近联系人最后一条聊天记录
  getLastMsgObj(data, loading = false) {
    const url = `/api/employee/ws-customers-newest-message`
    return request.post(url, data, loading)
  },

  // 最近联系人列表
  getContactList(data, loading = false) {
    const url = `/api/employee/contacts`
    return request.get(url, data, loading)
  },

  // 最近联系人列表-1.5新
  getNewContactList(data, loading = false) {
    const url = `/api/employee/ai/contacts`
    return request.get(url, data, loading)
  },

  // 删除最近联系人-1.5新
  delContact(data, loading = false) {
    const url = `/api/employee/ai/delete-contact`
    return request.post(url, data, loading)
  },

  // 推荐商品
  getGoodsList(data, loading = false) {
    const url = `/api/employee/goods-lists`
    return request.get(url, data, loading)
  },
  // 推荐商品
  getProductList(data, loading = false) {
    const url = `/api/employee/product-lists`
    return request.get(url, data, loading)
  },
  // 推荐活动
  getActivityList(data, loading = false) {
    const url = `/api/employee/activity-lists`
    return request.get(url, data, loading)
  },

  // 最后一条群发消息
  getLastGroupMsg(loading = false) {
    const url = `/api/employee/latest-group-message`
    return request.get(url, {}, loading)
  },

  // 群发助手消息列表
  getGroupMsgList(data, loading = false) {
    const url = `/api/employee/groups/messages`
    return request.get(url, data, loading)
  },

  // 群发记录
  setGroupList(data, loading = false) {
    const url = `/api/employee/store-group-message`
    return request.post(url, data, loading)
  },

  // 获取话术库
  getMyWordList(loading = false) {
    const url = `/api/employee/quickreplies`
    return request.get(url, {}, loading)
  },

  // 编辑话术
  editWord(data, id, loading = false) {
    const url = `/api/employee/quickreplies/${id}`
    return request.put(url, data, loading)
  },

  // 删除话术
  delWord(id, loading = false) {
    const url = `/api/employee/quickreplies/${id}`
    return request.delete(url, loading)
  },

  // 添加话术
  addWordAny(data, loading = false) {
    const url = `/api/employee/quickreplies`
    return request.post(url, data, loading)
  },

  // 获取个人和群微信状态
  getCodeStatus(loading = false) {
    const url = `/api/employee/check-employee-qrcode`
    return request.get(url, {}, loading)
  }
}
