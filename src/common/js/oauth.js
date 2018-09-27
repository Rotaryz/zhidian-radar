const env = process.env

export default class Oauth {
  constructor() {
    const suffix = env.NODE_ENV === 'production' ? 'com' : 'net'
    const uri = location.origin + '/oauth'
    const redirectUri = encodeURIComponent(uri)
    this.oauthUri = `https://zhidian-api.jkweixin.${suffix}/wechat/oauth?type=ai&redirect=${redirectUri}`
  }
}
