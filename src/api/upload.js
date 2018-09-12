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
  },
  /**
   * 下载图片
   * @param data
   * @returns {*}
   */
  downImage (data) {
    let url = 'getpic'
    return request.get(url, data)
  }
}
