import request from '../common/js/request'

export default {
  /**
   * 我的名片信息
   * @returns {*}
   */
  myBusinessCard () {
    let url = 'api/employee/my-business-card'
    return request.get(url)
  },
  /**
   * 我的名片信息
   * @returns {*}
   */
  updateMyBusiness (data) {
    let url = 'api/employee/update-my-business'
    return request.post(url, data)
  },
  /**
   * 我的名片-个性签名编辑
   * @returns {*}
   */
  updateMySignature (data) {
    let url = 'api/employee/update-my-signature'
    return request.post(url, data)
  },
  /**
   * 我的名片-个性签名编辑
   * @returns {*}
   */
  Myqrcode (data) {
    let url = 'api/employee/my-new-qrcode'
    return request.get(url, data)
  }
}
