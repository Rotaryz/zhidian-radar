import request from 'common/js/request'

export default {
  // 获取客户分组列表
  getGroupList(data, loading) {
    const url = `/api/employee/ai/groups-list`
    return request.get(url, data, loading)
  },
  // 新建分组
  createGroup(data, loading) {
    const url = `api/employee/groups`
    return request.post(url, data, loading)
  },
  // 获取客户列表
  getCustomerList(data, loading) {
    const url = `/api/employee/ai/get-customer-list`
    return request.get(url, data, loading)
  },
  // 获取分组内客户列表
  getGroupCustomerList(data, loading) {
    const url = `api/employee/ai/groups-users`
    return request.get(url, data, loading)
  },
  // 获取设置分组的客户列表
  getSetGroupList(customerId, loading) {
    const url = `/api/employee/customers/${customerId}/groups`
    return request.get(url, loading)
  },
  // 在设置分组里面为用户更改组
  setGroup(data, customerId, loading) {
    const url = `/api/employee/customers/${customerId}/groups`
    return request.post(url, data, loading)
  },
  // 分组内删除用户
  delCustomer(data, groupId, loading) {
    const url = `/api/employee/groups/${groupId}/detach`
    return request.post(url, data, loading)
  },
  // 分组内添加用户
  addGroupCustomer(groupId, data, loading) {
    const url = `/api/employee/groups/${groupId}`
    return request.put(url, data, loading)
  },
  // 分组删除
  delGroup(data, loading) {
    const url = `/api/employee/groups/${data.groupId}`
    return request.delete(url, loading)
  },
  // 标签列表
  getTagList(data, loading) {
    const url = `/api/employee/labels`
    return request.get(url, data, loading)
  },
  // 用户标签列表
  getCusomerTagList(customerId, loading) {
    const url = `api/employee/customers/${customerId}/summary`
    return request.get(url, loading)
  },
  // 更新标签
  updateTag(data, customerId, loading) {
    const url = `/api/employee/customers/${customerId}/labels`
    return request.post(url, data, loading)
  }
}
