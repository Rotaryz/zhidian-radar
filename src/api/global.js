import request from '../common/js/request'

export default {
  /**
   * 获取微信JSSDK配置
   * @returns {*}
   */
  jssdkConfig (data) {
    let url = '/api/wechat/jssdk'
    return request.get(url, data)
  }
}
