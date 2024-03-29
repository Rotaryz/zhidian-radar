import request from '../common/js/request'

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
    let url = `api/employee/customers/${customerId}/visits`
    let data = {
      page,
      from,
      limit
    }
    return request.get(url, data)
  },
  /**
   * 营销记录
   * @returns {*}
   */
  marketRecord(data, loading) {
    const url = `/api/employee/ai-market/logs`
    return request.get(url, data, loading)
  },
  /**
   * 客户活跃度 KOL RFM值
   * @returns {*}
   */
  clientData(data, loading) {
    const url = `/api/employee/ai/get-values-data`
    return request.post(url, data, loading)
  }
}
