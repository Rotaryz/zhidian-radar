import request from '../common/js/request'

export default {
  /**
   * 活动列表
   * @returns {*}
   */
  getActivityList (data, loading) {
    let url = '/api/employee/activity-lists'
    return request.get(url, data, loading)
  },
  /**
   * 活动库
   * @returns {*}
   */
  getActivityAll (data, loading) {
    let url = '/api/employee/activity'
    return request.get(url, data, loading)
  },
  /**
   * 活动上下线
   * @returns {*}
   */
  activityHandle (activityId, isOnline) {
    let url = '/api/employee/change-activity-status'
    let data = {
      activity_id: activityId,
      is_online: isOnline
    }
    return request.post(url, data)
  }
}
