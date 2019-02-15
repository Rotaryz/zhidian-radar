import {MARKET_TYPE} from 'utils/constant'
export const CONFIG = {
  [MARKET_TYPE.newCustomer]: { // 新客有礼
    icon: require('./market-header/pic-newgift@2x.png'),
    choicesArr: [
      {
        title: '选择人群',
        explain: '(覆盖人数',
        enableChange: false
      },
      {
        title: '选择权益',
        explain: '(优惠券)',
        incomeArr: ['添加权益'],
        enableChange: true
      },
      {
        title: '选择渠道',
        explain: '(页面弹窗)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ],
    checkArr: ['_checkDefault', 'hasBenefit', '_checkDefault']
  },
  [MARKET_TYPE.newProduct]: { // 上新提醒
    icon: require('./market-header/pic-remind@2x.png'),
    choicesArr: [
      {
        title: '选择人群',
        explain: '(覆盖人数',
        enableChange: false
      },
      {
        title: '选择权益',
        explain: '(上新的商品或活动)',
        incomeArr: ['添加权益'],
        enableChange: false
      },
      {
        title: '选择渠道',
        explain: '(消息模板)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ]
  },
  [MARKET_TYPE.sevenBack]: { // 7天召回
    icon: require('./market-header/pic-seven@2x.png'),
    choicesArr: [
      {
        title: '选择人群',
        explain: '(覆盖人数',
        enableChange: false
      },
      {
        title: '选择权益',
        explain: '(活动/优惠券)',
        incomeArr: ['活动', '优惠券'],
        enableChange: true
      },
      {
        title: '选择渠道',
        explain: '(消息模板)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ]
  },
  [MARKET_TYPE.weChat]: { // 加个人微信
    icon: require('./market-header/pic-mywechat@2x.png')
  },
  [MARKET_TYPE.weGroup]: { // 加微信群
    icon: require('./market-header/pic-mywechat@2x.png')
  },
  [MARKET_TYPE.DIY]: { // 自定义
    icon: '',
    choicesArr: [
      {
        title: '选择人群',
        explain: '(覆盖人数',
        enableChange: true
      },
      {
        title: '选择权益',
        explain: '(优惠券)',
        incomeArr: ['添加权益'],
        enableChange: true
      },
      {
        title: '选择渠道',
        explain: '(消息模板)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ]
  },
  [MARKET_TYPE.activeCustomer]: { // 活跃新客
    icon: require('./market-header/pic-newguess@2x.png'),
    choicesArr: [
      {
        title: '选择人群',
        explain: '(覆盖人数',
        enableChange: false
      },
      {
        title: '选择权益',
        explain: '(优惠券)',
        incomeArr: ['添加权益'],
        enableChange: true
      },
      {
        title: '选择渠道',
        explain: '(消息模板)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ]
  },
  [MARKET_TYPE.boughtCustomer]: { // 已购新客
    icon: require('./market-header/pic-bought@2x.png'),
    choicesArr: [
      {
        title: '选择人群',
        explain: '(覆盖人数',
        enableChange: false
      },
      {
        title: '选择权益',
        explain: '(优惠券)',
        incomeArr: ['添加权益'],
        enableChange: true
      },
      {
        title: '选择渠道',
        explain: '(消息模板)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ]
  }
}
