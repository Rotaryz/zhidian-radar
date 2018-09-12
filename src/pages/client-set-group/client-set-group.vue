<template>
  <transition :name="slide">
    <article class="client-set-group">
      <div v-if="dataArray.length">
        <div class="title">设置分组</div>
        <section class="content">
          <div v-if="dataArray.length"
               :class="['item',item.is_selecte?'active':'']"
               v-for="(item,index) in dataArray"
               :key="index"
               @click="check(item)">
            {{item.name}}
          </div>
        </section>
      </div>
      <section class="exception-box" v-if="isEmpty">
        <exception errType="nogroup"></exception>
      </section>
    </article>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {Client} from 'api'
  import {ERR_OK} from '../../common/js/config'
  import Exception from 'components/exception/exception'
  import {mapGetters} from 'vuex'

  export default {
    name: 'ClientSetGroup',
    data() {
      return {
        dataArray: [],
        id: 0,
        isEmpty: false
      }
    },
    created() {
      this.id = this.$route.query.id // 分组id
      const data = {customer_id: this.id}
      Client.getSetGroupList(data).then(res => {
        if (res.data) {
          this.dataArray = res.data
          this.isEmpty = !this.dataArray.length
        }
      })
    },
    // beforeDestroy() {
    //   let arr = []
    //   this.dataArray.filter(item => {
    //     item.is_selecte && arr.push({group_id: item.id})
    //   })
    //   const data = {
    //     customer_id: this.id, // 分组id
    //     data: arr
    //   }
    //   Client.setGroup(data).then(res => {
    //     if (res.error === ERR_OK) {
    //       //
    //     } else {
    //       //
    //     }
    //     this.$emit('refresh')
    //   })
    // },
    beforeRouteLeave(to, from, next) {
      let arr = []
      this.dataArray.filter(item => {
        item.is_selecte && arr.push({group_id: item.id})
      })
      const data = {
        customer_id: this.id, // 分组id
        data: arr
      }
      Client.setGroup(data).then(res => {
        if (res.error === ERR_OK) {
          this.$emit('refresh')
        }
        next(true)
      })
    },
    methods: {
      check(item) {
        item.is_selecte = !item.is_selecte
      }
    },
    computed: {
      ...mapGetters(['ios']),
      slide() {
        return this.ios ? '' : 'slide'
      }
    },
    components: {
      Exception
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .client-set-group
    fill-box()
    background-color: $color-white-fff
    z-index: 10
    .title
      font-family: $font-family-regular
      font-size: $font-size-16
      color: $color-20202E
      padding: 15px
    .content
      margin: 0 75px 0 19px
      layout(row, block, wrap)
      .item
        padding: 8px 15px 8px 14px
        border: 1px solid $color-ccc
        margin: 0 10px 10px 0
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-888888
        background: $color-white-fff
        transition: background-color 0.6s
        &.active
          font-family: $font-family-regular
          background: $color-56BA15 url("icon-selectgroup@3x.png") no-repeat bottom right / 13px 15px
          color: $color-white-fff
          border-color: $color-56BA15

  .exception-box
    fill-box(absolute)
    padding-top: 137px
</style>
