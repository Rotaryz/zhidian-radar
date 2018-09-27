import request from 'common/js/request'

export default {
  /**
   * 企业微信员工授权登录
   * @param code 微信静默授权换取的code
   * @returns {*|AxiosPromise<any>|void}
   */
  employeeLogin(code) {
    const url = '/api/jwt/employee-login'
    const data = {
      code,
      suite_alias: 'ai_radar',
      current_type: 'weishang'
    }
    return request.post(url, data)
  }
}
