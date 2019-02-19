import request from 'common/js/request'
import {API_DEFAULT_MIDDLE_FN} from 'utils/constant'

export default {
  getList(data, loading = true, toast = true) {
    let url = '/api/employee/ai-market/activity'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  },
  updateActiveStatus(data, loading = true, toast = true) {
    let url = 'api/employee/ai-market/activity-change-status/' + data.id
    data = {
      status: data.status
    }
    return request.put(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  },
  getDetail(data, loading = true, toast = true) {
    let url = '/api/employee/ai-market/activity/' + data.id
    data = ''
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  },
  create(data, loading = true, toast = true) {
    let url = '/api/employee/ai-market/activity'
    return request.post(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  },
  update(data, loading = true, toast = true) {
    let url = '/api/employee/ai-market/activity/' + data.id
    return request.put(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  },
  getCouponList(data, loading = true, toast = true) {
    let url = '/api/employee/coupon-lists'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}
