import request from '../common/js/request'

export default {
  /**
   * 商品列表（推荐/全部）
   * @returns {*}
   */
  goods (data) {
    let url = 'api/employee/goods'
    return request.get(url, data)
  },
  /**
   * 商品加入推荐
   * @returns {*}
   */
  presellGoods (data) {
    let url = 'api/employee/presell-goods'
    return request.post(url, data)
  },
  /**
   * 商品取消推荐
   * @returns {*}
   */
  unPresellGoods (data) {
    let url = `api/employee/presell-goods`
    return request.delete(url, data)
  },
  /**
   * 商品详情
   * @returns {*}
   */
  doogsDetail (id) {
    let url = `api/employee/goods/${id}`
    return request.get(url)
  }
}