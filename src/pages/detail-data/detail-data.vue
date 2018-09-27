<template>
  <transition :name="slide">
    <article class="data-all">
      <scroll ref="scroll">
        <div class="data-box">
          <div class="client-top">
            <div class="cliten-bg"></div>
            <div class="cliten-box">
              <div class="cliten-con">
                <div class="cliten-img">
                  <div class="detail-img-box">
                    <div class="img">
                      <img :src="imgUrl" alt="" class="imgUrl">
                    </div>
                    <div class="label-right">
                      <div class="label-name">{{flow.nickname}}</div>
                      <div class="add-text">
                        <div class="text">加入时间：{{flow.created_at}}</div>
                        <!--<div class="text">{{flow.sources}}</div>-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="data-con">
            <div class="data-top">
              <div class="data-list">
                <div class="left">姓名</div>
                <div class="right">
                  <input type="text" placeholder="未完善" class="right-input" v-model="flow.real_name">
                </div>
              </div>
              <div class="data-list">
                <div class="left">手机号码</div>
                <div class="right">
                  <input type="number" placeholder="未完善" class="right-input"
                         oninput="if(value.length > 11)value = value.slice(0, 11)" v-model="flow.mobile">
                  <img v-if="flow.mobile.length > 0" src="./icon-telephone_khzl@2x.png" alt="" class="right-img-phone" @click="phoneCall">
                </div>
              </div>
              <div class="data-list">
                <div class="left">微信号</div>
                <div class="right">
                  <input type="text" placeholder="未完善" class="right-input" v-model="flow.wx_account">
                  <img v-if="flow.wx_account.length > 0" src="./icon-wechat_khzl@2x.png"  v-clipboard:copy="flow.wx_account" v-clipboard:success="onCopy" v-clipboard:error="onError" alt="" class="right-img-phone right-img-copy">
                </div>
              </div>
              <div class="data-list">
                <div class="left">性别</div>
                <div class="right">
                  <select v-model='sexSelected' class="right-selected">
                    <option v-for="option in options" v-bind:value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  <div class="selected-text" :class="sexSelected === '未完善' ? '':'active'">
                    {{sexSelected}}
                  </div>
                </div>
              </div>
              <div class="data-list">
                <div class="left">年龄</div>
                <div class="right">
                  <input type="number" placeholder="未完善" class="right-input"
                         oninput="if(value.length > 2)value = value.slice(0, 2)" v-model="flow.age">
                </div>
              </div>
              <div class="data-list">
                <div class="left">所在城市</div>
                <div class="right">
                  <input type="text" placeholder="未完善" class="right-input" v-model="flow.city">
                </div>
              </div>
              <div class="data-list">
                <div class="left">从事职业</div>
                <div class="right">
                  <input type="text" placeholder="未完善" class="right-input" v-model="flow.job">
                </div>
              </div>
              <div class="data-list">
                <div class="left">所属公司</div>
                <div class="right">
                  <input type="text" placeholder="未完善" class="right-input" v-model="flow.company">
                </div>
              </div>
              <div class="data-list" v-if="false">
                <div class="left">屏蔽消息</div>
                <div class="right">
                  <div class="name">{{chooseText}}</div>
                  <div class="right-choose" @click="chooseBtn" :class="bgChoose ? '' : 'right-choose-active'">
                    <div class="choose-btn" :class="choose ? 'choose-btn-active' : ''"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="data-bottom">
              <div class="title">备注</div>
              <div class="textarea-number">{{flow.note.length}}<span>/500</span></div>
              <textarea class="data-area" v-model="flow.note" maxlength="500" @focus="focusText" @blur="blurText" @touchmove.stop name="" id="" cols="30" rows="10"
                        placeholder="请输入备注"></textarea>
            </div>
          </div>
          <div class="btn-padding"></div>
          <toast ref="toast"></toast>
        </div>
      </scroll>
      <div class="data-btn" @click="saveClientData()">保存</div>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import {ClientDetail} from 'api'
  import {ERR_OK} from '../../common/js/config'
  import Scroll from 'components/scroll/scroll'
  import Toast from 'components/toast/toast'
  import VueClipboard from 'vue-clipboard2'
  import {mapGetters} from 'vuex'
  Vue.use(VueClipboard)

  export default {
    name: 'detail-data',
    data() {
      return {
        sexSelected: '未完善',
        options: [
          {text: '未完善', value: '未完善'},
          {text: '男', value: '男'},
          {text: '女', value: '女'}
        ],
        imgUrl: '',
        choose: false,
        bgChoose: false,
        chooseText: '屏蔽',
        flow: {
          nickname: '',
          real_name: '',
          mobile: '',
          age: null,
          wx_account: '',
          company: '',
          sex: '',
          country: '',
          city: '',
          job: '',
          note: '',
          message_is_abled: '',
          sources: ''
        },
        id: ''
      }
    },
    created() {
      this.id = this.$route.query.id
      this.getClientData(this.id)
    },
    methods: {
      chooseBtn() {
        this.choose = !this.choose
        setTimeout(() => {
          this.bgChoose = !this.bgChoose
          if (this.choose) {
            this.chooseText = '不屏蔽'
          } else {
            this.chooseText = '屏蔽'
          }
        }, 300)
      },
      getClientData(id) {
        ClientDetail.getClientDetail(id).then((res) => {
          if (res.error === ERR_OK) {
            console.log(res)
            this.imgUrl = res.data.image_url
            this.flow = res.data.flow
            if (res.data.flow.sex * 1 === 0) {
              this.sexSelected = '未完善'
            } else if (res.data.flow.sex * 1 === 1) {
              this.sexSelected = '男'
            } else if (res.data.flow.sex * 1 === 2) {
              this.sexSelected = '女'
            }
          }
        })
      },
      saveClientData(id) {
        if (this.sexSelected === '男') {
          this.flow.sex = 1
        } else if (this.sexSelected === '女') {
          this.flow.sex = 2
        }
        if (this.flow.mobile.length !== 11) {
          this.$refs.toast.show('请输入手机号码为11位数')
          return
        }
        ClientDetail.saveClientDetail(this.id, this.flow).then((res) => {
          if (res.error === ERR_OK) {
            this.$refs.toast.show('保存成功')
            setTimeout(() => {
              this.$emit('refresh')
              this.$router.back()
            }, 500)
          } else {
            this.$refs.toast.show(res.message)
          }
        })
      },
      phoneCall() {
        window.location.href = `tel:${this.flow.mobile}`
      },
      onCopy(e) {
        this.$refs.toast.show('复制成功')
      },
      onError(e) {
        console.log('无法复制文本！')
      },
      focusText() {
        console.log('scroll', this.$refs.scroll, this.slide)
        if (this.slide === 'slide') {
          this.$refs.scroll && this.$refs.scroll.scrollTo(0, -480)
        }
      },
      blurText() {
        this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0)
      }
    },
    computed: {
      ...mapGetters(['ios']),
      slide() {
        return this.ios ? '' : 'slide'
      }
    },
    components: {
      Toast,
      Scroll
    },
    watch: {
      sexSelected(val) {
        if (this.sexSelected !== '未完善') {
          this.options = [
            {text: '男', value: '男'},
            {text: '女', value: '女'}
          ]
        }
      }
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
  .data-all
    fill-box()
    z-index: 70
  .client-top
    position: relative
    .cliten-bg
      position: absolute
      z-index: 1
      height: 73px
      background: #20202E
      width: 100%
      top: 0
      left: 0
    .cliten-box
      position: relative
      padding: 20px 15px 0
      width: 100%
      z-index: 2
      .cliten-con
        background: #fff
        width: 100%
        padding: 15px
        position: relative
        .cliten-img
          layout(row)
          justify-content: space-between
          align-items: center
          position: relative
          z-index: 1
          .detail-img-box
            layout(row)
            .img
              position: relative
              height: 0
              width: 60px
              height: 60px
              background: #333
              .imgUrl
                width: 100%
                height: 100%
                display: block
            .label-right
              margin-left: 10px
              overflow: hidden
              flex: 1
              .label-name
                font-size: $font-size-medium-x
                color: $color-text
                font-family: $font-family-regular
                padding-top: 5px
                margin-bottom: 15px
                overflow: hidden
              .add-text
                layout(row)
                no-wrap()
                .text
                  font-size: $font-size-small
                  color: $color-text-88
                  font-family: $font-family-regular
                  margin-right: 5px
  .data-con
    padding: 15px
    .data-top
      border: 0.5px solid rgba(32, 32, 46, .1)
      background: #fff
      padding-left: 15px
      .data-list
        layout(row)
        height: 45px
        border-bottom: 0.5px solid rgba(0, 0, 0, .1)
        align-items: center
        .left
          font-size: $font-size-medium
          color: $color-text-88
          font-family: $font-family-regular
          width: 83px
        .name
          font-size: $font-size-medium
          color: #20202e
          font-family: $font-family-regular
        .right
          flex: 1
          position: relative
          .right-selected
            position: absolute
            width: 100%
            height: 44px
            left: 0
            top: -12px
            opacity: 0
          .right-input
            height: 43px
            line-height: 43px
            width: 90%
            border: none
            font-size: $font-size-medium
            color: #20202e
            font-family: $font-family-regular
            outline:none
          .right-input::-webkit-input-placeholder
            color: #ccc
          .right-input::-ms-input-placeholder
            color: #ccc
          .right-input::-moz-placeholder
            color: #ccc
          .selected-text
            font-size: $font-size-medium
            font-family: $font-family-regular
            color: #ccc
          .active
            color: #20202e
          .right-img-phone
            position: absolute
            width: 22px
            height: 22px
            display: block
            right: 14px
            top: 0
            bottom: 0
            margin: auto 0
          .right-img-copy
            width: 20px
            height: 20px
          .right-choose
            position: absolute
            background: #56BA15
            height: 24px
            width: 45px
            right: 14px
            padding: 1px
            top: 0
            bottom: 0
            margin: auto 0
            border-radius: 100px
            .choose-btn
              background: #fff
              height: 22px
              width: 22px
              border-radius: 50%
              position: absolute
              top: 0
              bottom: 0
              margin: auto 0
              left: 2px
              transition: all .5s
            .choose-btn-active
              left: 20px
          .right-choose-active
            background: #ddd
    .data-top:last-child
      border-bottom: 0
    .data-bottom
      margin-top: 10px
      border: 0.5px solid rgba(0, 0, 0, 0.1)
      padding: 15px
      background: #fff
      position: relative
      .title
        font-size: $font-size-medium
        color: $color-text-88
        font-family: $font-family-regular
      .data-area
        margin-top: 10px
        width: 100%
        border-color: rgba(0, 0, 0, 0.1)
        padding: 10px 15px
        font-size: $font-size-medium
        color: #20202e
        font-family: $font-family-regular
        height: 185px
        outline:none
        -webkit-appearance: none
        box-shadow:0 0 0 rgba(0,0,0,0)
      .textarea-number
        position: absolute
        bottom: 25px
        right: 25px
        font-size: $font-size-small
        font-family: $font-family-regular
        color: #202020
        span
          color: #ddd

  .data-btn
    position: fixed
    height: 45px
    line-height: 45px
    left: 0
    bottom: 0
    width: 100%
    color: #fff
    background: #20202e
    text-align: center
    z-index: 11
    font-size: $font-size-medium-x
    font-family: $font-family-regular

  .btn-padding
    height: 45px
</style>
