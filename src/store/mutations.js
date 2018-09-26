import * as TYPES from './mutation-types'
import Utils from 'common/js/utils'
import {TIMELAG} from 'common/js/config'

const mutations = {
  [TYPES.SET_TAB_MODE](state, tabMode) {
    state.tabMode = tabMode
  },
  [TYPES.SET_SIGNSTURE] (state, signature) {
    state.signature = signature
  },
  [TYPES.SET_LATELY_LIST](state, latelyList) {
    state.latelyList = latelyList
  },
  [TYPES.SET_CURRENT](state, current) {
    state.currentMsg = current
  },
  [TYPES.SET_UNREAD_COUNT](state, id) {
    state.latelyList = state.latelyList.map((item) => {
      if (item.sessionId === id) {
        item.unreadMsgCount = 0
      }
      return item
    })
  },
  [TYPES.SET_NEW_MSG](state, msg) {
    state.newMsg = msg
  },
  [TYPES.SET_CUSTOM_COUNT](state, type) {
    if (type === 'add') {
      state.customCount++
    } else if (type === 'clear') {
      state.customCount = 0
    }
  },
  [TYPES.ADD_LIST_COUNT](state, msg) {
    let hasArr = state.latelyList.filter((item) => {
      return item.sessionId === msg.fromAccount
    })
    if (hasArr.length) {
      if (state.currentMsg.nickName) {
        state.latelyList = state.latelyList.map((item) => {
          if (item.sessionId === msg.fromAccount) {
            item.unreadMsgCount = 0
          }
          return item
        })
      } else {
        state.latelyList = state.latelyList.map((item) => {
          if (item.sessionId === msg.fromAccount) {
            item.unreadMsgCount++
          }
          return item
        })
      }
    }
  },
  [TYPES.ADD_LIST_MSG](state, typeObj) {
    let msg = typeObj.msg
    if (msg.desc) {
      let desc = JSON.parse(msg.desc)
      if (desc.log_type * 1 === 3 || desc.log_type * 1 === 4 || desc.log_type * 1 === 5) {
        msg.text = '[商品信息]'
      } else if (desc.log_type * 1 === 20) {
        msg.text = '[图片信息]'
      }
    }
    let hasIn = state.latelyList.filter((item) => {
      return item.sessionId === msg.fromAccount
    })
    let notIn = state.latelyList.filter((item) => {
      return item.sessionId !== msg.fromAccount
    })
    let inItem
    if (hasIn.length) {
      inItem = Object.assign({}, hasIn[0], {html: Utils.msgFaceToHtml(msg.text), lastMsg: msg.text, msgTimeStamp: msg.msgTimeStamp, time: Utils.formatDate(msg.time).date})
    } else {
      let addMsg = {
        lastMsg: msg.text,
        html: Utils.msgFaceToHtml(msg.text),
        msgTimeStamp: msg.msgTimeStamp ? msg.msgTimeStamp : msg.time,
        time: Utils.formatDate(msg.time).date,
        sessionId: msg.fromAccount,
        avatar: msg.avatar,
        nickName: msg.nickName ? msg.nickName : msg.fromAccountNick,
        unreadMsgCount: typeObj.type === 'mineAdd' ? 0 : 1
      }
      inItem = Object.assign({}, addMsg)
    }
    state.latelyList = [inItem, ...notIn]
  },
  [TYPES.SET_IM_INFO](state, imInfo) {
    state.imInfo = imInfo
  },
  [TYPES.SET_NOW_CHAT](state, arr) {
    state.nowChat = arr.map((item) => {
      item.html = Utils.msgFaceToHtml(item.content)
      return item
    })
  },
  [TYPES.ADD_NOW_CHAT](state, msg) {
    let newMsg
    if (msg.type === 'chat') {
      newMsg = {
        from_account_id: msg.fromAccount,
        avatar: state.currentMsg.avatar,
        content: msg.text,
        time: msg.time,
        msgTimeStamp: msg.time,
        nickName: state.currentMsg.nickName,
        sessionId: msg.fromAccount,
        unreadMsgCount: 0,
        type: 1,
        html: Utils.msgFaceToHtml(msg.text)
      }
    } else {
      let data = JSON.parse(msg.data)
      let desc = JSON.parse(msg.desc)
      newMsg = {
        from_account_id: msg.fromAccount,
        time: msg.time,
        url: data.url,
        title: data.title,
        goods_id: data.goods_id,
        goods_price: data.goods_price,
        original_price: data.original_price,
        avatar: data.avatar,
        shop_name: data.shop_name,
        msgTimeStamp: msg.time,
        nickName: state.currentMsg.nickName,
        sessionId: msg.fromAccount,
        unreadMsgCount: 0,
        type: desc.log_type
      }
    }
    if (state.nowChat.length) {
      let lastItem = state.nowChat[state.nowChat.length - 1]
      let lastTime = lastItem.created_at ? lastItem.created_at : lastItem.msgTimeStamp
      newMsg.is_showtime = msg.time - lastTime > TIMELAG
    } else {
      newMsg.is_showtime = true
    }
    state.nowChat = [...state.nowChat, newMsg]
  },
  [TYPES.SET_IM_ING](state, boolean) {
    state.imIng = boolean
  },
  [TYPES.SET_GROUP_ITEM] (state, msg) {
    state.groupItem = {
      time: Utils.formatDate(msg.time).date,
      lastMsg: msg.lastMsg,
      html: Utils.msgFaceToHtml(msg.lastMsg)
    }
  },
  [TYPES.SET_CURRENT_GROUP] (state, msg) {
    state.currentGroupMsg = msg
  },
  [TYPES.SET_NEWS_GETTYPE] (state, boolean) {
    state.newsGetType = boolean
  },
  [TYPES.SET_GROUPMSG_ING] (state, boolean) {
    state.groupMsgIng = boolean
  }
}

export default mutations
