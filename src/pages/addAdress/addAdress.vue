<template>
  <transition :name="slide">
    <div class="change-autograph">
      <scroll ref="scroll">
        <div class="address-box">
          <div class="address-list" @click="selcetAddress">
            <div class="text">所在地区</div>
            <div class="text-right" v-if="address.length === 0">请选择地区</div>
            <div class="text-right-acitive" v-if="address.length !== 0">{{address}}</div>
            <img src="./icon-pressed@2x.png" alt="" class="address-img">
          </div>
          <div class="address-list">
            <div class="text">详细地址</div>
            <input type="text" class="item-input" v-model="detailAdress" placeholder="请输入详细地址"/>
          </div>
        </div>
      </scroll>
      <div class="btn">
        <div class="btn-item btn-green" @click="saveAdress">确定</div>
      </div>
      <awesome-picker
        ref="picker"
        :data="cityData"
        @cancel="handlePickerCancel"
        @confirm="handlePickerConfirm">
      </awesome-picker>
      <toast ref="toast"></toast>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Mine } from 'api'
  import { ERR_OK } from 'common/js/config'
  import { mapGetters } from 'vuex'
  import {cityData} from 'common/js/utils'
  import Toast from 'components/toast/toast'
  // import AMap from 'AMap'
  import axios from 'axios'

  const KEY = '206ec5511b39a51e02627ffbd8dfc16c'

  export default {
    name: 'change-autograph',
    data () {
      return {
        title: '',
        cityData,
        province: '',
        city: '',
        area: '',
        address: '',
        detailAdress: '',
        latitude: 0,
        longitude: 0
      }
    },
    created () {
      Mine.getMyInfoAddress().then((res) => {
        if (res.error === ERR_OK) {
          this.province = res.message.province
          this.city = res.message.city
          this.area = res.message.area
          this.detailAdress = res.message.address
          this.address = res.message.province + res.message.city + res.message.area
        } else {
          this.$refs.toast.show(res.message)
        }
      })
    },
    methods: {
      handlePickerCancel(e) {
        console.log(e)
      },
      handlePickerConfirm(e) {
        let text = ''
        for (var i = 0; i < e.length; i++) {
          text += e[i].value
        }
        this.province = e[0].value
        this.city = e[1].value
        this.area = e[2].value
        this.address = text
      },
      selcetAddress() {
        this.$refs.picker.show()
      },
      saveAdress() {
        if (this.address.length === 0) {
          this.$refs.toast.show('请选择所在地区')
          return
        }
        if (this.detailAdress.length === 0) {
          this.$refs.toast.show('请输入详细地址')
          return
        }
        let text = this.address + this.detailAdress
        this.getGeocoder(text)
      },
      getGeocoder(text) {
        let that = this
        axios.get(`https://restapi.amap.com/v3/geocode/geo?address=${text}&key=${KEY}`)
          .then(res => {
            let location = res.data.geocodes[0].location.split(',')
            that.longitude = location[0]
            that.latitude = location[1]
            let data = {
              address: that.detailAdress,
              province: that.province,
              city: that.city,
              area: that.area,
              longitude: that.longitude,
              latitude: that.latitude
            }
            Mine.updateMyInfoAddress(data).then((res) => {
              if (res.error === ERR_OK) {
                that.$router.back()
                that.$emit('getSign')
              } else {
                that.$refs.toast.show(res.message)
              }
            })
          }).catch(err => {
            alert(JSON.stringify(err))
          })
      }
    },
    computed: {
      ...mapGetters(['ios']),
      slide() {
        return this.ios ? '' : 'slide'
      }
    },
    components: {
      Scroll,
      Toast
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .change-autograph
    position: fixed
    background: $color-background
    z-index: 10
    left: 0
    right: 0
    bottom: 45px
    top: 0
    #autograph
      outline: none
      resize: none
      margin: 4vw
      border-radius: 2px
      background: $color-white
      height: 191px
      width: 92vw
      padding: 15px
      border: none
      box-sizing: border-box
      font-family: $font-family-regular
      font-size: $font-size-medium
      border-1px($color-col-line, 2px)
      &::-webkit-input-placeholder
        font-family: $font-family-regular
        font-size: $font-size-medium
        color: #CCCCCC
    .text-num
      position: absolute
      right: 30px
      bottom: 30px
      font-size: $font-size-small
      font-family: $font-family-regular
      .text-dark
        color: $color-text
      .text-light
        color: #CCCCCC
  .address-box
    background: $color-white-fff
    padding: 0 15px
    .address-list
      height: 55px
      layout(row)
      align-items: center
      position: relative
      border-bottom-1px(#ecedf1)
      .text
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-888888
        margin-right: 16px
      .text-right
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-ccc
      .text-right-acitive
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text
      .address-img
        position: absolute
        right: 0
        width: 7.5px
        height: 11.5px
        top: 0
        bottom: 0
        margin: auto
      .item-input
        height: 53px
        flex: 1
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text
        padding-right: 15px
        border: none
        outline: none
      .item-input::-webkit-input-placeholder
        color: #ccc
      .item-input::-ms-input-placeholder
        color: #ccc
      .item-input::-moz-placeholder
        color: #ccc
      .address-list:last-child
        border-none()
  .btn
    position: relative
    z-index: 10
    display: flex
    height: 45px
    .btn-item
      font-family: $font-family-regular
      font-size: $font-size-medium
      color: $color-white
      line-height: 45px
      text-align: center
      flex: 1
    .btn-dark
      background: $color-text
    .btn-green
      background: $color-text
</style>
