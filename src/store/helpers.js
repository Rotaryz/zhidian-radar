import {mapGetters, mapActions} from 'vuex'

export const marketComputed = {
  ...mapGetters('market', [
    'marketData',
    'CONFIG'
  ])
}
export const marketMethods = {
  ...mapActions('market', [
    'requestMarketData',
    'updateBenefit',
    'createMarket',
    'updateMarket',
    'updateBenefitType',
    'updateName',
    'updateGroup'
  ])
}
