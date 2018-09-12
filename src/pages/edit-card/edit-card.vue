<template>
  <transition :name="slide">
    <div class="edit-card">
      <!--<canvas class="canvas"></canvas>-->
      <scroll ref="scroll">
        <!--require('./Snip20180707_35.png')-->
        <div class="msg-box">
          <div class="header-icon-box" :style="{backgroundImage: 'url('+mine.avatar+')'}">
            <div class="header-mask">
              <div class="chang-header">
                更换头像
                <input type="file" class="header-icon" id="header-logo" @change="_fileChange($event)" accept="image/*" :value="inputValue">
              </div>
            </div>
          </div>
          <div class="mine-msg">
            <p class="mine-name">{{mine.name}}<span class="mine-position">{{mine.position}}</span></p>
            <p class="mine-company">{{mine.department}}</p>
            <div class="mine-sign">
              <p class="mine-sign-text">“{{mine.signature || '生活，总把我们打磨的光鲜圆润'}}”</p>
              <router-link tag="span" to="editCard/changeAutograph" class="chang-header">更改签名</router-link>
            </div>
            <ul class="header-list">
              <li class="header-img" v-for="(item,index) in header" :key="index" :style="{backgroundImage: `url(/static/img/pic-head${index+1}@2x.png)`}"></li>
            </ul>
            <div class="msg-icon">
              <img class="mine-status-icon" src="./icon-turn_out@2x.png">
              <img class="mine-status-icon" src="./icon-good_default@2x.png">
            </div>
            <!--<ul class="mine-status">-->
              <!--<li class="mine-status-item">-->
                <!--<img class="mine-status-icon" src="./icon-popularity@2x.png">-->
                <!--<span class="mine-status-text">人气 {{mine.like_count}}</span>-->
              <!--</li>-->
              <!--<li class="mine-status-item">-->
                <!--<img class="mine-status-icon" src="./icon-favour@2x.png">-->
                <!--<span class="mine-status-text">点赞 {{mine.click_count}}</span>-->
              <!--</li>-->
              <!--<li class="mine-status-item">-->
                <!--<img class="mine-status-icon" src="./icon-transpond@2x.png">-->
                <!--<span class="mine-status-text">转发 {{mine.share_count}}</span>-->
              <!--</li>-->
            <!--</ul>-->
          </div>
          <div class="mine-box">
            <div class="mine-detail-header">
              <span class="text">个人信息</span>
              <span class="line"></span>
              <span class="line"></span>
            </div>
            <div class="mine-detail">
              <ul class="mine-detail-list">
                <li class="mine-detail-item">
                  <span class="item-text">手机</span>
                  <input class="item-detail" type="mobile" v-model="mine.mobile" maxlength="11">
                </li>
                <li class="mine-detail-item">
                  <span class="item-text">微信</span>
                  <input class="item-detail" type="text" v-model="mine.weixin_account"  maxlength="18">
                </li>
                <li class="mine-detail-item">
                  <span class="item-text">邮箱</span>
                  <input class="item-detail" type="text" v-model="mine.email">
                </li>
                <li class="mine-detail-item mine-addres-item" @click="jumpAddress">
                  <span class="item-text">地址</span>
                  <div class="address-box">
                    <div class="text">{{address}}</div>
                    <img src="./icon-pressed@2x.png" alt="" class="address-img">
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </scroll>
      <div class="btn" @click="_changeMine">保存</div>
      <toast ref="toast"></toast>
      <router-view @getSign="getSign"></router-view>
      <div class="img-cut" v-show="visible">
        <vueCropper
          :viewMode="1"
          class="img-big"
          :guides="false"
          ref="cropper"
          :img="imageBig"
          :rotatable="true"
          :background="status"
          :cropBoxResizable="status"
          :aspectRatio="1"
          :autoCropArea="0.8"
          :dragMode="'move'"
          :checkCrossOrigin="false"
          :cropBoxMovable="false"
        >
        </vueCropper>
        <div class="img-btn">
          <div class="btn-item" @click="cropImage">确定</div>
          <div class="btn-item" @click="cropImageCosle">取消</div>
        </div>
        <img class="loading" src="./loading.gif" alt="" width="30" height="30" v-show="loading">
      </div>
      <!--<image-clipper ref="clipper" :img="imageBig" v-show="visible" :clipper-img-width="250" :clipper-img-height="250" @ok="sure" @cancel="visible = false" @loadSuccess="loadSuccess"></image-clipper>-->
    </div>
  </transition>
</template>

