import request from 'common/js/request'

export default {
  // 获取客户分组列表
  getGroupList(data, loading) {
    const url = `/api/employee/group`
    return request.get(url, data, loading)
  },
  // 新建分组
  createGroup(data, loading) {
    const url = `api/employee/group`
    return request.post(url, data, loading)
  },
  // 获取客户列表
  getCustomerList(data, loading) {
    const url = `/api/employee/employee-customer`
    return request.get(url, data, loading)
  },
  // 获取设置分组的客户列表
  getSetGroupList(data, loading) {
    const url = `/api/employee/set-group`
    return request.get(url, data, loading)
  },
  // 在设置分组里面为用户更改组
  setGroup(data, loading) {
    const url = `/api/employee/set-group`
    return request.post(url, data, loading)
  },
  // 分组内删除用户
  delCustomer(data, loading) {
    const url = `/api/employee/group-customer`
    return request.delete(url, data, loading)
  },
  // 分组内添加用户
  addGroupCustomer(data, loading) {
    const url = `/api/employee/group-customer`
    return request.post(url, data, loading)
  },
  // 分组删除
  delGroup(data, loading) {
    const url = `/api/employee/group/${data.groupId}`
    return request.delete(url, data, loading)
  },
  // 标签列表
  getTagList(data, loading) {
    const url = `/api/employee/label`
    return request.get(url, data, loading)
  },
  // 用户标签列表
  getCusomerTagList(data, loading) {
    const url = `/api/employee/label-relation`
    return request.get(url, data, loading)
  },
  // 更新标签
  updateTag(data, loading) {
    const url = `/api/employee/label-relation`
    return request.put(url, data, loading)
  }
}
