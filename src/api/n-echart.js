import request from '../common/js/request'

export default {
  /**
   * 客户性别占比
   * @returns {*}
   */
  sexRatio(data) {
    let url = 'api/employee/ai/sex-report'
    return request.get(url, data)
  },
  /**
   * 客户城市占比 TOP6
   * @returns {*}
   */
  cityRatio(data) {
    let url = 'api/employee/ai/city-report'
    return request.get(url, data)
  },
  /**
   * KOL传播 TOP10
   * @returns {*}
   */
  KOLRatio(data) {
    let url = 'api/employee/ai/get-kol-relation'
    return request.get(url, data)
  },
  /**
   * 客户近15天活跃度
   * @returns {*}
   */
  actionCustomerRatio(data) {
    let url = 'api/employee/ai/get-active-day-report'
    return request.get(url, data)
  },
  /**
   * 兴趣商品占比top5
   * @returns {*}
   */
  interestedRatio(data) {
    let url = 'api/employee/ai/get-user-interests'
    return request.get(url, data)
  },
  /**
   * 兴趣商品分类
   * @returns {*}
   */
  classifyRatio(data) {
    let url = 'api/employee/ai/get-event-count-by-group'
    return request.get(url, data)
  },
  /**
   * 笔单价、订单与金额、主力客户一周下单次数
   * @returns {*}
   */
  orderRatio(data) {
    let url = 'api/employee/ai/get-order-data-report'
    return request.get(url, data)
  },
  /**
   * 用户分组占比
   * @returns {*}
   */
  groupRatio(data) {
    let url = 'api/employee/ai/get-pnes-count-average'
    return request.get(url, data)
  },
  /**
   * PNES动力模型
   * @returns {*}
   */
  PENSRatio(data) {
    let url = 'api/employee/ai/get-pnes-rate-report'
    return request.get(url, data)
  }

}
