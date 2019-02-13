export const CARD_TYPE = {
  newCustomer: 1,
  newProduct: 2,
  sevenBack: 3,
  weChat: 4,
  weGroup: 40, // todo
  activeCustomer: 5,
  boughtCustomer: 6
}
export const CONFIG = {
  [CARD_TYPE.newCustomer]: {
    icon: require('./icon-newguest@2x.png'),
    title: '新客有礼',
    buttonType: 'switch',
    leftText: '触达数',
    middleText: '领取数',
    rightText: 'charts',
    leftKey: 'reach_count',
    middleKey: 'take_count'
  },
  [CARD_TYPE.newProduct]: {
    icon: require('./icon-clock@2x.png'),
    title: '上新提醒',
    buttonType: 'switch',
    leftText: '触达数',
    middleText: '进店数',
    rightText: 'charts',
    leftKey: 'reach_count',
    middleKey: 'into_shop_count'
  },
  [CARD_TYPE.sevenBack]: {
    icon: require('./icon-seven@2x.png'),
    title: '7天召回',
    buttonType: 'switch',
    leftText: '触达数',
    middleText: '进店数',
    rightText: 'charts',
    leftKey: 'reach_count',
    middleKey: 'into_shop_count'
  },
  [CARD_TYPE.weChat]: {
    icon: require('./icon-wechat@2x.png'),
    title: '加个人微信',
    buttonType: 'switch',
    leftText: '触达数',
    middleText: '复制二维码数',
    rightText: '',
    leftKey: 'reach_count',
    middleKey: 'copy_qrcode_count'
  },
  [CARD_TYPE.weGroup]: {
    icon: require('./icon-wechat-group@2x.png'),
    title: '加微信群',
    buttonType: 'switch',
    leftText: '触达数',
    middleText: '扫码微信群码数',
    rightText: '',
    leftKey: 'reach_count',
    middleKey: 'copy_qrcode_count'
  }
}
