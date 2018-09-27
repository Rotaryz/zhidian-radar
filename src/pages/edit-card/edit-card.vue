<template>
  <transition :name="slide">
    <div class="edit-card">
      <scroll ref="scroll">
        <!--require('./Snip20180707_35.png')-->
        <div class="header-icon-box" :style="{backgroundImage: 'url('+mine.avatar+')'}">
          <div class="header-mask"></div>
          <div class="chang-header">
            更换头像
          </div>
          <input type="file" class="header-icon" id="header-logo" @change="_fileChange($event)" accept="image/*">
        </div>
        <div class="mine-msg">
          <p class="mine-name">{{mine.name}}</p>
          <p class="mine-position">{{mine.position}}</p>
          <p class="mine-company">{{mine.department}}</p>
          <div class="mine-sign">
            <p class="mine-sign">“{{mine.signature || '生活，总把我们打磨的光鲜圆润'}}”</p>
            <router-link tag="span" to="editCard/changeAutograph" class="chang-header">更改签名</router-link>
          </div>
          <ul class="mine-status">
            <li class="mine-status-item">
              <img class="mine-status-icon" src="./icon-popularity@2x.png">
              <span class="mine-status-text">人气 {{mine.like_count}}</span>
            </li>
            <li class="mine-status-item">
              <img class="mine-status-icon" src="./icon-favour@2x.png">
              <span class="mine-status-text">点赞 {{mine.click_count}}</span>
            </li>
            <li class="mine-status-item">
              <img class="mine-status-icon" src="./icon-transpond@2x.png">
              <span class="mine-status-text">转发 {{mine.share_count}}</span>
            </li>
          </ul>
        </div>
        <div class="mine-box">
          <div class="mine-detail">
            <div class="mine-detail-header">个人信息</div>
            <ul class="mine-detail-list">
              <li class="mine-detail-item">
                <span class="item-text">手机</span>
                <input class="item-detail" type="mobile" v-model="mine.mobile" maxlength="11">
              </li>
              <li class="mine-detail-item">
                <span class="item-text">邮箱</span>
                <input class="item-detail" type="email" v-model="mine.email">
              </li>
              <li class="mine-detail-item">
                <span class="item-text">地址</span>
                <input class="item-detail" type="text" v-model="mine.address">
              </li>
            </ul>
          </div>
        </div>
      </scroll>
      <div class="btn" @click="_changeMine">保存</div>
      <toast ref="toast"></toast>
      <router-view @getSign="getSign"></router-view>
    </div>
  </transition>
</template>

<script>
  import { ERR_OK } from '../../common/js/config'
  import Scroll from 'components/scroll/scroll'
  import { Business, UpLoad } from 'api'
  import Toast from 'components/toast/toast'
  import { mapActions, mapGetters } from 'vuex'
  import storage from 'storage-controller'

  export default {
    name: 'edit-card',
    data () {
      return {
        mine: {},
        imageId: null
      }
    },
    created () {
      this._getMine()
    },
    beforeDestory() {
      this.$emit('refresh')
    },
    methods: {
      getSign() {
        this.mine.signature = this.$store.state.signature
        console.log(this.mine.department)
      },
      ...mapActions(['setSignature']),
      _getMine () {
        Business.myBusinessCard().then((res) => {
          if (res.error === ERR_OK) {
            this.mine = res.data
            this.setSignature(this.mine.signature)
            console.log(this.mine)
          }
        })
      },
      _changeMine () {
        let data = {business_card_mobile: this.mine.mobile, email: this.mine.email, address: this.mine.address, image_id: this.mine.image_id}
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
        document.getElementById('header-logo').click()
        if (e.target) {
          let param = this._infoImage(e.target.files[0])
          UpLoad.upLoadImage(param).then((res) => {
            if (res.error === ERR_OK) {
              this.mine.avatar = res.data.url
              this.mine.image_id = res.data.id
              // this.$refs.toast.show('修改成功')
              return false
            }
            this.$refs.toast.show(res.message)
          })
        }
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
  .edit-card
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 45px
    z-index: 30
    .header-icon-box
      display: flex
      justify-content: center
      align-items: center
      height: 82.67vw
      width: 100vw
      position: relative
      background-size: cover
      background-repeat: no-repeat
      .header-mask
        background: rgba(32, 32, 46, 0.30)
        position: absolute
        height: 100%
        width: 100%
      .header-icon
        width: 90px
        height: 36px
        position: absolute
        opacity: 0

  .chang-header
    background: rgba(32, 32, 46, 0.8)
    color: $color-white
    font-family: $font-family-regular
    text-align: center
    font-size: $font-size-medium-x
    line-height: 36px
    position: relative
    width: 90px
    height: 36px

  .mine-msg
    position: relative
    z-index: 50
    height: 248px
    width: 92vw
    margin: -55px 4vw 0
    border-radius: 2px
    background: $color-white
    padding-top: 30px
    box-sizing: border-box
    text-indent: 30px
    font-size: $font-size-medium
    color: $color-text
    font-family: $font-family-regular
    border-1px($color-col-line, 2px)
    .mine-name
      height: $font-size-large-xx
      font-family: PingFangSC-Semibold
      font-size: $font-size-large-xx
      color: $color-text
    .mine-position
      height: $font-size-medium
      margin-top: 12px
    .mine-company
      height: $font-size-medium
      margin-top: 7px
      color: $color-text-88
    .mine-sign
      position: relative
      margin-top: 11px
      line-height: 63px
      background: rgba(32, 32, 46, 0.20)
      height: 63px
      .chang-header
        position: absolute
        all-center()
        text-align: center
        text-indent: 0
        display: inline-block
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

  .mine-detail
    background-color: $color-white
    width: 92vw
    margin: 10px auto 0
    padding-left: 15px
    box-sizing border-box
    font-family: $font-family-regular
    font-size: $font-size-medium
    border-1px($color-row-line)
    .mine-detail-header
      height: 40px
      line-height: 40px
      border-bottom-1px($color-row-line)
    .mine-detail-item
      color: $color-text
      font-size: $font-size-mediums
      height: 50px
      align-items: center
      display: flex
      padding-right: 15px
      box-sizing: border-box
      border-bottom-1px($color-row-line)
      .item-detail
        height: 100%
        width : 70%
        outline: none
      .item-text
        width: 48px
        color: $color-text-88
      &:last-child
        border-none()

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
