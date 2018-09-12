<template>
  <transition :name="slide">
    <div class="data-all">
      <scroll>
        <div class="info-con">
          <div class="info-top">
            <div class="info-img-box">
              <img :src="avatar" alt="">
            </div>
            <div class="info-text">{{name}}</div>
          </div>
          <div class="info-list info-line">
            <div class="info-left">个人二维码</div>
            <div class="info-right">
              <div class="info-btn" v-if="imgUrl.length === 0">添加</div>
              <div class="info-img" v-if="imgUrl.length !== 0">
                <img :src="imgUrl" v-if="imgUrl" @load="imgSuccess">
                <img class="loading" src="./loading.gif" v-if="imgSc">
              </div>
              <input type="file" class="avatar-input" id="header-logo" @change="_fileChange($event, 'self')"
                     accept="image/*" :value="inputValue">
            </div>
          </div>
          <div class="info-list">
            <div class="info-left">群二维码</div>
            <div class="info-right">
              <div class="info-btn" v-if="allImgUrl.length === 0">添加</div>
              <div class="info-img" v-if="allImgUrl.length !== 0">
                <img :src="allImgUrl"  v-if="allImgUrl" @load="imgAllSuccess">
                <img class="loading" src="./loading.gif" v-if="imgAllSc">
              </div>
              <input type="file" class="avatar-input" id="header-alllogo" @change="_fileChange($event, 'all')"
                     accept="image/*" :value="inputValue">
            </div>
          </div>
        </div>
      </scroll>
      <toast ref="toast"></toast>
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
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'components/scroll/scroll'
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'common/js/config'
  import {UpLoad, Mine} from 'api'
  import Toast from 'components/toast/toast'
  import VueCropper from 'vue-cropperjs'

  export default {
    name: 'mine-info',
    data() {
      return {
        status: false,
        loading: false,
        imgId: 0,
        imgUrl: '',
        allImgId: 0,
        allImgUrl: '',
        visible: false,
        imageBig: '',
        name: '',
        avatar: '',
        typeCode: '',
        inputValue: '',
        imgSc: true,
        imgAllSc: true
      }
    },
    created() {
      this.getCodeData()
    },
    methods: {
      cropImage() {
        if (this.loading) return
        this.loading = true
        let src = this.$refs.cropper.getCroppedCanvas().toDataURL()
        let $Blob = this.getBlobBydataURI(src, 'image/png')
        let formData = new FormData()
        formData.append('file', $Blob, 'file_' + Date.parse(new Date()) + '.png')
        if (this.typeCode === 'self') {
          this.updateInfoSelf(formData)
        } else if (this.typeCode === 'all') {
          this.updateInfoAll(formData)
        }
      },
      imgSuccess() {
        this.imgSc = false
      },
      imgAllSuccess() {
        this.imgAllSc = false
      },
      cropImageCosle() {
        this.visible = false
        this.inputValue = ''
      },
      updateInfoSelf(formData) {
        UpLoad.upLoadImage(formData).then((res) => {
          if (res.error === ERR_OK) {
            this.loading = false
            this.visible = false
            this.imgUrl = ''
            this.imgSc = true
            this.imgUrl = res.data.url
            this.imgId = res.data.id
            Mine.updatePersonalQrcode(res.data.id).then((res) => {
              if (res.error === ERR_OK) {
                this.$refs.toast.show('上传成功')
              } else {
                this.$refs.toast.show(res.message)
              }
            })
            return false
          }
          this.loading = false
          this.visible = false
          this.$refs.toast.show(res.message)
        })
      },
      updateInfoAll(formData) {
        UpLoad.upLoadImage(formData).then((res) => {
          if (res.error === ERR_OK) {
            this.loading = false
            this.visible = false
            this.allImgUrl = ''
            this.imgAllSc = true
            this.allImgUrl = res.data.url
            this.allImgId = res.data.id
            Mine.updateGroupQrcode(res.data.id).then((res) => {
              if (res.error === ERR_OK) {
                this.$refs.toast.show('上传成功')
              } else {
                this.$refs.toast.show(res.message)
              }
            })
            return false
          }
          this.loading = false
          this.visible = false
          this.$refs.toast.show(res.message)
        })
      },
      _fileChange(e, name) {
        this.loading = false
        this.typeCode = name
        if (e.target) {
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
      getCodeData() {
        Mine.getCodeInfo().then((res) => {
          if (res.error === ERR_OK) {
            this.name = res.data.name
            this.allImgUrl = res.data.wx_group_image_url
            this.imgUrl = res.data.personal_qr_image_url
            this.avatar = res.data.image_url
            this.judgeImg()
          } else {
            this.judgeImg()
            this.$refs.toast.show(res.message)
          }
        })
      },
      judgeImg() {
        if (this.imgUrl.length === 0) {
          this.imgSc = false
        }
        if (this.allImgUrl.length === 0) {
          this.imgAllSc = false
        }
      },
      getBlobBydataURI(dataURI, type) {
        var binary = atob(dataURI.split(',')[1])
        var array = []
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i))
        }
        return new Blob([new Uint8Array(array)], {type: type})
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
      Toast,
      VueCropper
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  *
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box

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

  .data-all
    fill-box()
    z-index: 70

  .info-con
    background: $color-white-fff
    padding: 10px 15px 0
    .info-top
      padding: 22px 15px
      margin-bottom: 17.5px
      layout(row)
      border-1px(#e5e5e5)
      box-shadow: 0 4px 12px 0 rgba(32, 32, 46, 0.08)
      border-radius: 2px
      align-items: center
      .info-img-box
        width: 50px
        height: 50px
        margin-right: 10px
        position: relative
        img
          width: 100%
          height: 100%
          display: block
      .info-text
        font-family: $font-family-medium
        font-size: $font-size-16
        color: #374B63
    .info-list
      layout(row)
      height: 55px
      align-items: center
      justify-content: space-between
      .info-left
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-20202E
      .info-right
        layout(row)
        height: 55px
        align-items: center
        position: relative
        .avatar-input
          position: absolute
          width: 100%
          height: 100%
          left: 0
          top: 0
          z-index: 14
          opacity: 0
        .info-btn
          width: 70px
          background: $color-56BA15
          color: $color-white-fff
          text-align: center
          height: 26px
          line-height: 26px
          border-radius: 2px
        .info-img
          width: 30px
          height: 30px
          position: relative
          img
            width: 100%
            height: 100%
            display: block
          .loading
            background: #fff
            width: 100%
            height: 100%
            position: absolute
            left: 0
            top: 0
            z-index: 2
    .info-line
      border-bottom-1px(#e0e0e0)

  .z
    width: 100%

</style>
