import request from 'common/js/request'
import {API_DEFAULT_MIDDLE_FN} from 'utils/constant'

export default {
  /**
   * 营销活动列表
   * @returns {*}
   */
  getList(data, loading, toast = true) {
    let url = '/api/employee/ai-market/activity'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}
