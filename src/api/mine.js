import request from '../common/js/request'

export default {
  /**
   * 更新个人微信二维码
   * @param data
   * @returns {*}
   */
  upLoadPerson (data) {
    let url = 'api/employee/update-personal-qrcode'
    return request.post(url, data)
  },
  /**
   * 清空扫描活码数
   * @param data
   * @returns {*}
   */
  cleanCodeNumber (data) {
    let url = 'api/employee/clear-click-num'
    return request.get(url, data)
  },
  /**
   * 添加微信群二维码
   * @param data
   * @returns {*}
   */
  upLoadGroupWechat (data) {
    let url = 'api/employee/add-wxgroup-qrcode'
    return request.post(url, data)
  },
  /**
   * 删除微信群二维码
   * @param data
   * @returns {*}
   */
  deleteGroupWechat (data) {
    let url = 'api/employee/delete-wxgroup-qrcode'
    return request.post(url, data)
  },
  /**
   * 删除个人二维码
   * @param data
   * @returns {*}
   */
  deletePersonCode (data) {
    let url = 'api/employee/delete-personal-qrcode'
    return request.post(url, data)
  },
  /**
   * 更新机器人微信二维码
   * @param data
   * @returns {*}
   */
  upLoadRobotText (data) {
    let url = 'api/employee/update-robot-qrcode'
    return request.post(url, data)
  },
  /**
   * 更新机器人微信二维码
   * @param data
   * @returns {*}
   */
  upLoadRobotCode (data) {
    let url = 'api/employee/add-robot-qrcode'
    return request.post(url, data)
  },
  /**
   * 读取员工二维码
   * @param data
   * @returns {*}
   */
  getEmployeeCode (data) {
    let url = 'api/employee/employee-qrcode'
    return request.get(url, data)
  },
  /**
   * 开始模拟登录，生成模拟登录的微信二维码
   * @param data
   * @returns {*}
   */
  getWechatLogin (data) {
    let url = 'api/employee/start-mock-login'
    return request.get(url, data)
  },
  /**
   * 获取模拟登录的微信二维码
   * @param data
   * @returns {*}
   */
  getWechatLoginCode (data) {
    let url = 'api/employee/wx-mock-image'
    return request.get(url, data)
  },
  /**
   * 获取群二维码详情
   * @param data
   * @returns {*}
   */
  getGroupDetail (data) {
    let url = 'api/employee/qrcode-detail'
    return request.get(url, data)
  },
  /**
   * 机器人微信登录状态
   * @param data
   * @returns {*}
   */
  getWechatStatus (data) {
    let url = 'api/employee/mock-login-status'
    return request.get(url, data)
  }
}
