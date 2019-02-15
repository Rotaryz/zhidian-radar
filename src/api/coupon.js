import request from '../common/js/request'

export default {
  /**
   * 获取优惠券列表
   * @returns {*}
   */
  getCouponList (data, loading = false) {
    let url = '/api/employee/coupon-lists'
    return request.get(url, data, loading)
  }
}
