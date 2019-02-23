<template>
  <transition name="slide">
    <article class="client-set-group">
      <div v-if="dataArray.length">
        <div class="title">设置分组</div>
        <section class="content">
          <div v-if="dataArray.length"
               :class="['item',item.selected?'active':'', item.type === 0 ? '':'grey']"
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
      Client.getSetGroupList(this.id).then(res => {
        if (res.data) {
          this.dataArray = res.data
          this.isEmpty = !this.dataArray.length
        }
      })
    },
    beforeRouteLeave(to, from, next) {
      let groupIds = []
      this.dataArray.map(item => {
        item.selected && groupIds.push(item.id)
      })
      Client.setGroup({group_ids: groupIds}, this.id).then(res => {
        if (res.error === ERR_OK) {
          this.$emit('refresh')
        }
        next(true)
      })
    },
    methods: {
      check(item) {
        if (item.type === 0) {
          item.selected = !item.selected
        }
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
      color: #333
      padding: 15px
      background: #F7F7F8
      border-bottom-1px($color-line)
    .content
      margin: 20px 15px
      layout(row, block, wrap)
      .item
        text-align: center
        line-height: 32px
        width: 75px
        text-overflow: ellipsis
        white-space: nowrap
        overflow: hidden
        padding: 0 5px
        border: 1px solid $color-main
        margin: 0 10px 10px 0
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #5929DC
        border-radius: 4px
        background: $color-white-fff
        transition: background-color 0.3s
        box-sizing: border-box
        &.active
          font-family: $font-family-regular
          background: $color-linear-main
          color: $color-white-fff
          border-color: #863de5
        &.grey
          color: #CCC
          border-color: #CCC
  .exception-box
    fill-box(absolute)
    padding-top: 137px
</style>
