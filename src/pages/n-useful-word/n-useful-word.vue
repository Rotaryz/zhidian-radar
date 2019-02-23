<template>
  <transition name="slide">
    <div class="add-word">
      <scroll :bcColor="'#ffffff'" ref="scroll">
        <div class="word-list">
          <div class="word-item" v-for="(item, index) in wordList" :key="index">
            <slide-view :useType="3" @del="del" @touchBegin="touchBegin" @touchEnd="touchEnd" :item="item" :index="index" :hasFn="true" :ref="'slide' + index">
              <div slot="content" class="list-content">
                <div class="item-left">
                  <span>{{item.message}}</span>
                </div>
                <div class="item-right">
                  <div class="icon-box editor-box" @click="editItem(item, index)">
                    <div class="right-icon-editor right-icon"></div>
                  </div>
                </div>
              </div>
            </slide-view>
          </div>
          <section class="exception-box" v-if="!wordList.length">
            <exception errType="nodata"></exception>
          </section>
        </div>
      </scroll>
      <div class="bottom">
        <div class="word-bottom" @click="toAddWord">新增话术</div>
      </div>
      <!--<confirm-msg ref="confirm" @confirm="submitDelete"></confirm-msg>-->
      <toast ref="toast"></toast>
      <modal ref="modal" @confirm="submitDelete"></modal>
      <router-view @refresh="refresh"></router-view>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'components/scroll/scroll'
  import { Im } from 'api'
  import { ERR_OK } from '../../common/js/config'
  import Toast from 'components/toast/toast'
  import SlideView from 'components/slide-view/slide-view'
  import ConfirmMsg from 'components/confirm-msg/confirm-msg'
  import Modal from './modal/modal'
  import Exception from 'components/exception/exception'

  export default {
    name: 'News',
    created() {
      if (this.newsGetType) {
        this.setNewsGetType(false)
        return
      }
      this.getMsgList()
    },
    data() {
      return {
        itemChecked: {},
        wordList: [],
        deleteAny: {},
        allowSend: true,
        allowConfirm: true,
        item: {},
        moveIdx: -1
      }
    },
    methods: {
      getMsgList() {
        Im.getMyWordList().then(res => {
          if (res.error === ERR_OK) {
            this.wordList = res.data
            setTimeout(() => {
              this.$refs.scroll.refresh()
            }, 20)
          }
        })
      },
      del(Index, item) {
        this.deleteAny = item
        this.$refs.modal.showModal()
      },
      refresh() {
        this.getMsgList()
      },
      submitDelete() {
        if (!this.allowConfirm) return
        this.allowConfirm = false
        Im.delWord(this.deleteAny.id).then(res => {
          if (res.error === ERR_OK) {
            this.wordList = this.wordList.filter((item) => {
              return item.id !== this.deleteAny.id
            })
            this.deleteAny = {}
            let refName = 'slide' + this.moveIdx
            this.$refs[refName][0] && this.$refs[refName][0]._itemInit(false)
            this.moveIdx = -1
            setTimeout(() => {
              this.allowConfirm = true
            }, 300)
          } else {
            this.$refs.toast.show(res.message)
            setTimeout(() => {
              this.allowConfirm = true
            }, 300)
          }
        })
      },
      editItem(item, index) {
        this.$router.push(`/mine/useful-word/add-word?id=${item.id}`)
        let refName = 'slide' + this.moveIdx
        this.$refs[refName][0] && this.$refs[refName][0]._itemInit(false)
      },
      toAddWord() {
        this.$router.push('/mine/useful-word/add-word')
        let refName = 'slide' + this.moveIdx
        this.$refs[refName][0] && this.$refs[refName][0]._itemInit(false)
      },
      touchBegin(idx) {
        if (+idx !== +this.moveIdx && this.moveIdx !== -1) {
          let refName = 'slide' + this.moveIdx
          this.$refs[refName][0] && this.$refs[refName][0]._itemInit(true)
        }
      },
      touchEnd(idx) {
        this.moveIdx = idx
      }
    },
    components: {
      Scroll,
      Toast,
      ConfirmMsg,
      SlideView,
      Modal,
      Exception
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .add-word
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 50
    background: $color-white
    .word-list
      background: $color-white
      padding-bottom: 50px
      .word-item
        height: 70px
        .list-content
          display: flex
          align-items: center
          margin-left: 15px
          width: 100%
          border-bottom-1px(#E1E1E1)
        .item-left
          flex: 1
          display: flex
          align-items: center
          overflow: hidden
          line-height: 21px
          white-space: normal
          word-break: break-all
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-000
        .item-right
          display: flex
          align-items: center
          padding-left: 20px
          .icon-box
            padding: 20px
            font-size: 0
          .delete-box
            margin-right: 5px
            margin-left: 10px
          .right-icon
            width: 20px
            height: 20px
          .right-icon-editor
            icon-image('./icon-compile')
    .bottom
      height: 54px
      background: #FFF
      border-top-1px(#E1E1E1)
      padding: 7px 15px
      box-sizing: border-box
      position: fixed
      left: 0
      right: 0
      bottom: 0
      z-index: 10
    .word-bottom
      width: 100%
      height: 40px
      z-index: 55
      line-height: 40px
      text-align: center
      background: $color-linear-main
      color: $color-white
      font-family: $font-family-medium
      font-size: $font-size-14
      letter-spacing: 0.3px
      border-radius: 6px
  .exception-box
    padding-top: 70px
</style>
