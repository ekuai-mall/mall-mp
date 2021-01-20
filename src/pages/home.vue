<template>
  <div>
    <van-cell-group>
      <van-field
        :value="searchText"
        center
        clearable
        placeholder="请输入搜索内容"
        :border="true"
        use-button-slot
        @change="onChange"
      >
        <van-button slot="button" size="small" type="info" round icon="search" @click="search"></van-button>
      </van-field>
    </van-cell-group>
    <swiper :indicator-dots="true" :autoplay="true" :interval="10000" :duration="500">
      <div v-for="img in background" :key="img">
        <swiper-item>
          <div>
            <img mode="aspectFill" class="swiper-img" :src="img" alt=""/>
          </div>
        </swiper-item>
      </div>
    </swiper>
    <div>
      这里是首页
    </div>
  </div>

</template>

<script>
export default {
  mpType: 'page',
  data: () => ({
    searchText: ''
  }),
  mounted () {
    wx.setNavigationBarTitle({
      title: this.$store.state.Run.mallTitle
    })
  },
  methods: {
    search () {
      this.$store.commit('Run/updateGlobalInfo', [{
        key: 'currentSearch',
        value: this.searchText
      }])
      wx.switchTab({
        url: '/pages/search'
      })
    },
    onChange (e) {
      this.searchText = e.mp.detail
    }
  },
  computed: {
    background () {
      return JSON.parse(this.$store.state.Run.homeImg ? this.$store.state.Run.homeImg : '[]')
    }
  }
}
</script>

<style scoped>
.swiper-img {
  width: 100%;
}
</style>
