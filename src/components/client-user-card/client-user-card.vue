<template>
  <div class="client-user-card">
    <!--最新加入-->
    <section class="container" v-if="useType==='join'">
      <img  v-if="userInfo.image_url&&userInfo.image_url.length" class="user-icon" :style="{borderColor: pnes[userInfo.group_rule_name]}" :src="userInfo.image_url" alt=""/>
      <img v-else class="user-icon" src="./pic-default_people@2x.png" alt=""/>
      <article class="user-info">
        <section class="base-info">
          <div class="name">
            <div class="txt">{{userInfo.name || userInfo.nickname}}</div>
            <img v-if="userInfo.is_new" class="is-new" src="./icon-new@3x.png" alt="">
          </div>
          <div class="last-time">{{userInfo.sources}}</div>
        </section>
        <div class="tags">
          <div class="left">{{userInfo.last_follow_at ? '已跟进' : '还未跟进'}}</div>
          <div class="tags-right">{{userInfo.flow_join_at}}</div>
        </div>
      </article>
    </section>
    <!--活跃指数-->
    <section class="container" v-else-if="useType==='active_index'">
      <img v-if="userInfo.image_url&&userInfo.image_url.length" class="user-icon" :style="{borderColor: pnes.p}" :src="userInfo.image_url" alt=""/>
      <img v-else class="user-icon" src="./pic-default_people@2x.png" alt=""/>
      <article class="user-info">
        <section class="base-info">
          <div class="name">
            <div class="txt">{{userInfo.name}}</div>
            <img v-if="userInfo.is_new" class="is-new" src="./icon-new@3x.png" alt="">
          </div>
          <div class="last-time">活跃指数{{userInfo.active_value || 0}}</div>
        </section>
        <div class="tags">
          <div class="left">{{userInfo.last_follow_at ? '已跟进' : '还未跟进'}}</div>
          <div class="tags-right">{{userInfo.flow_join_at}}</div>
        </div>
      </article>
    </section>
    <!--RFM指数-->
    <section class="container" v-else-if="useType==='rfm'">
      <img v-if="userInfo.image_url&&userInfo.image_url.length" class="user-icon" :style="{borderColor: pnes.p}" :src="userInfo.image_url" alt=""/>
      <img v-else class="user-icon" src="./pic-default_people@2x.png" alt=""/>
      <article class="user-info">
        <section class="base-info">
          <div class="name">
            <div class="txt">{{userInfo.name}}</div>
            <img v-if="userInfo.is_new" class="is-new" src="./icon-new@3x.png" alt="">
          </div>
          <div class="last-time">最后跟进</div>
        </section>
        <div class="tags">
          <div class="left">{{userInfo.last_follow_at ? '已跟进' : '还未跟进'}}</div>
          <div class="tags-right">{{userInfo.flow_join_at}}</div>
        </div>
      </article>
    </section>
    <!--通用-->
    <section class="container" v-else-if="useType==='kol_index'">
      <img  v-if="userInfo.image_url&&userInfo.image_url.length" class="user-icon" :style="{borderColor: pnes.p}" :src="userInfo.image_url" alt=""/>
      <img v-else class="user-icon" src="./pic-default_people@2x.png" alt=""/>
      <article class="user-info">
        <section class="base-info">
          <div class="name">
            <div class="txt">{{userInfo.name}}</div>
            <img v-if="userInfo.is_new" class="is-new" src="./icon-new@3x.png" alt="">
          </div>
          <div class="last-time">KOL指数{{userInfo.kol_value || 0}}</div>
        </section>
        <div class="tags">
          <div class="left">{{userInfo.last_follow_at ? '已跟进' : '还未跟进'}}</div>
          <div class="tags-right">{{userInfo.flow_join_at}}</div>
        </div>
      </article>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import {PNES_COLOR} from 'common/js/pnes'
  export default {
    props: {
      userInfo: Object,
      useType: String
    },
    data() {
      return {
        pnes: PNES_COLOR
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .client-user-card
    flex: 1
    margin-left: 12px
    .container
      layout(row, block, no-warp)
      align-items: center
      padding: 12px 0
      height: 45px
      overflow: hidden
      .user-icon
        width: 40px
        height: 40px
        border-radius: 40px
        padding: 1.5px
        border: 1.5px solid $color-pnes-e
        margin-right: 10px
      .user-info
        flex: 1
        layout(column,block,nowrap)
        padding :3px 0
        justify-content: space-between
        height: 100%
        box-sizing :border-box
        .base-info
          box-sizing: border-box
          layout(row, block, nowrap)
          justify-content: space-between
          align-items: flex-start
          .name
            font-family: $font-family-regular
            font-size: $font-size-16
            color: $color-20202E
            letter-spacing: 0.6px
            layout(row, block, nowrap)
            align-items: flex-start
            .txt
              max-width :30vw
              no-wrap()
            .is-new
              width: 19px
              height: 13.5px
              margin-left: 5px
          .last-time
            padding-right: 12px
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-text-main
            no-wrap()
        .tags
          font-family: $font-family-regular
          font-size: $font-size-12
          color: #949494
          layout(row, block, nowrap)
          justify-content: space-between
          align-items: flex-start
          .tags-right
            font-family: $font-family-regular
            font-size: $font-size-12
            color: #949494
            padding-right: 15px
            no-wrap()

</style>
