import request from '../common/js/request'

export default {
  /**
   * 我的服务列表
   * @returns {*}
   */
  getServiceList (data) {
    let url = '/api/employee/recommend-goods'
    return request.get(url, data)
  },
  /**
   * 服务库
   * @returns {*}
   */
  getServiceAll (data) {
    let url = '/api/employee/goods'
    return request.get(url, data)
  },
  /**
   * 服务上下线
   * @returns {*}
   */
  serviceHandle (goodsId, isOnline) {
    let url = '/api/employee/change-goods-status'
    let data = {
      goods_id: goodsId,
      is_online: isOnline
    }
    return request.get(url, data)
  },
  /**
   * 查询下架服务是否绑定活动
   * @returns {*}
   */
  activity (id) {
    let url = `/api/employee/change-goods-status/${id}`
    return request.get(url)
  }
}
