<template>
  <div>
    用户
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
