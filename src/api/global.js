import request from '../common/js/request'

export default {
  /**
   * 商品列表（推荐/全部）
   * @returns {*}
   */
  jssdkConfig (data) {
    let url = 'api/employee/global/jssdk-config'
    return request.get(url, data)
  }
}