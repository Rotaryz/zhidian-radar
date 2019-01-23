import {createPNES, createVitality} from 'components/_ai-charts/charts-line-config'

export const CHARTS_TYPE = {
  VITALITY: 'VITALITY',
  PNES: 'PNES'
}
export const CHARTS_CONFIG = {
  [CHARTS_TYPE.PNES]: {
    createOption: createPNES
  },
  [CHARTS_TYPE.VITALITY]: {
    createOption: createVitality
  }
}
