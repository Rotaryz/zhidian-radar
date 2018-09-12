<template>
  <div class="client-user-card">
    <!--最后跟进-->
    <section class="container" v-if="useType==='follow'">
      <img class="user-icon" :src="userInfo.image_url" alt=""/>
      <article class="user-info">
        <section class="base-info">
          <div class="name">
            <div class="txt">{{userInfo.name}}</div>
            <img v-if="userInfo.is_new" class="is-new" src="./icon-new@3x.png" alt="">
          </div>
          <div class="last-time">最后跟进</div>
        </section>
        <div class="tags">
          <div class="left">{{userInfo.last_follow_day}}</div>
          <div class="tags-right">{{userInfo.last_follow_at}}</div>
        </div>
      </article>
    </section>
    <!--最近活跃-->
    <section class="container" v-else-if="useType==='active'">
      <img class="user-icon" :src="userInfo.image_url" alt=""/>
      <article class="user-info">
        <section class="base-info">
          <div class="name">
            <div class="txt">{{userInfo.name}}</div>
            <img v-if="userInfo.is_new" class="is-new" src="./icon-new@3x.png" alt="">
          </div>
          <div class="last-time">最后活跃</div>
        </section>
        <div class="tags">
          <div class="left">{{userInfo.last_follow_day}}</div>
          <div class="tags-right">{{userInfo.last_active_at}}</div>
        </div>
      </article>
    </section>
    <!--最新加入-->
    <section class="container" v-else-if="useType==='join'">
      <img class="user-icon" :src="userInfo.image_url" alt=""/>
      <article class="user-info">
        <section class="base-info">
          <div class="name">
            <div class="txt">{{userInfo.name}}</div>
            <img v-if="userInfo.is_new" class="is-new" src="./icon-new@3x.png" alt="">
          </div>
          <div class="last-time">{{userInfo.sources}}</div>
        </section>
        <div class="tags">
          <div class="left">{{userInfo.last_follow_day}}</div>
          <div class="tags-right">{{userInfo.flow_join_at}}</div>
        </div>
      </article>
    </section>
    <!--通用-->
    <section class="container" v-else>
      <img class="user-icon" :src="userInfo.image_url" alt=""/>
      <article class="user-info">
        <section class="base-info">
          <div class="name">
            <div class="txt">{{userInfo.name}}</div>
            <img v-if="userInfo.is_new" class="is-new" src="./icon-new@3x.png" alt="">
          </div>
          <div class="last-time">AI预计成交率{{userInfo.conversion_rate}}%</div>
        </section>
        <div class="tags">
          <div class="left">{{userInfo.last_follow_day}}</div>
          <div class="tags-right"></div>
        </div>
      </article>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      userInfo: Object,
      useType: String
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .client-user-card
    flex: 1
    margin-left: 15px
    .container
      layout(row, block, no-warp)
      align-items: center
      padding: 15px 0
      height: 45px
      overflow: hidden
      .user-icon
        width: 45px
        height: 45px
        opacity: 0.8
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
            padding-right: 15px
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-888888
            no-wrap()
        .tags
          font-family: $font-family-regular
          font-size: $font-size-12
          color: $color-56BA15
          layout(row, block, nowrap)
          justify-content: space-between
          align-items: flex-start
          .tags-right
            font-family: $font-family-regular
            font-size: $font-size-12
            color: $color-888888
            padding-right: 15px
            no-wrap()

</style>
