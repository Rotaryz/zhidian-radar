<template>
  <transition :name="slide">
    <article class="client-tag">
      <scroll bcColor="#fff">
        <div class="box">
          <section class="info-box" v-for="(item,index) in dataArray" :key="index" v-if="dataArray.length">
            <div class="title">{{item.name}}</div>
            <ul class="content">
              <li class="item-box" v-for="(dataItem,dataIndex) in item.labels" :key="dataIndex" v-if="item.labels">
                <div :class="['item',dataItem.isCheck?'active':'']"
                     @click="check(dataItem)"
                >
                  {{dataItem.name}}
                </div>
              </li>
            </ul>
          </section>
        </div>
      </scroll>
      <toast ref="toast"></toast>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Client} from 'api'
  import Scroll from 'components/scroll/scroll'
  import Toast from 'components/toast/toast'
  import {ERR_OK} from '../../common/js/config'
  import {mapGetters} from 'vuex'

  export default {
    name: 'ClientTag',
    data() {
      return {
        dataArray: [],
        currentId: 0
      }
    },
    created() {
      this.currentId = this.$route.query.customerId
      Client.getTagList().then(res => {
        if (res.data) {
          let dataArray = res.data
          // 获取员工标签列表
          Client.getCusomerTagList(this.currentId).then(tags => {
            this.dataArray = dataArray.map((item) => {
              item.labels.forEach(it => {
                let flag = tags.data.labels.some(val => val.id === it.id)
                if (flag) {
                  it.isCheck = true
                } else {
                  it.isCheck = false
                }
              })
              return item
            })
          })
        }
      })
    },
    beforeRouteLeave(to, from, next) {
      let arr = []
      this.dataArray.map(item => {
        item.labels.forEach(val => {
          val.isCheck && arr.push({
            id: val.id,
            name: val.name
          })
        })
      })
      const data = {
        labels: arr
      }
      Client.updateTag(data, this.currentId).then(res => {
        if (res.error === ERR_OK) {
          this.$emit('refresh')
          next(true)
        }
        this.$refs.toast.show(res.message)
      })
    },
    methods: {
      check(it) {
        this.dataArray.map(item => {
          let node = item.labels.find(val => val.id === it.id)
          node && (node.isCheck = !node.isCheck)
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
  @import "~common/stylus/mixin"

  .client-tag
    fill-box()
    background-color: $color-white-fff
    z-index: 70
    .box
      position: relative
      .info-box
        position: relative
        layout()
        .title
          font-family: $font-family-regular
          font-size: $font-size-16
          color: $color-20202E
          margin: 15px 0 15px 15px
        .content
          layout(row, block, wrap)
          justify-content: flex-start
          .item-box
            width: 33.33%
            height: 30px
            box-sizing: border-box
            padding: 0 15px
            margin-bottom: 15px
            .item
              width: 100%
              height: 100%
              no-wrap()
              box-sizing: border-box
              padding: 5px
              layout()
              justify-content: center
              align-items: center
              background-color: $color-F0F2F5
              font-family: $font-family-regular
              font-size: $font-size-14
              color: $color-888888
              margin-bottom: 15px
              border: 0.5px solid $color-E7E9EC
              &.active
                background-color: $color-56BA15-02
                color: $color-56BA15
                border-color: $color-56BA15-02

</style>
