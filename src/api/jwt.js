import request from 'common/js/request'

export default {
  /**
   * 微信公众号
   * @param code 微信静默授权换取的code
   * @returns {*|AxiosPromise<any>|void}
   */
  employeeLogin(data) {
    const url = '/api/employee/profile'
    return request.post(url, data)
  },
  getEmployeeInfo(data) {
    const url = '/api/employee/profile'
    return request.get(url, data)
  }
}
