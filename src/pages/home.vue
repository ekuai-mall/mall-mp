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
        <van-button slot="button" size="small" type="primary" round icon="search" @click="search"></van-button>
      </van-field>
    </van-cell-group>
    <swiper :indicator-dots="true"
            :autoplay="true" :interval="10000" :duration="500">
      <div v-for="img in background">
        <swiper-item>
          <div>
            <image mode="aspectFill" class="swiper-img" :src="img"/>
          </div>
        </swiper-item>
      </div>
    </swiper>
  </div>

</template>

<script>
export default {
  mpType: 'page',
  data: () => ({
    searchText: ''
  }),
  methods: {
    search () {
      console.log(this.searchText)
      console.log(this.background)
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
  /*height: 150px;*/
  width: 100%;
}
</style>
