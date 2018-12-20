// const env = process.env
//
// const version = ``
//
// const LOCAL_URL = {
//   api: 'http://zantui-api.com'
// }
//
// // const DEV_URL = {
// //   api: 'https://zhidian-api.jerryf.cn',
// //   image: 'https://img.jerryf.cn/defaults'
// // }
// const DEV_URL = {
//   api: 'https://ws-api.jkweixin.net' + version,
//   image: 'https://img.jkweixin.net/defaults',
//   upload: 'https://zhidian-api.jkweixin.net' + version
// }
//
// const TEST_URL = {
//   api: 'https://zhidian-api.jkweixin.net' + version,
//   image: 'https://img.jkweixin.net/defaults',
//   upload: 'https://zhidian-api.jkweixin.net' + version
// }
//
// const PROD_URL = {
//   api: 'https://zhidian-api.jkweixin.com' + version,
//   image: 'https://img.jkweixin.com/defaults',
//   upload: 'https://zhidian-api.jkweixin.com' + version
// }
//
// export const BASE_URL = env.NODE_ENV === 'production' ? PROD_URL : env.NODE_ENV === 'test' ? TEST_URL : env.NODE_ENV === 'dev' ? DEV_URL : LOCAL_URL
import APP_CONFIG from 'utils/_app-config'
APP_CONFIG.image = 'https://img.jkweixin.com/defaults'
export const BASE_URL = APP_CONFIG
export const ERR_OK = 0

export const TIMELAG = 300 // 间隔时间秒数，用于消息列表添加时间
