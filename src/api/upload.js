import request from '../common/js/request'

export default {
  /**
   * 上传图片
   * @param data
   * @returns {*}
   */
  upLoadImage (data) {
    let url = 'api/employee/images'
    return request.post(url, data)
  }
}
