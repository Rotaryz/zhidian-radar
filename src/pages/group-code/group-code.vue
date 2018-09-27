<template>
  <transition :name="slide">
    <div class="group-main-box">
    <Scroll bcColor="#fff">
      <div class="f0f2f5"></div>
      <div class="group-top">
        <div class="title-box">
          <div class="title-left">
            <div class="title-img">
              <div class="number">3</div>
            </div>
            <div class="title-text-box">
              <div class="title">{{groupName}}</div>
              <div class="sub-title">一大波福利在靠近，点击获取入群二维码</div>
            </div>
          </div>
          <div class="title-right" @click="showPic" v-if="groupImg && groupList.length * 1 !== 0">
            <div class="code">
              <img :src="groupImg" alt="">
            </div>
            <div class="text">点击放大</div>
          </div>
        </div>
        <div class="group-box">
          <div class="item-box border-top-1px">
            <div class="item">
              <div class="number">{{wechatCode}}</div>
              <div class="text">微信群数</div>
            </div>
            <div class="item item-line">
              <div class="number twonumber"><div>{{codeNumber}}</div><div class="clear-number" v-if="codeNumber * 1 !== 0" @click="cleanNumber">清零</div>
              </div>
              <div class="text">活码扫码数</div>
            </div>
          </div>
        </div>
      </div>
      <div class="f0f2f5"></div>
      <div class="group-bottom">
        <section class="exception-box" v-if="groupList.length === 0">
          <exception errType="nocode"></exception>
        </section>
        <ul class="code-list" v-if="groupList.length !== 0">
          <li class="item" v-for="(item, index) in groupList" v-bind:key="index">
            <div class="item-left">
              <img class="item-left-img" :src="item.image_url">
              <div class="text" v-if="item.is_expire * 1 === 0">正常</div>
              <div class="text-ccc" v-if="item.is_expire * 1 === 1">已失效</div>
            </div>
            <div class="item-right">
              <div class="text" :class="item.is_expire * 1 === 1? 'text-ccc':''">上传时间：{{item.created_at}}</div>
              <div class="icon-box" @click="deleteCode(item.id)">
                <div class="icon"></div>
              </div>
            </div>
          </li>
        </ul>
        <div class="add-wechat-btn">+添加微信群码
          <input type="file" class="header-icon" id="header-logo1" @change="_fileChange($event)" accept="image/*" :value="inputValue">
        </div>
        <div class="wechat-text-box">
          <div class="wechat-des">温馨提示：</div>
          <div class="wechat-text-p">
            <p>1. 把你微信群二维码上传到这里。</p>
            <p>2. 图片中包含的二维码必须是微信群二维码，上传其他二维码 或上传非法色情等图片会被系统删除和封号。</p>
          </div>
        </div>
      </div>
    </Scroll>
    <router-view></router-view>
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
    <toast ref="toast"></toast>
    <confirm-msg ref="confirm" @confirm="_sureDel"></confirm-msg>
  </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Mine, UpLoad, Global } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import storage from 'storage-controller'
  import Exception from 'components/exception/exception'
  import VueCropper from 'vue-cropperjs'
  import Toast from 'components/toast/toast'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import wx from 'weixin-js-sdk'
  import { mapGetters } from 'vuex'

  export default {
    name: 'group-code',
    data () {
      return {
        wechatCode: 0,
        codeNumber: 0,
        groupImg: '',
        groupName: '',
        groupBigImg: '',
        visible: false,
        status: false,
        imageBig: '',
        cropImg: '',
        loading: false,
        inputValue: '',
        groupList: [],
        typeMsg: 0,
        deleteId: ''
      }
    },
    created () {
      this.getGroupData()
      this.getGroupList()
      let url = location.href
      Global.jssdkConfig({weixin: 'ai_radar', url, current_type: 'weishang'}).then((res) => {
        if (res.error === ERR_OK) {
          res = res.data
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appid, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.noncestr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名，见附录1
            jsApiList: ['previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        }
      })
    },
    methods: {
      showPic() {
        wx.previewImage({urls: [this.groupBigImg]})
      },
      cropImage () {
        if (this.loading) return
        this.loading = true
        let src = this.$refs.cropper.getCroppedCanvas().toDataURL()
        let $Blob = this.getBlobBydataURI(src, 'image/png')
        let formData = new FormData()
        formData.append('file', $Blob, 'file_' + Date.parse(new Date()) + '.png')
        UpLoad.upLoadImage(formData).then((res) => {
          if (res.error === ERR_OK) {
            Mine.upLoadGroupWechat({image_id: res.data.id}).then((res) => {
              if (res.error === ERR_OK) {
                this.$refs.toast.show('上传成功')
                this.$emit('getQrCode')
                this.loading = false
                this.visible = false
                this.getGroupData()
                this.getGroupList()
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
      cropImageCosle() {
        this.visible = false
        this.inputValue = ''
      },
      getBlobBydataURI (dataURI, type) {
        var binary = atob(dataURI.split(',')[1])
        var array = []
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i))
        }
        return new Blob([new Uint8Array(array)], {type: type})
      },
      _fileChange (e) {
        this.loading = false
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
      getGroupData() {
        Mine.getGroupDetail().then((res) => {
          if (res.error === ERR_OK) {
            this.wechatCode = res.data.wx_group_count
            this.codeNumber = res.data.click_num
            this.groupImg = res.data.scan_url
            this.groupBigImg = res.data.scan_url
            this.groupName = res.data.shop_name
          }
        })
      },
      getGroupList() {
        Mine.getEmployeeCode({type: 3}).then((res) => {
          if (res.error === ERR_OK) {
            this.groupList = res.data
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      cleanNumber() {
        this.typeMsg = 1
        this.$refs.confirm.show({msg: '确定清零吗？'})
      },
      deleteCode(id) {
        this.deleteId = id
        this.typeMsg = 2
        this.$refs.confirm.show({msg: '确定删除吗？'})
      },
      _sureDel() {
        if (this.typeMsg * 1 === 1) {
          this.deleteNumerMsg()
        } else if (this.typeMsg === 2) {
          this.deleteCodeMsg()
        }
      },
      deleteNumerMsg() {
        Mine.cleanCodeNumber().then((res) => {
          if (res.error === ERR_OK) {
            this.codeNumber = 0
          }
        })
      },
      deleteCodeMsg() {
        Mine.deleteGroupWechat({id: this.deleteId}).then((res) => {
          if (res.error === ERR_OK) {
            this.getGroupList()
            this.getGroupData()
          }
        })
      }
    },
    computed: {
      userInfo() {
        return storage.get('info')
      },
      ...mapGetters(['ios']),
      slide () {
        return this.ios ? '' : 'slide'
      }
    },
    components: {
      Scroll,
      VueCropper,
      Toast,
      Exception,
      ConfirmMsg
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  div
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box
  .exception-box
    padding-top: 25px
  .group-main-box
    position: fixed
    background: $color-background
    z-index: 100
    left: 0
    right: 0
    top: 0
    bottom: 0
  .group-top
    box-shadow: 0 2px 6px 0 rgba(43,43,145,0.04)
  .title-box
    padding: 0 20px
    layout(row)
    height: 90px
    align-items: center
    justify-content: space-between
    .title-left
      layout(row)
      align-items: center
      .title-img
        width: 48px
        height: 48px
        border-radius: 4px
        margin-right: 13.5px
        position: relative
        icon-image('pic-head')
        .number
          width: 20px
          height: 20px
          border-radius: 50%
          top: -8px
          right: -8px
          text-align: center
          line-height: 19px
          background: $color-F9543C
          color: $color-white
          font-size: $font-size-11
          font-family: $font-family-medium
          position: absolute
      .title-text-box
        .title
          color: #374B63
          font-size: $font-size-16
          font-family: $font-family-medium
          margin-bottom: 5px
          width: 200px
          no-wrap()
        .sub-title
          color: $color-828AA2
          font-size: $font-size-12
          font-family: $font-family-regular
          width: 160px
          line-height: 14px
    .title-right
      text-align: center
      .code
        width: 35px
        height: 35px
        margin: 0 auto 5px
        img
          width: 100%
          height: 100%
      .text
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-828AA2
  .group-box
    padding: 0 25px
    .item-box
      layout(row)
      align-items: center
      padding: 19px 0 18px
      .item
        width: 50%
        position: relative
        text-align: center
        .number
          color: $color-20202E
          font-size: 40px
          line-height: 42px
          font-family: 'DINCondensed-Bold'
          margin-bottom: 5px
          position: relative
          display: block
          .clear-number
            width: 40px
            height: 18px
            line-height: 17px
            color: $color-white
            font-size: $font-size-12
            font-family: $font-family-regular
            background: $color-F9543C
            border-radius: 50px
            position: absolute
            bottom: 0
            right: -42px
        .twonumber
          display: inline-block
        .text
          color: $color-20202E
          font-size: $font-size-12
          font-family: $font-family-regular
      .item-line
        position: relative
        &:after
          content: ''
          display: block
          position: absolute
          height: 25px
          left: 0
          top: 0
          margin: auto
          bottom: 0
          width:1px
          border-right: 0.5px solid #e5e5e5
          opacity: 0.5
  .add-wechat-btn
    color: $color-white
    font-size: $font-size-16
    font-family: $font-family-regular
    background: $color-56BA15
    height: 36px
    line-height: 35px
    width: 148px
    text-align: center
    border-radius: 50px
    margin: 20px auto 18.5px
    position: relative
  .wechat-text-box
    padding: 0 15px 15px
    .wechat-des
      font-size: $font-size-12
      font-family: $font-family-medium
      color: $color-888888
      margin-bottom: 8.5px
    .wechat-text-p
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-888888
      line-height: 18px
  .code-list
    padding: 0 15px
    border-bottom-1px(rgba(0,0,0, .1))
    .item
      height: 75px
      layout(row)
      align-items: center
      justify-content: space-between
      border-bottom-1px(rgba(0,0,0, .1))
      .item-left
        layout(row)
        align-items: center
        .item-left-img
          display: block
          width: 35px
          height: 35px
          margin-right: 25px
        .text
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-20202E
        .text-ccc
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-ccc
      .item-right
        layout(row)
        align-items: center
        .text
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-20202E
        .text-ccc
          color: $color-ccc
        .icon-box
          width: 35px
          height:  75px
          padding-left: 20px
          layout(row)
          align-items: center
          .icon
            width: 15px
            height: 15px
            icon-image('btn-delete')
      &:last-child
        border-bottom-1px(rgba(0,0,0,0))
  .img-cut
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 100
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

  .f0f2f5
    height: 10px
    background: $color-F0F2F5
    width: 100%
  .header-icon
    top: 0
    left: 0
    width: 100%
    height: 100%
    position: absolute
    z-index: 1000
    opacity: 0
</style>
