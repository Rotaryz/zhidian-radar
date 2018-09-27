import request from '../common/js/request'

export default {
  /**
   * 我的名片信息
   * @returns {*}
   */
  liveLogs (data) {
    let url = 'api/employee/live-logs'
    return request.post(url, data)
  },
  /**
   * 我的名片信息
   * @returns {*}
   */
  liveLogsList (data) {
    let url = 'api/employee/live-logs'
    return request.get(url, data)
  },
  /**
   * 删除动态
   * @returns {*}
   */
  delLogsList (id) {
    let url = `api/employee/live-logs/${id}`
    return request.delete(url)
  },
  /**
   * 点赞取消点赞动态
   * @returns {*}
   */
  likeLog (data) {
    let url = `api/employee/like-log`
    return request.post(url, data)
  }
}