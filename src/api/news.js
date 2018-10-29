import request from 'common/js/request'

export default {
  // 获取分组列表
  getGroupList(data, loading) {
    const url = `/api/employee/groups`
    return request.get(url, data, loading)
  },
  // 获取分组列表
  sendGroupMessage(data, loading) {
    const url = `/api/employee/groups/messages`
    return request.post(url, data, loading)
  }
}
