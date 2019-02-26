import {MARKET_TYPE} from 'utils/constant'
export const CARD_TYPE = MARKET_TYPE
export const CONFIG = {
  [CARD_TYPE.newCustomer]: { // 新客有礼
    icon: require('./icon-newguest@2x.png'),
    buttonType: 'switch',
    leftText: '触达数',
    middleText: '领取数',
    rightText: 'charts',
    leftKey: 'reach_count',
    middleKey: 'take_count'
  },
  [CARD_TYPE.newProduct]: { // 上新提醒
    icon: require('./icon-clock@2x.png'),
    buttonType: 'switch',
    leftText: '触达数',
    middleText: '进店数',
    rightText: 'charts',
    leftKey: 'send_tpl_count',
    middleKey: 'into_shop_count'
  },
  [CARD_TYPE.sevenBack]: { // 7天召回
    icon: require('./icon-seven@2x.png'),
    buttonType: 'switch',
    leftText: '触达数',
    middleText: '进店数',
    rightText: 'charts',
    leftKey: 'send_tpl_count',
    middleKey: 'into_shop_count'
  },
  [CARD_TYPE.weChat]: { // 加个人微信
    icon: require('./icon-wechat@2x.png'),
    buttonType: 'switch',
    leftText: '触达数',
    middleText: '复制二维码数',
    rightText: '',
    leftKey: 'reach_count',
    middleKey: 'copy_qrcode_count'
  },
  [CARD_TYPE.weGroup]: { // 加微信群
    icon: require('./icon-wechat-group@2x.png'),
    buttonType: 'switch',
    leftText: '触达数',
    middleText: '扫码微信群码数',
    rightText: '',
    leftKey: 'reach_count',
    middleKey: 'copy_qrcode_count'
  },
  [CARD_TYPE.DIY]: { // 自定义
    icon: require('./icon-custom@2x.png'),
    buttonType: 'status',
    leftText: '触达数',
    middleText: '进店数',
    rightText: 'charts',
    leftKey: 'send_tpl_count',
    middleKey: 'into_shop_count'
  },
  [CARD_TYPE.activeCustomer]: { // 活跃新客
    icon: require('./icon-active@2x.png'),
    buttonType: 'status',
    leftText: '触达数',
    middleText: '领取数',
    rightText: 'charts',
    leftKey: 'send_tpl_count',
    middleKey: 'take_count'
  },
  [CARD_TYPE.boughtCustomer]: { // 已购新客
    icon: require('./icon-already@2x.png'),
    buttonType: 'status',
    leftText: '触达数',
    middleText: '进店数',
    rightText: 'charts',
    leftKey: 'send_tpl_count',
    middleKey: 'into_shop_count'
  }
}
