import request from 'common/js/request'

export default {
  // im获取签名，应用信息
  getImInfo(imAccount, loading = true) {
    const url = `/api/employee/employee-im-signature`
    const data = {
      im_account: imAccount
    }
    return request.post(url, data, loading)
  },

  // 雷达消息（所有人）
  getRadarList(from = 0, limit = 30, id, loading = true) {
    const url = `/api/employee/action-logs`
    const data = {
      from,
      limit,
      page: 0,
      customer_id: 0,
      employee_id: id
    }
    return request.post(url, data, loading)
  },

  // 行为为雷达消息（所有人）
  getActionList(from = 0, limit = 30, id, type = 1, time, loading = true) {
    const url = `/api/employee/action-logs`
    const data = {
      from,
      limit,
      page: 0,
      type,
      time,
      customer_id: 0,
      employee_id: id
    }
    return request.post(url, data, loading)
  },

  // 聊天记录
  getMsgList(data, loading = true) {
    const url = `/api/employee/message-logs`
    return request.post(url, data, loading)
  },

  // 最近联系人最后一条聊天记录
  getLastMsgObj(data, loading = true) {
    const url = `/api/employee/customers-newest-message`
    return request.post(url, data, loading)
  },

  // 最近联系人列表
  getContactList(data, loading = true) {
    const url = `/api/employee/customers-recent-contacts`
    return request.post(url, data, loading)
  },

  // 最后一条群发消息
  getLastGroupMsg(loading = true) {
    const url = `/api/employee/latest-group-message`
    return request.get(url, {}, loading)
  },

  // 群发助手消息列表
  getGroupMsgList(data, loading = true) {
    const url = `/api/employee/group-message-logs`
    return request.get(url, data, loading)
  },

  // 发送群发消息
  setGroupList(data, loading = true) {
    const url = `/api/employee/store-group-message`
    return request.post(url, data, loading)
  }
}
