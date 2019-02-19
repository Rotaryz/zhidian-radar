import request from 'common/js/request'

export default {
  // 雷达消息（所有人）新 1.5
  getRadarList(from = 0, limit = 30, id, loading = false) {
    const url = `/api/employee/ai/get-action-logs`
    const data = {
      page: 0,
      limit,
      from,
      customer_id: 0,
      employee_id: id
    }
    return request.post(url, data, loading)
  }
}