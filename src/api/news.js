import request from 'common/js/request'

export default {
  // 获取分组列表
  getGroupList(data, loading) {
    const url = `/api/employee/group`
    return request.get(url, data, loading)
  }
}
