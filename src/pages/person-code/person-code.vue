<template>
  <transition :name="slide">
    <div class="group-box">
      <scroll bcColor="#fff"
              ref="scroll">
        <div class="preson-box">
          <div class="item-box" v-for="(item, index) in tabList" v-bind:key="index" @click="clickTab(index)">
            <div class="item-box-con" :class="tabIndex * 1=== index ? 'active' : ''">
              <div class="item-box-con-top">
                <div class="icon" :class="item.icon"></div>
                <div class="text">{{item.title}}</div>
              </div>
              <div class="content">{{item.content}}</div>
            </div>
          </div>
        </div>
        <div class="preson-main-box" v-if="tabIndex * 1 === 0">
          <div class="upimg-box">
            <img :src="presonImg" class="upimg-box-img" v-if="presonImg" @load="imgSuccess">
            <div class="loading-box"  v-if="imgSc">
              <img class="loading-img" src="./loading.gif">
            </div>
            <div class="upimg-box-colse" v-if="presonImg" @click="clearPresonImg"></div>
            <input type="file" class="header-icon" id="header-logo" @change="_fileChange($event, 'preson')"
                   accept="image/*" :value="inputValue">
          </div>
          <p class="updata-text">上传个人微信二维码</p>
        </div>
        <div class="robot-box" v-if="tabIndex * 1 === 1">
          <div class="robot-list">
            <div class="item-list">
              <div class="text">上传微信二维码</div>
              <div class="text-img">
                <input type="file" class="header-icon" id="header-logo1" @change="_fileChange($event, 'robot')"
                       accept="image/*" :value="inputValue">
                <img :src="robotImg" v-if="robotImg" class="text-img-show"  @load="imgAllSuccess">
                <img class="loading" src="./loading.gif" v-if="imgAllSc">
              </div>
            </div>
            <div class="item-list" @click="jumpRobot">
              <div class="text">远程登录该微信</div>
              <div class="login-right">
                <div class="login-text">{{loginText}}</div>
                <div class="icon"></div>
              </div>
            </div>
          </div>
          <div class="robot-area">
            <div class="robot-title">添加欢迎语</div>
            <div class="data-area-box" @touchstart="disableScroll" @touchend="enableScroll" >
              <textarea @touchmove.stop class="data-area" v-model="note" maxlength="200" name="" id="" cols="30" rows="10" @blur="showPlaFai"
                        @focus="showPlaSuc" ></textarea>
              <div class="data-area-pla" v-if="!note && showPla">
                <div class="text">请添加欢迎语</div>
                <div class="text">(用户添加机器人后，会自动验证通过，且默认发文字信息给客户。)</div>
              </div>
              <div class="textarea-number">{{note.length}}<span>/200</span></div>
            </div>
            <div class="submit-btn" @click="submitSave">保存</div>
          </div>
          <div class="f3"></div>
          <div class="robot-area">
            <div class="note-des">温馨提示：</div>
            <ul class="note-list">
              <li class="item">1. 机器人微信是将私人微信远程机器化。</li>
              <li class="item">2. 机器人可以自动验证通过，且默认发送欢迎语。</li>
              <li class="item">3. 机器人成功登录后，请不要退出，退出后需要重新登录。</li>
              <li class="item">4. 新注册的微信号，不能当机器人（微信限制）。</li>
              <li class="item">5. 微信号每天添加好友的数量限制500个/日。</li>
            </ul>
          </div>
        </div>
      </scroll>
      <router-view  @refReshStatus="refReshStatus"></router-view>
      <toast ref="toast"></toast>
      <confirm-msg ref="confirm" @confirm="_sureDel"></confirm-msg>
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

