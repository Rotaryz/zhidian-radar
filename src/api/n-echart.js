import request from '../common/js/request'

export default {
  /**
   * 客户性别占比
   * @returns {*}
   */
  sexRetio(data) {
    let url = 'api/employee/ai/sex-report'
    return request.get(url, data)
  },
  /**
   * 客户城市占比 TOP6
   * @returns {*}
   */
  cityRetio(data) {
    let url = 'api/employee/ai/city-report'
    return request.get(url, data)
  },
  /**
   * KOL传播 TOP10
   * @returns {*}
   */
  KOLRetio(data) {
    let url = 'api/employee/ai/city-report'
    return request.get(url, data)
  },
  /**
   * 近15天活跃度
   * @returns {*}
   */
  actionRetio(data) {
    let url = '/api/employee/analysis/active-chart'
    return request.post(url, data)
  },
  /**
   * 兴趣商品占比
   * @returns {*}
   */
  interestedRetio(data) {
    let url = '/api/employee/analysis/interest-rate-chart'
    return request.post(url, data)
  },
  /**
   * 客单价、订单与金额、主力客户一周下单次数
   * @returns {*}
   */
  orderRetio(data) {
    let url = 'api/employee/ai/get-order-data-report'
    return request.get(url, data)
  },
  /**
   * 用户分组占比
   * @returns {*}
   */
  groupRetio(data) {
    let url = 'api/employee/ai/get-pnes-count-average'
    return request.get(url, data)
  },
  /**
   * PNES动力模型
   * @returns {*}
   */
  PENSRetio(data) {
    let url = 'api/employee/ai/get-pnes-rate-report'
    return request.get(url, data)
  }

}
