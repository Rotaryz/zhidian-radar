import {MARKET_TYPE} from 'utils/constant'
// 优惠券coupon 商品goods 服务service 活动activity 分组group
export const INCOME_TYPE = {
  coupon: {
    type: 'coupon',
    benefit_type: 1
  },
  goods: {
    type: 'goods',
    benefit_type: 2
  },
  service: {
    type: 'service',
    benefit_type: 3
  },
  activity: {
    type: 'activity',
    benefit_type: 4
  },
  group: {
    type: 'group',
    benefit_type: 0 // todo
  }
}
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
        incomeArr: [
          {
            text: '添加权益',
            type: INCOME_TYPE.coupon.type,
            benefit_type: INCOME_TYPE.coupon.benefit_type
          }
        ],
        enableChange: true,
        enableChangeType: 'income'
      },
      {
        title: '选择渠道',
        explain: '(页面弹窗)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ],
    checkArr: ['_checkDefault', 'hasBenefit', '_checkDefault'],
    submitButton: {
      text: '编辑计划',
      fn: 'updateMarket'
    }
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
        incomeArr: [],
        enableChange: false,
        enableChangeType: 'income'
      },
      {
        title: '选择渠道',
        explain: '(消息模板)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ],
    checkArr: ['_checkDefault', '_checkDefault', '_checkDefault'],
    submitButton: {
      text: '编辑计划',
      fn: 'updateMarket'
    }
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
        incomeArr: [
          {
            text: '活动',
            type: INCOME_TYPE.activity.type,
            benefit_type: INCOME_TYPE.activity.benefit_type
          },
          {
            text: '优惠券',
            type: INCOME_TYPE.coupon.type,
            benefit_type: INCOME_TYPE.coupon.benefit_type
          }
        ],
        enableChange: true,
        enableChangeType: 'income'
      },
      {
        title: '选择渠道',
        explain: '(消息模板)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ],
    checkArr: ['_checkDefault', 'hasBenefit', '_checkDefault'],
    submitButton: {
      text: '编辑计划',
      fn: 'updateMarket'
    }
  },
  [MARKET_TYPE.weChat]: { // 加个人微信
    icon: require('./market-header/pic-mywechat@2x.png'),
    choicesArr: [
      {
        title: '选择人群',
        explain: '(覆盖人数',
        enableChange: false
      },
      {
        title: '选择渠道',
        explain: '(页面弹窗)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ],
    checkArr: ['_checkDefault', '_checkDefault', '_checkDefault'],
    submitButton: {
      text: '编辑计划',
      fn: 'updateMarket'
    }
  },
  [MARKET_TYPE.weGroup]: { // 加微信群
    icon: require('./market-header/pic-mywechat@2x.png'),
    choicesArr: [
      {
        title: '选择人群',
        explain: '(覆盖人数',
        enableChange: false
      },
      {
        title: '选择渠道',
        explain: '(页面弹窗)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ],
    checkArr: ['_checkDefault', '_checkDefault', '_checkDefault'],
    submitButton: {
      text: '编辑计划',
      fn: 'updateMarket'
    }
  },
  [MARKET_TYPE.DIY]: { // 自定义
    icon: '',
    choicesArr: [
      {
        title: '选择人群',
        explain: '(覆盖人数',
        enableChange: true,
        enableChangeType: 'group',
        groupArr: [
          {
            text: '选择人群',
            type: INCOME_TYPE.group.type,
            benefit_type: INCOME_TYPE.group.benefit_type
          }
        ]
      },
      {
        title: '选择权益',
        explain: '(优惠券)',
        incomeArr: [
          {
            text: '添加权益',
            type: INCOME_TYPE.coupon.type,
            benefit_type: INCOME_TYPE.coupon.benefit_type
          }
        ],
        enableChange: true,
        enableChangeType: 'income'
      },
      {
        title: '选择渠道',
        explain: '(消息模板)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ],
    checkArr: ['hasGroup', 'hasBenefit', '_checkDefault'],
    submitButton: {
      text: '编辑计划',
      fn: 'updateMarket',
      defaultFn: 'createMarket'
    }
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
        incomeArr: [
          {
            text: '添加权益',
            type: INCOME_TYPE.coupon.type,
            benefit_type: INCOME_TYPE.coupon.benefit_type
          }
        ],
        enableChange: true,
        enableChangeType: 'income'
      },
      {
        title: '选择渠道',
        explain: '(消息模板)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ],
    checkArr: ['_checkDefault', 'hasBenefit', '_checkDefault'],
    submitButton: {
      text: '编辑计划',
      fn: 'updateMarket'
    }
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
        incomeArr: [
          {
            text: '添加权益',
            type: INCOME_TYPE.coupon.type,
            benefit_type: INCOME_TYPE.coupon.benefit_type
          }
        ],
        enableChange: true,
        enableChangeType: 'income'
      },
      {
        title: '选择渠道',
        explain: '(消息模板)',
        channelTextArr: ['页面弹窗', '消息模板', '微信机器人']
      }
    ],
    checkArr: ['_checkDefault', 'hasBenefit', '_checkDefault'],
    submitButton: {
      text: '编辑计划',
      fn: 'updateMarket'
    }
  }
}
