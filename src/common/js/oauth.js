import {BASE_URL} from './config'

export default class Oauth {
  constructor() {
    const uri = location.origin + '/oauth'
    const redirectUri = encodeURIComponent(uri)
    this.oauthUri = `${BASE_URL.api}/wechat/employee/oauth?type=ai&redirect=${redirectUri}`
  }
}
