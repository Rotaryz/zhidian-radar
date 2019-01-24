import {createPNES, createVitality} from 'components/_ai-charts/config-line'
import {createGender, createShop, createUser} from 'components/_ai-charts/config-pie'
import {createCityTop} from 'components/_ai-charts/config-bar'
export const BASE_CHARTS_HEIGHT = 64.67236467236467 // 折线图高度
export const CHARTS_TYPE = {
  VITALITY: 'VITALITY', // 近15天活跃度
  PNES: 'PNES', // NES动力模型
  GENDER: 'GENDER', // 客户性别占比
  SHOP: 'SHOP', // 兴趣的商品占比
  USER: 'USER', // 用户分组
  CITY_TOP: 'CITY_TOP'
}
export const CHARTS_CONFIG = {
  [CHARTS_TYPE.PNES]: {
    createOption: createPNES,
    height: BASE_CHARTS_HEIGHT
  },
  [CHARTS_TYPE.VITALITY]: {
    createOption: createVitality,
    height: BASE_CHARTS_HEIGHT
  },
  [CHARTS_TYPE.GENDER]: {
    createOption: createGender
  },
  [CHARTS_TYPE.SHOP]: {
    createOption: createShop
  },
  [CHARTS_TYPE.USER]: {
    createOption: createUser
  },
  [CHARTS_TYPE.CITY_TOP]: {
    createOption: createCityTop
  }
}
