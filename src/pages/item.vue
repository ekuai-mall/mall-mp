<template>
  <div>
    <div v-if="onLoading" class="loading">
      <van-loading color="#1890ff"/>
    </div>
    <div v-else>
      <div>
        <swiper :indicator-dots="true"
                :autoplay="true" :interval="10000" :duration="500">
          <div v-for="(url,index) in itemInfo.img" :key="index">
            <swiper-item>
              <video v-if="url.video" :src="url.video" :poster="url.img" controls></video>
              <img v-else :src="url.img" alt="" mode="aspectFit"/>
            </swiper-item>
          </div>
        </swiper>
      </div>
      <div class="detailContainer">
        <div class="margin-10">
          <h2>{{ itemInfo.name }}</h2>
        </div>
        <div class="margin-10">
          {{ itemInfo.detail }}
        </div>
        <div>
          <div v-for="(item,index) in itemInfo.child" :key="index" class="margin-10">
            <van-button v-if="index === selected" type="info" @click="select(index)">{{ item.name }}</van-button>
            <van-button v-else type="default" @click="select(index)">{{ item.name }}</van-button>
          </div>
        </div>
      </div>
    </div>
    <van-popup :show="show" position="bottom" round custom-style="height:80%" @close="onClose">
      <div v-if="selected>-1" class="popContainer">
        <div class="margin-10">
          <img :src="itemInfo.child[selected].img" alt="" mode="aspectFit" style="width: 100%"/>
        </div>
        <div class="margin-10">
          {{ itemInfo.child[selected].name }}
        </div>
        <div class="margin-10">
          {{ itemInfo.child[selected].detail }}
        </div>
        <div class="margin-10">
          <div v-for="(item,index) in itemInfo.child" :key="index" class="margin-10">
            <van-button v-if="index==selected" type="info" @click="select(index)">{{ item.name }}</van-button>
            <van-button v-else type="default" @click="select(index)">{{ item.name }}</van-button>
          </div>
        </div>
        <div class="margin-10">
          <van-button round type="info" @click="buy">确认下单</van-button>
        </div>
      </div>
    </van-popup>
  </div>

</template>

<script>
export default {
  mpType: 'page',
  onLoad (option) {
    this.onLoading = true
    this.itemId = option.id
    this.getItemInfo()
  },
  data: () => ({
    itemId: -1,
    onLoading: true,
    itemInfo: null,
    selected: -1,
    show: false
  }),
  methods: {
    getItemInfo () {
      this.$axios
        .$get('?_=item/get/' + this.itemId)
        .then(response => {
          if (response.status === 200) {
            let dat = response.data
            if (dat.status === 0) {
              this.onLoading = false
              this.itemInfo = dat['ret']
              this.itemInfo.img = JSON.parse(this.itemInfo.img)
              wx.setNavigationBarTitle({
                title: this.itemInfo.name
              })
            } else {
              this.$error({
                title: '服务器错误',
                content: dat.status + '：' + dat['ret']
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
    select (index) {
      this.selected = index
      this.show = true
    },
    onClose () {
      this.show = false
    },
    checkUser () {
      if (this.$store.state.User.cookie === '') {
        this.$info({
          title: '请先登录',
          content: '需要登陆后才可购买商品'
        })
        this.$store.commit('Run/updateLoginBack', true)
        wx.navigateTo({
          url: '/pages/login'
        })
        return false
      } else if (this.selected === undefined || this.selected < 0 || this.selected >= this.itemInfo.child.length) {
        this.$info({
          title: '请先选择一个商品',
          content: '需要选中商品后才可购买商品'
        })
        return false
      } else {
        this.draw = true
        return true
      }
    },
    buy () {
      if (this.checkUser()) {
        this.$axios.$post('?_=pay/buy', {
          cookie: this.$store.state.User.cookie,
          user: this.$store.state.User.id,
          product: this.itemInfo.child[this.selected].id
        }).then(response => {
          if (response.status === 200) {
            let dat = response.data
            if (dat.status === 0) {
              this.$success({
                title: '下单成功',
                content: '请在此页使用微信支付，有效期10分钟'
              })
              this.$store.commit('Run/updatePayOrder', dat['ret'])
              wx.redirectTo({
                url: '/pages/wxpay'
              })
            } else {
              this.$error({
                title: '下单失败',
                content: dat.status + '：' + dat['ret']
              })
            }
          } else {
            this.$error({
              title: '网络错误',
              content: response.status + '：' + response.statusText
            })
          }
          console.log(response)
        }).catch(error => {
          this.$error({
            title: '网络错误',
            content: error
          })
          console.log(error)
        })
      }
    }
  }
}
</script>

<style scoped>
.detailContainer {
  text-align: center;
  margin: 10px;
}

video {
  height: 100%;
}

swiper-item {
  text-align: center;
}

.popContainer {
  max-width: calc(100% - 10px);
  margin: 40px 5px;
  text-align: center;
}
</style>
