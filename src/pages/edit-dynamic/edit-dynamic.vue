<template>
  <transition :name="slide">

    <div class="edit-dynamic">
      <scroll>
        <div class="compile">
          <textarea class="words-span" placeholder="这一刻的想法…" v-model="title"></textarea>
          <!--:style="height: {{comHeight}}px"-->
          <div class="com-box">
            <div class="com-image" v-for="(item, index) in image" :key="index">
              <img class="img-item" :src="item.image_url">
              <!--<input type="file" class="image-file" @change="_fileImage($event)" accept="image/*" multiple>-->
              <div class="close-icon" @click.stop="_delImage(index)">
                <img class="close-icon" src="./icon-del@2x.png">
              </div>
            </div>
            <div class="com-image" v-show="image.length < 9">
              <img class="img-item" src="./Group3@2x.png">
              <input type="file" class="image-file" @change="_fileImage($event)" accept="image/*" multiple>
            </div>
          </div>
          <!--style="bottom: {{height}}px"-->
        </div>
      </scroll>
      <div class="btn">
        <div class="btn-item btn-dark" @click="_back">取消</div>
        <div class="btn-item btn-green" @click="_liveLogs">发布</div>
      </div>
      <toast ref="toast"></toast>
    </div>
  </transition>
</template>

<script>
  // import { ERR_OK } from 'api/config'
  import Scroll from 'components/scroll/scroll'
  import {UpLoad, Live} from 'api'
  import {ERR_OK} from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import {mapGetters} from 'vuex'

  export default {
    name: 'edit-dynamic',
    data() {
      return {
        title: '',
        image: [],
        send: true
      }
    },
    methods: {
      async _fileImage(e) {
        // let param = this._infoImage(e.target.files[0])
        await this._moreImage(e.target.files)
      },
      _infoImage(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name)// 通过append向form对象添加数据
        return param
      },
      _upLoad(item) {
        UpLoad.upLoadImage(item).then((res) => {
          if (res.error === ERR_OK) {
            let imageItem = {type: 1, detail_id: res.data.id, image_url: res.data.url}
            this.image.push(imageItem)
            this.image = this.image.slice(0, 9)
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      async _moreImage(arr) {
        // let image = {}
        // let sequence = Promise.resolve()
        for (let item of arr) {
          item = this._infoImage(item)
          await this._upLoad(item)
        }
      },
      _delImage(index) {
        this.image.splice(index, 1)
      },
      _liveLogs() {
        if (!this.send) {
          return
        }
        if (!this.title) {
          this.$refs.toast.show('发布内容不能为空')
          return
        } else if (!this.image.length) {
          this.$refs.toast.show('发布图片不能为空')
          return
        }
        let data = {content: this.title, live_log_details: this.image}
        Live.liveLogs(data).then((res) => {
          this.send = false
          if (res.error === ERR_OK) {
            this.$refs.toast.show('发布成功')
            this.$emit('refresh')
            setTimeout(() => {
              this._back()
            }, 300)
            return
          }
          this.send = true
        })
      },
      _back() {
        this.$router.back()
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
  .edit-dynamic
    position: fixed
    z-index: 100
    left: 0
    right: 0
    bottom: 45px
    top: 0
    .words-span
      height: 88px
      padding: 22px 15px
      outline: none
      resize: none
      width: 100vw
      background: $color-background
      border: none
      box-sizing: border-box
      font-size: $font-size-medium-x
      color: $color-text
      &::-webkit-input-placeholder
        font-family: $font-family-regular
        font-size: $font-size-medium-x
        color: #CCCCCC
    .com-box
      height: 19.5vh
      overflow-y: auto
      padding: 0 4vw 0 2.4vw
    .com-words
      color: #CCCCCC
      font-size: $font-size-medium-x
    .words-text
      height: 19.467vw
      font-size: $font-size-medium-x
      color: $color-text
      width: 100%
      box-sizing: border-box
      padding: 10.5px 24px 0 15px

  .com-tab
    background: $color-white
    position: fixed
    width: 100%
    bottom: 0
    border-top: 0.5px solid $color-split-line
    border-bottom: 0.5px solid $color-split-line
    height: 8.6vh
    display: flex
    margin-top: 4.56vh
    .com-addrss
      z-index: 100
      position: absolute
      top: -36px
      left: 15px
      height: 29px
      max-width: 82%
      background: $color-background
      border-radius: 50px
      padding: 0 13px
      display: flex
      align-items: center
      justify-content: center
      font-size: $font-size-medium
      color: $color-text-tr
      .add-title
        no-wrap()
      .com-add-icons
        width: 16px
        height: @width
    .com-addrss-active
      color: $color-text
    .com-tab-item
      height: 100%
      flex: 2.5
      line-height: 49px
      border-right: 0.5px solid $color-split-line
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
      .com-tab-icon
        height: 22px
        width: @height
      .com-tab-item-title
        font-size: $font-size-small-s
        color: $color-text-tr
        margin-top: 5px
      &:last-child
        flex: 5
        color: $color-assist-pink
        opacity: 0.5
        border-right: none
        text-align: center
    .com-tab-item-active
      opacity: 1 !important

  .com-image
    position: relative
    display: inline-block
    .img-item
      height: 28.4vw
      margin: 1.6vw 0 0 1.6vw
      width: @height
      position: relative
      .play
        all-center()
        width: 36.363%
        height: @width
    .close-icon
      height: 16.5px
      width: 16.5px
      line-height: 16.5px
      text-align: center
      background: rgba(0, 0, 0, 0.20)
      color: $color-white
      font-size: $font-size-small-s
      position: absolute
      right: 0px
      top: 3px
      background: $color-background
      .close-icon
        cll-center()
        height: 16.5px
        width: 16.5px
    .img-add
      display: inline-block
      height: 29.6vw
      width: @height
      margin: 1.6vw 0 0 1.6vw
      position: relative
      .add-image
        height: 98%
        width: @height

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
      background: $color-56

  .image-file
    opacity: 0
    height: 76%
    width: 76%
    all-center()
</style>
