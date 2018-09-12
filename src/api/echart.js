import request from '../common/js/request'

export default {
  /**
   * 客户兴趣占比图
   * @returns {*}
   */
  getPie(merchant_id = 0, employee_id = 0, customer_id = 0) {
    let url = 'api/employee/interest-rate-chart'
    let data = {
      customer_id,
      merchant_id,
      employee_id
    }
    return request.post(url, data)
  },
  /**
   * 近7日客户活跃度图
   * @returns {*}
   */
  getActionLine(merchant_id = 0, employee_id = 0, customer_id = 0) {
    let url = 'api/employee/active-chart'
    let data = {
      customer_id,
      merchant_id,
      employee_id
    }
    return request.post(url, data)
  },
  /**
   *  近7日新增客户数
   * @returns {*}
   */
  getAddLine(merchant_id = 0, employee_id = 0, customer_id = 0) {
    let url = 'api/employee/new-customer-sum-chart'
    let data = {
      customer_id,
      merchant_id,
      employee_id
    }
    return request.post(url, data)
  },
  /**
   *  成交率漏斗图
   * @returns {*}
   */
  getSuccess(merchant_id = 0, employee_id = 0, customer_id = 0) {
    let url = 'api/employee/close-deal-rate-chart'
    let data = {
      customer_id,
      merchant_id,
      employee_id
    }
    return request.post(url, data)
  },
  /**
   * 客户与我互动图
   * @returns {*}
   */
  getBar(merchant_id = 0, employee_id = 0, customer_id = 0) {
    let url = 'api/employee/interactive-chart'
    let data = {
      customer_id,
      merchant_id,
      employee_id
    }
    return request.post(url, data)
  },
  /**
   * 员工能力模型图
   * @returns {*}
   */
  getEmployee(merchant_id = 0, employee_id = 0, customer_id = 0) {
    let url = 'api/employee/interactive-chart'
    let data = {
      customer_id,
      merchant_id,
      employee_id
    }
    return request.post(url, data)
  },
  /**
   * 数据总览
   * @returns {*}
   */
  getAllData(time = 'all', merchant_id = 0, employee_id = 0) {
    let url = 'api/employee/data_overview'
    let data = {
      time,
      merchant_id,
      employee_id
    }
    return request.post(url, data)
  }
}
