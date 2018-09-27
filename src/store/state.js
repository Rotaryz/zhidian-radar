import {tabMode} from 'common/js/constants'
import utils from 'common/js/utils'
const platform = utils.getPlatform()
const state = {
  tabMode: tabMode.show,
  signature: '',
  currentMsg: {}, // 当前聊天对象
  latelyList: [], // 最近联系人列表
  newMsg: {}, // 最新消息
  customCount: 0,
  imInfo: {},
  nowChat: [], // 当前会话
  platform, // 平台信息
  imIng: false,
  groupItem: {}, // 群发助手对象
  currentGroupMsg: [], // 当前群发对象
  newsGetType: false, // 是否刷新群发助手
  groupMsgIng: false // 是否在群发状态中，是则不能发第二次消息
}

export default state
