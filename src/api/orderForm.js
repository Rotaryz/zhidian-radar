import request from '../common/js/request'

export default {
  /**
   * 订单列表
   * @returns {*}
   */
  orderFormList (data, loading) {
    let url = '/api/employee/order'
    return request.get(url, data, loading)
  },
  /**
   * 订单详情
   * @returns {*}
   */
  orderFormDetail (id, loading) {
    let url = `/api/employee/order/${id}`
    return request.get(url, loading)
  }
}
