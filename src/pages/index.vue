<template>
  <div class="container" @click="clickHandle('test click', $event)">

    <div class="userinfo" @click="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover"/>
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <van-tag>标签</van-tag>
    <van-tag type="danger">标签</van-tag>
    <van-tag type="primary">标签</van-tag>
    <van-tag type="success">标签</van-tag>

    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div>

    <form class="form-container">
      <input type="text" class="form-control" v-model="motto" placeholder="v-model"/>
      <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy"/>
    </form>
    <a href="/pages/counter" class="counter">去往Vuex示例页面</a>
    <a href="/packageA/logs" class="counter">去往packageA/logs</a>
    <van-button type="primary" @click="axios">$get</van-button>
  </div>

</template>

<script>
import card from '@/components/card'

export default {
  mpType: 'page',

  data () {
    return {
      motto: 'Hello World',
      userInfo: {}
    }
  },

  components: {
    card
  },

  methods: {
    bindViewTap () {
      const url = '/packageA/logs'
      this.$router.push(url)
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    axios () {
      this.$axios.$get('?_=info/getAll')
        .then(response => {
          // if (response.status === 200) {
          //   let dat = response.data;
          //   if (dat.status === 0) {
          //     this.$store.commit("Run/updateGlobalInfo", dat["ret"]);
          //   } else {
          //     this.$error({
          //       title: "服务器错误",
          //       content: dat.status + "：" + dat["ret"],
          //     });
          //   }
          // } else {
          //   this.$error({
          //     title: "网络错误",
          //     content: response.status + "：" + response.statusText,
          //   });
          // }
          console.log(response)
        })
      // .catch(error => {
      // this.$error({
      //   title: "网络错误",
      //   content: error,
      // });
      // console.log(error);
      // });
    },
    clickHandle (msg, ev) {
      // eslint-disable-next-line
      console.log('clickHandle:', msg, ev)
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128 rpx;
  height: 128 rpx;
  margin: 20 rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