<script>
  import { ERR_OK } from '../../common/js/config'
  import Scroll from 'components/scroll/scroll'
  import { Business, UpLoad, Mine } from 'api'
  import Toast from 'components/toast/toast'
  import { mapActions, mapGetters } from 'vuex'
  import imageClipper from '../../components/cropper/cropper'
  import storage from 'storage-controller'
  import VueCropper from 'vue-cropperjs'
  import utils from 'common/js/utils'

  export default {
    name: 'edit-card',
    data () {
      return {
        status: false,
        mine: {},
        imageId: null,
        visible: false,
        imageBig: '',
        cropImg: '',
        loading: false,
        header: [1, 2, 3, 4, 5, 6, 7, 8],
        address: '',
        inputValue: ''
      }
    },
    created () {
      this._getMine()
    },
    beforeDestory () {
      this.$emit('refresh')
    },
    methods: {
      cropImage () {
        if (this.loading) return
        this.loading = true
        let src = this.$refs.cropper.getCroppedCanvas().toDataURL()
        let $Blob = this.getBlobBydataURI(src, 'image/png')
        let formData = new FormData()
        formData.append('file', $Blob, 'file_' + Date.parse(new Date()) + '.png')
        // let data = {base_image: this.$refs.cropper.getCroppedCanvas().toDataURL()}
        UpLoad.upLoadImage(formData).then((res) => {
          if (res.error === ERR_OK) {
            this.mine.avatar = res.data.url
            this.mine.image_id = res.data.id
            this.loading = false
            this.visible = false
            this.$refs.toast.show('上传成功')
            return false
          }
          this.loading = false
          this.visible = false
          this.$refs.toast.show(res.message)
        })
      },
      cropImageCosle() {
        this.visible = false
        this.inputValue = ''
      },
      getSign () {
        this.mine.signature = this.$store.state.signature
        Mine.getMyInfoAddress().then((res) => {
          if (res.error === ERR_OK) {
            this.address = res.message.province + res.message.city + res.message.area + res.message.address
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      ...mapActions(['setSignature', 'setCutImg']),
      _getMine () {
        Business.myBusinessCard().then((res) => {
          if (res.error === ERR_OK) {
            this.mine = res.data
            this.setSignature(this.mine.signature)
          }
        })
        Mine.getMyInfoAddress().then((res) => {
          if (res.error === ERR_OK) {
            this.address = res.message.province + res.message.city + res.message.area + res.message.address
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      _changeMine () {
        if (!utils.checkIsPhoneNumber(this.mine.mobile)) {
          this.$refs.toast.show('请输入正确的手机号码')
          return
        }
        if (!utils.checkIsEMAIL(this.mine.email)) {
          this.$refs.toast.show('请输入正确的邮箱号码')
          return
        }
        if (utils.checkIsCHINA(this.mine.email)) {
          this.$refs.toast.show('请输入正确的邮箱号码')
          return
        }
        let data = {business_card_mobile: this.mine.mobile, email: this.mine.email, weixin_account: this.mine.weixin_account, address: '', image_id: this.mine.image_id}
        Business.updateMyBusiness(data).then((res) => {
          if (res.error === ERR_OK) {
            let obj = storage.get('info', {})
            obj.email = data.email
            obj.address = data.address
            obj.avatar = this.mine.avatar
            storage.set('info', obj)
            this.$refs.toast.show('修改成功')
            setTimeout(() => {
              this.$router.back()
              this.$emit('refresh')
            }, 300)
            return false
          }
          this.$refs.toast.show(res.message)
        })
      },
      _infoImage (file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name)// 通过append向form对象添加数据
        return param
      },
      _fileChange (e) {
        this.loading = false
        // document.getElementById('header-logo').click()
        if (e.target) {
          // let param = this._infoImage(e.target.files[0])
          const file = e.target.files[0]
          const reader = new FileReader()
          reader.onload = async (event) => {
            this.imageBig = event.target.result
            this.$refs.cropper.replace(event.target.result)
            this.visible = true
          }
          reader.readAsDataURL(file)
        }
      },
      getBlobBydataURI (dataURI, type) {
        var binary = atob(dataURI.split(',')[1])
        var array = []
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i))
        }
        return new Blob([new Uint8Array(array)], {type: type})
      },
      jumpAddress() {
        let path = `editCard/addAdress`
        this.$router.push(path)
      }
    },
    computed: {
      ...mapGetters(['ios']),
      slide () {
        return this.ios ? '' : 'slide'
      }
    },
    components: {
      Scroll,
      Toast,
      imageClipper,
      VueCropper
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .img-cut
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 50
    background: #000
    .img-big
      background: #000
      height: 100%
    .img-btn
      width: 100vw
      position: absolute
      bottom: 0
      height: 60px
      display: flex
      align-items: center
      background: $color-white
      border-top: 0.5px solid $color-col-line
      .btn-item
        flex: 1
        text-align: center
        font-size: $font-size-16
        color: $color-20202E
        &:last-child
          border-left: 0.5px solid $color-col-line
    .loading
      all-center()

  .edit-card
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 45px
    z-index: 30
    .msg-box
      padding: 15px
      .header-icon-box
        height: 92vw
        width: 100%
        position: relative
        background-size: cover
        background-repeat: no-repeat
        border-top-left-radius: 2px
        border-top-right-radius: 2px
        overflow: hidden
        .header-mask
          top: 0
          left: 0
          display: flex
          justify-content: center
          align-items: center
          background: rgba(32, 32, 46, 0.30)
          position: absolute
          height: 100%
          width: 100%
        .header-icon
          top: 0
          left: 0
          width: 90px
          height: 36px
          position: absolute
          z-index: 1000
          opacity: 0

  .chang-header
    background: rgba(32, 32, 46, 0.8)
    color: $color-white
    font-family: $font-family-regular
    text-align: center
    font-size: $font-size-medium-x
    line-height: 36px
    position: relative
    border-radius: 2px
    z-index: 1
    width: 90px
    height: 36px

  .mine-msg
    position: relative
    z-index: 50
    background: $color-white
    padding: 20px 0
    box-sizing: border-box
    font-size: $font-size-14
    color: $color-text
    font-family: $font-family-regular
    box-shadow: 0 4px 20px 0 #EAF0FD
    border-bottom-left-radius: 2px
    border-bottom-right-radius: 2px
    .mine-name
      font-family: PingFangSC-Semibold
      font-size: $font-size-22
      padding: 0 15px
      .mine-position
        font-size: $font-size-14
        color: $color-text-88
        margin-left: 5px
    .mine-company
      padding: 0 15px
      margin-top: 10px
      color: $color-text-88
    .mine-sign
      position: relative
      margin-top: 8px
      background: rgba(32,32,46,0.30)
      padding: 12px 15px
      .mine-sign-text
        line-height: 20px
      .chang-header
        position: absolute
        all-center()
        font-family: $font-family-medium
    .header-list
      margin-top: 5px
      padding: 0 15px
      overflow: hidden
      .header-img
        width: 32px
        height: 32px
        border-radius: 32px
        background-size: cover
        float: left
        margin-left: -7px
        &:first-child
          margin-left: 0
    .msg-icon
      position: absolute
      right: 15px
      top: -20px
      z-index: 1
      .mine-status-icon
        margin-left: 20px
        width: 40px
        height: 40px
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.2)
        float: right
        border-radius: 100px
    .mine-status
      margin-top: 6.5px
      display: flex
      .mine-status-item
        flex: 1
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        text-indent: 0
        font-size: $font-size-small
        color: rgba(124, 124, 143, 1)
        .mine-status-icon
          margin-bottom: 8.5px
          width: 18px
  .mine-detail-header
    height: 20px
    text-align: center
    color: $color-20202E
    font-family: $font-family-light
    margin: 24px 0 14px
    position: relative
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    .line
      height: 4px
      width: 100px
      display: block
      margin: 0 auto
      border-bottom-1px($color-20202E)
      &:last-child
        width: 90px
    .text
      display: block
      width: 70px
      font-size: $font-size-16
      all-center()
      z-index: 1
      background: $color-background
  .mine-detail
    background-color: $color-white
    padding-left: 15px
    box-sizing border-box
    font-family: $font-family-regular
    font-size: $font-size-medium-x
    box-shadow: 0 4px 20px 0 #EAF0FD
    border-bottom-left-radius: 2px
    border-bottom-right-radius: 2px
    .mine-detail-item
      color: $color-text
      font-size: $font-size-mediums
      min-height: 60px
      align-items: center
      display: flex
      padding-right: 15px
      box-sizing: border-box
      border-bottom-1px($color-row-line)
      .item-detail
        height: 100%
        width: 70%
        outline: none
      .item-text
        width: 48px
        color: $color-text-88
      .address-box
        layout(row)
        flex: 1
        align-items: center
        justify-content: space-between
        .text
          font-family: $font-family-medium
          font-size: $font-size-14
          color: $color-20202E
          width: 90%
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-box-orient: vertical
          -webkit-line-clamp: 2
          max-height: 28px
        .address-img
          width: 7.5px
          height: 11.5px
      &:last-child
        border-none()

    .mine-addres-item
      min-height: 60px
      padding: 10px 15px 10px 0
      box-sizing: border-box
  .btn
    line-height: 45px
    text-align: center
    height: 45px
    font-family: $font-family-regular
    font-size: $font-size-medium
    color: $color-white
    background: $color-text

  .mine-box
    padding-bottom: 30px
</style>
