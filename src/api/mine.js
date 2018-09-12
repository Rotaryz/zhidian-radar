import request from '../common/js/request'

export default {
  /**
   * 获取群和个人二维码
   * @returns {*}
   */
  getCodeInfo (data) {
    let url = 'api/employee/get-group-personal-qrcode'
    return request.get(url, data)
  },
  /**
   * 更新个人二维码
   * @returns {*}
   */
  updatePersonalQrcode (personal_qr_image_id = 0) {
    let data = {
      personal_qr_image_id
    }
    let url = 'api/employee/update-personal-qrcode'
    return request.post(url, data)
  },
  /**
   * 更新群二维码
   * @returns {*}
   */
  updateGroupQrcode (wx_group_image_id = 0) {
    let data = {
      wx_group_image_id
    }
    let url = 'api/employee/update-wx-group-qrcode'
    return request.post(url, data)
  },
  /**
   * 我的名片地址
   * @returns {*}
   */
  getMyInfoAddress (data) {
    let url = 'api/employee/my-card-address'
    return request.get(url, data)
  },
  /**
   * 我的名片地址
   * @returns {*}
   */
  updateMyInfoAddress (data) {
    let url = 'api/employee/update-card-address'
    return request.post(url, data)
  }
}
