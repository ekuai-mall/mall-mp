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
    <div>
      <div class="item-container" v-for="(item,index) in items" :key="index" @click="redirect(item.id)">
        <van-card :desc="item.detail" :title="item.name" :thumb="item.img[0].img"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mpType: 'page',
  data: () => ({
    searchText: '',
    items: []
  }),
  onShow () {
    this.searchText = this.$store.state.Run.currentSearch
    this.$store.commit('Run/updateGlobalInfo', [{
      key: 'currentSearch',
      value: ''
    }])
    this.search()
  },
  methods: {
    search () {
      this.$axios.$post('?_=item/search', {
        key: this.searchText
      }).then(response => {
        if (response.status === 200) {
          let dat = response.data
          if (dat.status === 0) {
            let items = dat['ret']
            for (let item of items) {
              item.img = JSON.parse(item.img)
            }
            this.items = items
          } else {
            this.$warning({
              title: '搜索失败',
              content: '错误码：' + dat.status + '，错误信息：' + dat['ret']
            })
          }
        } else {
          this.$error({
            title: '网络错误',
            content: response.status + '：' + response.statusText
          })
        }
        console.log(response)
      })
        .catch(error => {
          this.$error({
            title: '网络错误',
            content: error
          })
          console.log(error)
        })
    },
    onChange (e) {
      this.searchText = e.mp.detail
    },
    redirect (e) {
      wx.navigateTo({
        url: '/pages/item?id=' + e
      })
    }
  }
}
</script>

<style scoped>
.item-container {
  padding: 5px 0;
}
</style>
