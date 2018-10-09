import request from '../common/js/request'
import storage from 'storage-controller'

export default {
  /**
   * 获得客户资料
   * @returns {*}
   */
  getClientDetail(id) {
    let url = `/api/employee/customers/${id}`
    return request.get(url)
  },
  /**
   * 保存客户详情
   * @returns {*}
   */
  saveClientDetail(id, data) {
    let url = `/api/employee/customers/${id}`
    return request.put(url, data)
  },
  /**
   * 获取客户ID
   * @returns {*}
   */
  getClientId(customerId) {
    let url = `/api/employee/customers/${customerId}/summary`
    return request.get(url)
  },
  /**
   * 跟进记录列表
   * @returns {*}
   */
  getFlowList(customerId = 0, flow_id = 0, page = 1, limit = 10) {
    let url = `/api/employee/customers/${customerId}/follows`
    let data = {
      flow_id,
      page,
      limit
    }
    return request.get(url, data)
  },
  /**
   * 添加跟进记录
   * @returns {*}
   */
  addFlowList(customerId = 0, flow_id = 0, record) {
    let url = `/api/employee/customers/${customerId}/follows`
    let data = {
      flow_id,
      record
    }
    return request.post(url, data)
  },
  /**
   * 行为记录列表
   * @returns {*}
   */
  getActionList(customerId = 0, from = 0, limit = 30, page = 0) {
    const info = storage.get('info', {})
    const employeeId = info.id
    let url = `/api/employee/customers/${customerId}/follows`
    let data = {
      employee_id: employeeId,
      page,
      from,
      limit
    }
    return request.get(url, data)
  }
}