<script>
  import Scroll from 'components/scroll/scroll'
  import {UpLoad, Mine} from 'api'
  import {ERR_OK} from '../../common/js/config'
  import storage from 'storage-controller'
  import VueCropper from 'vue-cropperjs'
  import Toast from 'components/toast/toast'
  import {mapGetters} from 'vuex'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'

  const ICONTAB = [{icon: 'person', title: '普通微信', content: '手动验证通过'}, {
    icon: 'all',
    title: '机器人微信',
    content: '自动验证通过，自动发送欢迎语。'
  }]
  export default {
    name: 'person-code',
    data() {
      return {
        tabList: ICONTAB,
        tabIndex: 0,
        imageBig: '',
        visible: false,
        status: false,
        cropImg: '',
        loading: false,
        presonImg: '',
        chooseType: '',
        robotImg: '',
        robotId: 0,
        note: '',
        inputValue: '',
        upRobotId: true,
        imgSc: true,
        imgAllSc: true,
        showPla: true,
        loginText: '登录',
        wechatStatus: 0
      }
    },
    created() {
      this.getDataCode()
      this.getLoginStatus()
    },
    methods: {
      disableScroll() {
        this.$refs.scroll.disable()
      },
      enableScroll() {
        this.$refs.scroll.enable()
      },
      showPlaSuc() {
        if (this.slide === 'slide') {
          this.$refs.scroll.scrollTo(0, -230)
        }
      },
      showPlaFai() {
        if (this.slide === 'slide') {
          this.$refs.scroll.scrollTo(0, 0)
        }
      },
      refReshStatus() {
        this.getLoginStatus()
      },
      cropImage() {
        if (this.loading) return
        this.loading = true
        let src = this.$refs.cropper.getCroppedCanvas().toDataURL()
        let $Blob = this.getBlobBydataURI(src, 'image/png')
        let formData = new FormData()
        formData.append('file', $Blob, 'file_' + Date.parse(new Date()) + '.png')
        UpLoad.upLoadImage(formData).then((res) => {
          if (res.error === ERR_OK) {
            if (this.chooseType === 'preson') {
              this.presonImg = ''
              this.imgSc = true
              this.presonImg = res.data.url
              Mine.upLoadPerson({image_id: res.data.id}).then((res) => {
                if (res.error === ERR_OK) {
                  this.$refs.toast.show('上传成功')
                  this.$emit('getQrCode')
                  this.loading = false
                  this.visible = false
                } else {
                  this.$refs.toast.show(res.message)
                }
              })
            } else if (this.chooseType === 'robot') {
              this.robotImg = ''
              this.imgAllSc = true
              this.robotImg = res.data.url
              let id = res.data.id
              Mine.upLoadRobotCode({image_id: id}).then((res) => {
                if (res.error === ERR_OK) {
                  this.$refs.toast.show('上传成功')
                  this.$emit('getQrCode')
                  this.loading = false
                  this.visible = false
                  this.upRobotId = false
                  this.robotId = id
                } else {
                  this.$refs.toast.show(res.message)
                }
              })
            }
            return false
          }
          this.loading = false
          this.visible = false
          this.$refs.toast.show(res.message)
        })
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
      getBlobBydataURI(dataURI, type) {
        var binary = atob(dataURI.split(',')[1])
        var array = []
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i))
        }
        return new Blob([new Uint8Array(array)], {type: type})
      },
      _fileChange(e, type) {
        this.chooseType = type
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
      clearPresonImg() {
        this.$refs.confirm.show({msg: '确定删除吗？'})
      },
      getDataCode() {
        Mine.getEmployeeCode({type: 0}).then((res) => {
          if (res.error === ERR_OK) {
            res.data.forEach((item) => {
              if (item.type === 1) {
                this.presonImg = item.image_url
              }
              if (item.type === 2) {
                this.robotImg = item.image_url
                this.note = item.text
                this.robotId = item.image_id
                this.upRobotId = false
              }
            })
            this.judgeImg()
          } else {
            this.judgeImg()
            this.$refs.toast.show(res.message)
          }
        })
      },
      judgeImg() {
        if (this.presonImg.length === 0) {
          this.imgSc = false
        }
        if (this.robotImg.length === 0) {
          this.imgAllSc = false
        }
      },
      deletePersonImg() {
        Mine.getEmployeeCode({type: 1}).then((res) => {
          if (res.error === ERR_OK) {
            this.delPersonCode(res.data[0].id)
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      delPersonCode(data) {
        Mine.deletePersonCode({id: data}).then((res) => {
          if (res.error === ERR_OK) {
            this.presonImg = ''
            this.$refs.toast.show('删除成功')
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      _sureDel() {
        this.deletePersonImg()
      },
      clickTab(index) {
        this.tabIndex = index
      },
      submitSave() {
        if (this.note.length === 0) {
          this.$refs.toast.show('请添加欢迎语')
          return
        }
        Mine.upLoadRobotText({image_id: this.robotId, text: this.note}).then((res) => {
          if (res.error === ERR_OK) {
            this.$refs.toast.show('保存欢迎语成功')
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      jumpRobot() {
        if (this.wechatStatus * 1 === 1) {
          return
        }
        if (!this.robotImg) {
          this.$refs.toast.show('请上传微信二维码')
          return
        }
        this.$router.push('person-code/robot-code')
      },
      getLoginStatus() {
        Mine.getWechatStatus().then((res) => {
          if (res.error === ERR_OK) {
            this.wechatStatus = res.data.status
            if (res.data.status * 1 === 0) {
              this.loginText = '登录'
            } else if (res.data.status * 1 === 1) {
              this.loginText = '已登录'
              this.tabIndex = 1
            }
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      }
    },
    computed: {
      userInfo() {
        return storage.get('info')
      },
      ...mapGetters(['ios']),
      slide() {
        return this.ios ? '' : 'slide'
      }
    },
    components: {
      Scroll,
      VueCropper,
      Toast,
      ConfirmMsg
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  *
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box

  .robot-box
    padding-bottom: 65px

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

  .group-box
    position: fixed
    background: $color-background
    z-index: 121
    left: 0
    right: 0
    bottom: 0
    top: 0

  .preson-box
    padding: 15px
    layout(row)
    background: $color-white
    border-bottom: 10px solid #f1f2f5
    .item-box
      width: 50%
      &:nth-child(odd)
        padding-right: 5px
      &:nth-child(even)
        padding-left: 5px
      .item-box-con
        min-height: 78px
        border-radius: 2px
        width: 100%
        background: #fff
        border: 3px solid transparent
        box-shadow: 0 2px 8px 0 rgba(43, 43, 145, 0.20)
        padding: 12px 12.5px 12px 12.5px
        .item-box-con-top
          layout(row)
          align-items: center
          margin-bottom: 6px
          .icon
            width: 18px
            height: 18px
            margin-right: 4px
            &.person
              icon-image('icon-comwechat')
            &.all
              icon-image('icon-robot')
          .text
            font-size: $font-size-16
            color: $color-20202E
            font-family: $font-family-medium
        .content
          font-size: $font-size-12
          color: $color-888888
          font-family: $font-family-regular
      .active
        border: 3px solid rgba(32, 32, 46, 0.80)

  .preson-main-box
    padding-top: 35px
    .upimg-box
      width: 156px
      height: 156px
      icon-image(btn-upload)
      position: relative
      display: block
      margin: 0 auto 0
      margin-bottom: 15px
      .upimg-box-img
        width: 100%
        height: 100%
        display: block
        border: 1px solid #F0EFF5
      .loading-box
        background: #fff
        width: 100%
        height: 100%
        position: absolute
        left: 0
        top: 0
        z-index: 1112
        .loading-img
          all-center()
          width: 30px
          height: 30px
      .loading
        background: #fff
        width: 100%
        height: 100%
        position: absolute
        left: 0
        top: 0
        z-index: 1112
      .upimg-box-colse
        position: absolute
        icon-image(icon-delete)
        width: 20px
        height: 20px
        right: 0
        top: 0
        z-index: 1111
    .updata-text
      font-family: $font-family-regular
      font-size: $font-size-14
      color: $color-888888
      text-align: center

  .robot-list
    padding-left: 15px
    .item-list
      layout(row)
      align-items: center
      justify-content: space-between
      height: 55px
      padding-right: 15px
      border-bottom-1px(#e0e0e0)
      .text
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-20202E
      .text-img
        position: relative
        width: 35px
        height: 35px
        position: relative
        icon-image(btn-add)
        .text-img-show
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
      .login-right
        layout(row)
        align-items: center
        .login-text
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-20202E
          margin-right: 5px
        .icon
          icon-image('icon-pressed')
          width: 5px
          height: 10px

  .robot-area
    padding: 0 15px
    .robot-title
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-20202E
      padding: 20px 0 17px
    .data-area
      margin-top: 10px
      width: 100%
      border-color: rgba(0, 0, 0, 0.1)
      background: transparent
      padding: 15px 10px 25px 10px
      font-size: $font-size-medium
      color: #20202e
      font-family: $font-family-regular
      height: 205px
      outline: none
      -webkit-appearance: none
      box-shadow: 0 0 0 rgba(0, 0, 0, 0)
      position: relative
      z-index: 2
      overflow: scroll
    .textarea-number
      position: absolute
      bottom: 7px
      right: 25px
      font-size: $font-size-small
      font-family: $font-family-regular
      color: #202020
      span
        color: #ddd
    .data-area-box
      position: relative
      .data-area-pla
        position: absolute
        top: 0
        left: 0
        padding: 20px 15px
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-ccc
        line-height: 20px

  .note-des
    font-size: $font-size-12
    font-family: $font-family-medium
    color: $color-888888
    padding: 20px 0 10px

  .header-icon
    top: 0
    left: 0
    width: 100%
    height: 100%
    position: absolute
    z-index: 1000
    opacity: 0

  .note-list
    .item
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-888888
      line-height: 18px

  .submit-btn
    height: 36px
    background: $color-56BA15
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-white
    text-align: center
    width: 148px
    line-height: 36px
    border-radius: 50px
    margin: 15px auto 20px
  .f3
    height: 10px
    background: #f1f2f5
</style>
